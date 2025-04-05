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
│   └── ni-widget.css   # Styling for the widget
└── js/
    └── ni-widget.js    # Core functionality of the widget
```

## Quick Start

1. Clone this repository or download the source code
2. Copy the `src/js/ni-widget.js`, `src/css/ni-widget.css`, and `src/config.js` files to your project
3. Update `config.js` with your Next Identity provider details
4. Include the files in your HTML:

```html
<link rel="stylesheet" href="path/to/ni-widget.css">
<script src="path/to/config.js"></script>
<script src="path/to/ni-widget.js"></script>
```

5. Add the widget HTML to your page:

```html
<div class="ni-widget-container">
  <div class="ni-widget-header">
    <h2 class="ni-widget-title">Sign in</h2>
    <p class="ni-widget-subtitle">Choose your preferred sign-in method</p>
  </div>
  
  <div class="ni-auth-buttons">
    <!-- Buttons will be dynamically generated based on config -->
  </div>
  
  <!-- Loading indicator, error message, and user profile sections -->
  <div class="ni-loading">
    <div class="ni-spinner"></div>
  </div>
  
  <div class="ni-error">
    Authentication failed. Please try again.
  </div>
  
  <div class="ni-user-profile">
    <div class="ni-user-avatar"></div>
    <div class="ni-user-name"></div>
    <div class="ni-user-email"></div>
    <button class="ni-logout-button">Sign Out</button>
  </div>
</div>
```

## Configuration

The widget is configured using the `config.js` file. Here's an example configuration:

```javascript
const NIWidgetConfig = {
  // The single Next Identity issuer URL
  issuerUrl: 'https://your-provider.com',
  
  // Redirect URI - same page
  redirectUri: window.location.origin + window.location.pathname,
  
  // Auth providers with their client IDs
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
    // Add more providers as needed
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
