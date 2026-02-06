/* Global public/js/premium/common.js */


function animationEffect(classValue){
//these 2 lines prevent this function from being called multiple times to prevent overlapping
//the code works without these lines though so remove them if u don't want them
const counters = document.querySelectorAll(classValue);
const incrementConstant = 2; //the higher the number the faster the count rate, the lower the number the slower the count rate
const speed = 2000;

counters.forEach((counter) => {
      const updateCount = () => {
          const target = + counter.getAttribute('data-target');
          counter.storedValue=counter.storedValue||counter.innerText-0; //saving a custom value in the element(the floating value)
          const count = + counter.storedValue; //accessing custom value(and rounding it)
          const inc = incrementConstant/(speed / target); //the math thanks to @Tidus
          if(count < target) {
              counter.storedValue=count+inc
              counter.innerText = Math.round(counter.storedValue);
              setTimeout(updateCount, 1);
          } else {
              counter.innerText = target;
          }
      }
      updateCount();
  });
}

function log(l) {
    console.log(l);
}
(function (u) {
    config.requireJs['urlArgs'] = function (id, url) {
        if (typeof requireUrlArgs != 'undefined' && typeof requireUrlArgs[id] != 'undefined') {
            return (url.indexOf('?') === -1 ? '?' : '&') + requireUrlArgs[id];
        } else {
            return '';
        }
    };
    var s = document.createElement('script');
    s.src = u;
    if (s.readyState) {  // only required for IE <9
        s.onreadystatechange = function () {
            if (s.readyState === "loaded" || s.readyState === "complete") {
                s.onreadystatechange = null;
                requireLoaded();
            }
        };
    } else {  //Others
        s.onload = function () {
            requireLoaded();
        };
    }
    var b = document.getElementsByTagName('script')[0];
    b.parentNode.insertBefore(s, b);
})((typeof baseUrl !== 'undefined'?baseUrl:'')+'/js/require.js');

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;

    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }

    return {x: xPosition, y: yPosition};
}
function init_common() {
    /* Footer */
    $('[data-toggle="tooltip"]').tooltip();

    /* aside_bloc_contact */

    if (googlemap == true) {
        if (document.getElementById('map_sidebar')) {
            $('.bloc.bloc1,#toggle-menu-bottom').on('click',function () {
                requirejs([
                    'map_api',
                    'map_functions'
                ], function () {
                    displayMapSideBar(document.getElementById('map_sidebar'));
                });
            });
        }
    }

    $('.intention_appel').on("click", function (event) {
        var id = this.id;
        var idagence = 0;
        if (typeof $(this).attr('data-agence') !== 'undefined') {
            idagence = $(this).attr('data-agence');
        }

        $.ajax({
            type: "POST",
            url: telephone_url,
            data: "idhabit=" + idhabit + "&idagence=" + idagence,
            dataType: "json",
            global: false,    // this makes sure ajaxStart is not triggered
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='_token']").attr('content'));
            },
            success: function (result) {
                if (typeof (result.telephone) !== 'undefined' && result.telephone != '') {
                    $('#' + id + ' span.intention_appel_txt').text(result.telephone);
                    $('#' + id).addClass('telephone-vu');
                }
            },
            error: function (data, json, errorThrown) {
                // var errors = data.responseJSON;
            }
        });
    });

    // On vérifie si un "select.selectpicker" existe sur cette page.
    if ($('select.selectpicker').length > 0) {

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $('.selectpicker').selectpicker('mobile');
        }

    }

    // On vérifie si un "select.selectpicker-ajax" existe sur cette page.
    $('select.selectpicker-ajax').each(function () {
        var el = $(this);
        var selectOptions = {
            ajax: {
                data: {
                    form: el.parents('form').prop('id'),
                    search: "{{{q}}}",
                    _token: $("meta[name=_token]").attr('content'),
                    champ: el.prop('id')
                },
                dataType: 'json',
                type: 'POST'
            }
        };
        $(this).selectpicker().ajaxSelectPicker(selectOptions);
    });

    if ($('div.link').length > 0) {
        $('div.link').on('click', function (event) {
            event.stopPropagation();
            var link = $(this).attr('data-href');
            var target = '';
            if ($(this).attr('data-target')) {
                target = $(this).attr('data-target');
            }
            alert(link);
            window.open(link, target);
            return false;
        });
    }
    // Fixes the prev/next links of the sliders
    if ($('.carousel-control-prev').length > 0) {
        $('body').on('click', '.carousel-control-prev', function (event) {
            event.stopPropagation();
            var target = $(this).attr('href');
            $(target).carousel('prev');
            return false;
        });

        $('body').on('click', '.carousel-control-next', function (event) {
            event.stopPropagation();
            var target = $(this).attr('href');
            $(target).carousel('next');
            return false;
        });
        // carousel multiple items per slide
        $('.produitshabitationslider.multiple .carousel').on('slide.bs.carousel', function (e) {
            var slider = $(this);
            var $e = $(e.relatedTarget);
            var idx = $e.index();
            var itemsPerSlide = slider.data('per-slide');
            var totalItems = slider.find('.carousel-item').length;
            if (idx >= totalItems - (itemsPerSlide - 1)) {
                var it = itemsPerSlide - (totalItems - idx);
                for (var i = 0; i < it; i++) {
                    // append slides to end
                    if (e.direction == "left") {
                        slider.find('.carousel-item').eq(i).appendTo(slider.find('.carousel-inner'));
                    } else {
                        slider.find('.carousel-item').eq(0).appendTo(slider.find('.carousel-inner'));
                    }
                }
            }
        });
    }
    if ($('article.item-listing').length > 0) {
        // Or use this to Open link in same window (similar to target=_blank)
        $('body').on('click', 'article.item-listing', function (event) {
            event.stopPropagation();
            if (undefined == ($(this).find("a.item-link").attr("href"))) {
            } else {
                window.location = $(this).find("a.item-link").attr("href");
            }
            return false;
        });
    }
}

/* Toggle pour l'icone de favoris. */
function flyToElement(flyer, flyingTo) {
	console.log(flyingTo)
    var $func = $(this);
    var divider = 3;
    var flyerClone = $(flyer).clone();
    var bodyPos = $('body')[0].getBoundingClientRect();
    $(flyerClone).css({
        position: 'absolute',
        top: $(flyer)[0].getBoundingClientRect().y - bodyPos.y + "px",
        left: $(flyer)[0].getBoundingClientRect().x - bodyPos.x + "px",
        opacity: 1,
        'z-index': 1000,
        height: flyer[0].clientHeight,
        width: flyer[0].clientWidth
    });
    $('body').append($(flyerClone));
    var gotoX = $(flyingTo).offset().left + ($(flyingTo).width() / 2) - ($(flyer).width() / divider) / 2;
    var gotoY = $(flyingTo).offset().top + ($(flyingTo).height() / 2) - ($(flyer).height() / divider) / 2;

    $(flyerClone).animate({
            opacity: 0.4,
            left: gotoX,
            top: gotoY,
            width: $(flyingTo).width() / divider,
            height: $(flyingTo).height() / divider
        }, 750,
        function () {
            $(flyingTo).fadeOut('fast', function () {
                $(flyingTo).fadeIn('fast', function () {
                    $(flyerClone).fadeOut('fast', function () {
                        //$(flyerClone).remove(); // à tester si pas d'impact sur  les modele epur
                    });
                });
            });
        });
}

