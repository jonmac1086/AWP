/* ============================================
   DAILY LIQUIDITY API
   ============================================ */

class DailyLiquidityApi extends BaseApiService {
  constructor() {
    super();
  }

  async uploadExcelToTrialBalance(data, options = {}) {
    this.log('uploadExcelToTrialBalance called with:', data);
    return this.request('uploadExcelToTrialBalance', data, options);
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

  async getLiquiditySummary(fromDate, toDate, options = {}) {
    return this.request('getLiquiditySummary', { fromDate, toDate }, options);
  }
}

// Create instance
window.DailyLiquidityApi = new DailyLiquidityApi();
