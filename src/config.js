/**
 * Next Identity Widget Configuration
 */
const NIWidgetConfig = {
  // The single Next Identity issuer URL
  issuerUrl: 'https://your-issuer-domain.nextidentity.io',
  
  // Redirect URI - same page
  redirectUri: window.location.origin + window.location.pathname,
  
  // Post logout redirect URI - where to redirect after logout
  postLogoutRedirectUri: window.location.origin + window.location.pathname,
  
  // Debug mode - set to true to enable console logging
  debug: true,
  
  // Auth providers with their client IDs
  providers: [
    {
      id: 'google',
      name: 'Google',
      clientId: 'ni-google-client-id',
      icon: 'google'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      clientId: 'ni-facebook-client-id',
      icon: 'facebook'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      clientId: 'ni-microsoft-client-id',
      icon: 'microsoft'
    },
    {
      id: 'amazon',
      name: 'Amazon',
      clientId: 'ni-amazon-client-id',
      icon: 'amazon'
    },
    {
      id: 'x',
      name: 'X',
      clientId: 'ni-x-client-id',
      icon: 'x'
    }
  ],
  
  // Customization options
  customization: {
    buttonRadius: '4px',
    buttonColor: '#4285F4',
    buttonTextColor: '#ffffff',
    fontFamily: "'Roboto', sans-serif",
    widgetWidth: '300px'
  },
  
  // Next Identity scope
  scope: 'openid profile email',
  
  // PKCE settings
  pkce: {
    challengeMethod: 'S256'
  }
};


// Make config globally available
if (typeof window !== 'undefined') {
  window.NIWidgetConfig = NIWidgetConfig;
} 