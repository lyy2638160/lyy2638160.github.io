/*
Author URI: http://webthemez.com/
Note: 
Licence under Creative Commons Attribution 3.0 
Do not remove the back-link in this web template 
-------------------------------------------------------*/

$(window).load(function() {
    jQuery('#all').click();
    return false;
});

$(document).ready(function() {
	$('.carousel').carousel();
    $('#header_wrapper').scrollToFixed();
    $('.res-nav_click').click(function() {
        $('.main-nav').slideToggle();
        return false

    });
	
    function resizeText() {
        var preferredWidth = 767;
        var displayWidth = window.innerWidth;
        var percentage = displayWidth / preferredWidth;
        var fontsizetitle = 25;
        var newFontSizeTitle = Math.floor(fontsizetitle * percentage);
        $(".divclass").css("font-size", newFontSizeTitle)
    }
    if ($('#main-nav ul li:first-child').hasClass('active')) {
        $('#main-nav').css('background', 'none');
    }
    $('#mainNav').onePageNav({
        currentClass: 'active',
        changeHash: false,
        scrollSpeed: 1000,
        scrollThreshold: 0.2,
        filter: '',
        easing: 'swing',
        begin: function() {
        },
        end: function() {
            if (!$('#main-nav ul li:first-child').hasClass('active')) {
                $('.header').addClass('addBg');
            } else {
                $('.header').removeClass('addBg');
            }

        },
        scrollChange: function($currentListItem) {
            if (!$('#main-nav ul li:first-child').hasClass('active')) {
                $('.header').addClass('addBg');
            } else {
                $('.header').removeClass('addBg');
            }
        }
    });

    var container = $('#portfolio_wrapper');


    container.isotope({
        animationEngine: 'best-available',
        animationOptions: {
            duration: 200,
            queue: false
        },
        layoutMode: 'fitRows'
    });

    $('#filters a').click(function() {
        $('#filters a').removeClass('active');
        $(this).addClass('active');
        var selector = $(this).attr('data-filter');
        container.isotope({
            filter: selector
        });
        setProjects();
        return false;
    });

    function splitColumns() {
        var winWidth = $(window).width(),
            columnNumb = 1;


        if (winWidth > 1024) {
            columnNumb = 4;
        } else if (winWidth > 900) {
            columnNumb = 2;
        } else if (winWidth > 479) {
            columnNumb = 2;
        } else if (winWidth < 479) {
            columnNumb = 1;
        }

        return columnNumb;
    }
	
    function setColumns() {
        var winWidth = $(window).width(),
            columnNumb = splitColumns(),
            postWidth = Math.floor(winWidth / columnNumb);

        container.find('.portfolio-item').each(function() {
            $(this).css({
                width: postWidth + 'px'
            });
        });
    }

    function setProjects() {
        setColumns();
        container.isotope('reLayout');
    }

    container.imagesLoaded(function() {
        setColumns();
    });


    $(window).bind('resize', function() {
        setProjects();
    });

   $(".fancybox").fancybox();

    // Close mobile menu when clicking a menu item
    $('.navbar-nav li a').on('click', function() {
        if ($('.navbar-toggle').is(':visible')) {
            $('.navbar-collapse').collapse('hide');
        }
    });

    // Close mobile menu when clicking outside
    $(document).on('click touchstart', function(e) {
        if ($('.navbar-toggle').is(':visible')) {
            if (!$(e.target).closest('.navbar-collapse, .navbar-toggle').length) {
                if ($('.navbar-collapse').hasClass('in')) {
                    $('.navbar-collapse').collapse('hide');
                }
            }
        }
    });
});

wow = new WOW({
    animateClass: 'animated',
    offset: 100
});
wow.init();
document.getElementById('service').onclick = function() {
    var section = document.createElement('section');
    section.className = 'wow fadeInDown';
    section.className = 'wow shake';
    section.className = 'wow zoomIn';
    section.className = 'wow lightSpeedIn';
    this.parentNode.insertBefore(section, this);
};

// Add to your custom.js or at the bottom of index.html
document.getElementById('langSelect').addEventListener('change', function() {
    const lang = this.value;
    // Here you can add logic to switch language
    // For example, store the selection in localStorage
    localStorage.setItem('selectedLanguage', lang);
    // Reload page or update content
    location.reload();
});

// Set initial language selection
const savedLang = localStorage.getItem('selectedLanguage');
if (savedLang) {
    document.getElementById('langSelect').value = savedLang;
}

// 导航文字显示不下时自动缩小字号
function fitNavText() {
    var navList = document.getElementById('mainNav');
    if (!navList) {
        return;
    }
    var navBox = navList.parentNode;
    var navBar = navBox.parentNode;
    var links = navList.getElementsByTagName('a');
    if (!links.length) {
        return;
    }

    // 先恢复默认字号再测量
    for (var i = 0; i < links.length; i++) {
        links[i].style.fontSize = '';
    }

    // .navStyle 是浮动元素，宽度会被内容撑开，所以以导航栏容器宽度作为可用宽度
    var available = navBar.clientWidth || navBox.clientWidth;
    var size = parseFloat(window.getComputedStyle(links[0]).fontSize) || 16;
    var attempts = 0;
    while (navList.getBoundingClientRect().width > available && size > 8 && attempts < 40) {
        size = Math.max(8, size - 0.5);
        for (var j = 0; j < links.length; j++) {
            links[j].style.fontSize = size + 'px';
        }
        attempts++;
    }
}

var navFitTimer = null;
function scheduleFitNavText() {
    clearTimeout(navFitTimer);
    navFitTimer = setTimeout(fitNavText, 100);
}

// 语言切换和字体加载后文字宽度会变化，需要重新适配
document.addEventListener('i18n:applied', fitNavText);
window.addEventListener('load', fitNavText);
window.addEventListener('resize', scheduleFitNavText);