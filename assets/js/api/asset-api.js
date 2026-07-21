/* ============================================
   FIXED ASSETS API
   ============================================ */

class AssetApi extends ApiService {
  constructor() {
    super();
  }

  // ============================================
  // FIXED ASSETS API
  // ============================================
  
  async generateAssetCode(assetType, options = {}) {
    return this.request('generateAssetCode', { assetType }, options);
  }
  
  async addNewAsset(formData, options = {}) {
    return this.request('addNewAsset', formData, options);
  }
  
  async getDetailedRegister(options = {}) {
    return this.request('getDetailedRegister', {}, options);
  }
  
  async updateAssetStatus(assetName, newStatus, options = {}) {
    return this.request('updateAssetStatus', { assetName, newStatus }, options);
  }
  
  async updateAllAccumulatedDepreciation(asOfDate, options = {}) {
    this.log('updateAllAccumulatedDepreciation called for date:', asOfDate);
    return this.request('updateAllAccumulatedDepreciation', { asOfDate }, options);
  }

  async getFixedAssetsSummaryReport(toDate, options = {}) {
    this.log('getFixedAssetsSummaryReport called for date:', toDate);
    return this.request('getFixedAssetsSummaryReport', { toDate }, options);
  }
}

// Create instance
window.AssetApi = new AssetApi();
