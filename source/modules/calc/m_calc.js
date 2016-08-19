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