function lazy_carousel() {
    $('body').on("slide.bs.carousel", '.carousel.lazy', function (ev) {
        var lazy;
        lazy = $(ev.relatedTarget).find("img[data-src]");
        lazy.attr("src", lazy.data('src'));
        lazy.attr("srcset", lazy.data('srcset'));
        lazy.removeAttr("data-src");
        lazy.removeAttr("data-srcset");
    });
}

function ajax_favoris() {
    $('body').on("click", '.adfav', function (event) {
        event.stopPropagation();
        var object = $(this);
        var id;
        id = object.attr("id");

        action = '';
        if (object.hasClass("active")) {
            action = "remid=" + id;
            object.removeClass("active");
        } else {
            action = "adid=" + id;
            object.addClass("active");
        }

        $.ajax({
            type: "POST",
            url: url_favoris,
            data: action,
            dataType: "json",
            cache: false,
            global: false,    // this makes sure ajaxStart is not triggered
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("meta[name='_token']").attr('content'));
            },
            success: function (result) {
                var count = result.count;
                //Select item image and pass to the function
                if (action.indexOf('adid') >= 0) {
                    var itemImg = object.parents('article').find('img.d-block').eq(0);
                    if (page_nom == 'detail' || page_nom == 'programme-neuf') {
                        itemImg = $('div.carousel-inner div.carousel-item').eq(0).find('img.d-block');
                    }
										console.log($('.bloc3:visible'))
                    flyToElement($(itemImg), $('.bloc3:visible'));
                }
                $(".badge-pill").html(count).animate({backgroundColor: '#E4D8B8'});
            },
            error: function (data, json, errorThrown) {
                // var errors = data.responseJSON;
            }
        });
    });

    return false;
}

function init_parsley() {
    window.Parsley.on('field:error', function () {
        this.$element.addClass('has-danger').addClass('form-control-danger');
    });

    window.Parsley.on('field:success', function () {
        this.$element.addClass('has-success').addClass('form-control-success');
    });

    window.Parsley.on('field:validated', function (e) {
        if (e.validationResult.constructor !== Array) {
            this.$element.closest('.form-group').removeClass('has-danger').addClass('has-success');
        } else {
            this.$element.closest('.form-group').removeClass('has-success').addClass('has-danger');
        }
    });

    window.Parsley.addValidator('maxFileSize', {
        validateString: function (_value, maxSize, parsleyInstance) {
            if (!window.FormData) {
                console.log('You are making all developpers in the world cringe. Upgrade your browser!');
                return true;
            }
            var files = parsleyInstance.$element[0].files;
            var condition = (files.length != 1 || files[0].size <= maxSize * 1024);

            // On met en place les éléments spécifiques pour marquer "V" ou "X" puisqu'on surclasse en css le input[file].
            var label = parsleyInstance.element.parentElement;

            $(label).removeClass('has-success').removeClass('form-control-success')
                .removeClass('has-danger').removeClass('form-control-danger');

            if (condition) {
                $(label).addClass('has-success').addClass('form-control-success');
            } else {
                $(label).addClass('has-danger').addClass('form-control-danger');
            }

            return condition;
        },
        requirementType: 'integer',
        messages: {
            de: 'This file should not be larger than %s Kb',
            en: 'This file should not be larger than %s Kb',
            fr: 'Ce fichier est plus grand que %s Kb.'
        }
    });

    window.Parsley.addValidator('fileExtension', {
        validateString: function (_value, fileExtensions, parsleyInstance) {
            var extensions = fileExtensions.split(',');
            var fileExtension = _value.split('.').pop().toLowerCase();
            var condition = (extensions.indexOf(fileExtension) >= 0);
            var label = parsleyInstance.element.parentElement;

            // On met en place les éléments spécifiques pour marquer "V" ou "X" puisqu'on surclasse en css le input[file].
            $(label).removeClass('has-success').removeClass('form-control-success')
                .removeClass('has-danger').removeClass('form-control-danger');

            if (condition) {
                //			var filename = parsleyInstance.$element[0].files[0].name;
                $(label).addClass('has-success').addClass('form-control-success');//.text( filename );
            } else {
                $(label).addClass('has-danger').addClass('form-control-danger');
            }

            return condition;
        },
        requirementType: 'string',
        messages: {
            de: 'This file should have one of the following extension: %s.',
            en: 'This file should have one of the following extension: %s.',
            fr: 'Ce fichier n\'a pas l\'une des extensions suivantes : %s.'
        }
    });

    window.Parsley.addValidator("requiredIf", {
        validateString: function (_value, targetElement) {
            if ($(targetElement).val()) {
                return !!_value;
            }
            return true;
        },
        requirementType: 'string',
        messages: {
            de: 'This field must be filled',
            en: 'This field must be filled',
            fr: 'Ce champ est requis',
        }
    });

    $('form.validate').parsley({
        errorClass: 'has-danger',
        successClass: 'has-success',
        classHandler: function (ParsleyField) {
            return ParsleyField.$element.parents('.form-group');
        },
        errorsContainer: function (ParsleyField) {
            return ParsleyField.$element.parents('.form-group');
        },
        errorsWrapper: '<span class="help-block parsley-red">',
        errorTemplate: '<div></div>'
    });
}

function init_parsley_estimation() {
	console.log("function init_parsley_estimation");
    var $sections = $('div.form-section');
    var steps = $sections.length;
    var form = $('#formestimation');
    var formNav = $('.form-navigation');

    function navigateTo(index, steps) {
		console.log("function navigateto99");
        // Mark the current section with the class 'current'
        $sections
            .removeClass('current')
            .eq(index)
            .addClass('current');
		//	$sections.eq(index).children('div.form-group').children('input:first-child').focus();

        // Show only the navigation buttons that make sense for the current section:

        formNav.show();
        formNav.find('.previous,.next,.gRecapSubmit,.g-recaptcha').hide();
        form.find('.g-recaptcha').hide();
        form.find('#captchaShow').hide();
        if (index > 0) {
            formNav.find('.previous').show();
        }

        if (index < $sections.length - 1) {
            formNav.find('.next').show();
        } else {
            formNav.find('.gRecapSubmit, .g-recaptcha').show();
            form.find('.g-recaptcha').show();
            form.find('#captchaShow').show();
        }
        setProgressBar(index, steps);
    }

    function curIndex() {
        // Return the current index by looking at which section has the class 'current'
        // On ajoute 1, sinon s'il s'agit du premier élément on retourne 0, donc false 
        return "" + $sections.index($sections.filter('.current'));
        // return parseInt($sections.index($sections.filter('.current'))) + 1 ;
    }

    // Previous button is easy, just go back
    formNav.find('.previous').click(function () {
        navigateTo(curIndex() - 1, steps);
    });

    // Next button goes forward iff current block validates
    formNav.find('.next').click(function () {
        var cur_index = curIndex();
        if (form.parsley().validate({group: 'block-' + cur_index})) {
            navigateTo(parseInt(cur_index) + 1, steps);
            if ($('.sticky_menu.sticking').length) {
                $scroll( '.content_page', '.sticky_menu.sticking' )
            }
        }
    });

    // Prepare sections by setting the `data-parsley-group` attribute to 'block-0', 'block-1', etc.
    $sections.each(function (index, section) {
        $(section).find(':input').attr('data-parsley-group', 'block-' + index);
    });
    navigateTo(0, steps); // Start at the beginning

    $('#resultat_estim').hide();
    // Ajax for our form
    form.on('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        $('#captchaModal').modal('hide');
        if (form.parsley().validate({group: 'block-' + curIndex()})) {
            formAjax_estimation();
        }
    });
}

