// Gallery slider with custom settings and dot navigation with images

(function ($) {
  // Document ready function
  $(function () {
    // Initialize the slick slider with custom settings
    $('.slider').slick({
      dots: true, // Enable dots navigation
      prevArrow: '<a class="slick-prev slick-arrow" href="#" style=""><div class="icon icon--ei-arrow-left"><svg class="icon__cnt"><use xlink:href="#ei-arrow-left-icon"></use></svg></div></a>', // Custom HTML for the previous arrow
      nextArrow: '<a class="slick-next slick-arrow" href="#" style=""><div class="icon icon--ei-arrow-right"><svg class="icon__cnt"><use xlink:href="#ei-arrow-right-icon"></use></svg></div></a>', // Custom HTML for the next arrow
      customPaging: function (slick, index) {
        // Custom function to render the dot navigation with images
        var targetImage = slick.$slides.eq(index).find('img').attr('src'); // Get the image source from the current slide
        return '<img src=" ' + targetImage + ' ">'; // Return the image source as the dot navigation
      }
    });
  });
})(jQuery);
