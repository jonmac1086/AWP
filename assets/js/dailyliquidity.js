// ============================================
// ENTRY POINT - Handle GET requests (for JSONP)
// ============================================
function doGet(e) {
  if (e && e.parameter && e.parameter.callback) {
    return handleJsonpRequest(e);
  }
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Accounts Workspace')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================
// Handle JSONP requests
// ============================================
function handleJsonpRequest(e) {
  var callback = e.parameter.callback;
  var action = e.parameter.action;
  var data = e.parameter.data ? JSON.parse(e.parameter.data) : {};
  
  Logger.log('JSONP Request - Action: ' + action);
  Logger.log('Data: ' + JSON.stringify(data));
  
  var result;
  
  try {
    switch(action) {
      // ============================================
      // DIAGNOSTIC ACTIONS
      // ============================================
      case 'testDriveAPI':
        result = testDriveAPI();
        break;
      
      case 'testFileConversion':
        result = testFileConversion(data.base64, data.filename);
        break;

      // Existing cases...
      case 'getUserInfo':
        result = getUserInfo();
        break;
      case 'processForm':
        result = processForm(data);
        break;
      case 'getNextPVNumber':
        result = getNextPVNumber(data.voucherType);
        break;
      case 'getPVNumbersByType':
        result = getPVNumbersByType();
        break;
      case 'getVoucherByNumber':
        result = getVoucherByNumber(data.pvNumber, data.voucherType);
        break;
      case 'updateVoucher':
        result = updateVoucher(data);
        break;
      case 'addNewInventory':
        result = addNewInventory(data);
        break;
      case 'getInventoryCategories':
        result = getInventoryCategories();
        break;
      case 'generateInventoryCategoryCode':
        result = generateInventoryCategoryCode();
        break;
      case 'getNextInventoryCode':
        result = getNextInventoryCode(data.mainCode);
        break;
      case 'getPurchaseReportData':
        var fromDate = data.fromDate || getTodayMinusMonths(12);
        var toDate = data.toDate || getTodayString();
        result = getPurchaseReportData(fromDate, toDate);
        break;
      case 'getUsageReportData':
        var fromDate = data.fromDate || getTodayMinusMonths(12);
        var toDate = data.toDate || getTodayString();
        result = getUsageReportData(fromDate, toDate);
        break;
      case 'getInventoryListData':
        result = getInventoryListData();
        break;
      case 'recordInventoryUsage':
        result = recordInventoryUsage(data);
        break;
      case 'removeInventory':
        result = removeInventory(data.inventoryCode);
        break;
      case 'generateAssetCode':
        result = generateAssetCode(data.assetType);
        break;
      case 'addNewAsset':
        result = addNewAsset(data);
        break;
      case 'getDetailedRegister':
        result = getDetailedRegister();
        break;
      case 'updateAssetStatus':
        result = updateAssetStatus(data.assetName, data.newStatus);
        break;
      case 'updateAllAccumulatedDepreciation':
        result = updateAllAccumulatedDepreciation(data.asOfDate);
        break;
      case 'getFixedAssetsSummaryReport':
        result = getFixedAssetsSummaryReport(data.toDate);
        break;
      case 'generateInvestmentCode':
        result = generateInvestmentCode(data.investmentType);
        break;
      case 'addNewInvestment':
        result = addNewInvestment(data);
        break;
      case 'getInvestmentsByDateRange':
        result = getInvestmentsByDateRange(data.fromDate, data.toDate);
        break;
      case 'getMaturedInvestments':
        result = getMaturedInvestments(data.toDate);
        break;
      case 'getUniqueInvestmentTypes':
        result = getUniqueInvestmentTypes();
        break;
      case 'getUniqueBanks':
        result = getUniqueBanks();
        break;
      case 'getAllInvestments':
        result = getAllInvestments();
        break;
      case 'getInvestmentByCode':
        result = getInvestmentByCode(data.investmentCode);
        break;
      case 'updateInvestmentRedeemDate':
        result = updateInvestmentRedeemDate(data.investmentCode, data.redeemDate);
        break;
      case 'generateSubscriptionCategoryCode':
        result = generateSubscriptionCategoryCode();
        break;
      case 'getSubscriptionCategories':
        result = getSubscriptionCategories();
        break;
      case 'getNextSubscriptionCode':
        result = getNextSubscriptionCode(data.categoryCode);
        break;
      case 'addSubscription':
        result = addSubscription(data);
        break;
      case 'getAllSubscriptions':
        result = getAllSubscriptions();
        break;
      case 'updateSubscription':
        result = updateSubscription(data);
        break;
      case 'deleteSubscription':
        result = deleteSubscription(data.subscriptionCode);
        break;
      case 'getSubscriptionsByDateRange':
        var fromDate = data.fromDate || getTodayMinusMonths(12);
        var toDate = data.toDate || getTodayString();
        result = getSubscriptionsByDateRange(fromDate, toDate);
        break;
      case 'getExpiredSubscriptions':
        result = getExpiredSubscriptions(data.asOfDate || getTodayString());
        break;
      case 'renewSubscription':
        result = renewSubscription(data.subscriptionCode, data.newExpiryDate, data.newAnnualCost);
        break;
      case 'updateSubscriptionPayment':
        result = updateSubscriptionPayment(data.subscriptionCode, data.amountPaid);
        break;
      case 'getSubscriptionByCode':
        result = getSubscriptionByCode(data.subscriptionCode);
        break;

      // ============================================
      // DAILY LIQUIDITY CASES
      // ============================================
      case 'uploadExcelToTrialBalance':
        Logger.log('uploadExcelToTrialBalance called');
        // The function expects (base64, filename, weekEnding)
        // But data might come as an object with these properties
        var base64 = data.base64 || data;
        var filename = data.filename || 'upload.xlsx';
        var weekEnding = data.weekEnding || '';
        
        // If data is an object with base64 property, extract it
        if (data && data.base64) {
          result = uploadExcelToTrialBalance(data.base64, data.filename, data.weekEnding);
        } else {
          // If data is the base64 string directly
          result = uploadExcelToTrialBalance(data, filename, weekEnding);
        }
        break;

      case 'test':
        result = { success: true, message: 'API is working' };
        break;
      
      default:
        result = { error: 'Unknown action: ' + action };
        Logger.log('Unknown action: ' + action);
    }
  } catch (error) {
    Logger.log('ERROR in handleJsonpRequest: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    result = { 
      success: false,
      error: error.toString(),
      action: action,
      stack: error.stack
    };
  }
  
  var jsonResult = JSON.stringify(result);
  var output = ContentService.createTextOutput(callback + '(' + jsonResult + ')');
  output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  return output;
}

// ============================================
// ENTRY POINT - Handle POST requests
// (returns JSON for all actions, including uploads)
// ============================================
function doPost(e) {
  try {
    var output;
    var params = e.parameter || {};
    var action = params.action;
    Logger.log('POST Request - Action: ' + action);
    
    var result;
    
    switch(action) {
      // Existing cases (mirror what's in handleJsonpRequest)
      case 'getUserInfo':
        result = getUserInfo();
        break;
      case 'processForm':
        result = processForm(params.formData ? JSON.parse(params.formData) : {});
        break;
      case 'getNextPVNumber':
        result = getNextPVNumber(params.voucherType);
        break;
      case 'getPVNumbersByType':
        result = getPVNumbersByType();
        break;
      case 'getVoucherByNumber':
        result = getVoucherByNumber(params.pvNumber, params.voucherType);
        break;
      case 'updateVoucher':
        result = updateVoucher(params.formData ? JSON.parse(params.formData) : {});
        break;
      case 'addNewInventory':
        result = addNewInventory(params.formData ? JSON.parse(params.formData) : {});
        break;
      case 'getInventoryCategories':
        result = getInventoryCategories();
        break;
      case 'generateInventoryCategoryCode':
        result = generateInventoryCategoryCode();
        break;
      case 'getNextInventoryCode':
        result = getNextInventoryCode(params.mainCode);
        break;
      case 'getPurchaseReportData':
        var fromDate = params.fromDate || getTodayMinusMonths(12);
        var toDate = params.toDate || getTodayString();
        result = getPurchaseReportData(fromDate, toDate);
        break;
      case 'getUsageReportData':
        var fromDate = params.fromDate || getTodayMinusMonths(12);
        var toDate = params.toDate || getTodayString();
        result = getUsageReportData(fromDate, toDate);
        break;
      case 'getInventoryListData':
        result = getInventoryListData();
        break;
      case 'recordInventoryUsage':
        result = recordInventoryUsage(params.formData ? JSON.parse(params.formData) : {});
        break;
      case 'removeInventory':
        result = removeInventory(params.inventoryCode);
        break;
      case 'generateAssetCode':
        result = generateAssetCode(params.assetType);
        break;
      case 'addNewAsset':
        result = addNewAsset(params.formData ? JSON.parse(params.formData) : {});
        break;
      case 'getDetailedRegister':
        result = getDetailedRegister();
        break;
      case 'updateAssetStatus':
        result = updateAssetStatus(params.assetName, params.newStatus);
        break;
      case 'updateAllAccumulatedDepreciation':
        result = updateAllAccumulatedDepreciation(params.asOfDate);
        break;
      case 'getFixedAssetsSummaryReport':
        result = getFixedAssetsSummaryReport(params.toDate);
        break;
      case 'generateInvestmentCode':
        result = generateInvestmentCode(params.investmentType);
        break;
      case 'addNewInvestment':
        result = addNewInvestment(params.formData ? JSON.parse(params.formData) : {});
        break;
      case 'getInvestmentsByDateRange':
        result = getInvestmentsByDateRange(params.fromDate, params.toDate);
        break;
      case 'getMaturedInvestments':
        result = getMaturedInvestments(params.toDate);
        break;
      case 'getUniqueInvestmentTypes':
        result = getUniqueInvestmentTypes();
        break;
      case 'getUniqueBanks':
        result = getUniqueBanks();
        break;
      case 'getAllInvestments':
        result = getAllInvestments();
        break;
      case 'getInvestmentByCode':
        result = getInvestmentByCode(params.investmentCode);
        break;
      case 'updateInvestmentRedeemDate':
        var formData = params.formData ? JSON.parse(params.formData) : {};
        result = updateInvestmentRedeemDate(formData.investmentCode, formData.redeemDate);
        break;
      case 'generateSubscriptionCategoryCode':
        result = generateSubscriptionCategoryCode();
        break;
      case 'getSubscriptionCategories':
        result = getSubscriptionCategories();
        break;
      case 'getNextSubscriptionCode':
        result = getNextSubscriptionCode(params.categoryCode);
        break;
      case 'addSubscription':
        result = addSubscription(params.formData ? JSON.parse(params.formData) : {});
        break;
      case 'getAllSubscriptions':
        result = getAllSubscriptions();
        break;
      case 'updateSubscription':
        result = updateSubscription(params.formData ? JSON.parse(params.formData) : {});
        break;
      case 'deleteSubscription':
        result = deleteSubscription(params.subscriptionCode);
        break;
      case 'getSubscriptionsByDateRange':
        var fromDate = params.fromDate || getTodayMinusMonths(12);
        var toDate = params.toDate || getTodayString();
        result = getSubscriptionsByDateRange(fromDate, toDate);
        break;
      case 'getExpiredSubscriptions':
        result = getExpiredSubscriptions(params.asOfDate || getTodayString());
        break;
      case 'renewSubscription':
        result = renewSubscription(params.subscriptionCode, params.newExpiryDate, params.newAnnualCost);
        break;
      case 'updateSubscriptionPayment':
        result = updateSubscriptionPayment(params.subscriptionCode, params.amountPaid);
        break;
      case 'getSubscriptionByCode':
        result = getSubscriptionByCode(params.subscriptionCode);
        break;

      // ============================================
      // DAILY LIQUIDITY CASES
      // ============================================
      case 'uploadExcelToTrialBalance':
        Logger.log('uploadExcelToTrialBalance called (POST)');
        var postData = params.formData ? JSON.parse(params.formData) : params;
        Logger.log('Data: base64 length=' + (postData.base64 ? postData.base64.length : 0) + ', filename=' + postData.filename + ', weekEnding=' + postData.weekEnding);
        // Support both shapes: either postData is an object with base64 property,
        // or postData itself is the base64 string (legacy).
        if (postData && postData.base64 !== undefined) {
          result = uploadExcelToTrialBalance(postData.base64, postData.filename, postData.weekEnding);
        } else {
          // postData may be the raw base64 string
          result = uploadExcelToTrialBalance(postData, postData.filename || 'upload.xlsx', postData.weekEnding || '');
        }
        break;
      case 'test':
        result = { success: true, message: 'API is working' };
        break;
      
      default:
        result = { error: 'Unknown action: ' + action };
        Logger.log('Unknown action: ' + action);
    }
    
    // Default: return JSON for all actions (including uploads)
    output = ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return output;
    
  } catch (error) {
    Logger.log('ERROR in doPost: ' + error.toString());
    Logger.log('Stack: ' + (error.stack || 'no stack'));
    
    var output = ContentService.createTextOutput(JSON.stringify({ 
      success: false,
      error: error.message,
      stack: error.stack
    })).setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return output;
  }
}

// ============================================
// ENTRY POINT - Handle OPTIONS requests
// ============================================
function doOptions(e) {
  var output = ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  output.setHeader('Access-Control-Max-Age', '3600');
  return output;
}

// ============================================
// DIAGNOSTIC FUNCTIONS
// ============================================

/**
 * Test if Drive API is available
 */
function testDriveAPI() {
  try {
    Logger.log('Testing Drive API availability...');
    
    // Try to list files (requires Drive API)
    const files = Drive.Files.list();
    
    Logger.log('✓ Drive API is available and working');
    return {
      success: true,
      message: 'Drive API is available',
      fileCount: files.items ? files.items.length : 0
    };
  } catch (e) {
    Logger.log('✗ Drive API error: ' + e.message);
    return {
      success: false,
      error: 'Drive API not available: ' + e.message,
      solution: 'Add Google Drive API to Google Apps Script: Services > + > Google Drive API > V3'
    };
  }
}

/**
 * Test file conversion (base64 -> blob -> sheet)
 */
function testFileConversion(base64Data, filename) {
  try {
    Logger.log('Testing file conversion...');
    Logger.log('Filename: ' + filename);
    Logger.log('Base64 length: ' + (base64Data ? base64Data.length : 0));
    
    if (!base64Data) {
      throw new Error('No base64 data provided');
    }
    
    // Step 1: Decode base64
    Logger.log('Step 1: Decoding base64...');
    const bytes = Utilities.base64Decode(base64Data);
    Logger.log('Decoded bytes: ' + bytes.length);
    
    // Step 2: Create blob
    Logger.log('Step 2: Creating blob...');
    const blob = Utilities.newBlob(bytes, MimeType.MICROSOFT_EXCEL, filename);
    Logger.log('Blob MIME type: ' + blob.getContentType());
    Logger.log('Blob size: ' + blob.getSize());
    
    // Step 3: Test Drive insert (this is where permission errors occur)
    Logger.log('Step 3: Testing Drive.Files.insert...');
    const resource = {
      title: 'TEST_' + filename + '_' + Date.now(),
      mimeType: MimeType.GOOGLE_SHEETS
    };
    
    const file = Drive.Files.insert(resource, blob);
    const tempFileId = file.id;
    Logger.log('✓ Temp file created: ' + tempFileId);
    
    // Step 4: Cleanup
    Logger.log('Step 4: Cleaning up temp file...');
    Drive.Files.remove(tempFileId);
    Logger.log('✓ Temp file deleted');
    
    return {
      success: true,
      message: 'File conversion test passed',
      steps: {
        base64Decode: 'OK (' + bytes.length + ' bytes)',
        blobCreate: 'OK (' + blob.getSize() + ' bytes)',
        driveInsert: 'OK',
        cleanup: 'OK'
      }
    };
  } catch (e) {
    Logger.log('✗ File conversion error: ' + e.message);
    Logger.log('Stack: ' + e.stack);
    
    return {
      success: false,
      error: 'File conversion failed: ' + e.message,
      stack: e.stack,
      solution: 'Check Drive API is enabled and user has permission'
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function getTodayString() {
  var today = new Date();
  return Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function getTodayMinusMonths(months) {
  var date = new Date();
  date.setMonth(date.getMonth() - months);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function getUserInfo() {
  try {
    const user = Session.getActiveUser();
    return {
      email: user.getEmail(),
      name: user.getName() || 'User',
      success: true
    };
  } catch (error) {
    return {
      email: 'guest@example.com',
      name: 'Guest',
      success: true
    };
  }
}
