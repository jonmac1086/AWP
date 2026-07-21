/* ============================================
   PAYMENT VOUCHER API
   ============================================ */

class PaymentVoucherApi extends BaseApiService {
  constructor() {
    super();
  }

  async processForm(formData, options = {}) {
    this.log('processForm called with:', formData);
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
    return this.request('updateVoucher', formData, options);
  }

  async getVoucherHistory(pvNumber, options = {}) {
    return this.request('getVoucherHistory', { pvNumber }, options);
  }

  async approveVoucher(pvNumber, approverName, options = {}) {
    return this.request('approveVoucher', { pvNumber, approverName }, options);
  }

  async rejectVoucher(pvNumber, reason, options = {}) {
    return this.request('rejectVoucher', { pvNumber, reason }, options);
  }
}

// Create instance
window.PaymentVoucherApi = new PaymentVoucherApi();