///////////////////// Captcha Consorts ///////////////////////
$('#captchaShow').click(function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    // ajax request to get captcha
    createCaptcha();
    //display modal
    $('#captchaModal').modal('show');
    });
function createCaptcha(target=null) {
    let url = 'https://www.consortium-immobilier.fr/api-captcha/captcha.php';
    if(target){
        url = 'https://www.consortium-immobilier.fr/api-captcha/captcha.php?target='+target;
    }
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        cors: true ,
        contentType:'application/json',
        secure: true,
        headers: {
        'Access-Control-Allow-Origin': '*',
      },
      success: function(data) {
            if(target){
                $('#captcha-html-'+target ).html(data.html);
            }
            else{
                $('#captcha-html').html(data.html);
            }
        }
    });
}
//////////////////////////////////////////////////////////

function arrow_deroule() {
    var deroule_height = 0;
    if (typeof page_nom != 'undefined' && page_nom == 'detail' && typeof detail_arrow_deroule != 'undefined' && detail_arrow_deroule) {
        if ($('#detailinfosdetail').length > 0) {
            deroule_height = $('#detailinfosdetail .col1 ul').height();
            $('#detailinfosdetail').height(deroule_height);
        }
    }

    $('.btn-collapse').on('click', function () {
        var $this = $(this);

        if ($this.hasClass('')) {
            $this.removeClass();
        } else if ($this.hasClass('arrow')) {
            $this.removeClass('arrow').addClass('');
            if (deroule_height > 0) {
                $('#detailinfosdetail').height(deroule_height);
            }
        } else {
            $this.addClass('arrow');
            if (deroule_height > 0) {
                $('#detailinfosdetail').height('auto');
            }
        }
    });

    return false;
}

function init_map_agence() {
    if (document.getElementById('map_contact')) {
        requirejs([
            'map_api',
            'map_functions'
        ], function () {
            var map_Sidebar = displayMapAgence(document.getElementById('map_contact'));
            $('.btn.btn-circle.chevron-toggle.ion-chevron-down').click(function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                // function toggleSize($ev, $from, $to){
                var el = $('.map, #map_contact');
                if (undefined === el.attr('toggled')) {
                    el.attr('toggled', '')
                }
                if (el.attr('toggled') === 'toggled') {
                    el.attr('toggled', '');
                } else {
                    el.attr('toggled', 'toggled');
                }
                mapResize(map_Sidebar.getMap());
            });
        });
    }
}

/* Page détail */

function init_map_proximite() {
    requirejs([
        "map_api",
        "map_functions",
        "map_places"
    ], function () {
        initializeMapProximite();
    });
    init_compteur_gmap();
}

function init_detailtabs() {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if($('#map-proximite').is(':visible')) {
            setTimeout(init_detailnotabs, 350);
        }
    });
		
}

function init_detailnotabs() {
    init_map_proximite();
}

function init_detail_tablesort() {
    var detaillots = $('table#detaillots');
    if (detaillots.length > 0) {
        detaillots.tablesorter({
            sortList: [[0, 0]],
//        theme: 'blue',
            widgets: ['zebra', 'reflow'],
            widgetOptions: {
                // class name added to make it responsive (class name within media query)
                // reflow_className: 'ui-table-reflow',
                // header attribute containing modified header name
                // reflow_headerAttrib : 'data-name',
                // data attribute added to each tbody cell
                // it contains the header cell text, visible upon reflow
                // reflow_dataAttrib   : 'data-title'
            }

        });
    }
}

function init_clickscroll() {
    $('a.nav-scroll').on('click', function (evt) {
        evt.preventDefault();
        var target = $(this).attr('href');
        $('html, body')
            .stop()
            .animate({scrollTop: $(target).offset().top}, 1000);

        return false;
    });
}

function updateQrCode() {

    if ('undefined' === typeof detail_url||!document.getElementById('detail_qrcode')) {
        return;
    }

    var options = {
        fill: '#0081C5',
        size: parseInt(300, 10),
        radius: parseInt(50, 10) * 0.01,
        text: detail_url
    };
    $('#detail_qrcode').empty().qrcode(options);
}

/* Page estimation */

function init_estimation() {
    current = 1; //,current_step,next_step,steps;
    current_step = 1;
    next_step = 2;
    steps = $("fieldset").length;
    console.log('init_estimation');
    $('fieldset').slice(1).hide();

    setProgressBar(current, steps);

    $('#resultat_estim').hide();

    // Ajax for our form
    $('[name="validate"]').on('click', formAjax_widget);
    requirejs(['map_places_api'], function () {
        google.maps.event.addDomListener(window, 'load', initAutocomplete);
    });
}

function form_estimation() {

    $(".next").click(function () {

        if ((current == 1 && $('input[name="surface"]').val() != '')
            || (current == 2 && $('input[name="adresse"]').val() != '')
            || (current == 3 && $('input[name="accepte"]').val() == '1' && $('input[name="email"]').val() != '')) {
            current_step = $(this).parent();
            next_step = $(this).parent().next();
            next_step.show();
            current_step.hide();
            setProgressBar(++current, steps);
        }
    });

    $(".previous").click(function () {
        current_step = $(this).parent();
        next_step = $(this).parent().prev();
        next_step.show();
        current_step.hide();
        setProgressBar(--current, steps);
    });
}

function setProgressBar(curStep, steps) {
    // Change progress bar action
    // console.log("curStep",curStep)
    // console.log("steps",steps)
    var percent = parseFloat(100 / steps) * curStep;
    // console.log("percent",percent)
    percent = percent.toFixed();
    $(".progress-bar")
        .css("width", percent + "%")
        .html(percent + "%");
}

function init_place_autocomplete(){
    if($('input[data-places-autocomplete],#autocomplete').length > 0) {
        requirejs(['map_places_api', 'map_functions'], function () {
            initializePlaceAutocomplete();
        });
    }
}

