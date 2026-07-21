/* ============================================
   INVESTMENT API
   ============================================ */

class InvestmentApi extends BaseApiService {
  constructor() {
    super();
  }

  async generateInvestmentCode(investmentType, options = {}) {
    return this.request('generateInvestmentCode', { investmentType }, options);
  }
  
  async addNewInvestment(formData, options = {}) {
    return this.request('addNewInvestment', formData, options);
  }
  
  async getInvestmentsByDateRange(fromDate, toDate, options = {}) {
    return this.request('getInvestmentsByDateRange', { fromDate, toDate }, options);
  }
  
  async getMaturedInvestments(toDate, options = {}) {
    return this.request('getMaturedInvestments', { toDate }, options);
  }
  
  async getUniqueInvestmentTypes(options = {}) {
    return this.request('getUniqueInvestmentTypes', {}, options);
  }
  
  async getUniqueBanks(options = {}) {
    return this.request('getUniqueBanks', {}, options);
  }
  
  async getAllInvestments(options = {}) {
    return this.request('getAllInvestments', {}, options);
  }

  async getInvestmentByCode(investmentCode, options = {}) {
    return this.request('getInvestmentByCode', { investmentCode }, options);
  }

  async updateInvestmentRedeemDate(investmentCode, redeemDate, options = {}) {
    return this.request('updateInvestmentRedeemDate', { investmentCode, redeemDate }, options);
  }

  async getInvestmentSummary(asOfDate, options = {}) {
    return this.request('getInvestmentSummary', { asOfDate }, options);
  }
}

// Create instance
window.InvestmentApi = new InvestmentApi();
