/**
 * Next Identity Widget Configuration
 */
const NIWidgetConfig = {
  // The single Next Identity issuer URL
  issuerUrl: 'https://ajyc6qopjq-dev.idp.nextidentity.io',
  
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
      clientId: '1b95e536a1a44422b8b976db4462f098',
      icon: 'google'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      clientId: '234jdk4j3ndfkj3434kefkj34kjefk',
      icon: 'facebook'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      clientId: '345jdk4j3ndfkj3434kefkj34kjefk',
      icon: 'microsoft'
    },
    {
      id: 'amazon',
      name: 'Amazon',
      clientId: '456jdk4j3ndfkj3434kefkj34kjefk',
      icon: 'amazon'
    },
    {
      id: 'x',
      name: 'X',
      clientId: '567jdk4j3ndfkj3434kefkj34kjefk',
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