function formAjax_estimation() { 
 
    var form = $('#formestimation');

    if ((form.find('input[name="accepte"]').val() == '1' && form.find('input[name="email"]').val() != '')
        || form.find('input[name="accepte"]').val() == '0') {
        form.find('#estimationErrorList').remove();

	// console.log(form.serialize() + "&route=" + page_nom);
	console.log("--------------------------------------");
        $.ajax({
            url: widget_url,
            type: 'POST',
            data: form.serialize() + "&route=" + page_nom,
            beforeSend: function (request) {
                // console.log('beforeSend');
                console.log("widget_url", widget_url)
                req = request.setRequestHeader('X-CSRF-Token', $("meta[name='_token']").attr('content'));
                console.log('REQ', req);
                return request;

            },
            // dataType: "json",
            success: function (json) {
				// console.log("************");
				// console.log(json);
                setProgressBar(3, 3);
                form.hide();
                if ('undefined' === typeof (json.data)) {

                    json = json.replace(/\n/g, '');
                    console.log("json",json)

                    var parser = new DOMParser();
                    var doc = parser.parseFromString(json, 'text/html');
                    var $parsedHTML = $(doc.documentElement);
                    console.log('outerhtml', $parsedHTML[0].outerHTML);
                    if ($parsedHTML.length > 0) {
                        var results = $parsedHTML.find("table.email-body_inner");
                        console.log("TABLE", results)
                        $('div.formcms4').prepend(results)                        
                    }
                    else if (0 == form.find('input[name="accepte"]').val()) {
                        $('#resultat_estim_rien_not_contact').show();
                        log('$(\'#resultat_estim_rien_not_contact\').show();');
                    } else {
                        $('#resultat_estim_rien').show();
                        log('$(\'#resultat_estim_rien\').show();')
                    }

                    return;
                }

                var resultat = json.data.resultat;
 
                if (resultat.habmoyen == '0') {
                    // log('resultat habit 0')
                    if (0 == form.find('input[name="accepte"]').val()) {
                        $('#resultat_estim_rien_not_contact').show();
                    } else {
                        $('#resultat_estim_rien').show();
                    }
                    return;
                } else {
                    $('#resultat_estim').show();
                }

                var habmini = resultat.habmini.replace('&nbsp;', ' ');
                var habmoyen = resultat.habmoyen.replace('&nbsp;', ' ');
                var habmaxi = resultat.habmaxi.replace('&nbsp;', ' ');
                var prixm2 = resultat.prixm2.replace('&nbsp;', ' ');

                $('#infos').text(resultat.type + ' ' + resultat.piece + ' pièce(s) ' + resultat.surface + ' m2');
                $('#infos_coords').text(resultat.rue + ' ' + resultat.ville);

                $('#prixbas').text(habmini + ' €');
                $('#prixmoyen').text(habmoyen + ' €');
                $('#prixhaut').text(habmaxi + ' €');
                $('#prixm2').text(prixm2 + ' €');

            },
            error: function (data, json, errorThrown) {
				console.log('error ajax estimation');
                console.log("data", data); 
                console.log("errorThrown", errorThrown); 
                console.log("json", json); 
                if (409 == data.status) {
                    if (0 == form.find('input[name="accepte"]').val()) {
                        $('#resultat_estim_rien_not_contact').show();
                    } else {
                        $('#demande-enrg').show();
                    }

                    return;
                }
                var errors = data.responseJSON;
                var errorsHtml = '';
                $.each(errors, function (key, value) {
                    errorsHtml += '<li>' + value + '</li>';
                });
                if (422 == data.status) {
                    if (errorsHtml.length > 0) {
                        form.prepend($('<div id="estimationErrorList" class="alert alert-danger"><ul>' + errorsHtml + '</ul></div>'));
                    }
                }
            }
        })
            .done(function (response) {
                setProgressBar(3, 3);
            })
            .fail(function (data, json) {
            });
    }
    return false;
}

/* Pages listing */

function formAjax_formsearch(event) {
    
    event.stopPropagation();
    event.preventDefault();
    var form = $(this);

    queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    cloneFrom = form.clone();
    // selectpicker update
    form.find('select.selectpicker').each(function () {
        var sel = $(this);
        cloneFrom.find('#' + sel.prop('id')).val(sel.val());
    });
    // if('undefined' !== typeof cloneFrom[0].coordonnees){
    //     cloneFrom[0].coordonnees.value = '';
    // }
    // window.history.pushState('', '', location.protocol + '//' + location.host + location.pathname+'?'+cloneFrom.serialize());
    var postData = form.serialize() + "&route=" + page_nom;
    if(urlParams.get('loc') && urlParams.get('loc')=='saisonniere')
    {
        postData = "loc=saisonniere&" + form.serialize() + "&route=" + page_nom;
    }
     
    $.ajax({
        url: widget_url,
        type: 'POST',
        data: postData,
        beforeSend: function (request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='_token']").attr('content'));
        },
        dataType: "json",
        success: success_formsearch,
        error: function (data, json, errorThrown) {
            var errors = data.responseJSON;
            var errorsHtml = '';
            $.each(errors, function (key, value) {
                errorsHtml += '<li>' + value[0] + '</li>';
            });
					/*	 console.log(data );
				 	console.log(json );  
						console.log(errorThrown );  
               */
            //console.log(errorsHtml, "Error " + data.status + ': ' + errorThrown);
        }
    })
        .done(function (response) {
        })
        .fail(function (data, json) {
        });
    if ('undefined' !== typeof cloneFrom[0].coordonnees) {
        cloneFrom[0].coordonnees.value = '';
    }
    if(urlParams.get('loc') && urlParams.get('loc')=='saisonniere')
    {
        window.history.pushState({'postData':postData}, '', location.protocol + '//' + location.host + location.pathname + '?' +"loc=saisonniere&" + $(cloneFrom).serialize());
    }
    else
    {
        window.history.pushState({'postData':postData}, '', location.protocol + '//' + location.host + location.pathname + '?' + $(cloneFrom).serialize());
    }    
    return false;
}

function success_formsearch(json) {
    var data = json.data;
    // Si aucun bien ne ressort avec la requête géographique par tracé sur le carte, on enlève les coordonnées de la sélection courante.
    var coordonnees_string = $('input#coordonnees').val();
    if (typeof (coordonnees_string) !== 'undefined' && coordonnees_string != '' && coordonnees_string == JSON.stringify(JSON.parse(coordonnees_string)) && data.total == 0) {
        $('input#coordonnees').val('');
        return false;
        // $('#' + id + ' input[name="btnSubmit"]').click();
    }
    // On affiche le nouveau listing et sa pagination.
    $('#' + bloclisting).html(data.output);
    // Singulier ou pluriel
    label_submit = data.total + labels_submit[0];
    if (data.total > 1) {
        label_submit = data.total + labels_submit[1];
    }
    if (typeof $('#' + id + ' input[name="btnSubmit"]').data('sansnbbiens') == "undefined") {
        $('#' + id + ' input[name="btnSubmit"]').val(label_submit);
    }
    // Initialisation de la carte.
    removeMarkers();
    markers = [];
    locations = [];
    /**
     * Raph : 19/12/2022
     * Pour le listing vendu, lorsqu'on fait une recherche sur la carte, on enregistre le résultat de cette recherche en bdd pour la partager.
     */
    if(typeof(idpers) !="undefined" && idpers == '239801' )
    {
        if(data.id == 'listing-vendu'){
            console.log('debug success' , data)
            $.ajax({
                url: 'url/simplifiee',
                type: 'POST',
                data: {
                    'url' : data.resultats.first_page_url,
                },
                beforeSend: function (request) {
                    return request.setRequestHeader('X-CSRF-Token', $("meta[name='_token']").attr('content'));
                },
                dataType: "json",
                success: function(data){
                    // affichage du bouton de partage de la recherche (data = id de cms4_recherche_map)
                    $('#partage-recherche').attr('href', 'https://'+ location.host+ '/fr/recherche/'+data);
                    // On ajoute le texte du lien de la recherche
                    $('#partage-recherche').text('Votre recherche : https://'+ location.host+ '/fr/recherche/'+data);
                    $('#partage-recherche').show(); 
                    
                },
                error: function (data, json, errorThrown) {
                    var errors = data.responseJSON;
                    var errorsHtml = '';
                    $.each(errors, function (key, value) {
                        errorsHtml += '<li>' + value[0] + '</li>';
                    });
                            
                    //console.log(errorsHtml, "Error " + data.status + ': ' + errorThrown);
                }
            })
                .done(function (response) {
                })
                .fail(function (data, json) {
                });    
        }
    }
        

    $("html, body").animate({scrollTop: 0}, "slow");
   

    if (Object.keys(data.insee).length > 0) {

        
        locations = data.insee;
        if ($('div.prod_listing').hasClass('carte')) {
            $('.module_recherche_carte').show();
            // if ($('input#coordonnees').val() != '') {
            //     coordonnees_string = $('input#coordonnees').val();
            //     if (coordonnees_string === JSON.stringify(JSON.parse(coordonnees_string))) {
            //         coordonnees = JSON.parse(coordonnees_string);
            //         // Au rafraichissement ajax, on trace les coordonnées précédemment sélectionnées sur la carte.
            //         var polygoneParcelleHeig = new google.maps.Polygon({
            //             paths: coordonnees,//sommets du polygone
            //             strokeColor: "#0FF000",//couleur des bords du polygone
            //             strokeOpacity: 0.8,//opacité des bords du polygone
            //             strokeWeight: 22,//épaisseur des bords du polygone
            //             fillColor: "#0FF000",//couleur de remplissage du polygone
            //             fillOpacity: 0.35,////opacité de remplissage du polygone
            //             clickable: false,
            //             draggable: false,
            //             editable: false,
            //             geodesic: false
            //
            //         });
            //         polygoneParcelleHeig.setMap(map);
            //
            //     }
            // }
        }

        initListingView();

    } else {
        console.log('data insee is undefined');
        return false;
    }
}

