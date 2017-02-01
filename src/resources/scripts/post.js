$(function () {

  /**
   * Page header previews
   */
  var $previewContainer = $('.preview-container');
  var $previewIframes   = $previewContainer.find('iframe');

  // add load event listener to iframes
  $previewIframes.on('load', function (e) {
    var $target = $(e.target);
    var $preview = $target.closest('.preview');

    $preview.addClass('iframe-loaded');
  });

  // delay iframe loading in order not to overload
  // browser rendering
  setTimeout(function () {
    $previewIframes.each(function (index, iframe) {
      var $iframe = $(iframe);
      $iframe.attr('src', $iframe.data('src'));
    });
  }, 500);

  /**
   * Previewer (detailed)
   */
  var $previewer             = $('#previewer');
  var $previewerIframe       = $previewer.find('iframe');
  var $previewerModeSelector = $previewer.find('#previewer-mode-selector');

  // load webpage
  $previewerIframe.attr('src', $previewerIframe.data('src'));

  $previewer.open = function (mode) {
    if (!mode && !$previewer.attr('data-mode')) {
      $previewer.attr('data-mode', 'desktop');
    }

    $previewer.addClass('active');

    $('body').attr('data-previewer', 'active');
  };

  $previewer.close = function () {
    $previewer.removeClass('active');

    $('body').attr('data-previewer', 'inactive');
  };

  // attach event handlers
  $previewerModeSelector.on('click', 'li', function (e) {
    var mode = $(e.currentTarget).data('mode');

    if (mode) {
      $previewer.attr('data-mode', mode);
    }
  });

  $(window).on('hashchange', _handleHashchange);

  function _handleHashchange() {
    var hash = window.location.hash || '';

    if (hash === '#preview') {
      $previewer.open();
    } else {
      $previewer.close();
    }
  }

  _handleHashchange();

});
