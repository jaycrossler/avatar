//--------------------------------------------
// Library of commonly used generic functions.
//--------------------------------------------

var Helpers = Helpers || {};
Helpers.between = function (s, prefix, suffix, suffixAtEnd, prefixAtEnd) {
    if (!s.lastIndexOf || !s.indexOf) {
        return s;
    }
    var i = prefixAtEnd ? s.lastIndexOf(prefix) : s.indexOf(prefix);
    if (i >= 0) {
        s = s.substring(i + prefix.length);
    }
    else {
        return '';
    }
    if (suffix) {
        i = suffixAtEnd ? s.lastIndexOf(suffix) : s.indexOf(suffix);
        if (i >= 0) {
            s = s.substring(0, i);
        }
        else {
            return '';
        }
    }
    return s;
};

Helpers.randomSetSeed = function (seed) {
    Helpers._randseed = seed || 42;
};
Helpers.random = function () {
    Helpers._randseed = Helpers._randseed || 42;
    var x = Math.sin(Helpers._randseed++) * 10000;
    return x - Math.floor(x);
};
Helpers.randInt = function (max) {
    max = max || 100;
    return parseInt(Helpers.random() * max + 1);
};
Helpers.randOption = function (options) {
    var len = options.length;
    return options[Helpers.randInt(len) - 1];
};

Helpers.dateFromPythonDate = function (date, defaultVal) {
    //Requires moment.js

    if (date == 'None') date = undefined;
    if (date == null) date = undefined;
    if (date == '') date = undefined;

    var output = defaultVal;
    if (date) {
        date = date.replace(/p.m./, 'pm');
        date = date.replace(/a.m./, 'am');
        date = date.replace(/\. /, " ");
        //TODO: Get to work with Zulu times
        output = moment(date);
    }
    if (output && output.isValid && !output.isValid()) output = defaultVal || moment();
    return output;
};

Helpers.knownFileExt = function (ext) {
    var exts = ",3gp,7z,ace,ai,aif,aiff,amr,asf,aspx,asx,bat,bin,bmp,bup,cab,cbr,cda,cdl,cdr,chm,dat,divx,dll,dmg,doc,docx,dss,dvf,dwg,eml,eps,exe,fla,flv,gif,gz,hqx,htm,html,ifo,indd,iso,jar,jp2,jpeg,jpg,kml,kmz,lnk,log,m4a,m4b,m4p,m4v,mcd,mdb,mid,mov,mp2,mp4,mpeg,mpg,msi,mswmm,ogg,pdf,png,pps,ppt,pptx,ps,psd,pst,ptb,pub,qbb,qbw,qxd,ram,rar,rm,rmvb,rtf,sea,ses,sit,sitx,ss,swf,tgz,thm,tif,tmp,torrent,ttf,txt,vcd,vob,wav,wma,wmv,wps,xls,xpi,zip,";
    return (exts.indexOf("," + ext + ",") > -1);
};

