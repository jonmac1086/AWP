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
  // JSONP REQUEST (for small payloads)
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
          
          this.error(`[${action}] Script load failed - URL too long or endpoint unreachable`);
          
          reject(new Error(
            `Network error - JSONP request failed (URL may be too long).\n\n` +
            `For large files, the system should use POST requests instead.`
          ));
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
  // POST REQUEST (for large payloads like file uploads)
  // ============================================
  async postRequest(action, data = {}, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.BASE_URL) {
          reject(new Error('API BASE_URL not configured'));
          return;
        }

        this.log(`[${action}] POST Request (payload: ${JSON.stringify(data).length} chars)...`);

        // Prepare form data
        const formData = new FormData();
        formData.append('action', action);
        formData.append('formData', JSON.stringify(data));

        // Create timeout promise
        const timeoutPromise = new Promise((_, rejectTimeout) => {
          setTimeout(() => rejectTimeout(new Error('POST request timeout')), this.requestTimeout);
        });

        // Create fetch promise
        const fetchPromise = fetch(this.BASE_URL, {
          method: 'POST',
          body: formData
        }).then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        });

        // Race between fetch and timeout
        Promise.race([fetchPromise, timeoutPromise])
          .then(result => {
            this.log(`[${action}] POST Response:`, result);
            if (result && result.success !== false) {
              const cacheKey = `${action}_${JSON.stringify(data)}`;
              this.cache.set(cacheKey, result);
              resolve(result);
            } else {
              reject(new Error((result && result.error) || `API request failed: ${action}`));
            }
          })
          .catch(error => {
            this.error(`[${action}] POST Error:`, error);
            reject(new Error(`POST request failed: ${error.message}`));
          });

      } catch (error) {
        this.error(`[${action}] Request error:`, error);
        reject(error);
      }
    });
  }

  // ============================================
  // SMART REQUEST - Chooses JSONP or POST
  // ============================================
  async request(action, data = {}, options = {}) {
    // For file uploads (large base64 strings), use POST
    const dataString = JSON.stringify(data);
    const isLargePayload = dataString.length > 5000;
    const isFileUpload = action.toLowerCase().includes('upload');

    if (isLargePayload || isFileUpload) {
      this.log(`[${action}] Using POST (large payload: ${dataString.length} chars)`);
      return this.postRequest(action, data, options);
    } else {
      this.log(`[${action}] Using JSONP (small payload: ${dataString.length} chars)`);
      return this.jsonpRequest(action, data, options);
    }
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
