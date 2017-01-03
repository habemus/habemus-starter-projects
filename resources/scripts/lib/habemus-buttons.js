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
  
  // TODO: substitute for script src
  var HABEMUS_DASHBOARD_URI = window.HABEMUS_DASHBOARD_URI;
  
  var habemusButtons = Array.prototype.slice.call(
    document.querySelectorAll('a.habemus-button'),
    0
  );
  
  habemusButtons.forEach(function (button) {
    button.setAttribute('hidden', 'true');
  });
  
  'http://localhost:3000/dashboard/'
  
  if (!HABEMUS_DASHBOARD_URI) {
    console.warn('window.HABEMUS_DASHBOARD_URI must be set. Cancelling button rendering.');
    return;
  }
  
  HABEMUS_DASHBOARD_URI = HABEMUS_DASHBOARD_URI.replace(/\/$/, '');
  
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
        
        var buttonHref = [
          HABEMUS_DASHBOARD_URI,
          '/#/?templateURL=',
          encodeURIComponent(templateURL)
        ];
        
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