function init_formsearch() {
    // Initialisation ajax
    if (ajax == true) {
        // Ajax for our form
        $('form#' + id).on('submit', formAjax_formsearch);
    }
    // Lien d'impression du listing : on redirige le "submit" du formulaire sur l'url "pdf.listing".
    if (document.getElementById('print_listing') !== null) {
        $("#print_listing").on("click", function (e) {
            e.preventDefault();
            // Si on est en ajax, on enlève d'abord le "on submit" surchargé.
            if (ajax == true) {
                $('form#' + id).unbind('submit');
            }
            $('form#' + id)
            // Pour transmettre à la fonction "imprimer", en attendant de faire des "actions au clic" non-ajax standard.
                .append("<input type='hidden' name='form' value='" + id + "' />")
                .append("<input type='hidden' name='_token' value='" + $('meta[name=\'_token\']').attr('content') + "' />")
                .attr('action', pdf_url)
                .attr('method', 'post')
                .submit();

            // Si on est en ajax, on remet en place le "on submit" surchargé.
            if (ajax == true) {
                $('form#' + id).on('submit', formAjax_formsearch);
            }
        });
    }
    // Si on modifie un champ hormis "page"
    $('#' + id + ' input, #' + id + ' select')
        .not('input[name="page"]')
        .filter(function () {
            var el = $(this);
            return el.attr('name') && el.attr('name').length > 0;
        })
        .on('change', function (e) {
            //			refreshAjax();
            $('input#page').attr('value', '1');
            if (typeof setTriDefaut != 'undefined' && setTriDefaut && typeof tri_defaut != 'undefined') {
                $('input#tri').attr('value', tri_defaut);
            }
            if (ajax == true) {
                $('#' + id + ' input[name="btnSubmit"]').click();
            }
        });
    // Si on change le tri, on valide le formulaire avec.
    $('select#select_tri')
        .on('change', function (event) {
            var tri = this.value;
            $('#' + id + ' input#tri').attr('value', tri);
            $('#' + id + ' input#page').attr('value', 1);
            $('#' + id + ' input[name="btnSubmit"]').click();
             
            $('form#'+id).submit();
            console.log('ici www-cms4/public/assets/js/common line 942');
        });
				
    // Si on clique sur un lien de page, on valide le formulaire avec.
    $('#' + bloclisting)
        .on('click', 'a.page-link', function (event) {
			console.log("pagination++");
            event.preventDefault();
            var page = $(this).data('id');
			console.log("pagination page:"+page);
			console.log("pagination id:"+id);
			 
            $('#' + id + ' input#page').attr('value', page);
            $('#' + id + ' input[name="btnSubmit"]').click();
						
						$('form#'+id).submit();
						console.log('ici www-cms4/public/assets/js/common line 957');
			
        });
    $('.onlyinsee').unbind('click');
    $(document).on('click', '.onlyinsee', function (event) {
        event.stopPropagation();
        event.preventDefault();
        // Pour remplacer le code insee par le code postal ou autre selon le besoin.
        var geocode = 'insee';
        if (typeof geovariable != 'undefined') {
            geocode = geovariable;
        }
        if (ajax == true) {
            $('select#' + geocode + '.selectpicker').unbind('change');
            // $('form#' + id).unbind('submit');
        }
        var insee = $(this).attr('data-id');
        $('select#' + geocode + '.selectpicker').selectpicker('deselectAll');
        $('select#' + geocode + '.selectpicker').selectpicker('val', insee);
        $('form#' + id).submit();
        return false;
    });
    $('.removeinsee').unbind('click');
    $(document).on('click', '.removeinsee', function (event) {
        event.stopPropagation();
        event.preventDefault();
        if (ajax == true) {
            $('form#' + id).off('submit');
        }
        var insee = $(this).attr('data-id');
        // On regarde le nombre d'options sélectionnées.
        var options = $('form#' + id + ' select#insee option:selected');
        var values = $.map(options, function (option) {
            return option.value;
        });
        if (values.length == 0 || values.length == 1) {
            options = $('form#' + id + ' select#insee option');
            values = $.map(options, function (option) {
                return option.value;
            });
        }
        var index = values.indexOf(insee);
        if (index != -1) {
            values.splice(index, 1);
        }
       
        $('select#insee.selectpicker').selectpicker('deselectAll');
        $('select#insee.selectpicker').selectpicker('val', values);
        // $('select#insee.selectpicker').selectpicker('refresh');
        if (ajax == true) {
            $(document).on('submit', 'form#' + id, formAjax_formsearch);
            //			$('form#' + id + ' input[name="btnSubmit"]').click();
            $('form#' + id).submit();
        }
        return false;
    });
    $('form#' + id + ' input[name="btnSubmit"]').on('click', function(e) {
        if ($('#myModal').length && typeof e.originalEvent !== 'undefined') {
            $('#myModal').modal('hide');
        }
    });
}

function refreshAjax() {
    $('input#page').attr('value', '1');
    if (typeof setTriDefaut != 'undefined' && setTriDefaut && typeof tri_defaut != 'undefined') {
        $('input#tri').attr('value', tri_defaut);
    }
    if (ajax == true) {
        $('#' + id + ' input[name="btnSubmit"]').click();
    }
    return false;
}

function initListingView() {
    var current = $('#vue_'+ (typeof listingtypemodel !== 'undefined' && listingtypemodel ? listingtypemodel : 'listing'));
    if (window.innerWidth > 1024) {
        if (['listing', 'damier', 'carte'].indexOf(Cookies.get('listingtype' + (typeof listingtype !== 'undefined' && listingtype ? listingtype : ''))) !== -1) {
            current = $('#vue_' + Cookies.get('listingtype' + (typeof listingtype !== 'undefined' && listingtype ? listingtype : '')));
            console.log('listingtype test')
        } else if (typeof (listing_defaut) !== 'undefined' && ['listing', 'damier', 'carte'].indexOf(listing_defaut)) {
            current = $('#vue_' + listing_defaut);
            console.log('listing_defaut')
        }
    }
    current.click();
    resetListingView(current);
}

function resetListingView(current) {
    console.log("resetListingView()")
    var listing = ['listing', 'damier', 'carte'];
    for (var x in listing) {
        $('#vue_' + listing[x]).parents('li').removeClass('active');
    }
    if (current) {
        current.parents('li').addClass('active');
    }
    setTimeout(function(){lazyload();}, 250);
}

