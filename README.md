# Next Identity Authentication Widget

A simple, customizable Single Page Application (SPA) widget for Next Identity authentication that can be easily integrated into any web application.

## Features

- Easy to integrate - just include the CSS and JavaScript files
- Supports multiple authentication providers (Google, Facebook, Microsoft, etc.)
- Uses secure Next Identity authentication with PKCE flow
- Customizable styling through CSS variables
- Built-in event system for handling authentication state changes
- No external dependencies

## Project Structure

```
src/
├── config.js           # Configuration file for the widget
├── index.html          # Demo page showing the widget in action
├── css/
│   ├── ni-widget.css   # Styling for the widget
│   └── ni-widget.min.css # Minified CSS
└── js/
    ├── ni-widget.js    # Core functionality of the widget
    └── ni-widget.min.js # Minified JavaScript
```

## Quick Start

1. Clone this repository or download the source code
2. Copy the widget files to your project (minified versions recommended for production)
3. Update `config.js` with your Next Identity provider details
4. Choose an integration method below

## Integration Methods

You can integrate the Next Identity widget in two ways:

### Method 1: Standard Integration

This method provides a pre-structured widget DOM that you can style further if needed:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Add the widget CSS -->
  <link rel="stylesheet" href="path/to/ni-widget.min.css">
</head>
<body>
  <!-- Widget container with predefined structure -->
  <div class="ni-widget-container">
    <div class="ni-widget-header">
      <h2 class="ni-widget-title">Sign in</h2>
      <p class="ni-widget-subtitle">Choose your preferred sign-in method</p>
    </div>
    
    <div class="ni-auth-buttons">
      <!-- Auth buttons will be dynamically generated -->
    </div>
    
    <div class="ni-loading">
      <div class="ni-spinner"></div>
    </div>
    
    <div class="ni-error"></div>
  </div>

  <!-- Config script - Update path to your config file -->
  <script src="path/to/config.js"></script>
  
  <!-- Widget script -->
  <script src="path/to/ni-widget.min.js"></script>
</body>
</html>
```

### Method 2: Minimal Integration

For the most minimal integration, just add a single div with ID `ni-widget-root`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Add the widget CSS -->
  <link rel="stylesheet" href="path/to/ni-widget.min.css">
</head>
<body>
  <!-- The widget will be entirely built inside this element -->
  <div id="ni-widget-root"></div>

  <!-- Config script - Update path to your config file -->
  <script src="path/to/config.js"></script>
  
  <!-- Widget script -->
  <script src="path/to/ni-widget.min.js"></script>
</body>
</html>
```

## Configuration

The widget is configured using the `config.js` file. Here's an example configuration:

```javascript
const NIWidgetConfig = {
  // Your Next Identity issuer URL
  issuerUrl: 'https://your-issuer.nextidentity.io',
  
  // The redirect URI (typically the same page)
  redirectUri: window.location.origin + window.location.pathname,
  
  // Redirect URI for after logout
  postLogoutRedirectUri: window.location.origin + window.location.pathname,
  
  // Enable debug logging for troubleshooting
  debug: false,
  
  // Configure your authentication providers
  providers: [
    {
      id: 'google',
      name: 'Google',
      clientId: 'your-client-id-for-google',
      icon: 'google'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      clientId: 'your-client-id-for-facebook',
      icon: 'facebook'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      clientId: 'your-client-id-for-microsoft',
      icon: 'microsoft'
    },
    {
      id: 'amazon',
      name: 'Amazon',
      clientId: 'your-client-id-for-amazon',
      icon: 'amazon'
    },
    {
      id: 'x',
      name: 'X',
      clientId: 'your-client-id-for-x',
      icon: 'x'
    },
    {
      id: 'nextidentity',
      name: 'Next Identity',
      clientId: 'your-client-id-for-nextidentity',
      icon: 'nextidentity'
    }
    // Add more providers as needed
  ],
  
  // UI customization options
  customization: {
    buttonRadius: '4px',
    buttonColor: '#4285F4',
    buttonTextColor: '#ffffff',
    fontFamily: "'Roboto', sans-serif",
    widgetWidth: '300px'
  },
  
  // OpenID Connect scope
  scope: 'openid profile email',
  
  // PKCE settings (don't change unless you know what you're doing)
  pkce: {
    challengeMethod: 'S256'
  }
};

// Make config available globally
if (typeof window !== 'undefined') {
  window.NIWidgetConfig = NIWidgetConfig;
}
```

### Important Notes

- The widget uses a single Next Identity provider (specified by `issuerUrl`), but can use different client IDs for different "providers" (Google, Facebook, etc.)
- Each button in the widget will redirect to the same Next Identity provider but with a different client ID
- The client ID is included in the authentication request
- The buttons are dynamically generated based on the providers configured in the config file

## Event Handling

The widget triggers events for different authentication states:

```javascript
// Listen for successful authentication
document.addEventListener('ni:authenticated', (event) => {
  const userData = event.detail.user;
  console.log('User authenticated:', userData);
  // Handle successful authentication
});

// Listen for token received
document.addEventListener('ni:tokens_received', (event) => {
  const tokenData = event.detail;
  console.log('Tokens received:', tokenData);
  // Handle tokens (e.g., store them securely)
});

// Listen for logout
document.addEventListener('ni:logout', () => {
  console.log('User logged out');
  // Handle logout
});

// Listen for errors
document.addEventListener('ni:error', (event) => {
  const error = event.detail;
  console.error('Authentication error:', error);
  // Handle authentication errors
});

// When login process starts
document.addEventListener('ni:login_initiated', (event) => {
  const provider = event.detail.providerId;
  console.log('Login initiated with provider:', provider);
});
```

## API Methods

The widget instance is available globally as `window.niWidget` and provides these methods:

- `isAuthenticated()` - Check if user is authenticated
- `getCurrentUser()` - Get the current user data
- `logout()` - Log the user out

Example usage:

```javascript
if (window.niWidget.isAuthenticated()) {
  const user = window.niWidget.getCurrentUser();
  console.log('User is authenticated:', user);
}
```

## Customization

The widget can be customized using CSS variables. Update the `customization` section in `config.js`:

```javascript
customization: {
  buttonRadius: '4px',
  buttonColor: '#4285F4',
  buttonTextColor: '#ffffff',
  fontFamily: "'Roboto', sans-serif",
  widgetWidth: '300px'
}
```

These settings will automatically apply to the widget when it loads.

## Security Considerations

This widget implements the Authorization Code Flow with PKCE (Proof Key for Code Exchange), which is recommended for public clients like browser-based applications. 

Key security features:
- Uses PKCE to prevent authorization code interception attacks
- Stores tokens in memory/localStorage (consider using a more secure storage in production)
- Validates state parameter to prevent CSRF attacks
- Parses and validates ID tokens

## Browser Compatibility

The widget uses modern JavaScript features and Web APIs, including:
- `crypto.subtle` for generating secure random values and hashing
- `fetch` API for network requests
- ES6+ features (classes, arrow functions, etc.)

It should work in all modern browsers (Chrome, Firefox, Safari, Edge).

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
