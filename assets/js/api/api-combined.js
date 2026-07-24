// Create global API instance that combines all APIs
window.API = new ApiService();

// Override API methods to use the specific API instances
// This maintains the same interface as the original api.js

// ============================================
// USER API
// ============================================
window.API.getUserInfo = function(options = {}) {
  return window.PaymentVoucherApi.request('getUserInfo', {}, options);
};

// ============================================
// PAYMENT VOUCHER API
// ============================================
window.API.processForm = function(formData, options = {}) {
  return window.PaymentVoucherApi.processForm(formData, options);
};

window.API.getNextPVNumber = function(voucherType, options = {}) {
  return window.PaymentVoucherApi.getNextPVNumber(voucherType, options);
};

window.API.getPVNumbersByType = function(options = {}) {
  return window.PaymentVoucherApi.getPVNumbersByType(options);
};

window.API.getVoucherByNumber = function(pvNumber, voucherType, options = {}) {
  return window.PaymentVoucherApi.getVoucherByNumber(pvNumber, voucherType, options);
};

window.API.updateVoucher = function(formData, options = {}) {
  return window.PaymentVoucherApi.updateVoucher(formData, options);
};

// ============================================
// INVENTORY API
// ============================================
window.API.generateInventoryCategoryCode = function(options = {}) {
  return window.InventoryApi.generateInventoryCategoryCode(options);
};

window.API.getNextInventoryCode = function(mainCode, options = {}) {
  return window.InventoryApi.getNextInventoryCode(mainCode, options);
};

window.API.getInventoryCategories = function(options = {}) {
  return window.InventoryApi.getInventoryCategories(options);
};

window.API.addNewInventory = function(formData, options = {}) {
  return window.InventoryApi.addNewInventory(formData, options);
};

window.API.getPurchaseReportData = function(fromDate, toDate, options = {}) {
  return window.InventoryApi.getPurchaseReportData(fromDate, toDate, options);
};

window.API.getUsageReportData = function(fromDate, toDate, options = {}) {
  return window.InventoryApi.getUsageReportData(fromDate, toDate, options);
};

window.API.getInventoryListData = function(options = {}) {
  return window.InventoryApi.getInventoryListData(options);
};

window.API.recordInventoryUsage = function(formData, options = {}) {
  return window.InventoryApi.recordInventoryUsage(formData, options);
};

window.API.removeInventory = function(inventoryCode, options = {}) {
  return window.InventoryApi.removeInventory(inventoryCode, options);
};

// ============================================
// FIXED ASSETS API
// ============================================
window.API.generateAssetCode = function(assetType, options = {}) {
  return window.AssetApi.generateAssetCode(assetType, options);
};

window.API.addNewAsset = function(formData, options = {}) {
  return window.AssetApi.addNewAsset(formData, options);
};

window.API.getDetailedRegister = function(options = {}) {
  return window.AssetApi.getDetailedRegister(options);
};

window.API.updateAssetStatus = function(assetName, newStatus, options = {}) {
  return window.AssetApi.updateAssetStatus(assetName, newStatus, options);
};

window.API.updateAllAccumulatedDepreciation = function(asOfDate, options = {}) {
  return window.AssetApi.updateAllAccumulatedDepreciation(asOfDate, options);
};

window.API.getFixedAssetsSummaryReport = function(toDate, options = {}) {
  return window.AssetApi.getFixedAssetsSummaryReport(toDate, options);
};

// ============================================
// INVESTMENT API
// ============================================
window.API.generateInvestmentCode = function(investmentType, options = {}) {
  return window.InvestmentApi.generateInvestmentCode(investmentType, options);
};

window.API.addNewInvestment = function(formData, options = {}) {
  return window.InvestmentApi.addNewInvestment(formData, options);
};

window.API.getInvestmentsByDateRange = function(fromDate, toDate, options = {}) {
  return window.InvestmentApi.getInvestmentsByDateRange(fromDate, toDate, options);
};

window.API.getMaturedInvestments = function(toDate, options = {}) {
  return window.InvestmentApi.getMaturedInvestments(toDate, options);
};

window.API.getUniqueInvestmentTypes = function(options = {}) {
  return window.InvestmentApi.getUniqueInvestmentTypes(options);
};

window.API.getUniqueBanks = function(options = {}) {
  return window.InvestmentApi.getUniqueBanks(options);
};

