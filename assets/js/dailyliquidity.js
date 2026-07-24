// Daily Liquidity Module - Upload Excel to Trial Balance
(function() {
    'use strict';

    // ---------- EMPTY TABLE STRUCTURE ----------
    const EMPTY_ROWS = [
        { label: 'TOTAL DEPOSITS LIABILITY', values: ['', '', '', '', '', '', ''], bold: true, icon: 'arrow-up' },
        { isSection: true, label: 'LIQUIDITY REQUIREMENTS' },
        { label: 'Primary Reserve required (8%)', values: ['', '', '', '', '', '', ''] },
        { label: 'Secondary Reserve required (20%)', values: ['', '', '', '', '', '', ''] },
        { label: 'TOTAL RESERVE REQUIRED - TRR', values: ['', '', '', '', '', '', ''], bold: true },
        { isSection: true, label: 'LIQUID ASSETS' },
        { label: 'Current & Call Account Balances', values: ['', '', '', '', '', '', ''] },
        { label: 'Placement with Other Banks', values: ['', '', '', '', '', '', ''] },
        { label: 'Total Balance with Banks', values: ['', '', '', '', '', '', ''], bold: true },
        { label: 'Cash in hand', values: ['', '', '', '', '', '', ''] },
        { label: 'Gov. Securities (Treasury bills, Bonds etc)', values: ['', '', '', '', '', '', ''] },
        { label: 'TOTAL LIQUID ASSETS - TLA', values: ['', '', '', '', '', '', ''], bold: true, totalRow: true },
        { label: 'SURPLUS/(DEFICIT) TLA - TRR =', values: ['', '', '', '', '', '', ''], bold: true, surplusRow: true },
        { label: 'Primary Reserve Held', values: ['', '', '', '', '', '', ''], bold: true },
        { label: 'Surplus/(Deficit)*', values: ['', '', '', '', '', '', ''], positive: true },
        { label: 'Surplus/Deficit (with borrowings)*', values: ['', '', '', '', '', '', ''], negative: true },
        { label: 'Secondary Reserve Held', values: ['', '', '', '', '', '', ''], bold: true },
        { label: 'Surplus/(Deficit)*', values: ['', '', '', '', '', '', ''], positive: true },
        { label: 'Primary Reserve %', values: ['', '', '', '', '', '', ''] },
        { label: 'Secondary Reserve %', values: ['', '', '', '', '', '', ''] },
        { label: 'TOTAL LOANS & ADVANCES', values: ['', '', '', '', '', '', ''], bold: true },
        { label: 'NET WORTH (last month close)', values: ['', '', '', '', '', '', ''], bold: true },
        { label: 'Plant, Property & Equipment', values: ['', '', '', '', '', '', ''] },
        { isSection: true, label: 'RATIOS' },
        { label: 'Total Liquid Assets/Deposits', values: ['', '', '', '', '', '', ''], bold: true },
        { label: 'Cash in hand/Deposit', values: ['', '', '', '', '', '', ''], bold: true },
        { label: 'Loans/Deposits', values: ['', '', '', '', '', '', ''], bold: true },
        { label: 'Total Loans/Networth', values: ['', '', '', '', '', '', ''], bold: true },
        { label: 'PPE/Networth', values: ['', '', '', '', '', '', ''], bold: true }
    ];

    let currentData = [];
    let isLoading = false;
    let selectedFile = null;

    // ---------- GET WEEK DATES ----------
    function getWeekDatesFromEnding(weekEndingDate) {
        const endDate = new Date(weekEndingDate);
        endDate.setHours(0, 0, 0, 0);
        
        if (isNaN(endDate.getTime())) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dayOfWeek = today.getDay();
            const diffToWednesday = dayOfWeek <= 3 ? 3 - dayOfWeek : 10 - dayOfWeek;
            const wednesday = new Date(today);
            wednesday.setDate(today.getDate() + diffToWednesday);
            return getWeekDatesFromEnding(wednesday);
        }
        
        const dayOfWeek = endDate.getDay();
        const diffToWednesday = dayOfWeek <= 3 ? 3 - dayOfWeek : 10 - dayOfWeek;
        const wednesday = new Date(endDate);
        wednesday.setDate(endDate.getDate() + diffToWednesday);
        wednesday.setHours(0, 0, 0, 0);
        
        const weekDates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(wednesday);
            date.setDate(wednesday.getDate() - i);
            date.setHours(0, 0, 0, 0);
            weekDates.push(date);
        }
        return weekDates;
    }

    function formatDateHeader(date) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()] + ' ' + date.getDate();
    }

    function formatWeekEnding(date) {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return month + ' ' + day + ', ' + year;
    }

    // ---------- UPDATE COLUMN HEADERS ----------
    function updateColumnHeadersWithDates(weekEndingDate) {
        const weekDates = getWeekDatesFromEnding(weekEndingDate);
        const dayNames = weekDates.map(d => formatDateHeader(d));
        
        for (let i = 1; i <= 7; i++) {
            const col = document.getElementById('col' + i);
            if (col) col.textContent = dayNames[i - 1];
        }
        
        const lastDay = weekDates[weekDates.length - 1];
        const weekEnding = formatWeekEnding(lastDay);
        updateWeekEnding(weekEnding);
        
        const datePicker = document.getElementById('weekEndingDate');
        if (datePicker) {
            const year = lastDay.getFullYear();
            const month = String(lastDay.getMonth() + 1).padStart(2, '0');
            const day = String(lastDay.getDate()).padStart(2, '0');
            datePicker.value = year + '-' + month + '-' + day;
        }
        
        return { weekDates, dayNames, weekEnding };
    }

    // ---------- UPDATE WEEK ENDING DISPLAY ----------
    function updateWeekEnding(weekEnding) {
        const displays = document.querySelectorAll('#weekEndingDisplay, #footerWeekEnding');
        displays.forEach(el => {
            if (el) el.textContent = weekEnding;
        });
    }

    // ---------- RENDER TABLE ----------
    function renderTable(data) {
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;
        let html = '';

        if (!data || data.length === 0) {
            data = EMPTY_ROWS;
        }

        data.forEach(item => {
            if (item.isSection) {
                html += `<tr class="section-header"><td colspan="8"><i class="fas fa-${item.icon || 'folder-open'}"></i> ${item.label}</td></tr>`;
                return;
            }

            let rowClass = '';
            if (item.totalRow) rowClass = 'total-row';
            else if (item.surplusRow) rowClass = 'surplus-row';

            let labelHtml = item.label;
            if (item.icon) {
                labelHtml = `<i class="fas fa-${item.icon}" style="margin-right:4px;color:#2b6e4f;"></i> ${labelHtml}`;
            }
            if (item.bold) labelHtml = `<strong>${labelHtml}</strong>`;

            let valueCells = '';
            if (item.values && item.values.length === 7) {
                item.values.forEach((val) => {
                    const displayVal = val && String(val).trim() !== '' ? val : '<span class="empty-cell">—</span>';
                    let cls = 'numeric';
                    if (item.positive) cls += ' positive';
                    if (item.negative) cls += ' negative';
                    valueCells += `<td class="${cls}">${displayVal}</td>`;
                });
            } else {
                valueCells = '<td colspan="7" class="text-muted">—</td>';
            }

            html += `<tr class="${rowClass}">
                <td class="row-label">${labelHtml}</td>
                ${valueCells}
            </tr>`;
        });

        tbody.innerHTML = html;
        currentData = data;
    }

    // ---------- LOADING MODAL ----------
    function showLoadingModal(message) {
        const modal = document.getElementById('loadingModal');
        const msg = document.getElementById('loadingMessage');
        if (modal) {
            modal.style.display = 'flex';
            if (msg) msg.textContent = message || 'Loading data...';
        }
        isLoading = true;
    }

    function hideLoadingModal() {
        const modal = document.getElementById('loadingModal');
        if (modal) {
            modal.style.display = 'none';
        }
        isLoading = false;
    }

    // ---------- SET DEFAULT DATE ----------
    function setDefaultDate() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayOfWeek = today.getDay();
        const diffToWednesday = dayOfWeek <= 3 ? 3 - dayOfWeek : 10 - dayOfWeek;
        const wednesday = new Date(today);
        wednesday.setDate(today.getDate() + diffToWednesday);
        
        const datePicker = document.getElementById('weekEndingDate');
        if (datePicker) {
            const year = wednesday.getFullYear();
            const month = String(wednesday.getMonth() + 1).padStart(2, '0');
            const day = String(wednesday.getDate()).padStart(2, '0');
            datePicker.value = year + '-' + month + '-' + day;
        }
        
        return wednesday;
    }

    // ---------- TOAST MESSAGE ----------
    function showToast(message, type) {
        let toast = document.getElementById('liquidityToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'liquidityToast';
            toast.style.cssText = `
                position: fixed; bottom: 20px; right: 20px;
                padding: 10px 20px; border-radius: 8px;
                z-index: 9999; font-weight: 600; font-size: 13px;
                max-width: 380px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease; transform: translateY(20px); opacity: 0;
                pointer-events: none;
            `;
            document.body.appendChild(toast);
        }

        const colors = {
            success: { bg: '#d1fae5', color: '#065f46', border: '#34d399' },
            error: { bg: '#fee2e2', color: '#991b1b', border: '#f87171' },
            info: { bg: '#dbeafe', color: '#1e40af', border: '#60a5fa' },
            warning: { bg: '#fef3c7', color: '#92400e', border: '#fbbf24' }
        };
        const style = colors[type] || colors.info;

        toast.style.background = style.bg;
        toast.style.color = style.color;
        toast.style.borderLeft = `4px solid ${style.border}`;
        toast.style.pointerEvents = 'auto';
        toast.textContent = message;
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';

        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
        }, 3500);
    }

    // ---------- UPLOAD STATUS HELPERS ----------
    function setUploadProgress(message) {
        const statusIcon = document.getElementById('uploadStatusIcon');
        const statusMessage = document.getElementById('uploadStatusMessage');
        if (statusIcon) statusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        if (statusMessage) statusMessage.textContent = message || 'Uploading to Trial Balance...';
    }

    function setUploadSuccess(message) {
        const statusIcon = document.getElementById('uploadStatusIcon');
        const statusMessage = document.getElementById('uploadStatusMessage');
        const confirmBtn = document.getElementById('uploadConfirmBtn');
        if (statusIcon) statusIcon.innerHTML = '<i class="fas fa-check-circle" style="color:#16a34a;"></i>';
        if (statusMessage) statusMessage.textContent = message || 'Upload successful';
        if (confirmBtn) confirmBtn.disabled = false;
        setTimeout(() => {
            closeUploadModal();
        }, 1200);
    }

    function setUploadFailure(message) {
        const statusIcon = document.getElementById('uploadStatusIcon');
        const statusMessage = document.getElementById('uploadStatusMessage');
        const confirmBtn = document.getElementById('uploadConfirmBtn');
        if (statusIcon) statusIcon.innerHTML = '<i class="fas fa-times-circle" style="color:#dc2626;"></i>';
        if (statusMessage) statusMessage.textContent = message || 'Upload failed';
        if (confirmBtn) confirmBtn.disabled = false;
    }