Helpers.thousandsFormatter = function (num) {
    return num > 999 ? (num / 1000).toFixed(1) + 'k' : num;
};
Helpers.invertColor = function (hexTripletColor) {
    var color = hexTripletColor;
    color = color.substring(1);           // remove #
    color = parseInt(color, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    color = color.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color;                  // prepend #
    return color;
};
Helpers.rgb2hex = function (rgb) {
    if (typeof rgb != "string") return rgb;
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    if (rgb && rgb.search("rgb") == -1) {
        rgb = rgb.split(',');
        if (rgb.length >= 3) {
            return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
        }
        return rgb;
    } else if (rgb) {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    } else {
        return rgb;
    }
};
Helpers.getRGBComponents = function (color) {
    var r = color.substring(1, 3),
        g = color.substring(3, 5),
        b = color.substring(5, 7);
    return {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
    };
};
Helpers.idealTextColor = function (bgColor) {
    if (bgColor.length === 4) {
        bgColor = '#' + bgColor[1] + bgColor[1] + bgColor[2] + bgColor[2] + bgColor[3] + bgColor;
    }
    var nThreshold = 105,
        components = Helpers.getRGBComponents(bgColor),
        bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
};
Helpers.getColorWithBackground = function (bg_color, useInvertedInsteadOfBlackWhite) {
    var color = Helpers.rgb2hex(bg_color);
    var overColor = useInvertedInsteadOfBlackWhite ? Helpers.invertColor(color) : Helpers.idealTextColor('#' + color);
    return overColor;
};

Helpers.getQueryString = function () {
    var result = {}, queryString = location.search.substring(1),
        re = /([^&=]+)=([^&]*)/g, m;
    while (m = re.exec(queryString)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    return result;
};
Helpers.exists = function () {
    //Check if variables exist
    var allExist = true;
    for (var i = 0; i < arguments.length; i++) {
        //TODO: Should it check for null as well?
        if (typeof arguments[i] == "undefined") {
            allExist = false;
            break;
        }
    }
    return allExist;
};
Helpers.upperCase = function (input, eachword) {
    if (typeof input == "undefined") return;

    if (eachword) {
        return input.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    } else {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }
};
Helpers.MakeSureClassExists = function (pointer) {
    //usage: HelperFunctions.MakeSureClassExists('Settings.data');

    var classArr = pointer.split(".");

    var newClass = {};

    if (classArr.length && classArr.length > 0) {
        //It's a multiple-level class

        var rootClass = classArr[0];
        if (window[rootClass]) {
            newClass = window[rootClass];
        } else {
            eval(rootClass + ' = {}');
        }

        var classEval = rootClass;
        for (var i = 1; i < classArr.length; i++) {
            //Loop through everything beyond the first level and make sub objects
            classEval += "['" + classArr[i] + "']";
            if (eval("typeof " + classEval) == 'undefined') {
                eval(classEval + " = {}")
            }
        }
    }
};
Helpers.dateCameBefore = function (dateToCheck) {
    var isADate = false;
    var result = false;
    if (dateToCheck && dateToCheck.isValid) {
        isADate = true;
    } else {
        dateToCheck = moment(dateToCheck);
    }
    if (dateToCheck && dateToCheck.isValid && dateToCheck.isValid()) {
        var now = moment();
        var timeDiff = now.diff(dateToCheck);
        if (timeDiff > 0) result = true;
    } else {
        result = "Invalid Date";
    }
    return result;
};
Helpers.buildBootstrapDropdown = function (title, items) {
    var $group = $("<span class='btn-group'>");
    $("<a class='btn dropdown-toggle btn-mini' data-toggle='dropdown' href='#'>" + title + "<span class='caret'></span></a>")
        .appendTo($group);
    var $ul = $("<ul class='dropdown-menu'>")
        .appendTo($group);
    _.each(items, function (dd) {
        var $li = $("<li>").appendTo($ul);
        var $a = $("<a>")
            .attr({target: '_blank', alt: (dd.alt || dd.name || "")})
            .text(dd.title || "Item")
            .appendTo($li);
        if (dd.url) {
            $a.attr({href: dd.href});
        }
        if (dd.onclick) {
            $a.on('click', dd.onclick);
        }
    });
    return $group;
};
Helpers.buildBootstrapInputDropdown = function (title, items, $input) {
    var $group = $("<span class='input-append btn-group'>");
    var $group_holder = $("<a class='btn dropdown-toggle btn-mini' data-toggle='dropdown' href='#'>")
        .css({float: "none"})
        .appendTo($group);
    var $group_title = $("<span>")
        .text(title)
        .appendTo($group_holder);
    $("<span>")
        .addClass('caret')
        .appendTo($group_holder);

    var $ul = $("<ul class='dropdown-menu'>")
        .appendTo($group);
    _.each(items, function (dd) {
        var $li = $("<li>").appendTo($ul);
        var $a = $("<a>")
            .attr({alt: (dd.alt || dd.name || "")})
            .attr({href: "#"})
            .on('click', function () {
                var value = $(this).text();
                $input.val(value);
                $group_title.text(value);
            })
            .appendTo($li);
        if (dd.imgSrc) {
            $("<img>")
                .attr({src: dd.imgSrc})
                .appendTo($a);
        }
        $('<span>')
            .text(dd.title || "Item")
            .appendTo($a);
    });
    return $group;
};
Helpers.tryToMakeDate = function (val, fieldName) {
    var returnVal;
    var name = (fieldName && fieldName.toLowerCase) ? fieldName.toLowerCase() : "";

    if (name && (name == "date" || name == "created" || name == "updated" || name == "datetime")) {
        var testDate = moment(val);
        if (testDate.isValid()) {
            returnVal = val + " <b>(" + testDate.calendar() + ")</b>";
        }
    }
    return (returnVal || val);
};
Helpers.randomLetters = function (n) {
    var out = "";
    n = n || 1;
    for (var i = 0; i < n; i++) {
        out += String.fromCharCode("a".charCodeAt(0) + (Math.random() * 26) - 1)
    }
    return out;
};
Helpers.pluralize = function (str) {
    var uncountable_words = [
        'equipment', 'information', 'rice', 'money', 'species', 'series',
        'fish', 'sheep', 'moose', 'deer', 'news'
    ];
    var plural_rules = [
        [new RegExp('(m)an$', 'gi'), '$1en'],
        [new RegExp('(pe)rson$', 'gi'), '$1ople'],
        [new RegExp('(child)$', 'gi'), '$1ren'],
        [new RegExp('^(ox)$', 'gi'), '$1en'],
        [new RegExp('(ax|test)is$', 'gi'), '$1es'],
        [new RegExp('(octop|vir)us$', 'gi'), '$1i'],
        [new RegExp('(alias|status)$', 'gi'), '$1es'],
        [new RegExp('(bu)s$', 'gi'), '$1ses'],
        [new RegExp('(buffal|tomat|potat)o$', 'gi'), '$1oes'],
        [new RegExp('([ti])um$', 'gi'), '$1a'],
        [new RegExp('sis$', 'gi'), 'ses'],
        [new RegExp('(?:([^f])fe|([lr])f)$', 'gi'), '$1$2ves'],
        [new RegExp('(hive)$', 'gi'), '$1s'],
        [new RegExp('([^aeiouy]|qu)y$', 'gi'), '$1ies'],
        [new RegExp('(x|ch|ss|sh)$', 'gi'), '$1es'],
        [new RegExp('(matr|vert|ind)ix|ex$', 'gi'), '$1ices'],
        [new RegExp('([m|l])ouse$', 'gi'), '$1ice'],
        [new RegExp('(quiz)$', 'gi'), '$1zes'],
        [new RegExp('s$', 'gi'), 's'],
        [new RegExp('$', 'gi'), 's']
    ];
    var ignore = _.indexOf(uncountable_words, str.toLowerCase()) > -1;
    if (!ignore) {
        for (var x = 0; x < plural_rules.length; x++) {
            if (str.match(plural_rules[x][0])) {
                str = str.replace(plural_rules[x][0], plural_rules[x][1]);
                break;
            }
        }
    }
    return str;
};
Helpers.stringAfterString = function (string, after, valIfNotFound) {
    var inLoc = string.indexOf(after);
    if (Helpers.exists(inLoc) && inLoc > -1) {
        return string.substr(inLoc + after.length);
    } else {
        return valIfNotFound || string;
    }
};
Helpers.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
Helpers.nameOfUSState = function (code, withComma) {
    var lookup = {AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'};
    var state = lookup[code.toUpperCase()];
    var output = "";
    if (state) output = withComma ? ", " + state : state;
    return output;
};
Helpers.getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var output = query;
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            output = pair[1];
            break;
        }
    }
    return output;
};
Helpers.createCSSClass = function (selector, style) {
//FROM: http://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
    if (!document.styleSheets) {
        return;
    }

    if (document.getElementsByTagName("head").length == 0) {
        return;
    }

    var styleSheet;
    var mediaType;
    var media;
    if (document.styleSheets.length > 0) {
        for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].disabled) {
                continue;
            }
            media = document.styleSheets[i].media;
            mediaType = typeof media;

            if (mediaType == "string") {
                if (media == "" || (media.indexOf("screen") != -1)) {
                    styleSheet = document.styleSheets[i];
                }
            } else if (mediaType == "object" && media.mediaText) {
                if (media.mediaText == "" || (media.mediaText.indexOf("screen") != -1)) {
                    styleSheet = document.styleSheets[i];
                }
            }

            if (Helpers.exists(styleSheet)) {
                break;
            }
        }
    }

    if (Helpers.exists(styleSheet)) {
        var styleSheetElement = document.createElement("style");
        styleSheetElement.type = "text/css";

        document.getElementsByTagName("head")[0].appendChild(styleSheetElement);

        for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].disabled) {
                continue;
            }
            styleSheet = document.styleSheets[i];
        }

        media = styleSheet.media;
        mediaType = typeof media;
    }

    var i;
    if (mediaType == "string") {
        for (i = 0; i < styleSheet.rules.length; i++) {
            if (styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.rules[i].style.cssText = style;
                return;
            }
        }
        styleSheet.addRule(selector, style);
    } else if (mediaType == "object") {
        for (i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.cssRules[i].style.cssText = style;
                return;
            }
        }
        styleSheet.insertRule(selector + "{" + style + "}", 0);
    }
};
Helpers.loadCSSFiles = function (cssArray) {
    if (typeof(cssArray) == 'string') cssArray = [cssArray];
    if (!_.isArray(cssArray)) cssArray = [];

    for (var c = 0; c < cssArray.length; c++) {
        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", cssArray[c]);
        document.getElementsByTagName("head")[0].appendChild(link);
    }
};
Helpers.directoryOfPage = function (url) {
    url = url || document.location.href;
    var lio = url.lastIndexOf("/");
    return url.substr(0, lio + 1);
};
Helpers.randomcolor = function (brightness) {
    if (!Helpers.exists(brightness)) return '#' + Math.floor(Math.random() * 16777215).toString(16);

    //6 levels of brightness from 0 to 5, 0 being the darkest
    var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
    var mixed_rgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) {
        return Math.round(x / 2.0)
    });
    return "rgb(" + mixed_rgb.join(",") + ")";
};
Helpers.randRange = function (minVal, maxVal, floatVal) {
    //From: JSEDI
    //optional Floatval specifies number of decimal points
    var randVal = minVal + (Math.random() * (maxVal - minVal + 1));
    return (Helpers.exists(floatVal)) ? Math.round(randVal - .5) : randVal.toFixed(floatVal);
};
Helpers.round = function (num, dec) {
    return (Math.round(num * (Math.pow(10, dec))) / Math.pow(10, dec));
};
Helpers.hexFromDec = function (decimal) {
    var code = Math.round(decimal).toString(16);
    (code.length > 1) || (code = '0' + code);
    return code;
};
Helpers.randomcolor_basedon = function (colorrgb) {
    colorrgb = colorrgb || "#505050";
    if (colorrgb.indexOf("#") == 0) colorrgb = colorrgb.substr(1);
    if (colorrgb.length && colorrgb.length == 3)
        colorrgb = colorrgb.substr(0, 1) + "0" + colorrgb.substr(1, 1) + "0" + colorrgb.substr(2, 1) + "0";
    var r = parseInt(colorrgb.substr(0, 2), 16);
    var g = parseInt(colorrgb.substr(2, 2), 16);
    var b = parseInt(colorrgb.substr(4, 2), 16);
    var range = 16;
    r = Helpers.hexFromDec(r + Helpers.randRange(0, range) - (range / 2));
    g = Helpers.hexFromDec(g + Helpers.math.randRange(0, range) - (range / 2));
    b = Helpers.hexFromDec(b + Helpers.math.randRange(0, range) - (range / 2));
    return "#" + r + g + b;
};
Helpers.color_transparency = function (colorrgb, trans) {
    colorrgb = colorrgb || "#505050";
    if (colorrgb.indexOf("#") == 0) colorrgb = colorrgb.substr(1);
    if (colorrgb.length && colorrgb.length == 3)
        colorrgb = colorrgb.substr(0, 1) + "0" + colorrgb.substr(1, 1) + "0" + colorrgb.substr(2, 1) + "0";
    var r = parseInt(colorrgb.substr(0, 2), 16);
    var g = parseInt(colorrgb.substr(2, 2), 16);
    var b = parseInt(colorrgb.substr(4, 2), 16);
    return "rgba(" + r + "," + g + "," + b + "," + trans + ")";
};

