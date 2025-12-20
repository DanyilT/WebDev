$(document).ready(function () {
    const carousel = new Carousel(document.getElementById('carousel'), {
        slidesToScroll: 1,
        slidesToShow: 1,
        infinite: true,
        dots: true
    });

    // Update header position on window scroll
    $(window).scroll(updateHeader);

    // Smooth scroll to download section on download button click
    $('#download-btn').click(function (event) {
        event.preventDefault();
        smoothScrollTo('#download-section');
    });

    // Smooth scroll to target section on navigation link click
    $('.nav-links a').click(function (event) {
        event.preventDefault();
        smoothScrollTo($(this).attr('href'));
    });
});

let lastScrollTop = 0;

// Function to update header position based on scroll direction
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

// Function to smooth scroll to the target element
function smoothScrollTo(target) {
    const targetElement = $(target);
    $('html, body').animate({ scrollTop: targetElement.offset().top }, 500);
}

// Form Something
$(document).ready(function () {
    $('#contact-form').on('submit', function(event) {
        const messageInput = $('#contact-form textarea[name="message"]').val();
        if (messageInput === 'qwerty') {
            alert('Really?\n You wanna share your password with me?\n Oh that\'s so sweet of you! 😊');
            event.preventDefault();
        }
    });
});
