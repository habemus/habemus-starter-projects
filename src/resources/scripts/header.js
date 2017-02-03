// animate header on scroll
$(function () {
  
  var $rightCommand = $("#menu-right-command");
  var $header = $("#header");
  var isOriginallyLight = $header.hasClass("light");
    
  // check if color of header is originally light
  $(window).scroll(function() {
    
    if ($(this).scrollTop() > 20){  
      $header.addClass("smaller");
      
        if (isOriginallyLight) {
          $header.removeClass("light");
        }
    } else {
      $header.removeClass("smaller");
      
      if (isOriginallyLight) {
        $header.addClass("light");
      }
    }
  });
  
  // open and close right-command
  $rightCommand.on('click', function (e) {
    
    var isMenuOpen = $header.hasClass("open-menu");
    
    if (isMenuOpen) {
      $('body').removeClass('scroll-disabled');
      $header.removeClass('open-menu');
    } else {
      $('body').addClass('scroll-disabled');
      $header.addClass('open-menu');
    }
    
    // e.preventDefault();
    e.stopPropagation();
  });
  
});