function init_listing() {
    /* Gestion des popover sur le listing. */
    //	$(function () {
    $('[data-toggle="popover"]').popover();
    //	})
    $('.block_info:not(.nolnk)').click(function (event) {
        if ($(event.target).is('.adfav')) {
            event.preventDefault();
            return;
        }
        var url_item = $(this).data('href');
        if (undefined != url_item) {
            window.location = url_item;
        }
    });
    var prodListing = $('.prod_listing');
    prodListing.find('article').hover(function () {
        $(this).find('.block_info_hover').fadeToggle();
    });
    /* Gestion des 3 types de vue pour le listing. */
    $('#vue_listing').on('click', function (event) {
        $('.module_recherche_carte').hide();
        prodListing.removeClass('damier').removeClass('carte');
        prodListing.addClass('listing');
        resetListingView($(this));
        Cookies.set('listingtype' + (typeof listingtype !== 'undefined' && listingtype ? listingtype : ''), 'listing');
    });
    $('#vue_damier').on('click', function (event) {
        $('.module_recherche_carte').hide();
        prodListing.removeClass('carte').removeClass('listing');
        prodListing.addClass('damier');
        resetListingView($(this));
        Cookies.set('listingtype' + (typeof listingtype !== 'undefined' && listingtype ? listingtype : ''), 'damier');
    });
    $('#vue_carte').on('click', function (event) {
        var viewmap = false;
        prodListing.removeClass('damier').removeClass('listing');
        prodListing.addClass('carte');
        resetListingView($(this));
        $('.module_recherche_carte').show();
        Cookies.set('listingtype' + (typeof listingtype !== 'undefined' && listingtype ? listingtype : ''), 'carte');
        requirejs(['map_api', 'map_functions'], function () {
            if (!viewmap) {
                removeMarkers();
                initializeMapListing();
                viewmap = true;
            }
           drawInit() ;
					///
        });
    });

    initListingView();

    // Si on n'est pas en ajax, on met en place l'offset de la pagination courante dans le bouton "Recherche" du formulaire correspondant
    // car c'est le listing qui porte les variables de pagination. --}}
    //	if ( ajax == false ) {
    if (typeof formName !== "undefined"
        && typeof $('#' + formName + ' input[name="btnSubmit"]').data('sansnbbiens') == "undefined"
        && typeof label_submit !== 'undefined') {
        $('form#' + formName + ' input[name="btnSubmit"]').val(label_submit);
    }
    //	$('form:first input[name="btnSubmit"]').val( label_submit );

    //	}

}

/* Page comparateur */

function init_comparateur() {
    /* Gestion des popover sur le listing. */
    //	$(function () {
    $('[data-toggle="popover"]').popover();
    //	})
    $('.block_info:not(.nolnk)').click(function (event) {
        if ($(event.target).is('.adfav')) {
            event.preventDefault();
            return;
        }
        var url_item = $(this).data('href');
        window.location = url_item;
    });
    $('.prod_listing article').hover(function () {
        $(this).find('.block_info_hover').fadeToggle();
    });
    /* Gestion des 3 types de vue pour le listing. */
    $('.vue_damier').click(function () {
        $(".prod_listing article").removeClass();
        $('.module_recherche_carte').hide();
        $('.prod_listing article').addClass('damier');
    });
    $('.vue_listing').click(function () {
        $(".prod_listing article").removeClass();
        $('.module_recherche_carte').hide();
    });
    $('.vue_carte').click(function () {
        /*triggermap*/
        $(".prod_listing article").removeClass();
        $('.prod_listing article').addClass('carte');
        $('.module_recherche_carte').show();
        // initializeliste();
    });
    if ($('.item-favori-delete').length > 0) {
        // Or use this to Open link in same window (similar to target=_blank)
        $('body').on('click', '.item-favori-delete', function (event) {
            event.stopPropagation();
            window.location = $(this).attr("href");
            return false;
        });
    }
    //	if (ajax == false) {
    //$('form#' + formName + ' input[name="btnSubmit"]').val( label_submit );
    //	}
}

/* Maplisting / listing */

function init_maplisting() {
    requirejs(['map_functions'], function () {
        $('div.prod_listing').on({
            mouseenter: function () {
                showme({'insee':$(this).attr('data-insee'),'id': $(this).prop('id').replace('art_', '')});
            },
            mouseleave: function () {
                showme({'insee': $(this).attr('data-insee'), 'id': $(this).prop('id').replace('art_', '')}, 0);
            }
        }, 'article'); //pass the element as an argument to .on
    });
}

/* Piwik */
function init_piwik() {
    if (typeof piwik2 != 'undefined' && piwik2 != false) {
        var _paq = _paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function () {
            var u = index_url;
            _paq.push(['setTrackerUrl', u + '/piwik2.php']);
            _paq.push(['setSiteId', piwik2]);
            var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
            g.type = 'text/javascript';
            g.async = true;
            g.defer = true;
            g.src = u + '/piwik2.php';
            s.parentNode.insertBefore(g, s);
        })();
    }
}

/* Page recherche détaillée */

function formAjax_recherchedetaillee(event) {
    event.preventDefault();
    var form = $(this);
 
/*  console.log(widget_url);
 console.log(form.serialize() + "&route=" + page_nom);   */

    $.ajax({
        url: widget_url,
        type: 'POST',
        data: form.serialize() + "&route=" + page_nom,
        beforeSend: function (request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='_token']").attr('content'));
        },
        dataType: "json",
        success: function (json) {
				 
            var data = json.data;
            $('.container .sidebar .' + widget_result).text(data.total);
            $('form#' + id + ' .submit_complexe').html('<span class="nb_biens_complexe"><i class="ion-eye"></i> Voir les <span class="nb_biens"><span>' + data.total + '</span> biens</span></span>');
        },
        error: function (data, json, errorThrown) {
			
            var errors = data.responseJSON;
            var errorsHtml = '';
            $.each(errors, function (key, value) {
                errorsHtml += '<li>' + value[0] + '</li>';
            });
            console.log(errorsHtml, "Error " + data.status + ': ' + errorThrown);
        }
    })
        .done(function (response) {
        })
        .fail(function (data, json) {
        });
    return false;
}

function init_recherchedetaillee() {
	
    var doneTypingInterval = 1000;  //time in ms (5 seconds)
    // Ajax for our form
    if (ajax == true) {
        $('form#' + id).on('submit', formAjax_recherchedetaillee);
    }
    $('a.submit_complexe').on('click', function (event) {
        event.preventDefault();
        $('form#' + id).off('submit');
        $('form#' + id).submit();
    });
    // Si on modifie un champ hormis "page"
    $('#' + id + ' input[type="checkbox"], #' + id + ' input[type="radio"], #' + id + ' select')
        .not('input[name="btnSubmit"]')
        .on('change', function (e) {
            $('input#page').attr('value', '1');
            if (typeof setTriDefaut != 'undefined' && setTriDefaut && typeof tri_defaut != 'undefined') {
                $('input#tri').attr('value', tri_defaut);
            }
            if (ajax == true) {
                $('#' + id + ' input[name="btnSubmit"]').click();
            }
        });
    //setup before functions
    //on keyup, start the countdown
    $('#' + id + ' input[type="text"]').keyup(function () {
			
        if (typeof (typingTimer) !== 'undefined') {
            clearTimeout(typingTimer);
        }
        if ($(this).val()) {
            typingTimer = setTimeout(doneTyping, doneTypingInterval);
        }
    });
}

//user is "finished typing," do something
function doneTyping() {
    if (ajax == true) {
        $('#' + id + ' input[name="btnSubmit"]').click();
        return false;
    }
}

function init_ajax() {
    $.ajaxSetup({
        beforeSend: function (request) {
            return request.setRequestHeader('X-CSRF-Token', $("meta[name='token']").attr('content'));
        }
    });
    $('#ajax-loader').hide();
    $('#ajax-overlay').hide();
    $(document)
        .ajaxStart(function () {
            $('.ajax-overlay').fadeIn();
            $('#ajax-loader').fadeIn();
        })
        .ajaxStop(function () {
            $('#ajax-loader').fadeOut();
            $('.ajax-overlay').fadeOut();
        });
    return false;
}

