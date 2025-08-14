$(function () {
    $('.toggle-menu').click(function () {
        $('.exo-menu').toggleClass('display');

    });

    $('.mat-mdc-tab-body-wrapper').css('text-align', 'center');
    $('.mat-mdc-tab-body-wrapper').css('padding-top', '15px');

    const pageHeader = document.querySelector(".page-header");
    const toggleMenu = pageHeader.querySelector(".toggle-menu");
    const menuWrapper = pageHeader.querySelector(".menu-wrapper");
    const level1Links = pageHeader.querySelectorAll(".level-1 > li > a");
    const listWrapper2 = pageHeader.querySelector(".list-wrapper:nth-child(2)");
    const listWrapper3 = pageHeader.querySelector(".list-wrapper:nth-child(3)");
    const subMenuWrapper2 = listWrapper2.querySelector(".sub-menu-wrapper");
    const subMenuWrapper3 = listWrapper3.querySelector(".sub-menu-wrapper");
    const backOneLevelBtns = pageHeader.querySelectorAll(".back-one-level");
    const backLabel2 = listWrapper2.querySelector(".back-one-level span");
    const backLabel3 = listWrapper3.querySelector(".back-one-level span");
    const isVisibleClass = "is-visible";
    const isActiveClass = "is-active";
    const isShow = "show";
//
    toggleMenu.addEventListener("click", function () {
        $(this).slideDown("slow");

        menuWrapper.classList.toggle(isVisibleClass);
        menuWrapper.classList.toggle(isShow);
        if (!this.classList.contains(isVisibleClass)) {
            listWrapper2.classList.remove(isVisibleClass);
            listWrapper3.classList.remove(isVisibleClass);
            const menuLinks = menuWrapper.querySelectorAll("a");
            for (const menuLink of menuLinks) {
                menuLink.classList.remove(isActiveClass);
            }
            backLabel2.textContent = "";
            backLabel3.textContent = "";
        }
    });

    for (const level1Link of level1Links) {
        level1Link.addEventListener("click", function (e) {
            const siblingList = level1Link.nextElementSibling;
            if (siblingList) {
                e.preventDefault();
                this.classList.add(isActiveClass);
                const cloneSiblingList = siblingList.cloneNode(true);
                subMenuWrapper2.innerHTML = "";
                subMenuWrapper2.append(cloneSiblingList);
                listWrapper2.classList.add(isVisibleClass);
                backLabel2.textContent = level1Link.textContent;
            }
        });
    }

    listWrapper2.addEventListener("click", function (e) {
        const target = e.target;
        if (target.tagName.toLowerCase() === "a" && target.nextElementSibling) {
            const siblingList = target.nextElementSibling;
            e.preventDefault();
            target.classList.add(isActiveClass);
            const cloneSiblingList = siblingList.cloneNode(true);
            subMenuWrapper3.innerHTML = "";
            subMenuWrapper3.append(cloneSiblingList);
            listWrapper3.classList.add(isVisibleClass);
            backLabel3.textContent = target.textContent;
        }
    });

    for (const backOneLevelBtn of backOneLevelBtns) {
        backOneLevelBtn.addEventListener("click", function () {
            const parent = this.closest(".list-wrapper");
            parent.classList.remove(isVisibleClass);
            parent.previousElementSibling
                .querySelector(".is-active")
                .classList.remove(isActiveClass);
        });
    }

});


function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

(function ($) {
    "use strict";

    $(".drop")
        .mouseover(function () {
            $(".dropdown").show(300);
        });
    $(".drop")
        .mouseleave(function () {
            $(".dropdown").hide(300);
        });

    // Fixed Navbar
    // $(window).scroll(function () {
    //     if ($(this).scrollTop() > 300) {
    //         $('.sticky-top').addClass('shadow-sm').css('top', '0px').removeClass('sticky-top').addClass("sticky-top-2");
    //     } else {
    //         $('.sticky-top').removeClass('shadow-sm').css('top', '-200px').removeClass('sticky-top-2').addClass("sticky-top");
    //     }
    // });


    /*
        $("#button-menu").click(function () {
            if ($(".content-menu-phone").hasClass("show")) {
                $("#button-telefone").click();
            }
    
            if ($(".content-menu").hasClass("show")) {
                $(".content-menu").removeClass("show");
                $("#button-menu").removeClass("focus");
            } else {
                $(".content-menu").addClass("show");
                $("#button-menu").addClass("focus");
            }
        });
    
        $("#button-telefone").click(function () {
            if ($(".content-menu").hasClass("show")) {
                $("#button-menu").click();
            }
    
            if ($(".content-menu-phone").hasClass("show")) {
                $('.icon-bar-telefone').removeClass("icon-bar");
                $(".content-menu-phone").removeClass("show");
                $("#button-telefone").removeClass("focus");
                $ ('#mat-icon-phone').show();
            } else {
                $ ('#mat-icon-phone').hide();
                $('.icon-bar-telefone').addClass("icon-bar");
                $(".content-menu-phone").addClass("show");
                $("#button-telefone").addClass("focus");
            }
        });
    */
    $(window).scroll(function () {
        if ($(this).scrollTop() != 0) {
            //$(".topbar-fundo").fadeOut("fast");
            //$(".topbar-fundo-texto").fadeOut("fast");
            //$(".topbar-fundo-transparente").fadeOut("fast");
            //$("#topbar-fundo").fadeOut("fast");
            //$(".topbar-fundo-container").fadeOut("fast");
            $(".div-text-rml").fadeOut("fast");
            $(".div-img-rml").fadeOut("fast");
            $(".div-text-direito").fadeOut("fast");
            $("#img_rmld").fadeOut("fast");
            //$(".sticky-top").css("border-bottom", "1px solid #39A6C0");
            //$('.div-text-direito-mobile').fadeOut("fast");
        } else {
            $("#img_rmld").fadeIn("fast");
            // $(".topbar-fundo").fadeIn("fast");
            // $(".topbar-fundo-texto").fadeIn("fast");
            // $(".topbar-fundo-transparente").fadeIn("fast");
            // $(".topbar-fundo-container").fadeIn("fast");
            // $("#topbar-fundo").fadeIn("fast");
            $(".div-text-rml").fadeIn("fast");
            $(".div-img-rml").fadeIn("fast");
            $(".div-text-direito").fadeIn("fast");
            //$(".sticky-top").css("border-bottom", "none");
            //$('.div-text-direito-mobile').fadeIn("fast");
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('fast');
        } else {
            $('.back-to-top').fadeOut('fast');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 50, 'easeInOutExpo');
        return false;
    });


    // Latest-news-carousel
    $(".latest-news-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });


    // What's New carousel
    $(".whats-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
            }
        }
    });



    // Modal Video
    /**
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });
 */


})(jQuery);