Helpers.steppedGYR = function (percentage) {
    percentage = percentage || 0;
    var ret;
    if (percentage <= .5) {
        ret = Helpers.blendColors("#00ff00", '#ffff00', percentage * 2);
    } else {
        ret = Helpers.blendColors('#ffff00', "#ff0000", (percentage - .5) * 2);
    }
    return ret;
};
Helpers.blendColors = function (c1, c2, percentage) {
    if (typeof Colors == 'undefined') {
        throw "Requires colors.min.js library";
    }
    if (!c1 || !c2) return c1;

    c1 = (c1.indexOf('#') == 0) ? c1 = Colors.hex2rgb(c1) : Colors.name2rgb(c1);
    c2 = (c2.indexOf('#') == 0) ? c2 = Colors.hex2rgb(c2) : Colors.name2rgb(c2);

    var rDiff = (c2.R - c1.R) * percentage;
    var gDiff = (c2.G - c1.G) * percentage;
    var bDiff = (c2.B - c1.B) * percentage;


    var result = Colors.rgb2hex(parseInt(c1.R + rDiff), parseInt(c1.G + gDiff), parseInt(c1.B + bDiff));
    if (result.indexOf('#') != 0) {
        result = c1;
    }
    return result;
};
Helpers.bw = function (color) {
//r must be an rgb color array of 3 integers between 0 and 255.
    if (typeof Colors == 'undefined') {
        throw "Requires colors.min.js library";
    }

    var r = Colors.hex2rgb(color).a;

    var contrast = function (B, F) {
        var abs = Math.abs,
            BG = (B[0] * 299 + B[1] * 587 + B[2] * 114) / 1000,
            FG = (F[0] * 299 + F[1] * 587 + F[2] * 114) / 1000,
            bright = Math.round(Math.abs(BG - FG)),
            diff = abs(B[0] - F[0]) + abs(B[1] - F[1]) + abs(B[2] - F[2]);
        return [bright, diff];
    };
    var c, w = [255, 255, 255], b = [0, 0, 0];
    if (r[1] > 200 && (r[0] + r[2]) < 50) c = b;
    else {
        var bc = contrast(b, r);
        var wc = contrast(w, r);
        if ((bc[0] * 4 + bc[1]) > (wc[0] * 4 + wc[1])) c = b;
        else if ((wc[0] * 4 + wc[1]) > (bc[0] * 4 + bc[1])) c = w;
        else c = (bc[0] < wc[0]) ? w : b;
    }
    return 'rgb(' + c.join(',') + ')';
};
Helpers.removeMobileAddressBar = function (doItNow) {
    function fixSize() {
        // Get rid of address bar on iphone/ipod
        window.scrollTo(0, 0);
        document.body.style.height = '100%';
        if (!(/(iphone|ipod)/.test(navigator.userAgent.toLowerCase()))) {
            if (document.body.parentNode) {
                document.body.parentNode.style.height = '100%';
            }
        }
    }

    if (doItNow) {
        fixSize();
    } else {
        setTimeout(fixSize, 700);
        setTimeout(fixSize, 1500);
    }
};

