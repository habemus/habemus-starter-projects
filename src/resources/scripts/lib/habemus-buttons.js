/**
 * Heavily inspired by
 * https://buttons.github.io/
 * (thank you)
 * 
 * ? = optional
 * 
 * <a
 *   class="habemus-button"
 *   data-action="deploy"
 *   data-template-url="http://somewhere.com/template.zip"
 * 
 *   data-preview-url=?"http://somewhere.com/"
 *   data-project-name=?"my-new-project"
 *   data-author=?"Habemus">
 *   Deploy to Habemus
 * </a>
 */

document.addEventListener('DOMContentLoaded', function (e) {
  // check if user is logged in
  // TODO: add a flag to h-account-client, so that we do not need to retrieve
  // the token
  var HABEMUS_AUTH_TOKEN_NAME_LS_KEY = 'h_account_auth_token';
  var IS_AUTHENTICATED = !!window.localStorage.getItem(HABEMUS_AUTH_TOKEN_NAME_LS_KEY);
  
  // TODO: substitute for script src
  var HABEMUS_DASHBOARD_URI = window.HABEMUS_DASHBOARD_URI;
  var HABEMUS_TRY_URI       = window.HABEMUS_TRY_URI;
  
  var habemusButtons = Array.prototype.slice.call(
    document.querySelectorAll('a.habemus-button'),
    0
  );
  
  habemusButtons.forEach(function (button) {
    button.setAttribute('hidden', 'true');
  });
  
  if (!HABEMUS_DASHBOARD_URI) {
    console.warn('window.HABEMUS_DASHBOARD_URI must be set. Cancelling button rendering.');
    return;
  }

  if (!HABEMUS_TRY_URI) {
    console.warn('window.HABEMUS_TRY_URI must be set. Cancelling button rendering.');
    return;
  }
  
  HABEMUS_DASHBOARD_URI = HABEMUS_DASHBOARD_URI.replace(/\/$/, '');
  HABEMUS_TRY_URI = HABEMUS_TRY_URI.replace(/\/$/, '');

  // check properties and show buttons
  habemusButtons.forEach(function (button) {
    var action      = button.getAttribute('data-action');
    var templateURL = button.getAttribute('data-template-url');
    
    var previewURL  = button.getAttribute('data-preview-url');
    var projectName = button.getAttribute('data-project-name');
    var author      = button.getAttribute('data-author');
    
    switch (action) {
      case 'deploy':
        // TODO: validate templateURL
        if (!templateURL) {
          console.warn('templateURL is required for deploy');
          return;
        }

        var buttonHref;

        if (IS_AUTHENTICATED) {
          // authenticated, go to dashboard
          var buttonHref = [
            HABEMUS_DASHBOARD_URI,
            '/#/?templateURL=',
            encodeURIComponent(templateURL)
          ];
        } else {
          // unauthenticated, go to try
          var buttonHref = [
            HABEMUS_TRY_URI,
            '/?template_url=',
            encodeURIComponent(templateURL),
          ];
        }
        
        if (projectName) {
          buttonHref.push('&project-name');
          buttonHref.push(encodeURIComponent(projectName));
        }
        
        if (author) {
          buttonHref.push('&author');
          buttonHref.push(encodeURIComponent(author));
        }
        
        buttonHref = buttonHref.join('');
        
        button.setAttribute('href', buttonHref);
        button.removeAttribute('hidden');
        
        break;
      default:
        console.warn('unsupported `data-action` ' + action, button);
        break;
    }
  });
  
}, false);

