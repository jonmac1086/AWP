/* ============================================
   INVENTORY API
   ============================================ */

class InventoryApi extends BaseApiService {
  constructor() {
    super();
  }

  async generateInventoryCategoryCode(options = {}) {
    return this.request('generateInventoryCategoryCode', {}, options);
  }

  async getNextInventoryCode(mainCode, options = {}) {
    this.log('getNextInventoryCode called for:', mainCode);
    return this.request('getNextInventoryCode', { mainCode }, options);
  }
  
  async getInventoryCategories(options = {}) {
    return this.request('getInventoryCategories', {}, options);
  }
  
  async addNewInventory(formData, options = {}) {
    return this.request('addNewInventory', formData, options);
  }
  
  async getPurchaseReportData(fromDate, toDate, options = {}) {
    return this.request('getPurchaseReportData', { fromDate, toDate }, options);
  }
  
  async getUsageReportData(fromDate, toDate, options = {}) {
    return this.request('getUsageReportData', { fromDate, toDate }, options);
  }
  
  async getInventoryListData(options = {}) {
    return this.request('getInventoryListData', {}, options);
  }
  
  async recordInventoryUsage(formData, options = {}) {
    return this.request('recordInventoryUsage', formData, options);
  }
  
  async removeInventory(inventoryCode, options = {}) {
    return this.request('removeInventory', { inventoryCode }, options);
  }

  async getInventoryByCode(inventoryCode, options = {}) {
    return this.request('getInventoryByCode', { inventoryCode }, options);
  }

  async updateInventoryQuantity(inventoryCode, newQuantity, options = {}) {
    return this.request('updateInventoryQuantity', { inventoryCode, newQuantity }, options);
  }
}

// Create instance
window.InventoryApi = new InventoryApi();