Helpers.orientationInfo = function (x, y) {
    x = x || $(window).width();
    y = y || $(window).height();
    var layout = (x > y) ? 'horizontal' : 'vertical';

    return {layout: layout, ratio: x / y};
};
Helpers.dots = function (num) {
    var output = "";
    for (var i = 0; i < num; i++) {
        if (i % 5 == 0) output += " ";
        output += "&#149;";
    }
    if (num == 0) {
        output = "0";
    }
    return output;
};
Helpers.isIOS = function () {
    navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/);
};
Helpers.exists = function () {
    //Check if variables exist
    var allExist = true;
    for (var i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == "undefined") {
            allExist = false;
            break;
        }
    }
    return allExist;
};
Helpers.distanceXY = function (p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
};
Helpers.isInArray = function (searchFor, searchIn, ignoreCase) {
    if (!Helpers.exists(searchFor) || !Helpers.exists(searchIn)) return false;
    if (!Helpers.isArray(searchFor)) searchFor = [searchFor];
    if (!Helpers.isArray(searchIn)) searchIn = [searchIn];
    var found = false;
    for (var i = 0; i < searchFor.length; i++) {
        for (var j = 0; j < searchIn.length; j++) {
            var s_f = searchFor[i];
            var s_i = searchIn[j];
            if (ignoreCase && typeof s_f == 'string' && typeof s_i == 'string') {
                if (s_f.toLowerCase() == s_i.toLowerCase()) {
                    found = true;
                    break;
                }
            } else {
                if (s_f == s_i) {
                    found = true;
                    break;
                }
            }
        }
    }
    return found;
};


(function ($) {
    // eventType - "click", "mouseover" etc.
    // destination - either jQuery object, dom element or selector
    // clearCurrent - if true it will clear current handlers at destination - default false
    $.fn.copyEventTo = function (eventType, destination, clearCurrent) {
        var events = [];
        this.each(function () {
            var allEvents = jQuery._data(this, "events");
            if (typeof allEvents === "object") {
                var thoseEvents = allEvents[eventType];
                if (typeof thoseEvents === "object") {
                    for (var i = 0; i < thoseEvents.length; i++) {
                        events.push(allEvents[eventType][i].handler);
                    }
                }
            }
        });
        if (typeof destination === "string") {
            destination = $(destination);
        } else if (typeof destination === "object") {
            if (typeof destination.tagName === "string") {
                destination = $(destination);
            }
        }
        if (clearCurrent === true) destination.off(eventType);
        destination.each(function () {
            for (var i = 0; i < events.length; i++) {
                destination.bind(eventType, events[i]);
            }
        });
        return this;
    }

})(jQuery);

(function(){

  if ("performance" in window == false) {
      window.performance = {};
  }

  Date.now = (Date.now || function () {  // thanks IE8
	  return new Date().getTime();
  });

  if ("now" in window.performance == false){

    var nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
  }

})();