/**
 * Import Excel (base64) into Trial Balance sheet.
 * Uses Drive.Files.insert when available; otherwise uses UrlFetchApp to call Drive API upload with convert=true.
 */
function importLiquidityExcelToSheet(base64, filename, weekEnding) {
  try {
    Logger.log('=== importLiquidityExcelToSheet START ===');
    Logger.log('Filename: ' + filename);
    Logger.log('Week Ending: ' + weekEnding);
    Logger.log('Base64 length: ' + (base64 ? base64.length : 0));

    if (!base64) {
      throw new Error('No file data received');
    }
    if (base64.length === 0) {
      throw new Error('File data is empty');
    }

    // Convert base64 to bytes and create blob
    var bytes = Utilities.base64Decode(base64);
    var blob = Utilities.newBlob(bytes, MimeType.MICROSOFT_EXCEL, filename);

    // Attempt 1: If Advanced Drive Service is enabled, use Drive.Files.insert to convert
    var tempSheetId;
    try {
      if (typeof Drive !== 'undefined' && Drive.Files && typeof Drive.Files.insert === 'function') {
        Logger.log('Using Advanced Drive service (Drive.Files.insert) to create converted Sheet...');
        var resource = {
          title: 'Temp_Import_' + filename + '_' + Date.now(),
          mimeType: MimeType.GOOGLE_SHEETS
        };
        var file = Drive.Files.insert(resource, blob);
        tempSheetId = file && file.id;
        Logger.log('Temp file created (advanced service): ' + tempSheetId);
      } else {
        throw new Error('Advanced Drive service not available');
      }
    } catch (driveErr) {
      // Fallback: use Drive REST API via UrlFetchApp with OAuth token to upload & convert
      Logger.log('Advanced Drive service not available or failed: ' + driveErr.message + ' — falling back to UrlFetch upload');

      var url = 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart&convert=true';
      var boundary = '-------314159265358979323846';
      var delimiter = '\r\n--' + boundary + '\r\n';
      var closeDelim = '\r\n--' + boundary + '--';

      var metadata = {
        title: 'Temp_Import_' + filename + '_' + Date.now(),
        mimeType: MimeType.GOOGLE_SHEETS
      };

      // Build multipart request body: JSON metadata + base64-encoded file (with 64-bit encoding header)
      var multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + MimeType.MICROSOFT_EXCEL + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n\r\n' +
        base64 +
        closeDelim;

      var options = {
        method: 'post',
        contentType: 'multipart/related; boundary=' + boundary,
        payload: multipartRequestBody,
        headers: {
          Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
        },
        muteHttpExceptions: true
      };

      var resp = UrlFetchApp.fetch(url, options);
      var code = resp.getResponseCode();
      var respText = resp.getContentText();
      Logger.log('Drive upload response code: ' + code);
      Logger.log('Drive upload response: ' + respText);

      if (code < 200 || code >= 300) {
        throw new Error('Drive upload failed (HTTP ' + code + '): ' + respText);
      }

      var respJson = JSON.parse(respText);
      tempSheetId = respJson.id;
      Logger.log('Temp file created (UrlFetch): ' + tempSheetId);
    }

    if (!tempSheetId) {
      throw new Error('Failed to create temporary Google Sheet (no file id returned)');
    }

    // Open the newly created spreadsheet and read the first sheet's data
    var tempFileSs = SpreadsheetApp.openById(tempSheetId);
    var tempSheet = tempFileSs.getSheets()[0];
    var tempData = tempSheet.getDataRange().getValues();

    Logger.log('Rows imported from Excel: ' + tempData.length);
    Logger.log('Columns: ' + (tempData[0] ? tempData[0].length : 0));

    if (!tempData || tempData.length === 0) {
      // Cleanup temp file
      try { DriveApp.getFileById(tempSheetId).setTrashed(true); } catch(e){}
      throw new Error('No data found in the Excel file');
    }

    // Open the target Trial Balance sheet
    var targetSS = SpreadsheetApp.openById(LIQUIDITY_CONFIG.SHEET_ID);
    var targetSheet = targetSS.getSheetByName(LIQUIDITY_CONFIG.SHEET_NAME);
    if (!targetSheet) {
      targetSheet = targetSS.insertSheet(LIQUIDITY_CONFIG.SHEET_NAME);
    }

    // Clear existing data and write the imported data
    targetSheet.clearContents();
    targetSheet.clearFormats();

    var numRows = tempData.length;
    var numCols = tempData[0].length;
    targetSheet.getRange(1, 1, numRows, numCols).setValues(tempData);

    // Format the sheet (call your existing formatter)
    formatTrialBalanceSheet(targetSheet, numRows, numCols);

    // Cleanup: delete temp file (try both Drive API and DriveApp)
    try {
      // Prefer DriveApp to remove
      var tempFile = DriveApp.getFileById(tempSheetId);
      if (tempFile) tempFile.setTrashed(true);
      Logger.log('Temp file trashed: ' + tempSheetId);
    } catch (cleanupErr) {
      Logger.log('Could not delete temp file via DriveApp: ' + cleanupErr.message);
      try {
        if (typeof Drive !== 'undefined' && Drive.Files && typeof Drive.Files.remove === 'function') {
          Drive.Files.remove(tempSheetId);
          Logger.log('Temp file removed via Drive.Files.remove');
        }
      } catch (e) {
        Logger.log('Could not delete temp file via Drive.Files.remove: ' + e.message);
      }
    }

    // Save week ending meta
    try {
      var scriptProps = PropertiesService.getScriptProperties();
      scriptProps.setProperty('lastLiquidityUploadWeekEnding', weekEnding || '');
      scriptProps.setProperty('lastLiquidityUploadDate', new Date().toISOString());
    } catch (e) {
      Logger.log('Could not save script properties: ' + e.message);
    }

    Logger.log('=== importLiquidityExcelToSheet SUCCESS ===');

    return {
      success: true,
      message: 'Excel file imported to Trial Balance successfully!',
      rowsImported: numRows - 1,
      weekEnding: weekEnding,
      filename: filename
    };

  } catch (error) {
    Logger.log('ERROR in importLiquidityExcelToSheet: ' + error.message);
    Logger.log('Stack: ' + (error.stack || 'no stack'));
    return {
      success: false,
      error: 'Failed to import Excel: ' + error.message,
      stack: error.stack
    };
  }
}
    // Handle upload response (kept for backward compatibility)
    function handleUploadResponse(response) {
        console.log('Upload response:', response);
        
        if (response && response.success !== false) {
            const message = response.message || response.result || 'Upload successful';
            setUploadSuccess('✅ ' + message);
            if (response.rowsImported) {
                showToast('Rows imported: ' + response.rowsImported, 'info');
            }
        } else {
            const errorMsg = response?.error || response?.message || 'Unknown error';
            setUploadFailure('❌ Upload failed: ' + errorMsg);
        }
    }

    // ---------- UPLOAD MODAL ----------
    function setupUploadModal() {
        const uploadBtn = document.getElementById('uploadBtn');
        const modal = document.getElementById('uploadModal');
        const overlay = document.getElementById('uploadModalOverlay');
        const closeBtn = document.getElementById('uploadModalClose');
        const cancelBtn = document.getElementById('uploadCancelBtn');
        const confirmBtn = document.getElementById('uploadConfirmBtn');
        const uploadWeekEnding = document.getElementById('uploadWeekEnding');
        const fileInput = document.getElementById('uploadFileInput');
        const fileArea = document.getElementById('uploadFileArea');
        const fileInfo = document.getElementById('uploadFileInfo');
        const fileName = document.getElementById('uploadFileName');
        const fileRemove = document.getElementById('uploadFileRemove');
        const statusDiv = document.getElementById('uploadStatus');
        const statusIcon = document.getElementById('uploadStatusIcon');
        const statusMessage = document.getElementById('uploadStatusMessage');

        // Open modal
        if (uploadBtn) {
            uploadBtn.addEventListener('click', function() {
                modal.style.display = 'flex';
                const currentDate = document.getElementById('weekEndingDate').value;
                if (uploadWeekEnding) {
                    uploadWeekEnding.value = currentDate || '';
                }
                statusDiv.style.display = 'none';
                selectedFile = null;
                confirmBtn.disabled = true;
                fileArea.style.display = 'block';
                fileInfo.style.display = 'none';
                fileInput.value = '';
            });
        }

        function closeUploadModal() {
            modal.style.display = 'none';
            statusDiv.style.display = 'none';
            confirmBtn.disabled = true;
            selectedFile = null;
        }

        // Close modal functions
        if (closeBtn) closeBtn.addEventListener('click', closeUploadModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeUploadModal);
        if (overlay) overlay.addEventListener('click', closeUploadModal);

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeUploadModal();
            }
        });

        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                e.stopPropagation();
                if (this.files && this.files.length > 0) {
                    handleFileSelect(this.files[0]);
                }
            });
        }

        // Click on file area triggers file input
        if (fileArea) {
            fileArea.addEventListener('click', function(e) {
                if (e.target.tagName !== 'INPUT') {
                    if (fileInput) fileInput.click();
                }
            });

            // Drag and drop
            fileArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dragover');
            });

            fileArea.addEventListener('dragleave', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
            });

            fileArea.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleFileSelect(e.dataTransfer.files[0]);
                }
            });
        }

        // Handle file selection
        function handleFileSelect(file) {
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
                'text/csv'
            ];
            const validExtensions = ['.xlsx', '.xls', '.csv'];
            
            const fileExt = '.' + file.name.split('.').pop().toLowerCase();
            const isValidType = validTypes.includes(file.type) || validExtensions.includes(fileExt);
            
            if (!isValidType) {
                showToast('❌ Please select an Excel or CSV file', 'error');
                return;
            }
            
            selectedFile = file;
            fileName.textContent = file.name;
            fileInfo.style.display = 'flex';
            fileArea.style.display = 'none';
            confirmBtn.disabled = false;
            showToast('✅ File selected: ' + file.name, 'success');
        }

        // Remove file
        if (fileRemove) {
            fileRemove.addEventListener('click', function() {
                selectedFile = null;
                fileInput.value = '';
                fileInfo.style.display = 'none';
                fileArea.style.display = 'block';
                confirmBtn.disabled = true;
            });
        }

        // Confirm upload
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                const weekEnding = (uploadWeekEnding && uploadWeekEnding.value) || document.getElementById('weekEndingDate').value;
                
                if (!weekEnding) {
                    showToast('⚠️ Please select a week ending date', 'warning');
                    return;
                }

                if (!selectedFile) {
                    showToast('⚠️ Please select a file to upload', 'warning');
                    return;
                }

                // Show status inside upload modal (do not use global loading modal)
                statusDiv.style.display = 'flex';
                if (statusIcon) statusIcon.className = 'upload-status-icon';
                if (statusIcon) statusIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                if (statusMessage) statusMessage.textContent = 'Uploading to Trial Balance...';
                confirmBtn.disabled = true;

                // Upload to Trial Balance (iframe + postMessage)
                uploadToTrialBalance(weekEnding, selectedFile);
            });
        }
    }

    // ---------- HANDLE DATE CHANGE ----------
    function handleDateChange() {
        const datePicker = document.getElementById('weekEndingDate');
        if (datePicker) {
            updateColumnHeadersWithDates(datePicker.value);
        }
    }

    // ---------- EXPORT GLOBALLY ----------
    window.initDailyLiquidityModule = function() {
        console.log('Initializing Daily Liquidity Module');
        
        const defaultDate = setDefaultDate();
        updateColumnHeadersWithDates(defaultDate);
        renderTable(EMPTY_ROWS);
        
        // Setup Upload Modal
        setupUploadModal();
        
        const datePicker = document.getElementById('weekEndingDate');
        if (datePicker) {
            datePicker.addEventListener('change', handleDateChange);
        }
    };

    // Expose functions for console/testing
    window.uploadLiquidityData = uploadToTrialBalance;
    window.renderLiquidityTable = renderTable;
    window.closeUploadModal = function() {
        const modal = document.getElementById('uploadModal');
        if (modal) modal.style.display = 'none';
    };

})();
