/* ============================================
   ACCOUNTS WORKSPACE - MAIN JAVASCRIPT
   ============================================ */

// Global Variables
let currentOpenSubmenu = null;
let sidebarCollapsed = false;
let currentUser = null;
let currentModule = 'dashboard';

// ============================================
// COMPATIBILITY LAYER - For modules using google.script.run
// ============================================

// Create a wrapper that mimics google.script.run for compatibility
window.google = {
  script: {
    run: (function() {
      // Store the current success and failure handlers
      let currentSuccessHandler = null;
      let currentFailureHandler = null;
      
      // Create the chainable object
      const chainable = {
        withSuccessHandler: function(callback) {
          currentSuccessHandler = callback;
          return chainable;
        },
        withFailureHandler: function(callback) {
          currentFailureHandler = callback;
          return chainable;
        }
      };
      
      // Add dynamic methods for all API actions
      const actions = [
        // User
        'getUserInfo',
        
        // Payment Voucher
        'processForm',
        'getNextPVNumber',
        'getPVNumbersByType',
        'getVoucherByNumber',
        'updateVoucher',
        
        // Inventory
        'generateInventoryCategoryCode',
        'getInventoryCategories',
        'addNewInventory',
        'getPurchaseReportData',
        'getUsageReportData',
        'getInventoryListData',
        'recordInventoryUsage',
        'removeInventory',
        
        // Assets
        'generateAssetCode',
        'addNewAsset',
        'getDetailedRegister',
        'updateAssetStatus',
        'updateAllAccumulatedDepreciation',
        'getFixedAssetsSummaryReport',
        
        // Investments
        'generateInvestmentCode',
        'addNewInvestment',
        'getInvestmentsByDateRange',
        'getMaturedInvestments',
        'getUniqueInvestmentTypes',
        'getUniqueBanks',
        'getAllInvestments',
        'getInvestmentByCode',
        'updateInvestmentRedeemDate',
        
        // Subscriptions
        'getSubscriptionCategories',
        'generateSubscriptionCategoryCode',
        'getNextSubscriptionCode',
        'addSubscription',
        'getAllSubscriptions',
        'updateSubscription',
        'deleteSubscription',
        'getSubscriptionsByDateRange',
        'getExpiredSubscriptions',
        'renewSubscription',
        
        // Daily Liquidity
        'uploadExcelToTrialBalance',
        'importLiquidityFromTrialBalance',
        'saveLiquidityData',
        'loadLiquidityData',
        'getAvailableWeekEndings',
        'deleteLiquidityData',
        
        // HTML Module Loaders
        'getPVFormHTML',
        'getAddInventoryHTML',
        'getInventoryReportHTML',
        'getAddAssetHTML',
        'getAssetRegisterHTML',
        'getInvestmentAddHTML',
        'getInvestmentReportHTML'
      ];
      
      actions.forEach(action => {
        chainable[action] = function(...args) {
          // Map the action to API methods
          const actionMap = {
            // User
            'getUserInfo': () => {
              // Return a mock user since we removed user functions
              return Promise.resolve({ name: 'User', email: 'user@example.com' });
            },
            
            // Payment Voucher
            'processForm': () => window.API.processForm(args[0]),
            'getNextPVNumber': () => window.API.getNextPVNumber(args[0]),
            'getPVNumbersByType': () => window.API.getPVNumbersByType(),
            'getVoucherByNumber': () => window.API.getVoucherByNumber(args[0], args[1]),
            'updateVoucher': () => window.API.updateVoucher(args[0]),
            
            // Inventory
            'generateInventoryCategoryCode': () => window.API.generateInventoryCategoryCode(),
            'getInventoryCategories': () => window.API.getInventoryCategories(),
            'addNewInventory': () => window.API.addNewInventory(args[0]),
            'getPurchaseReportData': () => window.API.getPurchaseReportData(args[0], args[1]),
            'getUsageReportData': () => window.API.getUsageReportData(args[0], args[1]),
            'getInventoryListData': () => window.API.getInventoryListData(),
            'recordInventoryUsage': () => window.API.recordInventoryUsage(args[0]),
            'removeInventory': () => window.API.removeInventory(args[0]),
            
            // Fixed Assets
            'generateAssetCode': () => window.API.generateAssetCode(args[0]),
            'addNewAsset': () => window.API.addNewAsset(args[0]),
            'getDetailedRegister': () => window.API.getDetailedRegister(),
            'updateAssetStatus': () => window.API.updateAssetStatus(args[0], args[1]),
            'updateAllAccumulatedDepreciation': () => window.API.updateAllAccumulatedDepreciation(args[0]),
            'getFixedAssetsSummaryReport': () => window.API.getFixedAssetsSummaryReport(args[0]),
            
            // Investment
            'generateInvestmentCode': () => window.API.generateInvestmentCode(args[0]),
            'addNewInvestment': () => window.API.addNewInvestment(args[0]),
            'getInvestmentsByDateRange': () => window.API.getInvestmentsByDateRange(args[0], args[1]),
            'getMaturedInvestments': () => window.API.getMaturedInvestments(args[0]),
            'getUniqueInvestmentTypes': () => window.API.getUniqueInvestmentTypes(),
            'getUniqueBanks': () => window.API.getUniqueBanks(),
            'getAllInvestments': () => window.API.getAllInvestments(),
            'getInvestmentByCode': () => window.API.getInvestmentByCode(args[0]),
            'updateInvestmentRedeemDate': () => window.API.updateInvestmentRedeemDate(args[0], args[1]),
            
            // Subscription
            'getSubscriptionCategories': () => window.API.getSubscriptionCategories(),
            'generateSubscriptionCategoryCode': () => window.API.generateSubscriptionCategoryCode(),
            'getNextSubscriptionCode': () => window.API.getNextSubscriptionCode(args[0]),
            'addSubscription': () => window.API.addSubscription(args[0]),
            'getAllSubscriptions': () => window.API.getAllSubscriptions(),
            'updateSubscription': () => window.API.updateSubscription(args[0]),
            'deleteSubscription': () => window.API.deleteSubscription(args[0]),
            'getSubscriptionsByDateRange': () => window.API.getSubscriptionsByDateRange(args[0], args[1]),
            'getExpiredSubscriptions': () => window.API.getExpiredSubscriptions(args[0]),
            'renewSubscription': () => window.API.renewSubscription(args[0], args[1], args[2]),
            
            // Daily Liquidity
            'uploadExcelToTrialBalance': () => window.API.uploadExcelToTrialBalance(args[0]),
            'importLiquidityFromTrialBalance': () => window.API.importLiquidityFromTrialBalance(args[0]),
            'saveLiquidityData': () => window.API.saveLiquidityData(args[0]),
            'loadLiquidityData': () => window.API.loadLiquidityData(args[0]),
            'getAvailableWeekEndings': () => window.API.getAvailableWeekEndings(),
            'deleteLiquidityData': () => window.API.deleteLiquidityData(args[0]),
             
            // HTML Module Loaders
            'getPVFormHTML': () => loadModuleFile('paymentVoucher'),
            'getAddInventoryHTML': () => loadModuleFile('inventoryAdd'),
            'getInventoryReportHTML': () => loadModuleFile('inventoryReport'),
            'getAddAssetHTML': () => loadModuleFile('addAsset'),
            'getAssetRegisterHTML': () => loadModuleFile('viewAssetRegister'),
            'getInvestmentAddHTML': () => loadModuleFile('investmentAdd'),
            'getInvestmentReportHTML': () => loadModuleFile('investmentReport')
          };
          
          const apiCall = actionMap[action];
          if (apiCall) {
            apiCall()
              .then(response => {
                if (currentSuccessHandler) {
                  currentSuccessHandler(response);
                }
              })
              .catch(error => {
                console.error(`API call failed for ${action}:`, error);
                if (currentFailureHandler) {
                  currentFailureHandler(error);
                }
              });
          } else {
            console.error('Unknown action:', action);
            if (currentFailureHandler) {
              currentFailureHandler(new Error(`Unknown action: ${action}`));
            }
          }
          return chainable;
        };
      });
      
      return chainable;
    })()
  }
};