window.API.getAllInvestments = function(options = {}) {
  return window.InvestmentApi.getAllInvestments(options);
};

window.API.getInvestmentByCode = function(investmentCode, options = {}) {
  return window.InvestmentApi.getInvestmentByCode(investmentCode, options);
};

window.API.updateInvestmentRedeemDate = function(investmentCode, redeemDate, options = {}) {
  return window.InvestmentApi.updateInvestmentRedeemDate(investmentCode, redeemDate, options);
};

// ============================================
// SUBSCRIPTION API
// ============================================
window.API.getSubscriptionCategories = function(options = {}) {
  return window.SubscriptionApi.getSubscriptionCategories(options);
};

window.API.generateSubscriptionCategoryCode = function(options = {}) {
  return window.SubscriptionApi.generateSubscriptionCategoryCode(options);
};

window.API.getNextSubscriptionCode = function(categoryCode, options = {}) {
  return window.SubscriptionApi.getNextSubscriptionCode(categoryCode, options);
};

window.API.addSubscription = function(formData, options = {}) {
  return window.SubscriptionApi.addSubscription(formData, options);
};

window.API.getAllSubscriptions = function(options = {}) {
  return window.SubscriptionApi.getAllSubscriptions(options);
};

window.API.updateSubscription = function(formData, options = {}) {
  return window.SubscriptionApi.updateSubscription(formData, options);
};

window.API.deleteSubscription = function(subscriptionCode, options = {}) {
  return window.SubscriptionApi.deleteSubscription(subscriptionCode, options);
};

window.API.getSubscriptionsByDateRange = function(fromDate, toDate, options = {}) {
  return window.SubscriptionApi.getSubscriptionsByDateRange(fromDate, toDate, options);
};

window.API.getExpiredSubscriptions = function(asOfDate, options = {}) {
  return window.SubscriptionApi.getExpiredSubscriptions(asOfDate, options);
};

window.API.renewSubscription = function(subscriptionCode, newExpiryDate, newAnnualCost, options = {}) {
  return window.SubscriptionApi.renewSubscription(subscriptionCode, newExpiryDate, newAnnualCost, options);
};

// ============================================
// DAILY LIQUIDITY API
// ============================================
window.API.uploadExcelToTrialBalance = function(base64, filename, weekEnding, options = {}) {
  return window.DailyLiquidityApi.uploadExcelToTrialBalance(base64, filename, weekEnding, options);
};

window.API.importLiquidityFromTrialBalance = function(weekEnding, options = {}) {
  return window.DailyLiquidityApi.importLiquidityFromTrialBalance(weekEnding, options);
};

window.API.saveLiquidityData = function(data, options = {}) {
  return window.DailyLiquidityApi.saveLiquidityData(data, options);
};

window.API.loadLiquidityData = function(weekEnding, options = {}) {
  return window.DailyLiquidityApi.loadLiquidityData(weekEnding, options);
};

window.API.getAvailableWeekEndings = function(options = {}) {
  return window.DailyLiquidityApi.getAvailableWeekEndings(options);
};

window.API.deleteLiquidityData = function(weekEnding, options = {}) {
  return window.DailyLiquidityApi.deleteLiquidityData(weekEnding, options);
};

// ============================================
// TEST CONNECTION
// ============================================
window.API.testConnection = async function(options = {}) {
  try {
    const response = await window.API.request('test', {}, options);
    return {
      connected: response && response.success !== false,
      message: response && response.success !== false ? 'Connected to server' : 'Connection failed'
    };
  } catch (error) {
    return {
      connected: false,
      message: 'Connection failed: ' + error.message
    };
  }
};

// ============================================
// CACHE CLEARING (Maintain original functionality)
// ============================================
window.API.clearCache = function(action = null) {
  if (action) {
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.startsWith(action)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key));
  } else {
    this.cache.clear();
  }
};