function init_map_agents() {
    if(document.getElementById("map_agents")) {
        requirejs(['map_api', 'map_functions'], function () {
            displayMapAgents();
        });
    }
}

function init_map_footer() {
    if(document.getElementById('map_footer')) {
        requirejs(['map_api', 'map_functions'], function () {
            displayMapFooter();
        });
    }
}

function init_map_biens() {
    if (document.getElementById("map_biens")) {
        requirejs(['map_api', 'map_functions'], function () {
            displayMapBiens();
        });
    }
}

function init_alertemail_link() {
    $('#alerte-email-link').on('click', function (event) {
        if (typeof (formName) !== 'undefined') {
            event.preventDefault();
            // On enlève le submit par ajax.
            $('form#' + formName).off('submit');
            // On passe le formulaire du listing de recherche en "post" avec l'url de la page "alerte email"
            $('form#' + formName)
                .attr('action', alerte_email_url)
                .attr('method', 'post');
            // On ajoute le token de sécurité pour le form en post normal.
            $('form#' + formName).append('<input type="hidden" name="_token" value="' + $("meta[name='_token']").attr('content') + '" />');
            // On soumet le formulaire.
            $('form#' + formName).submit();
        }
    });
}

function init_referencement() {
    if (document.getElementById("referencement") != null) {
        $('#referencement')
            .detach()
            .prependTo('#affichereferencement');
    }
}

function init_compteur_gmap() {
    var url = window.location.href;
    var params = {};
    switch (page_nom) {
        case 'contact':
            params = {
                'url': url.substring(0, url.lastIndexOf("/")),
                'page': '',
                'nbpage': '1',
                'static': '0',
                'dynamic': '1',
                'streetview': '0',
                'autocompletesession': '0',
                'autocompletecaractere': '0',
                'geocoding': '0',
                'places': '0'
            };
            break;

        case 'detail':
            params = {
                'url': url.substring(0, url.lastIndexOf("/")),
                'page': '',
                'nbpage': '1',
                'static': '0',
                'dynamic': '1',
                'streetview': '0',
                'autocompletesession': '0',
                'autocompletecaractere': '0',
                'geocoding': '0',
                'places': '1'
            };

            break;
        case 'estimation':
            params = {
                'url': url.substring(0, url.lastIndexOf("/")),
                'page': '',
                'nbpage': '1',
                'static': '0',
                'dynamic': '0',
                'streetview': '0',
                'autocompletesession': '1',
                'autocompletecaractere': '1',
                'geocoding': '0',
                'places': '1'
            };
            break;
        case (page_nom.match(/^listing/) ? page_nom : undefined):
            params = {
                'url': url.substring(0, url.lastIndexOf("/")),
                'page': '',
                'nbpage': '1',
                'static': '0',
                'dynamic': '1',
                'streetview': '0',
                'autocompletesession': '0',
                'autocompletecaractere': '0',
                'geocoding': '0',
                'places': '0'
            };
            break;
        case 'index':
        default:
            params = {
                'url': url.substring(0, url.lastIndexOf("/")),
                'page': '',
                'nbpage': '1',
                'static': '0',
                'dynamic': '1',
                'streetview': '0',
                'autocompletesession': '0',
                'autocompletecaractere': '0',
                'geocoding': '0',
                'places': '0'
            };
            break;
    }
    var dt = new Date();
    params['_t'] = dt.getTime();
    params['_s'] = '1';
    var queryString = Object.keys(params).map(function (key) {
        return key + '=' + params[key]
    }).join('&');
    var u = 'https://www.consortium-immobilier.fr/stat/gmap.php?' + queryString;

    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.defer = true;
    g.src = u;
    s.parentNode.insertBefore(g, s);
}

/* Initialisation en fonction de la page */
function initialisation() {
    // Initialise en fonction de la page courante.

    init_inline();
    initForm();
    init_place_autocomplete();
	console.log('page_nom : '+page_nom);
    switch (page_nom) {
        case 'index':
            lazy_carousel();
            ajax_favoris();
            init_referencement();
            if (typeof (index_mapagents) !== 'undefined' && index_mapagents) {
                init_map_agents();
                init_compteur_gmap();
            }
            if (typeof (index_mapfooter) !== 'undefined' && index_mapfooter) {
                init_map_footer();
                init_compteur_gmap();
            }
            if (typeof (index_mapbiens) !== 'undefined' && index_mapbiens) {
                // init_map_biens();
                init_compteur_gmap();
            }
            break;
        case 'comparateur':
            lazy_carousel();
            ajax_favoris();
            init_comparateur();
            break;
        case 'connexion':
        case 'estimation':
            init_parsley();
            init_parsley_estimation();
            init_compteur_gmap();
            //init_estimation();
            //form_estimation();
            break;

        case 'contact':
            init_parsley();
            arrow_deroule();
            if (googlemap == true) {
                init_map_agence();
                init_compteur_gmap();
            }
            break;
        case 'recrutement':
            init_parsley();
            break;
        case 'alerte-email':
            init_parsley();
            //arrow_deroule();
            //if ( googlemap == true ) {
            //	init_map_agence();
            //}
            break;
        case 'detail':
            lazy_carousel();
            ajax_favoris();
            if (typeof (detail_contact_verification) !== 'undefined' && detail_contact_verification) {
                init_parsley();
            }
            if (typeof (detail_arrow_deroule) !== 'undefined' && detail_arrow_deroule) {
                arrow_deroule();
            }
            if (typeof (detail_notab) !== 'undefined' && detail_notab) {
                init_detailnotabs();
            } else {
                init_detailtabs();
            }
            if (typeof (detail_fraisnotaire) !== 'undefined' && detail_fraisnotaire) {
                requirejs([
                    "frais_notaire"
                ], function () {
                    // init_fraisnotaire();
                });
            }
            if (typeof (detail_tablesort) !== 'undefined' && detail_tablesort) {
                init_detail_tablesort();
            }
            if (typeof (calendrier_loca_saisons) !== 'undefined' && calendrier_loca_saisons) {
                init_calendrier_loca_saisons();
            }
			if (googlemap == true) {
                init_map_agence();
            }
            //if ( typeof(detail_clickscroll) !== 'undefined' && detail_clickscroll ) {
            //	init_clickscroll();
            //}
            updateQrCode();
            break;
        case 'programme-neuf':
            lazy_carousel();
            ajax_favoris();
            if (typeof (detail_notab) !== 'undefined' && detail_notab) {
                init_detailnotabs();
            } else {
                init_detailtabs();
            }
            break;
        //case 'listing':
       //case 'listing-vente': init_maplisting(); break;
        //case 'listing-location':
        case (page_nom.match(/^listing/) ? page_nom : undefined):
            lazy_carousel();
            ajax_favoris();
            init_formsearch();
            init_listing();
            init_maplisting();
            init_alertemail_link();
            init_compteur_gmap();
            break;
        case 'recherche-detaillee':
            init_recherchedetaillee();
            init_alertemail_link();
            break;
        //case 'estimation2':
            //init_parsley_estimation();
            //init_estimation();
            //form_estimation();
            //break;
        default:
            lazy_carousel();
            break;
    }
    //	init_piwik();
    init_ajax();
    init_common();
    init_clickscroll();
    onLoadPage();
    init_map_biens();
    if(page_nom!='index' && (typeof (index_mapagents) == 'undefined' || !index_mapagents)){
        init_map_agents();
    }
    init_map_agence_footer();
}