// Helper to load module HTML files
async function loadModuleFile(moduleName) {
  const modules = {
    'paymentVoucher': 'modules/payment-voucher.html',
    'inventoryAdd': 'modules/add-inventory.html',
    'inventoryReport': 'modules/inventory-report.html',
    'addAsset': 'modules/add-asset.html',
    'viewAssetRegister': 'modules/asset-register.html',
    'investmentAdd': 'modules/add-investment.html',
    'investmentReport': 'modules/investment-report.html'
  };
  
  try {
    const response = await fetch(modules[moduleName]);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading module file:', error);
    return '<div class="welcome-card"><i class="fas fa-exclamation-circle welcome-icon"></i><h2>Error Loading Module</h2><p>Could not load module. Please try again.</p></div>';
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  setupSidebarToggleOnResize();
  
  // Load dashboard content directly (using dashboard.js function)
  if (typeof loadDashboardContent === 'function') {
    loadDashboardContent();
  } else {
    // Fallback
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      mainContent.innerHTML = '<div class="content-wrapper"><p>Loading dashboard...</p></div>';
    }
  }
  
  // Check if sidebar should be collapsed based on screen size
  if (window.innerWidth <= 768) {
    sidebarCollapsed = true;
    document.getElementById('sidebar').classList.add('collapsed');
  }
}

