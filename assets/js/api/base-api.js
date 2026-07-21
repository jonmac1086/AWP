/* ============================================
   BASE API SERVICE - Core Request Methods 
   ============================================ */

class ApiService {
  constructor() {
    // ⚠️ IMPORTANT: Update this URL after redeploying Google Apps Script
    // Steps: Google Apps Script > Deploy > New Deployment > Web App > Copy URL
    this.BASE_URL = 'https://script.google.com/macros/s/AKfycbyh-69v4qQbQYFJp6ZeHmnr_vOLuzBgRYjf0F2YeWa0W3k2RC_OMeCnT9V-Wq6Yu5G3/exec';
    this.cache = new Map();
    this.debug = true;
    this.requestTimeout = 60000; // 60 seconds for large file uploads
  }

  log(...args) {
    if (this.debug) {
      console.log('[API]', ...args);
    }
  }

  error(...args) {
    console.error('[API]', ...args);
  }

  /**
   * Test if the API endpoint is reachable
   */
  async testConnection() {
    this.log('Testing API connection to:', this.BASE_URL);
    
    return new Promise((resolve) => {
      const callbackName = 'api_test_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const timeoutId = setTimeout(() => {
        delete window[callbackName];
        if (testScript && testScript.parentNode) {
          testScript.parentNode.removeChild(testScript);
        }
        this.error('Connection test timed out');
        resolve({ 
          ok: false, 
          message: 'API endpoint not responding (timeout). URL may be invalid or expired.',
          url: this.BASE_URL
        });
      }, 5000);

      window[callbackName] = (response) => {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (testScript && testScript.parentNode) {
          testScript.parentNode.removeChild(testScript);
        }
        
        if (response && response.success !== false) {
          this.log('✓ Connection test successful');
          resolve({ ok: true, message: 'API connection OK' });
        } else {
          this.log('✗ Connection test failed:', response);
          resolve({ 
            ok: false, 
            message: response?.error || 'API returned error',
            response: response
          });
        }
      };

      const testScript = document.createElement('script');
      testScript.src = this.BASE_URL + '?action=test&callback=' + callbackName;
      testScript.type = 'text/javascript';
      testScript.async = true;
      
      testScript.onerror = () => {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (testScript && testScript.parentNode) {
          testScript.parentNode.removeChild(testScript);
        }
        this.error('✗ Script load error - URL unreachable');
        resolve({ 
          ok: false, 
          message: 'Cannot reach API endpoint. Check that:\n1. URL is correct\n2. Google Apps Script is deployed as Web App\n3. Deployment ID is current (re-deploy if needed)',
          url: this.BASE_URL,
          help: 'Re-deploy: Google Apps Script > Deploy > New Deployment > Web App'
        });
      };

      document.head.appendChild(testScript);
      this.log('Test script initiated for URL:', this.BASE_URL);
    });
  }

  /**
   * Update the API endpoint URL
   */
  setBaseUrl(newUrl) {
    if (!newUrl) {
      this.error('URL cannot be empty');
      return false;
    }
    if (!newUrl.includes('script.google.com')) {
      this.error('Invalid URL - must be a Google Apps Script URL');
      return false;
    }
    this.BASE_URL = newUrl;
    this.log('✓ Base URL updated:', newUrl);
    this.clearCache();
    return true;
  }

  getBaseUrl() {
    return this.BASE_URL;
  }

  // ============================================
  // JSONP REQUEST (works with CORS)
  // ============================================
  async jsonpRequest(action, data = {}, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.BASE_URL) {
          reject(new Error('API BASE_URL not configured'));
          return;
        }

        const callbackName = 'api_callback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const url = new URL(this.BASE_URL);
        url.searchParams.append('action', action);
        url.searchParams.append('data', JSON.stringify(data));
        url.searchParams.append('callback', callbackName);
        
        const fullUrl = url.toString();
        this.log(`[${action}] JSONP Request (${fullUrl.length} chars)...`);
        
        // For large payloads, warn but still try
        if (fullUrl.length > 2000) {
          this.log(`[${action}] ⚠️ URL length is ${fullUrl.length} chars - may exceed browser limits`);
        }
        
        const timeoutId = setTimeout(() => {
          if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) script.parentNode.removeChild(script);
            this.error(`[${action}] Request timeout`);
            reject(new Error(`Request timeout - API server did not respond within ${this.requestTimeout / 1000}s`));
          }
        }, this.requestTimeout);
        
        window[callbackName] = (response) => {
          clearTimeout(timeoutId);
          delete window[callbackName];
          
          if (script && script.parentNode) {
            script.parentNode.removeChild(script);
          }
          
          this.log(`[${action}] Response received:`, response);
          
          if (response && response.success !== false) {
            const cacheKey = `${action}_${JSON.stringify(data)}`;
            this.cache.set(cacheKey, response);
            resolve(response);
          } else {
            reject(new Error((response && response.error) || `API request failed: ${action}`));
          }
        };
        
        const script = document.createElement('script');
        script.src = fullUrl;
        script.type = 'text/javascript';
        script.async = true;
        
        script.onerror = () => {
          clearTimeout(timeoutId);
          delete window[callbackName];
          if (script && script.parentNode) script.parentNode.removeChild(script);
          
          this.error(`[${action}] Script load failed`);
          
          // Check if URL is too long
          if (fullUrl.length > 2000) {
            reject(new Error(
              `URL too long (${fullUrl.length} chars). The base64 data is too large for JSONP.\n\n` +
              `Try using a smaller Excel file or split the data into smaller chunks.`
            ));
          } else {
            reject(new Error(`Network error - failed to connect to server`));
          }
        };

        document.head.appendChild(script);
        this.log(`[${action}] Script tag added`);
        
      } catch (error) {
        this.error(`[${action}] Request error:`, error);
        reject(error);
      }
    });
  }

  // ============================================
  // POST REQUEST - Disabled due to CORS
  // ============================================
  async postRequest(action, data = {}, options = {}) {
    this.log(`[${action}] POST is disabled due to CORS. Use JSONP instead.`);
    throw new Error('POST requests are disabled. Please use JSONP.');
  }

  // ============================================
  // SMART REQUEST - Force JSONP for all requests
  // ============================================
  async request(action, data = {}, options = {}) {
    // ALWAYS use JSONP - POST doesn't work due to CORS
    this.log(`[${action}] Using JSONP (all requests)`);
    return this.jsonpRequest(action, data, options);
  }

  clearCache(action = null) {
    if (action) {
      const keysToDelete = [];
      for (const key of this.cache.keys()) {
        if (key.startsWith(action)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => this.cache.delete(key));
      this.log(`Cache cleared for action: ${action}`);
    } else {
      this.cache.clear();
      this.log('All cache cleared');
    }
  }
}

// Export for use in other files
window.ApiService = ApiService;
