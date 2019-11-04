/*
 * cookie-notice.js
 */

// void(function(root, factory) {
//     if (typeof define === 'function' && define.amd) define(factory)
//     else if (typeof exports === 'object') module.exports = factory()
//     else root.CookieNotice = factory()
// }(this, function() {
//     function CookieNotice() {
//         ready(run)
//     }

//     CookieNotice.options = {
//         message: '<p>This website uses cookies to help us give you the best experience when you visit. By using this website you consent to our use of these cookies.</p>',
//         dismiss: 'Dismiss'
//     }

//     function run() {
//         if (window.localStorage.cookieNoticeDismissed) return
//         show()
//     }

//     function dismiss() {
//         var notice = document.getElementById('cookie-notice')
//         if (notice) notice.parentNode.removeChild(notice)
//         window.localStorage.cookieNoticeDismissed = true
//     }

//     function undismiss() {
//         delete window.localStorage.cookieNoticeDismissed
//     }

//     function show() {
//         var $div = document.createElement('div')
//         $div.className = 'cookie-notice'
//         $div.id = 'cookie-notice'

//         var $message = document.createElement('div')
//         $message.className = 'cookie-notice-message'
//         $message.innerHTML = CookieNotice.options.message
//         $div.appendChild($message)

//         var $dismiss = document.createElement('button')
//         $dismiss.innerHTML = CookieNotice.options.dismiss
//         $dismiss.onclick = dismiss
//         $div.appendChild($dismiss)

//         document.body.appendChild($div)
//     }

//     function ready(fn) {
//         if (document.readyState === 'complete') {
//             return fn()
//         } else if (document.addEventListener) {
//             document.addEventListener('DOMContentLoaded', fn)
//         } else {
//             document.attachEvent('onreadystatechange', function() {
//                 if (document.readyState === 'interactive') fn()
//             })
//         }
//     }

//     CookieNotice.run = run
//     CookieNotice.dismiss = dismiss
//     CookieNotice.undismiss = undismiss

//     return CookieNotice
// }));

/*
 * Run it
 */

// CookieNotice.undismiss() // just so it always shows up in this demo
// CookieNotice()

$(document).ready(function() {

  $('button').on('click', function() {
      if ($(this).hasClass('nav-button')) {
          $('nav div').addClass('show');
      } else if ($(this).hasClass('exit-menu')) {
          $('nav div').removeClass('show');
      } else if ($(this).hasClass('to-top')) {
          $('html,body').animate({ scrollTop: 0 }, 'slow');
      }
  });

  AOS.init({
      duration: 1800,
      easing: 'ease'
  });

})

$('document').ready(function() {
  var $lightbox = $('#lightbox');

  $('[data-target="#lightbox"]').on('click', function(event) {
      var $img = $(this).find('img'),
          src = $img.attr('src'),
          alt = $img.attr('alt'),
          css = {
              'maxWidth': $(window).width() - 100,
              'maxHeight': $(window).height() - 100
          };

      $lightbox.find('.close').addClass('hidden');
      $lightbox.find('img').attr('src', src);
      $lightbox.find('img').attr('alt', alt);
      $lightbox.find('img').css(css);
  });

  $lightbox.on('shown.bs.modal', function(e) {
      var $img = $lightbox.find('img');

      $lightbox.find('.modal-dialog').css({ 'width': $img.width() });
      $lightbox.find('.close').removeClass('hidden');
  });
});
/* button */