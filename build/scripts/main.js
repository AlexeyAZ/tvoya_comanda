$(function () {

    var body = $("body");
    var header = $(".header");

    var dataItems;
    var dataAdv;

    // стиль шапки в зависимости от страницы
    function setHeaderStyle() {

        if (window.location.pathname == "/gallery.html") {
            header.addClass("header_gallery");

            header.find(".header__nav-link").each(function () {
                var self = $(this);

                self.attr("href", self.data("gallery-href"));
            });
        } else {
            header.removeClass("header_gallery");
        }
    }

    // ajax запрос к данным
    function getDataContent() {
        $.ajax({
            url: 'json/data.json',
            success: function (data) {
                dataItems = data;
            },
            complete: function () {
                [createOurWorksGallery(), createOpenGallery(Cookies.get('ourworksgalleryphotoindex'))];
            }
        });
    }

    // ajax запрос к данным рекламы
    function getAdvContent() {
        $.ajax({
            url: 'json/adv.json',
            success: function (data) {
                createAdvGallery(data);
            },
            complete: function () {}
        });
    }

    // клик по пункту из портфолио
    body.on("click", ".our-works__gallery-item", function () {
        var self = $(this);
        Cookies.set('ourworksgalleryphotoindex', self.data("photo-index"));
    });

    // Создать контент в разделе "наши последние работы"
    function createOurWorksGallery() {

        if ($(".our-works__gallery").length) {
            var ourWorksGallery = $(".our-works__gallery");
            var ourWorksGalleryContent = "";
            var ourWorksGalleryTemplate = $("#ourWorksTemplate");

            for (var i = 0; i < dataItems.length; i++) {
                ourWorksGalleryContent += ourWorksGalleryTemplate.html();
            }

            ourWorksGallery.html(ourWorksGalleryContent);

            for (var i = 0; i < dataItems.length; i++) {
                var item = ourWorksGallery.find(".our-works__gallery-item").eq(i);

                var photo = item.find(".our-works__gallery-photo");
                var name = item.find(".our-works__gallery-name");
                var place = item.find(".our-works__gallery-place");

                item.attr("data-photo-index", i);
                photo.css("backgroundImage", "url(" + dataItems[i].photo + ")");
                name.text(dataItems[i].name);
                place.text(dataItems[i].place);
            }

            setOurWorksGalleryHeightInit();
        }
    }

    // развернуть галерею "наши последние работы"
    body.on("click", ".js-show-more-photo-btn", function (e) {
        e.preventDefault();
        setOurWorksGalleryHeight();
    });

    // высота галереи "наши последние работы"
    function setOurWorksGalleryHeight() {

        var galleryBtn = $(".our-works__btn");
        var galleryContainer = $(".our-works__gallery-container");
        var gallery = $(".our-works__gallery");
        var galleryItem = $(".our-works__gallery-item");
        var galleryItemHeight = galleryItem.outerHeight(true);

        if (galleryContainer.hasClass("our-works__gallery-container_open")) {
            galleryContainer.removeClass("our-works__gallery-container_open");
            galleryBtn.text(galleryBtn.data("btn-open"));
            galleryContainer.height(galleryItem.outerHeight(true));
        } else {
            galleryContainer.addClass("our-works__gallery-container_open");
            galleryContainer.height(gallery.height());
            galleryBtn.text(galleryBtn.data("btn-close"));
        }
    }

    function setOurWorksGalleryHeightInit() {
        var galleryBtn = $(".our-works__btn");
        var galleryContainer = $(".our-works__gallery-container");
        var galleryItem = $(".our-works__gallery-item");

        galleryContainer.removeClass("our-works__gallery-container_open");
        galleryBtn.text(galleryBtn.data("btn-open"));
        galleryContainer.height(galleryItem.outerHeight(true));
    }

    // Создать контент в разделе "реклама о нас"
    function createAdvGallery(data) {
        if ($(".adv__gallery").length) {
            var advGallery = $(".adv__gallery");
            var advGalleryContent = "";
            var advGalleryTemplate = $("#advGalleryTemplate");

            for (var i = 0; i < data.length; i++) {
                advGalleryContent += advGalleryTemplate.html();
            }

            advGallery.html(advGalleryContent);

            for (var i = 0; i < data.length; i++) {
                var item = advGallery.find(".adv__gallery-item").eq(i);

                var photo_1 = item.find(".adv__gallery-photo-item:first-child");
                var photo_2 = item.find(".adv__gallery-photo-item:last-child");
                var text = item.find(".adv__gallery-paragraph");
                var source = item.find(".adv__description-source");
                var date = item.find(".adv__description-date");

                photo_1.attr("src", data[i].photo_1);
                photo_2.attr("src", data[i].photo_2);
                text.text(data[i].text);
                source.text(data[i].source);
                date.text(data[i].date);
            }

            createAdvGallerySlider();
        }
    }

    // создать контент основной галереи
    function createOpenGallery(number) {

        if ($(".gallery__thumbnails").length) {
            var galleryThubnails = $(".gallery__thumbnails");
            var galleryThubnailsContent = "";
            var galleryThubnailsTemplate = $("#galleryThumbnailsTemplate");

            var gallerySlider = $(".gallery__slider");
            var gallerySliderContent = "";
            var gallerySliderTemplate = $("#gallerySliderTemplate");

            var galleryName = $(".gallery__title");
            var galleryPlace = $(".gallery__place");
            var galleryDate = $(".gallery__date");

            galleryName.text(dataItems[number].name);
            galleryPlace.text(dataItems[number].place);
            galleryDate.text(dataItems[number].date);

            for (var i = 0; i < dataItems[number]["all-photo"].length; i++) {
                galleryThubnailsContent += galleryThubnailsTemplate.html();
                gallerySliderContent += gallerySliderTemplate.html();
            }

            galleryThubnails.html(galleryThubnailsContent);
            gallerySlider.html(gallerySliderContent);

            for (var i = 0; i < dataItems[number]["all-photo"].length; i++) {

                var thumbnailsItem = galleryThubnails.find(".gallery__thumbnails-item").eq(i);
                var sliderItem = gallerySlider.find(".gallery__slider-item").eq(i);

                thumbnailsItem.css("backgroundImage", "url(" + dataItems[number]["all-photo"][i].photo + ")");
                sliderItem.css("backgroundImage", "url(" + dataItems[number]["all-photo"][i].photo + ")");
            }

            createThumbnailsGallery();
            createSliderGallery();
        }
    }

    // плавный скролл к якорям
    body.on("click", ".js-link-smooth-scroll", function (e) {
        e.preventDefault();

        var self = $(this);
        var anchor = $(self.attr("href"));

        if (!self.closest(".header_gallery").length) {
            console.log(0);
            $("html, body").animate({
                scrollTop: anchor.offset().top
            }, 300);
        } else {
            window.location = self.attr("href");
        }
    });

    // галерея "реклама о нас"
    function createAdvGallerySlider() {
        $('.adv__gallery').slick({
            dots: true,
            arrows: false
        });
    }

    // создать галерею с миниатюрами
    function createThumbnailsGallery() {
        $('.gallery__thumbnails').slick({
            asNavFor: '.gallery__slider',
            slidesToShow: 13,
            slidesToScroll: 1,
            focusOnSelect: true,
            arrows: false,
            swipeToSlide: true,
            centerMode: true,
            variableWidth: true
        });
    }

    // создать галерею слайдер
    function createSliderGallery() {
        $('.gallery__slider').slick({
            asNavFor: '.gallery__thumbnails',
            slidesToShow: 1,
            slidesToScroll: 1,
            focusOnSelect: true,
            arrows: false,
            centerMode: true,
            variableWidth: true
        });
    }

    function playAnimation() {
        $('.title_state_hide').viewportChecker({
            classToAdd: 'title_state_show'
        });

        $('.text_state_hide').viewportChecker({
            classToAdd: 'text_state_show'
        });

        $('.main').viewportChecker({
            classToAdd: 'main_bg_transparent'
        });

        $('.about__photo').viewportChecker({
            classToAdd: 'about__photo_animate'
        });
    }

    $(window).on("resize", function () {
        setOurWorksGalleryHeightInit();
    });

    function start() {
        setHeaderStyle();
        getAdvContent();
        getDataContent();
        playAnimation();
    }

    start();
});
//# sourceMappingURL=main.js.map
