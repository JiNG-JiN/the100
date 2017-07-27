// Setup ONE namespace
var ONE = ONE || {};

/*
    Video library
    This script conditionally load either the flash or html5 youtube api based on the browser and available object.
    Defaults to html5 player, with fallbacks to flash player api.
*/
// Player ready flag
var player1, player2;

// Check if html5 video is supported
if (!!document.createElement('video').canPlayType) {
    //-------------------------------------------------------------------------------------
    // IFrame HTML5 based YouTube embedding
    //-------------------------------------------------------------------------------------
    // This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    //tag.src = "https://www.youtube.com/iframe_api";
	tag.src = '';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // This function creates an <iframe> (and YouTube player)
    // after the API code downloads.
    function onYouTubeIframeAPIReady() {
        // Add first video
        player1 = new YT.Player('player1-inner', {
            height: '100%',
            width: '100%',
            videoId: '1mDEJcBgsFA',
            events: {
                'onReady': function () {
                    
                },
                'onStateChange': function (event) {
                    // Hide player when video ends
                    if (event.data == YT.PlayerState.ENDED) {
                        $('#player1').removeClass('player-show');
                        $('#player1').closest('.carousel').carousel('cycle');
                    }
                }
            }
        });

        // Add second video
        player2 = new YT.Player('player2-inner', {
            height: '100%',
            width: '100%',
            videoId: 'ESf-X6Hnr1o',
            events: {
                'onReady': function () {
                    
                },
                'onStateChange': function (event) {
                    // Hide player when video ends
                    if (event.data == YT.PlayerState.ENDED) {
                        $('#player2').removeClass('player-show');
                        $('#player2').closest('.carousel').carousel('cycle');
                    }
                }
            }
        });

        // Auto play first video
    }

} else {
    //-------------------------------------------------------------------------------------
    // Flash based YouTube embedding
    //-------------------------------------------------------------------------------------
    // This code loads the video and Javascript API code asynchronously.
    var params = { allowScriptAccess: "always", wmode: "transparent" };
    var atts = { id: "ytplayer" };
    swfobject.embedSWF("//www.youtube.com/v/1mDEJcBgsFA?controls=1&enablejsapi=1&playerapiid=ytplayer&version=3",
                       "player1", "768", "433", "8", null, null, params, atts);

    // Call when video player is ready
    function onYouTubePlayerReady(playerApiId) {
        player = document.getElementById(playerApiId);

        // Listen to events
        player.addEventListener('onStateChange', "onPlayerStateChange");
    }

    // Youtube Player event handlers
    function onPlayerStateChange(state) {console.log(state);
        // Show over when video ends
        if (state === 0) {
            // Hide overlays
            $('.placeholder, .play, .video-link').show();
        }

    }
}

/**
 * Sets the height of the carousels and parallax images to be fullscreen.
 * Takes into account the fixed top navbar.
 */
ONE.setViewHeight = function () {
    // Calculate the availale viewport space, minus the fixed navbar
    var viewport_height = $(window).height() - $('.navbar-one').outerHeight();

    // Set viewport height to wrap image on smaller screens
    if ($(window).width() < 480) {
        // Set carousel and parallax areas height's viewport height
        $('.player').css('height', '100%');
        $('.carousel').css('height', 'auto');
    } else {
        // Set carousel and parallax areas height's viewport height
        $('.carousel, .player').height(viewport_height);
    }

    // Parallax heights always match viewport
    $('.parallax-wrap, .parallax').height(viewport_height);
};

/**
 * Show a dancer's bio information.
 * @param e jQuery event object.
 */
ONE.showDancerInfo = function (e) {
    // Hide all other open ones
    $('.dancer.open').removeClass('open');

    // Show summary
    $(this).toggleClass('open');
};

/**
 * Hide a dancer's bio information.
 * @param e jQuery event object.
 */
ONE.hideDancerInfo = function (e) {
    // Prevent the click from propagating or it will open it again
    e.stopPropagation();

    $(this).closest('.dancer').removeClass('open');
};

/**
 * Play a video
 * @param {int} id The id of the video to play
 */
ONE.playVideo = function (id) {
    // Get jquery reference to element clicked on
    $elem = $('[data-player="'+id+'"]');

    // Pause the carousel of the video section we are in
    $elem.closest('.carousel').carousel('pause');

    // Show player and play video
    if (id === 1) {
        // Stop and hide other player
        if (player2) player2.stopVideo();
        $('#player2').removeClass('player-show');

        // Show video player
        $('#player1').addClass('player-show');

        // Only play video right away on smaller screens
        if ($(window).width() > 480) {
            player1.playVideo();
        }
    } else if (id === 2) {
        // Stop and hide the other player
        if (player1) player1.stopVideo();
        $('#player1').removeClass('player-show');

        // Show video player
        $('#player2').addClass('player-show');

        // Only play video right away on smaller screens
        if ($(window).width() > 480) {
            player2.playVideo();
        }
    }
};

/**
 * Scroll to a specific section
 * @param {string} hash The hash string of the section to scrollto
 * @param {int} speed How many miliseconds scroll animation should take
 */
ONE.scrollTo = function (hash, speed) {
    // animate
   $('html, body').animate({
        scrollTop: (hash === '#home') ? 0 : $(hash).offset().top
    }, speed, function(){
        // when done, add hash to url
        // (default click behaviour)
        window.location.hash = hash;
    });
};


/**
 * Enabled the dancer journey's popovers
 */
ONE.initDancers = function () {
    // Show and hide dancer journey info on click
    $('.dancer').on('click', ONE.showDancerInfo);
    $('.journey').on('click', ONE.hideDancerInfo);
};

var initDancer = function () {
    // Show and hide dancer journey info on click
    $(this).on('click', ONE.showDancerInfo);
    $('.journey', this).on('click', ONE.hideDancerInfo);
};

// Variables that need to be global due to external script dependencies
// Wordpress contact plugins settings
var _wpcf7 = {
    "loaderUrl":"http:\/\/oneinnewyork.com\/wp-content\/plugins\/contact-form-7\/images\/ajax-loader.gif",
    "sending":"Sending ..."
};

// Wait until document is ready before adding click listeners
$(function() {
	
	$("iframe").each(
     function(index, elem) {
         elem.setAttribute("scrolling","no");
		 elem.setAttribute("style","overflow:hidden");
     }
    );
    // Set the height of parallax and carousels
    ONE.setViewHeight();

    // Initialize Steller.js parallax
    $.stellar();
    $(window).stellar({ horizontalOffset: 72});

    // Animated scrollspy
    $(".navbar-one .nav li a").on('click', function(e) {
       // prevent default anchor click behavior
       e.preventDefault();

       // Scrollto the section
       ONE.scrollTo(this.hash);
    });

    // Plays video on click
    $('.playbutton').on('click', function (e) {
        // Prevent anchors from doing default
        e.preventDefault();

        // Play the video player id specified
        ONE.playVideo($(this).data('player'));
    });

    // Show and hide dancer journey info on click
    ONE.initDancers();

    // Show/hide the100 dropdown based on hover
    $('.dropdown-the100').hover(function () {
        $(this).addClass('open');
    }, function () {
        $(this).removeClass('open');
    });
});