function setupEventListeners() {
  // Close user dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenu && !userMenu.contains(event.target)) {
      if (userDropdown) userDropdown.classList.remove('show');
    }
  });
}

function setupSidebarToggleOnResize() {
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && sidebarCollapsed) {
      // Do nothing, keep collapsed state
    } else if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('show-mobile');
    }
  });
}

// ============================================
// UI HELPERS
// ============================================

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.querySelector('.main-content');
  
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('show-mobile');
  } else {
    sidebar.classList.toggle('collapsed');
    if (mainContent) {
      mainContent.classList.toggle('expanded');
    }
    sidebarCollapsed = sidebar.classList.contains('collapsed');
    
    // Close all submenus when sidebar is collapsed
    if (sidebarCollapsed) {
      document.querySelectorAll('.submenu').forEach(menu => {
        menu.classList.remove('show');
      });
      document.querySelectorAll('.dropdown-icon').forEach(icon => {
        icon.classList.remove('rotated');
      });
      currentOpenSubmenu = null;
    }
  }
}

function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('show');
}

function toggleSubmenu(submenuId) {
  if (sidebarCollapsed && window.innerWidth > 768) return;
  
  const submenu = document.getElementById(submenuId);
  const icon = document.getElementById(submenuId.replace('Submenu', 'Icon'));
  
  // Close other submenus
  if (currentOpenSubmenu && currentOpenSubmenu !== submenu) {
    currentOpenSubmenu.classList.remove('show');
    const prevIcon = document.getElementById(currentOpenSubmenu.id.replace('Submenu', 'Icon'));
    if (prevIcon) prevIcon.classList.remove('rotated');
  }
  
  if (submenu) {
    submenu.classList.toggle('show');
    if (icon) icon.classList.toggle('rotated');
    currentOpenSubmenu = submenu.classList.contains('show') ? submenu : null;
  }
}

// ============================================
// LOADING MODAL
// ============================================