// Carousel multi images (3 images en ligne)
//$('#recipe-multi-carousel').carousel({
//    interval: 2500
//});
//$('#carouselBienControlsproduits25').carousel({
//    interval:false
//});

$('.multi-carousel .carousel-item').each(function () {
    var next = $(this).next();
    if (!next.length) {
        next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));

    if (next.next().length > 0) {
        next.next().children(':first-child').clone().appendTo($(this));
    } else {
        $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
    }
});

$('nav .dropdown').hover(function () {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown(150);
}, function () {
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp(105)
});

Array.prototype.forEach.call(document.querySelectorAll('input.custom-file-input'), function (input) {
    var label = input.nextElementSibling;
    input.addEventListener('change', function (e) {
        var fileName = '';
        if (this.files && this.files.length > 1)
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        else
            fileName = e.target.value.split('\\').pop();

        if (fileName)
            label.innerHTML = fileName;
        else
            label.innerHTML = '';
    });
});

$('[data-target="#myModal"]').click(function () {
    $('#form-recherche-modal-content').append($('.container_search form'));
});

function copieOnPress(contenu) {
    var $textarea = $('<textarea>');
    $('body').append($textarea);
    $textarea.val(contenu).select();
    document.execCommand('copy');
    $textarea.remove();
}

/**
 *
 * @param content string
 * @param level string : primary|secondary|success|danger|warning|info|light|dark
 * @param duration : int 3000
 */
function $alert(content, level, duration) {
    var level = (typeof level !== 'undefined') ? level : 'primary';
    var duration = (typeof duration !== 'undefined') ? duration : 5000;

    var notifs = $('#notifications');
    if (!notifs.length) {
        notifs = $('<div id="notifications" class="notification">');
        $('body').prepend(notifs);
    }
    notifs.addClass('show');
    console.log(notifs);

    var notif = $(
        '<div class="alert alert-' + level + ' alert-dismissible fade show" role="alert">'
        + content
        + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
        + '<span aria-hidden="true">&times;</span> </button> </div>'
    );

    notifs.prepend(notif);
    setTimeout(function () {
        notif.remove();
    }, duration);
}

$('[scroll-to]').click(function (e) {
    e.preventDefault();
    $scroll($(this).attr('scroll-to'), $(this).attr('scroll-below'));
});

function $scroll(to, below) {
    var top = $(to).offset().top;
    var sb = document.querySelector(below);
    if (sb !== undefined && sb !== null) {
        top = top - (sb.offsetTop + sb.offsetHeight);
    }
    $('html, body').animate({scrollTop: top}, 750);
}

function initForm() {
    if (typeof recaptchaLoad == 'undefined' || typeof arguments[0] != 'undefined') {
        var theForms = getTheForm();
        if (theForms && theForms.length > 0) {
            theForms.each(function (index, elem) {
                elem = $(elem);
                if (elem.find('.g-recaptcha').length === 0) {
                    var div = $('<div></div>')
                        .addClass('g-recaptcha')
                        .attr('data-sitekey', recaptcha_public_key)
                        .attr('data-callback', 'onSubmit')
                        .attr('data-size', 'invisible')
                    ;
                    elem.append($(div));
                    elem.find('[type=submit]')
                        .attr('type', 'button')
                        .removeAttr('name')
                        .addClass('gRecapSubmit')
                        .on('click', function () {
                            if (elem.parsley().validate()) {
                                $('.form-recaptcha-submit').removeClass('form-recaptcha-submit');
                                elem.addClass('form-recaptcha-submit');
                                grecaptcha.execute();
                            }
                        });
                }
            });
            requirejs(['grecaptcha'], function () {

            });
        }
    }
}

function getTheForm() {
    if (typeof recaptcha != 'undefined' && typeof recaptcha.ids_form != 'undefined' && recaptcha.ids_form.length > 0) {
        return $('#' + recaptcha.ids_form.join(',#'));
    }
    return null;
}

function onSubmit(token) {
    var form = $('.form-recaptcha-submit');
    form.find('.g-recaptcha [name=g-recaptcha-response]').val(token);
    form.submit();
}

$(window).on('popstate', function (e) {
    var state = e.originalEvent.state;

    if ($('form.formSearch').length > 0) {
        if (state != null && state !== '') {
            if (typeof widget_url != 'undefined') {
                $.ajax({
                    url: widget_url,
                    type: 'POST',
                    data: state['postData'],
                    beforeSend: function (request) {
                        return request.setRequestHeader('X-CSRF-Token', $("meta[name='_token']").attr('content'));
                    },
                    dataType: "json",
                    success: success_formsearch
                });
            }
        } else if (window.location.href.indexOf('?')) {
            window.location.replace(window.location.href);
        }
    }
});
$(function () {
    $('body').on('keypress keydown keyup', '.bootstrap-select .bs-searchbox input[type=text]', function () {
        $(this).parents('.bootstrap-select.open').removeClass('open');
    });
});

function init_map_agence_footer() {
    if (document.getElementById("map_agence_footer")) {
        requirejs([
            'map_api',
            'map_functions'
        ], function () {
            displayMapAgence(document.getElementById('map_agence_footer'));
        });
    }
}

var lazyloadThrottleTimeout;
var lazyReferenceEl = typeof lazyReference != 'undefined' && $(lazyReference).length > 0 ? $(lazyReference) : null;
var lazyReferenceOn = lazyReferenceEl && lazyReferenceEl[0].scrollHeight > lazyReferenceEl[0].clientHeight;
function lazyload() {
    if (lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
    }

    var lazyloadImages = document.querySelectorAll("img.lazy");
    lazyloadThrottleTimeout = setTimeout(function () {
        var scrollTop = window.pageYOffset === 0 && lazyReferenceEl ? lazyReferenceEl.scrollTop() : window.pageYOffset;
        for(var i=0;i<lazyloadImages.length;i++){
            if ($(lazyloadImages[i]).offset().top < (window.innerHeight + scrollTop + 100)) {
                if (typeof lazyloadImages[i].dataset.src !== 'undefined') {
                    lazyloadImages[i].src = lazyloadImages[i].dataset.src;
                    if(typeof lazyloadImages[i].dataset.srcset !== 'undefined'){
                        lazyloadImages[i].srcset = lazyloadImages[i].dataset.srcset;
                        lazyloadImages[i].removeAttribute('data-srcset');
                    }
                    lazyloadImages[i].classList.remove('lazy');
                    lazyloadImages[i].removeAttribute('data-src');
                }
            }
        }
        lazyloadImages = document.querySelectorAll("img.lazy");
        if (!page_nom.match(/^listing/) && lazyloadImages.length === 0) {
            lazyReferenceOn ? lazyReferenceEl.off('scroll', lazyload) : document.removeEventListener("scroll", lazyload);
            window.removeEventListener("resize", lazyload);
            window.removeEventListener("orientationChange", lazyload);
        }
    }, 20);
}
document.addEventListener("DOMContentLoaded", function () {
    lazyReferenceOn ? lazyReferenceEl.on('scroll',lazyload):document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
    setTimeout(function(){lazyload();},250);
});
function onLoadPage(){}

//Tri pour page adminperso
function trierpar(){
    var tri=document.getElementById('select_tri').value;
    window.location.href = "?tri="+tri;
}

// map window on marker
$(function(){

	$(document).on({
		mouseenter: function () {
		 $(this).click();
		 
		}
		 
		
	}, "img.leaflet-marker-icon.leaflet-custom-marker.leaflet-zoom-animated.leaflet-interactive" );
	
	 
	
});




