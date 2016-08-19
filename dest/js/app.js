$(function() {
    $('a[href="#"]').click(function(e){ e.preventDefault(); });

    // Polyfill to remove click delays on browsers with touch UIs
    FastClick.attach(document.body);

    // Detect if the user's browser IE
    function detectIE() {
      var BrowserDetect = {
              init: function () {
                  this.browser = this.searchString(this.dataBrowser) || "Other";
                  this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
              },
              searchString: function (data) {
                  for (var i = 0; i < data.length; i++) {
                      var dataString = data[i].string;
                      this.versionSearchString = data[i].subString;

                      if (dataString.indexOf(data[i].subString) !== -1) {
                          return data[i].identity;
                      }
                  }
              },
              searchVersion: function (dataString) {
                  var index = dataString.indexOf(this.versionSearchString);
                  if (index === -1) {
                      return;
                  }

                  var rv = dataString.indexOf("rv:");
                  if (this.versionSearchString === "Trident" && rv !== -1) {
                      return parseFloat(dataString.substring(rv + 3));
                  } else {
                      return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
                  }
              },

              dataBrowser: [
                  {string: navigator.userAgent, subString: "Edge", identity: "MS Edge"},
                  {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
                  {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
                  {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
                  {string: navigator.userAgent, subString: "Opera", identity: "Opera"},
                  {string: navigator.userAgent, subString: "OPR", identity: "Opera"},

                  {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
                  {string: navigator.userAgent, subString: "Safari", identity: "Safari"}
              ]
          };

          BrowserDetect.init();
          if (BrowserDetect.browser == 'Explorer') {
            $('html').addClass('IE');
          };
    };
    detectIE();

    // Mask for form's input
    function inputMask() {
      $(".mask-date").mask("99.99.9999",{placeholder:"__.__.____"});
      $(".mask-year").mask("9999",{placeholder:""});
      $(".mask-tel").mask("+7 (999) 999-99-99");
    };
    inputMask();

    function calc() {

      $(".number-only").keydown(function (e) {

        // Allow: backspace, delete, tab, escape, enter and .

        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||

             // Allow: Ctrl+A, Command+A

            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||

             // Allow: home, end, left, right, down, up

            (e.keyCode >= 35 && e.keyCode <= 40)) {

                 // let it happen, don't do anything

                 return;

        }

        // Ensure that it is a number and stop the keypress

        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {

            e.preventDefault();

        }

      });

    

      $('.cash').number( true, 0, '.', ' ' );

    

      $('.percentage').on('keyup', function(){

        if ( $(this).val() > 100 ) {

          $(this).val(100);

        }

      });

    

      $(".number-only").on('keyup', function(){

        initialCalc();

        if ( $('.value-profit').text() == diff ) {

          console.log('equal');

        } else {

          setTimeout(function(){

            $('.value-profit').animateNumber({number: diff},250, function(){

              $('.value-profit').number( true, 0, '.', ' ' );

            });

            return false;

          }, 10);

        }

    

      });

    };

    calc();

    

    function initialCalc() {

      var day = $('#val-days').val();

      var refill = $('#val-refill').val();

      var profit = $('#val-profit').val();

      var com1 = $('#val-commission-1').val();

      var com2 = $('#val-commission-2').val();

    

      value1 = Math.round(((profit-(profit*(com1/100)))-(refill))*day);

      $('.value-1').text(value1);

      $('.value-1').number( true, 0, '.', ' ' );

    

      var rival = $('.value-2').attr('data-rival');

      value2 = Math.round(((profit-(profit*((com1/100)+(com2/100))))-(refill*1.13-(refill*(rival/100))))*day);

      $('.value-2').text(value2);

      $('.value-2').number( true, 0, '.', ' ' );

      diff = value1 - value2;

    };

    initialCalc();

    

    function initialCalcLoad() {

      $('.value-profit').text(diff);

      $('.value-profit').number( true, 0, '.', ' ' );

    };

    initialCalcLoad();

    

    

    function popups() {

      // Form

      $('.popup-form').magnificPopup({

        type: 'inline',

        fixedContentPos: false,

        fixedBgPos: true,

        overflowY: 'auto',

        closeBtnInside: true,

        preloader: false,

        midClick: true,

        removalDelay: 300,

        mainClass: 'my-mfp-slide-bottom'

      });

    

      // Validate Form

      $('.form-modal').each(function(){

        var $this = $(this);

        $this.submit(function(e){

          var isFormValid = true;

    

          $(this).find('.required').each(function(){

              if ($.trim($(this).val()).length == 0){

                  $(this).addClass("highlight");

                  isFormValid = false;

              }

              else{

                  $(this).removeClass("highlight");

              }

          });

    

          if ( isFormValid == true ) {

            $('.popup-form').magnificPopup('close');

            setTimeout(function(){

              $('.thanks').trigger('click');

            }, 300);

          }

    

          e.preventDefault();

        })

    

      });

    

    

    };

    popups();

    

    

    $(window).scroll(function(){

      var $header = $('.m_header');

    

      if ($(this).scrollTop() > 90) {

          $header.addClass('fixed');

      } else {

          $header.removeClass('fixed');

      }

    });

    

    function mobileMenu() {

      $('.mobile-menu-trigger').on('click', function(){

        $(this).toggleClass('open');

        $('.m_header .nav').toggleClass('open');

      });

    };

    mobileMenu();

    

    

    console.log('Layout generated');

    

    ymaps.ready(function () {

        var settingsMarker = {

            iconLayout: 'default#image',

            iconImageHref: 'images/marker.png',

            iconImageSize: [117, 136],

            iconImageOffset: [-62, -119]

        };

        var settingsBaloon = { hintContent: '', balloonContent: '' };

    

        var coord_1 = [60.016186, 30.310793];

        var coord_2 = [55.75396, 37.620393];

        var coord_3 = [56.838607, 60.605514];

    

    

        var myMap = new ymaps.Map('map', {

            center: coord_1,

            zoom: 14,

            controls: ['zoomControl']

        }, { searchControlProvider: 'yandex#search'} ),

    

        myPlacemark_1 = new ymaps.Placemark(coord_1, settingsBaloon, settingsMarker);

        myPlacemark_2 = new ymaps.Placemark(coord_2, settingsBaloon, settingsMarker);

        myPlacemark_3 = new ymaps.Placemark(coord_3, settingsBaloon, settingsMarker);

    

        myMap.geoObjects.add(myPlacemark_1);

        myMap.geoObjects.add(myPlacemark_2);

        myMap.geoObjects.add(myPlacemark_3);

    

        myMap.behaviors.disable('scrollZoom');

    

        // Set center on click

    

    

        $('select').selectric({

            disableOnMobile: false,

            responsive: true

        });

        $('select').selectric().on('change', function() {

            var eq = $(this).val();

    

            $('#popup-maps .body .place').removeClass('current');

            $('#popup-maps .body .place').eq(eq-1).addClass('current');

    

            if ( eq == 1 ) { myMap.setCenter(coord_1, 14); }

            if ( eq == 2 ) { myMap.setCenter(coord_2, 14); }

            if ( eq == 3 ) { myMap.setCenter(coord_3, 14); }

        });

    });

    

    

    

    

    function servCarousel() {

    

      var w = $(window).width();

      if ( w > 750) {

    

        if ( $('.m_services').hasClass('initialized') ) {

          $('.serv-carousel').slick('unslick');

          // $('.m_services').removeClass('initialized');

          $('.serv-carousel').slick({

            dots: true,

            arrows: true,

            slidesToShow: 8,

            slidesToScroll: 8,

            responsive: [

              {

                breakpoint: 1200,

                settings: {

                  slidesToShow: 5,

                  slidesToScroll: 5

                }

              }

            ]

          });

          console.log('Reinitialize');

        } else {

          $('.serv-carousel').on('init', function(){

            $('.m_services').addClass('initialized');

          });

          $('.serv-carousel').slick({

            dots: true,

            arrows: true,

            slidesToShow: 8,

            slidesToScroll: 8,

            responsive: [

              {

                breakpoint: 1200,

                settings: {

                  slidesToShow: 5,

                  slidesToScroll: 5

                }

              }

            ]

          });

        }

      } else {

    

        if ( $('.m_services').hasClass('initialized') ) {

          $('.serv-carousel').slick('unslick');

          $('.serv-carousel').slick({

            dots: true,

            arrows: true,

            rows: 2,

            slidesPerRow: 3

          });

        } else {

          // $('.serv-carousel').slick('unslick');

          // $('.m_services').removeClass('initialized');

          $('.serv-carousel').on('init', function(){

            $('.m_services').addClass('initialized');

          });

          $('.serv-carousel').slick({

            dots: true,

            arrows: true,

            rows: 2,

            slidesPerRow: 3

          });

        }

      }

    };

    $(window).load(servCarousel);

    $(window).resize(servCarousel);

    

    function storiesCarousel() {

      $('.stories-carousel').slick({

        dots: true,

        arrows: false,

        slidesToShow: 3,

        slidesToScroll: 3,

        responsive: [

          {

            breakpoint: 769,

            settings: {

              slidesToShow: 2,

              slidesToScroll: 2

            }

          },

          {

            breakpoint: 480,

            settings: {

              slidesToShow: 1,

              slidesToScroll: 1

            }

          }

        ]

      });

    };

    storiesCarousel();
});