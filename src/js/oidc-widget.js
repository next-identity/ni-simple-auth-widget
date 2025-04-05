/**
 * OIDC Authentication Widget
 * Handles OIDC authentication flow with PKCE
 */
class OIDCWidget {
  constructor(config) {
    this.config = config;
    this.state = {};
    this.initializeState();
    this.setupEventListeners();
  }

  /**
   * Initialize widget state
   */
  initializeState() {
    // Check if we're in a callback from auth flow
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      this.handleCallback(code, state);
    } else {
      // Clear any existing tokens if not in callback flow
      this.clearStoredTokenData();
    }
  }

  /**
   * Set up event listeners for auth buttons
   */
  setupEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      // Find all auth buttons in the widget
      const authButtons = document.querySelectorAll('.oidc-auth-button');
      
      authButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const providerId = button.getAttribute('data-provider-id');
          this.initiateLogin(providerId);
        });
      });

      // Apply customizations
      this.applyCustomizations();
    });
  }

  /**
   * Generate a random string for state and code verifier
   */
  generateRandomString(length = 64) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    return result;
  }

  /**
   * Calculate code challenge from code verifier (for PKCE)
   */
  async calculateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    
    // Convert to base64url
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Store auth state in localStorage
   */
  storeAuthState(state, codeVerifier, providerId) {
    const stateData = {
      state,
      codeVerifier,
      providerId,
      timestamp: Date.now()
    };
    localStorage.setItem('oidc_auth_state', JSON.stringify(stateData));
  }

  /**
   * Get stored auth state from localStorage
   */
  getStoredAuthState() {
    const stateData = localStorage.getItem('oidc_auth_state');
    if (!stateData) return null;
    
    try {
      return JSON.parse(stateData);
    } catch (e) {
      console.error('Failed to parse auth state:', e);
      return null;
    }
  }

  /**
   * Clear stored auth state
   */
  clearStoredAuthState() {
    localStorage.removeItem('oidc_auth_state');
  }

  /**
   * Store token data
   */
  storeTokenData(tokenData) {
    localStorage.setItem('oidc_token_data', JSON.stringify(tokenData));
    
    // Dispatch event for token received
    const event = new CustomEvent('oidc:tokens_received', {
      detail: tokenData
    });
    document.dispatchEvent(event);
  }

  /**
   * Get stored token data
   */
  getStoredTokenData() {
    const tokenData = localStorage.getItem('oidc_token_data');
    if (!tokenData) return null;
    
    try {
      return JSON.parse(tokenData);
    } catch (e) {
      console.error('Failed to parse token data:', e);
      return null;
    }
  }

  /**
   * Clear stored token data
   */
  clearStoredTokenData() {
    localStorage.removeItem('oidc_token_data');
  }

  /**
   * Parse and validate ID token
   */
  parseIdToken(idToken) {
    try {
      const parts = idToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (e) {
      console.error('Failed to parse ID token:', e);
      return null;
    }
  }

  /**
   * Initiate login process for a provider
   */
  async initiateLogin(providerId) {
    try {
      // Find provider in config
      const provider = this.config.providers.find(p => p.id === providerId);
      if (!provider) {
        throw new Error(`Provider with ID ${providerId} not found`);
      }
      
      // Generate state and code verifier for PKCE
      const state = this.generateRandomString(32);
      const codeVerifier = this.generateRandomString(64);
      const codeChallenge = await this.calculateCodeChallenge(codeVerifier);
      
      // Store state and code verifier
      this.storeAuthState(state, codeVerifier, providerId);
      
      // Build authorization URL
      const authUrl = new URL(`${this.config.issuerUrl}/authorize`);
      authUrl.searchParams.append('client_id', provider.clientId);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', this.config.redirectUri);
      authUrl.searchParams.append('scope', this.config.scope);
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('code_challenge', codeChallenge);
      authUrl.searchParams.append('code_challenge_method', this.config.pkce.challengeMethod);
      
      // Dispatch event for login initiated
      const event = new CustomEvent('oidc:login_initiated', {
        detail: { providerId }
      });
      document.dispatchEvent(event);
      
      // Redirect to authorization endpoint
      window.location.href = authUrl.toString();
    } catch (e) {
      console.error('Login initiation failed:', e);
      
      // Dispatch error event
      const event = new CustomEvent('oidc:error', {
        detail: { 
          error: 'login_failed',
          errorDescription: e.message
        }
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Handle auth callback
   */
  async handleCallback(code, returnedState) {
    try {
      // Get stored state data
      const storedStateData = this.getStoredAuthState();
      if (!storedStateData) {
        throw new Error('No stored authentication state found');
      }
      
      // Validate state
      if (storedStateData.state !== returnedState) {
        throw new Error('State mismatch - possible CSRF attack');
      }
      
      // Find provider
      const provider = this.config.providers.find(p => p.id === storedStateData.providerId);
      if (!provider) {
        throw new Error(`Provider with ID ${storedStateData.providerId} not found`);
      }
      
      // Exchange code for tokens
      const tokenResponse = await this.exchangeCodeForTokens(
        code, 
        storedStateData.codeVerifier, 
        provider.clientId
      );
      
      // Parse ID token
      const idTokenPayload = this.parseIdToken(tokenResponse.id_token);
      
      // Store token data
      this.storeTokenData({
        accessToken: tokenResponse.access_token,
        idToken: tokenResponse.id_token,
        refreshToken: tokenResponse.refresh_token,
        expiresIn: tokenResponse.expires_in,
        tokenType: tokenResponse.token_type,
        scope: tokenResponse.scope,
        idTokenPayload,
        providerId: storedStateData.providerId
      });
      
      // Clear state data as it's no longer needed
      this.clearStoredAuthState();
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Dispatch authenticated event
      const event = new CustomEvent('oidc:authenticated', {
        detail: {
          user: idTokenPayload,
          providerId: storedStateData.providerId
        }
      });
      document.dispatchEvent(event);
    } catch (e) {
      console.error('Authentication callback failed:', e);
      
      // Clear state data
      this.clearStoredAuthState();
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Dispatch error event
      const event = new CustomEvent('oidc:error', {
        detail: { 
          error: 'callback_failed',
          errorDescription: e.message
        }
      });
      document.dispatchEvent(event);
    }
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code, codeVerifier, clientId) {
    const tokenUrl = `${this.config.issuerUrl}/token`;
    
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', this.config.redirectUri);
    params.append('client_id', clientId);
    params.append('code_verifier', codeVerifier);
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || 'Failed to exchange code for tokens');
    }
    
    return await response.json();
  }

  /**
   * Logout user
   */
  logout() {
    const tokenData = this.getStoredTokenData();
    this.clearStoredTokenData();
    
    // Dispatch logout event
    const event = new CustomEvent('oidc:logout', {
      detail: tokenData ? { providerId: tokenData.providerId } : {}
    });
    document.dispatchEvent(event);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getStoredTokenData();
  }

  /**
   * Get current user information
   */
  getCurrentUser() {
    const tokenData = this.getStoredTokenData();
    return tokenData ? tokenData.idTokenPayload : null;
  }

  /**
   * Apply customizations from config
   */
  applyCustomizations() {
    const customization = this.config.customization;
    const root = document.documentElement;
    
    // Set CSS variables
    root.style.setProperty('--oidc-button-radius', customization.buttonRadius);
    root.style.setProperty('--oidc-button-color', customization.buttonColor);
    root.style.setProperty('--oidc-button-text-color', customization.buttonTextColor);
    root.style.setProperty('--oidc-font-family', customization.fontFamily);
    root.style.setProperty('--oidc-widget-width', customization.widgetWidth);
  }
}

// Initialize widget when config is available
document.addEventListener('DOMContentLoaded', () => {
  // Use global config if available
  if (window.OIDCWidgetConfig) {
    window.oidcWidget = new OIDCWidget(window.OIDCWidgetConfig);
  } else {
    console.error('OIDC Widget configuration not found');
  }
});

export default OIDCWidget; 