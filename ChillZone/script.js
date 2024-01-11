$(document).ready(function () {
    $('.carousel').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true
    });

    $('[data-fancybox="gallery"]').fancybox();

    $('#download-btn').click(function (event) {
        event.preventDefault();
        smoothScrollTo('#download-section');
    });

    $(window).scroll(updateHeader);

    $('.nav-links a').click(function (event) {
        event.preventDefault();
        smoothScrollTo($(this).attr('href'));
    });
});

let lastScrollTop = 0;
function updateHeader() {
    const header = $('header');
    const scrollPosition = $(window).scrollTop();
    if (scrollPosition > lastScrollTop) {
        // Scrolling down
        header.css('transform', 'translateY(-100%)');
    } else {
        // Scrolling up
        header.css('transform', 'translateY(0)');
    }
    lastScrollTop = scrollPosition;
}

function smoothScrollTo(target) {
    const targetElement = $(target);
    $('html, body').animate({ scrollTop: targetElement.offset().top }, 500);
}
