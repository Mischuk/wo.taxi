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