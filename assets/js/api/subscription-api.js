/* ============================================
   SUBSCRIPTION API
   ============================================ */

class SubscriptionApi extends ApiService {
  constructor() {
    super();
  }

  // ============================================
  // SUBSCRIPTION API
  // ============================================

  async getSubscriptionCategories(options = {}) {
    this.log('Getting subscription categories');
    return this.request('getSubscriptionCategories', {}, options);
  }

  async generateSubscriptionCategoryCode(options = {}) {
    this.log('Generating subscription category code');
    return this.request('generateSubscriptionCategoryCode', {}, options);
  }

  async getNextSubscriptionCode(categoryCode, options = {}) {
    this.log('Getting next subscription code for:', categoryCode);
    return this.request('getNextSubscriptionCode', { categoryCode }, options);
  }

  async addSubscription(formData, options = {}) {
    this.log('Adding subscription:', formData);
    return this.request('addSubscription', formData, options);
  }

  async getAllSubscriptions(options = {}) {
    this.log('Getting all subscriptions');
    return this.request('getAllSubscriptions', {}, options);
  }

  async updateSubscription(formData, options = {}) {
    this.log('Updating subscription:', formData);
    return this.request('updateSubscription', formData, options);
  }

  async deleteSubscription(subscriptionCode, options = {}) {
    this.log('Deleting subscription:', subscriptionCode);
    return this.request('deleteSubscription', { subscriptionCode }, options);
  }

  async getSubscriptionsByDateRange(fromDate, toDate, options = {}) {
    this.log('Getting subscriptions by date range:', fromDate, toDate);
    return this.request('getSubscriptionsByDateRange', { fromDate, toDate }, options);
  }

  async getExpiredSubscriptions(asOfDate, options = {}) {
    this.log('Getting expired subscriptions as of:', asOfDate);
    return this.request('getExpiredSubscriptions', { asOfDate }, options);
  }

  async renewSubscription(subscriptionCode, newExpiryDate, newAnnualCost, options = {}) {
    this.log('Renewing subscription:', subscriptionCode, newExpiryDate, newAnnualCost);
    return this.request('renewSubscription', { 
      subscriptionCode, 
      newExpiryDate, 
      newAnnualCost 
    }, options);
  }
}

// Create instance
window.SubscriptionApi = new SubscriptionApi();
