$(document).ready(function() {

    // When the button is clicked make the lightbox fade in in the span of 1 second, hide itself and start the video
    $("#button").on("click", function() {
        $("#lightbox").fadeIn(1000);
        $(this).hide();
        var videoURL = $('#video').prop('src');
        videoURL += "?autoplay=1";
        $('#video').prop('src', videoURL);
    });

    // When the close button is clicked make the lightbox fade out in the span of 0.5 seconds and show the play button
    $("#close-btn").on("click", function() {
        $("#lightbox").fadeOut(500);
        $("#button").show(250);
    });
});


// services

$(window).on('ready load resize', function() {
    var max = 0,
        mobile = $(window).width();
    $(".blog-section .equal-height").css('min-height', 'inherit');

    if (mobile > 600) {
        $(".blog-section .equal-height").each(function(index, el) {
            if ($(this).outerHeight() > max) {
                max = $(this).outerHeight();
            }
        });
        $(".blog-section .equal-height").css('min-height', max);
    }
});
// contact page

$(window).on('ready load resize', function() {
    var max = 0,
        mobile = $(window).width();
    $(".contact-sec .equal-height").css('min-height', 'inherit');

    if (mobile > 600) {
        $(".contact-sec .equal-height").each(function(index, el) {
            if ($(this).outerHeight() > max) {
                max = $(this).outerHeight();
            }
        });
        $(".contact-sec .equal-height").css('min-height', max);
    }
})

// map
$(window).on('ready load resize', function() {
    var max = 0,
        mobile = $(window).width();
    $(".map-section .equal-height").css('min-height', 'inherit');

    if (mobile > 600) {
        $(".map-section .equal-height").each(function(index, el) {
            if ($(this).outerHeight() > max) {
                max = $(this).outerHeight();
            }
        });
        $(".map-section .equal-height").css('min-height', max);
    }
});

// testimonial
$('.testimonail-slide').slick({
    dots: true,
    infinite: false,
    speed: 300,
    arrows: true,
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 2,
    responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: false,
                arrows: true,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                arrows: false,
                dots: true,
                autoplay: true,
                autoplaySpeed: 2000,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                autoplay: true,
                autoplaySpeed: 2000,
                speed: 1200,
            }
        }

    ]
});


$('.banner-slide').slick({
    dots: true,
    infinite: false,
    speed: 300,
    arrows: true,
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: false,
                arrows: true,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                autoplay: true,
                autoplaySpeed: 2000,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                autoplay: true,
                autoplaySpeed: 2000,
                speed: 1200,
            }
        }

    ]
});