window.APP_CONFIG = {
  // Main API URL
  API_URL: 'https://script.google.com/macros/s/AKfycbwhrAckDK-eLguLKM5WcV9HtUuE6D8I-Q2g-lckarcpSPfigqKsKAfVqIRMU1ppcBCkIQ/exec',
  
  // Upload Service URL (separate Web App)
  UPLOAD_URL: 'https://script.google.com/macros/s/AKfycby4-HEOB2dRbxoL9lwMr4idxIGzstLMJKQamZ7E6MHWjhIgxckEyBM6YNhKYRr2s3pC2g/exec',
  
  // Google Sheet IDs
  SHEETS: {
    PV: '1vb3sUPMXWi455HVG6PbeWiWGLt-ek9DbwrY7Bw_yuKw',
    INVENTORY: '1tgE_a9Bv5uuBSDcRYqtfifxHTAXhTILxHDI22z4C1TA',
    ASSETS: '1PnGJmfxZjdDxGhC7ddJE4dh3jhzdIz7Vo9UuzweptfU',
    INVESTMENTS: '1JxY5-A2A4xOKIF2NnB9n9yqTYO34Q7oP1N3D9wHfbkw',
    TRIAL_BALANCE: '1STj-5KHoNgt0BRLJlF_FnWlHvrZmrtHGKQ6x5Cm_-7I'
  },
  
  VOUCHER_PREFIXES: {
    'Payment Voucher': 'PVNO.FT',
    'Cash Payment Voucher': 'PVNO.CH',
    'Cheque Payment Voucher': 'PVNO.CQ',
    'Direct Credit Payment Voucher': 'PVNO.DC',
    'Staff Medical Payment Voucher': 'PVNO.SM'
  },
  
  ASSET_TYPES: {
    'Computers & Accessories': { prefix: 'GAPMFI/CA', lifeSpan: 3, rate: 33.33 },
    'Furniture and Fixtures': { prefix: 'GAPMFI/FFF', lifeSpan: 3, rate: 33.33 },
    'Office Equipment': { prefix: 'GAPMFI/OE', lifeSpan: 3, rate: 33.33 },
    'Software': { lifeSpan: 3, rate: 33.33 },
    'Fittings': { lifeSpan: 5, rate: 20.00 },
    'Motor Vehicle': { lifeSpan: 5, rate: 20.00 }
  },
  
  INVESTMENT_PREFIXES: {
    'Fixed Deposit': 'FD',
    'Treasury Bills': 'Tbill',
    'Bonds': 'Bond'
  }
};
