/**
 * Next Identity Widget Configuration
 */
const NIWidgetConfig = {
  // The single Next Identity issuer URL
  issuerUrl: 'https://example.auth.server.com',
  
  // Redirect URI - same page
  redirectUri: window.location.origin + window.location.pathname,
  
  // Auth providers with their client IDs
  providers: [
    {
      id: 'google',
      name: 'Google',
      clientId: '123jdk4j3ndfkj3434kefkj34kjefk',
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