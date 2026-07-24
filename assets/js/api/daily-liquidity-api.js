/* ============================================
   DAILY LIQUIDITY API 
   ============================================ */

class DailyLiquidityApi extends ApiService {
  constructor() {
    super();
  }

  // ============================================
  // UPLOAD EXCEL TO TRIAL BALANCE
  // ============================================
  
  async uploadExcelToTrialBalance(base64, filename, weekEnding, options = {}) {
    this.log('uploadExcelToTrialBalance called');
    this.log('Filename:', filename);
    this.log('Week Ending:', weekEnding);
    this.log('Base64 length:', base64 ? base64.length : 0);
    
    if (!base64 || base64.length === 0) {
      throw new Error('No file data provided');
    }
    
    // For large files, use the form POST method instead of JSONP
    // The base64 string may be too long for URL parameters
    return this.request('uploadExcelToTrialBalance', {
      base64: base64,
      filename: filename,
      weekEnding: weekEnding
    }, options);
  }

  // ============================================
  // GET TRIAL BALANCE DATA
  // ============================================
  
  async getTrialBalanceData(weekEnding, options = {}) {
    this.log('getTrialBalanceData called for week ending:', weekEnding);
    return this.request('getTrialBalanceData', { weekEnding }, options);
  }

  async importLiquidityFromTrialBalance(weekEnding, options = {}) {
    this.log('importLiquidityFromTrialBalance called for week ending:', weekEnding);
    return this.request('importLiquidityFromTrialBalance', { weekEnding }, options);
  }

  async saveLiquidityData(data, options = {}) {
    this.log('saveLiquidityData called with:', data);
    return this.request('saveLiquidityData', data, options);
  }

  async loadLiquidityData(weekEnding, options = {}) {
    this.log('loadLiquidityData called for week ending:', weekEnding);
    return this.request('loadLiquidityData', { weekEnding }, options);
  }

  async getAvailableWeekEndings(options = {}) {
    this.log('getAvailableWeekEndings called');
    return this.request('getAvailableWeekEndings', {}, options);
  }

  async deleteLiquidityData(weekEnding, options = {}) {
    this.log('deleteLiquidityData called for week ending:', weekEnding);
    return this.request('deleteLiquidityData', { weekEnding }, options);
  }
}

// Create instance
window.DailyLiquidityApi = new DailyLiquidityApi();