// ============================================
// BACKWARD COMPATIBILITY - callGAS function
// Maintains all existing actions without modifying them
// ============================================
window.callGAS = async function(action, data = {}) {
  console.warn('callGAS is deprecated. Use API.[method] instead.');
  
  const actionMap = {
    // User API
    'getUserInfo': () => window.API.getUserInfo(),
    
    // Payment Voucher API
    'processForm': () => window.API.processForm(data),
    'getNextPVNumber': () => window.API.getNextPVNumber(data.voucherType),
    'getPVNumbersByType': () => window.API.getPVNumbersByType(),
    'getVoucherByNumber': () => window.API.getVoucherByNumber(data.pvNumber, data.voucherType),
    'updateVoucher': () => window.API.updateVoucher(data),
    
    // Inventory API
    'generateInventoryCategoryCode': () => window.API.generateInventoryCategoryCode(),
    'getNextInventoryCode': () => window.API.getNextInventoryCode(data.mainCode),
    'getInventoryCategories': () => window.API.getInventoryCategories(),
    'addNewInventory': () => window.API.addNewInventory(data),
    'getPurchaseReportData': () => window.API.getPurchaseReportData(data.fromDate, data.toDate),
    'getUsageReportData': () => window.API.getUsageReportData(data.fromDate, data.toDate),
    'getInventoryListData': () => window.API.getInventoryListData(),
    'recordInventoryUsage': () => window.API.recordInventoryUsage(data),
    'removeInventory': () => window.API.removeInventory(data.inventoryCode),
    
    // Fixed Assets API
    'generateAssetCode': () => window.API.generateAssetCode(data.assetType),
    'addNewAsset': () => window.API.addNewAsset(data),
    'getDetailedRegister': () => window.API.getDetailedRegister(),
    'updateAssetStatus': () => window.API.updateAssetStatus(data.assetName, data.newStatus),
    'updateAllAccumulatedDepreciation': () => window.API.updateAllAccumulatedDepreciation(data.asOfDate),
    'getFixedAssetsSummaryReport': () => window.API.getFixedAssetsSummaryReport(data.toDate),
    
    // Investment API
    'generateInvestmentCode': () => window.API.generateInvestmentCode(data.investmentType),
    'addNewInvestment': () => window.API.addNewInvestment(data),
    'getInvestmentsByDateRange': () => window.API.getInvestmentsByDateRange(data.fromDate, data.toDate),
    'getMaturedInvestments': () => window.API.getMaturedInvestments(data.toDate),
    'getUniqueInvestmentTypes': () => window.API.getUniqueInvestmentTypes(),
    'getUniqueBanks': () => window.API.getUniqueBanks(),
    'getAllInvestments': () => window.API.getAllInvestments(),
    'getInvestmentByCode': () => window.API.getInvestmentByCode(data.investmentCode),
    'updateInvestmentRedeemDate': () => window.API.updateInvestmentRedeemDate(data.investmentCode, data.redeemDate),
    
    // Subscription API
    'generateSubscriptionCategoryCode': () => window.API.generateSubscriptionCategoryCode(),
    'getSubscriptionCategories': () => window.API.getSubscriptionCategories(),
    'getNextSubscriptionCode': () => window.API.getNextSubscriptionCode(data.categoryCode),
    'addSubscription': () => window.API.addSubscription(data),
    'getAllSubscriptions': () => window.API.getAllSubscriptions(),
    'updateSubscription': () => window.API.updateSubscription(data),
    'deleteSubscription': () => window.API.deleteSubscription(data.subscriptionCode),
    'getSubscriptionsByDateRange': () => window.API.getSubscriptionsByDateRange(data.fromDate, data.toDate),
    'getExpiredSubscriptions': () => window.API.getExpiredSubscriptions(data.asOfDate),
    'renewSubscription': () => window.API.renewSubscription(data.subscriptionCode, data.newExpiryDate, data.newAnnualCost),
    
    // Daily Liquidity API
    'uploadExcelToTrialBalance': () => window.API.uploadExcelToTrialBalance(data.base64, data.filename, data.weekEnding),
    'importLiquidityFromTrialBalance': () => window.API.importLiquidityFromTrialBalance(data.weekEnding),
    'saveLiquidityData': () => window.API.saveLiquidityData(data),
    'loadLiquidityData': () => window.API.loadLiquidityData(data.weekEnding),
    'getAvailableWeekEndings': () => window.API.getAvailableWeekEndings(),
    'deleteLiquidityData': () => window.API.deleteLiquidityData(data.weekEnding),
    
    // Test
    'test': () => window.API.request('test', {})
  };
  
  const apiCall = actionMap[action];
  if (apiCall) {
    return apiCall();
  }
  
  throw new Error(`Unknown action: ${action}`);
};

console.log('API Combined - All approaches maintained for backward compatibility');
