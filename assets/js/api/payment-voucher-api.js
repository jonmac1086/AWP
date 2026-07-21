/* ============================================
   PAYMENT VOUCHER API 
   ============================================ */

class PaymentVoucherApi extends ApiService {
  constructor() {
    super();
  }

  // ============================================
  // PAYMENT VOUCHER API
  // ============================================
  
  async processForm(formData, options = {}) {
    this.log('processForm called with:', formData);
    // Send formData directly, not wrapped in another object
    return this.request('processForm', formData, options);
  }
  
  async getNextPVNumber(voucherType, options = {}) {
    return this.request('getNextPVNumber', { voucherType }, options);
  }
  
  async getPVNumbersByType(options = {}) {
    return this.request('getPVNumbersByType', {}, options);
  }
  
  async getVoucherByNumber(pvNumber, voucherType, options = {}) {
    return this.request('getVoucherByNumber', { pvNumber, voucherType }, options);
  }
  
  async updateVoucher(formData, options = {}) {
    this.log('updateVoucher called with:', formData);
    // Send formData directly, not wrapped in another object
    return this.request('updateVoucher', formData, options);
  }
}

// Create instance
window.PaymentVoucherApi = new PaymentVoucherApi();