function showLoadingModal(message = 'Loading...') {
  let modal = document.getElementById('contentLoadingModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'contentLoadingModal';
    modal.className = 'content-loading-modal';
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <div class="loading-modal-content">
      <div class="loading-spinner"></div>
      <p>${message}</p>
    </div>
  `;
  modal.style.display = 'flex';
}

function hideLoadingModal() {
  const modal = document.getElementById('contentLoadingModal');
  if (modal) modal.style.display = 'none';
}

// ============================================
// MODULE LOADING
// ============================================

function loadModule(moduleName) {
  if (currentModule === moduleName) return;
  
  showLoadingModal('Loading module...');
  currentModule = moduleName;
  
  // Update active state in sidebar
  updateActiveMenuItem(moduleName);
  
  const modules = {
    'paymentVoucher': { file: 'modules/payment-voucher.html', init: 'initPVModule' },
    'inventoryAdd': { file: 'modules/add-inventory.html', init: 'initInventoryModule' },
    'inventoryReport': { file: 'modules/inventory-report.html', init: 'initInventoryReportModule' },
    'addAsset': { file: 'modules/add-asset.html', init: 'initAssetModule' },
    'viewAssetRegister': { file: 'modules/asset-register.html', init: 'initAssetRegisterModule' },
    'investmentAdd': { file: 'modules/add-investment.html', init: 'initInvestmentModule' },
    'investmentReport': { file: 'modules/investment-report.html', init: 'initInvestmentReportModule' },
    'subscriptionAdd': { file: 'modules/subscription-add.html', init: 'initSubscriptionAddModule' },
    'subscriptionSchedule': { file: 'modules/subscription-schedule.html', init: 'initSubscriptionScheduleModule' },
    'dailyLiquidity': { file: 'modules/dailyliquidity.html', init: 'initDailyLiquidityModule' },
    'dashboard': null
  };
  
  // Handle dashboard separately
  if (moduleName === 'dashboard') {
    if (typeof loadDashboardContent === 'function') {
      loadDashboardContent();
    }
    hideLoadingModal();
    closeSidebarMobile();
    return;
  }
  
  const config = modules[moduleName];
  if (!config) {
    showError('Module not found: ' + moduleName);
    hideLoadingModal();
    return;
  }
  
  fetch(config.file)
    .then(response => response.ok ? response.text() : Promise.reject('HTTP ' + response.status))
    .then(html => {
      document.getElementById('mainContent').innerHTML = `<div class="content-wrapper">${html}</div>`;
      setTimeout(() => {
        if (window[config.init] && typeof window[config.init] === 'function') {
          window[config.init]();
        }
        hideLoadingModal();
      }, 150);
      closeSidebarMobile();
    })
    .catch(error => {
      console.error('Error loading module:', error);
      showError('Could not load module. Please try again.');
      hideLoadingModal();
    });
}

function updateActiveMenuItem(moduleName) {
  // Remove active class from all menu items
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Find and activate the corresponding menu item
  document.querySelectorAll('.menu-item').forEach(item => {
    const onclickAttr = item.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes(`'${moduleName}'`)) {
      item.classList.add('active');
    }
  });
}

function showError(message) {
  alert(message);
}

function closeSidebarMobile() {
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.remove('show-mobile');
    }
  }
}

// ============================================
// MODULE INITIALIZERS
// ============================================

function initPVModule() {
  console.log('Payment Voucher module loaded');
}

function initInventoryModule() {
  console.log('Inventory module loaded');
}

function initInventoryReportModule() {
  console.log('Inventory Report module loaded');
}

function initAssetModule() {
  console.log('Asset module loaded');
}

function initAssetRegisterModule() {
  console.log('Asset Register module loaded');
}

function initInvestmentModule() {
  console.log('Investment module loaded');
}

function initInvestmentReportModule() {
  console.log('Investment Report module loaded');
}

function initSubscriptionAddModule() {
  console.log('Subscription Add module loaded');
}

function initSubscriptionScheduleModule() {
  console.log('Subscription Schedule module loaded');
}

function initDailyLiquidityModule() {
  console.log('Daily Liquidity module loaded');
  // The actual init is in dailyliquidity.js
  if (typeof window.initDailyLiquidityModule === 'function') {
    window.initDailyLiquidityModule();
  }
}

// ============================================
// USER FUNCTIONS (REMOVED - using mock data)
// ============================================

// REMOVED: loadUserInfo, showProfile, showSettings, logout

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

function getToday() {
  return formatDateForInput(new Date());
}

function getStartOfYear() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  return formatDateForInput(startOfYear);
}

function formatDateForInput(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================
// EXPORT FOR MODULES
// ============================================

// Make functions available globally
window.loadModule = loadModule;
window.toggleSidebar = toggleSidebar;
window.toggleUserMenu = toggleUserMenu;
window.toggleSubmenu = toggleSubmenu;
window.initPVModule = initPVModule;
window.initInventoryModule = initInventoryModule;
window.initInventoryReportModule = initInventoryReportModule;
window.initAssetModule = initAssetModule;
window.initAssetRegisterModule = initAssetRegisterModule;
window.initInvestmentModule = initInvestmentModule;
window.initInvestmentReportModule = initInvestmentReportModule;
window.initSubscriptionAddModule = initSubscriptionAddModule;
window.initSubscriptionScheduleModule = initSubscriptionScheduleModule;
window.initDailyLiquidityModule = initDailyLiquidityModule;
window.formatDate = formatDate;
window.getToday = getToday;
window.getStartOfYear = getStartOfYear;
window.showLoadingModal = showLoadingModal;
window.hideLoadingModal = hideLoadingModal;

// ============================================
// ADD CSS FOR LOADING MODAL
// ============================================

const homepageLoadingStyle = document.createElement('style');
homepageLoadingStyle.textContent = `
  .content-loading-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }

  .loading-modal-content {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    text-align: center;
    min-width: 150px;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4361ee;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px auto;
  }

  .loading-modal-content p {
    color: #2d3748;
    font-size: 14px;
    font-weight: 500;
    margin: 0;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(homepageLoadingStyle);
