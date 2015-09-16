var Avatar = (function ($, _, net, createjs, Helpers, maths) {
    //Uses jquery and Underscore and colors.js and createjs's easel.js

    //TODO: Have a skull-width and jaw-width, and then combine this with thickness to determine face type
    //TODO: Use age, thickness, and musculature to determine which muscles/lines to draw

    //TODO: Add oval decoration
    //TODO: Add descendant page with Procyon

    //TODO: Have a builder function to standardize and make reusable
    //TODO: Generate points for each important face zone, generate all these first before rendering

    //TODO: Hair Peak have multiple shapes, apply more than one peak
    //TODO: More Hair and Beard Options
    //TODO: Scars and Jewelery
    //TODO: Sag wrinkles when older
    //TODO: Sprite images
    //TODO: Emotions
    //TODO: Moving eyes with border around them
    //TODO: Outfits and standing avatar
    //TODO: Check big noses don't go over eyes

    //TODO: Three levels of cheek curves
    //TODO: Multiline function has shadow, offset shadow
    //TODO: Add in many eyebrows, overdraw with a canvas brush for bushiness
    //TODO: Eyes get eyelashes


    //-----------------------------
    //Private Global variables
    var VERSION = '0.0.6',
        summary = 'Drawing procedurally rendered people on HTML5 canvas.',
        author = 'Jay Crossler - http://github.com/jaycrossler',
        file_name = 'avatar.js';

    var _face_options = {
        style: 'lines',
        race: 'Human',
        rand_seed: 0,

        //'Living' settings that can change over time
        age: 30,
        era: 'Industrial',
        thickness: 0,
        cleanliness: 0,
        hair_style: null,
        hair_color: null,
        beard_color: null,
        beard_style: null,
        mustache_style: null,
        mustache_width: null,
        mustache_height: null,
        skin_texture: 'Normal',
        teeth_condition: 'Normal',
        lip_color: null,

        emotionality: 0,
        emotion_shown: 'none', //TODO: Have an array of current emotions?
        tattoos: [],
        jewelry: [],
        scars: [],

        //DNA settings that don't change easily
        gender: null,
        height: 0,

        skin_shade_tint: null,
        skin_shade: null,
        skin_colors: null,
        face_shape: null,
        skull_thickness: 'Normal',
        chin_divot: null,
        chin_shape: null,

        neck_size: null,

        eye_color: null,
        eye_shape: null,
        eye_spacing: null,
        eye_rotation: null,
        eyelid_shape: null,
        eye_cloudiness: null,
        eyebrow_shape: null,
        pupil_color: null,

        hair_texture: 'Smooth',
        head_size: 'Normal',
        hairiness: null,
        forehead_height: null,
        hair_color_roots: null,

        nose_shape: null,
        nose_size: null,
        nose_height: null,

        teeth_shape: 'Normal',
        lip_shape: null,
        mouth_height: null,
        mouth_left_upturn: null,
        mouth_right_upturn: null,
        mouth_width: null,
        mouth_upturn: null,
        mouth_downturn: null,
        lip_bottom_height: null,
        lip_top_height: null,
        lip_bottom_bottom: null,
        lip_top_top: null,

        ear_shape: null,
        ear_thickness: null,
        ear_lobe_left: null,
        ear_lobe_right: null,

        wrinkle_pattern_mouth: null,
        wrinkle_mouth_width: null,
        wrinkle_mouth_height: null,
        wrinkle_resistance: null

    };
    var _stage_options = {
        percent_height: 1,
        buffer: 0.1,
        x: 0,
        y: 0
    };
    var STAGES = []; //Global list of all stages used to lookup any existing ones

    //-----------------------------
    var _data = {'Human': {
        rendering_order: [
            {decoration:"box-behind"},
            {feature: "shoulders", style: "lines"},
            {feature: "neck", style: "lines"},
            {feature: "face", style: "lines"},
            {feature: "eye_position", style: "lines"},
            {feature: "nose", style: "lines"}, //Uses: right eye intermost
            {feature: "chin", style: "lines"}, //Uses: chin mid line, face
            {feature: "mouth", style: "lines"}, //NOTE: Shown twice to predraw positions
            {feature: "wrinkles", style: "lines"}, //Uses: face, left eye, right eye, lips, full nose, chin top line
            {feature: "beard", style: "lines"}, //Uses: face, left eye
            {feature: "mouth", style: "lines"},
            {feature: "eyes", style: "lines"},
            {feature: "hair", style: "lines"}, //Uses: face, left eye
            {feature: "ears", style: "lines"},
            {decoration: "name-plate"}
        ],

        //If Preset, then use one of the skin_color_options and change tint, otherwise calculate by tint and lightness
        skin_shade_options: "Light,Dark,Preset".split(","),
        skin_shade_tint_options: "Darkest,Darker,Dark,Very Low,Low,Less,Below,Reduce,Raised,Above,More,High,Very High,Bright,Brighter,Brightest".split(","),
        skin_colors_options: [
            {name: 'Fair', highlights: 'rgb(254,202,182)', skin: 'rgb(245,185,158)', cheek: 'rgb(246,171,142)', darkflesh: 'rgb(217,118,76)', deepshadow: 'rgb(202,168,110'},
            {name: 'Brown', highlights: 'rgb(229,144,90)', skin: 'rgb(228,131,86)', cheek: ' rgb(178,85,44)', darkflesh: 'rgb(143,70,29)', deepshadow: 'rgb(152,57,17'},
            {name: 'Tanned', highlights: 'rgb(245,194,151)', skin: 'rgb(234,154,95)', cheek: 'rgb(208,110,56)', darkflesh: 'rgb(168,66,17)', deepshadow: 'rgb(147,68,27'},
            {name: 'White', highlights: 'rgb(250,220,196)', skin: 'rgb(245,187,149)', cheek: 'rgb(239,165,128)', darkflesh: 'rgb(203,137,103)', deepshadow: 'rgb(168,102,68'},
            {name: 'Medium', highlights: 'rgb(247,188,154)', skin: 'rgb(243,160,120)', cheek: 'rgb(213,114,75)', darkflesh: 'rgb(154,79,48)', deepshadow: 'rgb(127,67,41'},
            {name: 'Yellow', highlights: 'rgb(255,218,179)', skin: 'rgb(250,187,134)', cheek: 'rgb(244,159,104)', darkflesh: 'rgb(189,110,46)', deepshadow: 'rgb(138,67,3'},
            {name: 'Pink', highlights: 'rgb(253,196,179)', skin: 'rgb(245,158,113)', cheek: 'rgb(236,134,86)', darkflesh: 'rgb(182,88,34)', deepshadow: 'rgb(143,60,18'},
            {name: 'Bronzed', highlights: 'rgb(236,162,113)', skin: 'rgb(233,132,86)', cheek: 'rgb(219,116,75)', darkflesh: 'rgb(205,110,66)', deepshadow: 'rgb(173,83,46'},
            {name: 'Light Brown', highlights: 'rgb(242,207,175)', skin: 'rgb(215,159,102)', cheek: 'rgb(208,138,86)', darkflesh: 'rgb(195,134,80)', deepshadow: 'rgb(168,112,63'},
            {name: 'Peach', highlights: 'rgb(247,168,137)', skin: 'rgb(221,132,98)', cheek: 'rgb(183,90,57)', darkflesh: 'rgb(165,87,51)', deepshadow: 'rgb(105,29,15'},
            {name: 'Black', highlights: 'rgb(140,120,110)', skin: 'rgb(160,90,66)', cheek: 'rgb(140,80,40)', darkflesh: 'rgb(120,90,29)', deepshadow: 'rgb(30,30,30'},
            {name: 'Deep Black', highlights: 'rgb(40,40,50)', skin: 'rgb(80,80,80)', cheek: 'rgb(70,70,70)', darkflesh: 'rgb(80,70,29)', deepshadow: 'rgb(30,30,30'}
        ],

        gender_options: "Male,Female".split(","),
        thickness_options: [-1.5, -1, -.5, 0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6],  //TODO: Turn these to word options

        face_shape_options: "Oblong,Oval,Round,Rectangular,Square,Triangular,Diamond,Inverted Triangle,Heart".split(","),
        chin_divot_options: "Double,Small,Large,Smooth".split(","),
        chin_shape_options: "Pronounced,Smooth".split(","),

        hair_color_roots_options: "Yellow,Brown,Black,White,Gray,Dark Brown,Dark Yellow,Red".split(","),
        hair_style_options: "Bald,Bowl,Bowl with Peak,Bowl with Big Peak".split(","),
        hairiness_options: "Bald,Thin Hair,Thick Hair,Hairy,Fuzzy,Bearded,Covered in Hair,Fury".split(","), //TODO

//        beard_color_options: "Hair,Yellow,Brown,Black,White,Gray,Dark Brown,Dark Yellow,Red".split(","),
        beard_style_options: "None,Full Chin,Chin Warmer,Soup Catcher,Thin Chin Wrap,Thin Low Chin Wrap".split(","),
        mustache_style_options: "None,Propeller,Butterfly,Fu Manchu,Lower Dali,Dali,Sparrow,Zappa,Anchor,Copstash,Handlebar,Low Handlebar,Long Curled Handlebar,Curled Handlebar".split(","),
        mustache_width_options: "Small,Short,Medium,Long,Large".split(","),
        mustache_height_options: "Small,Short,Medium,Long,Large".split(","),
        neck_size_options: "Thick,Concave".split(","),

        nose_shape_options: "Flat,Wide,Thin,Turned up/perky,Normal,Hooked down,Bulbous,Giant Nostrils".split(","),
        nose_size_options: "Tiny,Small,Normal,Large,Big,Giant,Huge".split(","),
        nose_height_options: "Low,Normal,Raised".split(","),

        eye_spacing_options: "Squeezed,Pinched,Thin,Normal,Wide".split(","),
        eye_size_options: "Small,Normal,Big".split(","),
        eye_shape_options: "Almond".split(","),
        eye_color_options: "Hazel,Amber,Green,Blue,Gray,Brown,Dark Brown,Black".split(","),
        eye_lids_options: "None,Smooth,Folded,Thick".split(","), //TODO
        eye_cloudiness_options: "Normal,Clear,Misty".split(","),
        eyebrow_shape_options: "Straight,Squiggle,Squiggle Flip,Slim,Lifted,Arch,Thick Arch,Caterpiller,Wide Caterpiller".split(","),
        eye_rotation_options: "Flat,Small,Medium,Large,Slanted".split(","),
        pupil_color_options: "Black".split(","),

        ear_shape_options: "Round".split(","),
        ear_thickness_options: "Wide,Normal,Big,Tall,Splayed".split(","),
        ear_lobe_left_options: "Hanging,Attached".split(","),
        ear_lobe_right_options: "Hanging,Attached,Same".split(","),

        mouth_height_options: "Low,Normal,Raised,High".split(","),
        mouth_left_upturn_options: "Down,Low,Normal,Raised,High".split(","),
        mouth_right_upturn_options: "Down,Low,Normal,Raised,High".split(","),
        mouth_width_options: "Wide,Big,Normal,Short,Small,Tiny".split(","),
        mouth_upturn_options: "Large,Short,Small,Tiny".split(","),
        mouth_downturn_options: "Large,Short,Small,Tiny".split(","),

        lip_color_options: "#f00,#e00,#d00,#c00,#f10,#f01,#b22,#944".split(","),
        lip_bottom_height_options: "Down,Low,Normal,Raised,High".split(","),
        lip_top_height_options: "Down,Low,Normal,Raised,High".split(","),
        lip_bottom_bottom_options: "Down,Low,Normal,Raised,High".split(","),
        lip_top_top_options: "Down,Low,Normal,Raised,High".split(","),
        lip_shape_options: "Puckered,Thin,Thick".split(","),

        wrinkle_pattern_mouth_options: "None,Gentle,Straight,Top,Middle,Bottom,Heavy".split(","),
        wrinkle_resistance_options: "Very Low,Low,Less,Below,Reduce,Raised,Above,More,High,Very High".split(","),
        wrinkle_mouth_width_options: "Far Out,Out,Middle,In,Far In".split(","),
        wrinkle_mouth_height_options: "Far Up,Up,Middle,Down,Far Down".split(","),

        forehead_height_options: "Under,Low,Less,Normal,Above,Raised,High,Floating".split(","),

        decorations: [
            {name: "box-behind", type: 'rectangle', p1: 'facezone topleft', p2: 'facezone bottomright',
                fill_color: 'blue', alpha: 0.3, line_color: 'light blue', size: '2', forceInBounds: true},
            {name: "name-plate", type: 'rectangle', height: 16, docked: 'bottom', forceInBounds: true, font_size: 9,
                text: '{{name}}', text_color: 'black', line_color: 'brown', fill_color: 'white', alpha: 0.8}
        ]
    }};

    //-----------------------------
    //Initialization
    function AvatarClass(option1, option2, option3) {
        this.version = file_name + ' (version ' + VERSION + ') - ' + summary + ' by ' + author;
        if (option1 == 'get_linked_template') {
            option2 = option2 || getFirstRaceFromData();
            return this.data[option2] || {error: 'race does not exist'};
        } else if (option1 == 'copy_data_template') {
            option2 = option2 || getFirstRaceFromData();
            if (this.data[option2]) {
                var data = this.data[option2];
                data = JSON.parse(JSON.stringify(data));
                return data;
            } else {
                return {error: 'race does not exist'};
            }

        } else if (option1 == 'add_render_function') {
            this.renderers.push(option2);

        } else if (option1 == 'get_render_functions') {
            return this.renderers;

        } else if (option1 == 'set_data_template') {
            this.data[option2] = option3;

        } else if (option1 == 'get_races') {
            var races = [];
            for (var race in this.data) {
                races.push(race);
            }
            return races;

        } else if (option1 == '') {
            return {details: 'avatar class initialized'};

        } else {
            this.drawOrRedraw(option1, option2, option3);
        }
    }

    AvatarClass.prototype.renderers = [];
    AvatarClass.prototype.data = _data;

    AvatarClass.prototype.drawOrRedraw = function (face_options, stage_options, canvas_name) {
        if (this.face_options === null) {
            this.initialization_seed = null;
        }

        this.initialization_options = face_options || this.initialization_options || {};

        this.face_options = $.extend({}, this.face_options || _face_options, face_options || {});
        this.stage_options = $.extend({}, this.stage_options || _stage_options, stage_options || {});
        this.event_list = this.event_list || [];
        this.registered_points = this.registered_points || [];

        //Determine the random seed to use.  Either use the one passed in, the existing one, or a random one.
        face_options = face_options || {};
        var rand_seed = face_options.rand_seed || this.initialization_seed || Math.floor(Math.random() * 100000);
        this.initialization_seed = rand_seed;
        this.initialization_options.rand_seed = rand_seed;
        //Set this random seed to be used throughout the avatar's livespan
        this.randomSetSeed(rand_seed);

        //Determine the race, and pick random variables to use for unspecified values
        this.face_options.race = this.face_options.race || getFirstRaceFromData();

        var race_data = this.getRaceData();
        for (var key in race_data) {
            this.randomFaceOption(key, true, true);
        }

        //Find the canvas that the stage should be drawn on (possibly multiple stages per canvas)
        if (canvas_name) {
            this.stage_options.canvas_name = canvas_name;
        }
        if (this.stage_options.canvas_name) {
            canvas_name = this.stage_options.canvas_name;
            if (canvas_name && canvas_name instanceof jQuery) {
                this.stage_options.canvas_name = canvas_name.attr('id') || canvas_name.selector || "canvas";
                this.$canvas = canvas_name;
            }
            var existing_stage = findStageByCanvas(this.stage_options.canvas_name);
            if (!this.$canvas && $(this.stage_options.canvas_name)) {
                this.$canvas = $('#' + this.stage_options.canvas_name);
            }

            if (existing_stage) {
                this.stage = existing_stage;
            } else {
                this.stage = setupStage(this.stage_options.canvas_name);
                if (!this.stage.canvas) {
                    throw "The canvas was not properly initialized in the stage, maybe jquery hadn't finished building it yet."
                }
                addStageByCanvas({canvas_id: this.stage_options.canvas_name, $canvas: this.$canvas, stage: this.stage});
            }
        }

        //Draw the faces
        if (this.stage) {
            this.erase();
            var face = this.buildFace();
            this.drawOnStage(face, this.stage);
            this.faceShapeCollection = face;

            registerEvents(this);

            this.stage.update();
        }
    };

    //-----------------------------
    //Supporting functions
    AvatarClass.prototype.getSeed = function (showAsString) {
        var result = this.initialization_options || {};
        return showAsString ? JSON.stringify(result) : result;
    };
    AvatarClass.prototype.erase = function () {
        if (this.faceShapeCollection) {
            this.faceShapeCollection.removeAllChildren();
            this.faceShapeCollection.visible = false;
        }
    };
    AvatarClass.prototype.getRaceData = function () {
        var race = this.face_options.race || getFirstRaceFromData();
        return _data[race] || _data[getFirstRaceFromData()];
    };
    AvatarClass.prototype.removeFromStage = function () {
        if (this.stage) {
            if (this.faceShapeCollection) {
                this.faceShapeCollection.removeAllChildren();
                this.faceShapeCollection.visible = false;
                this.stage.update();
            }
        }
    };
    AvatarClass.prototype.drawOnStage = function (face, stage) {
        stage.addChild(face);
        stage.update();
    };
    function turnWordToNumber(word, min, max, options) {
        options = options || "Darkest,Darker,Dark,Very Low,Low,Less,Below,Reduce,Raised,Above,More,High,Very High,Bright,Brighter,Brightest";
        if (typeof options == "string") options = options.split(",");

        var pos = _.indexOf(options, word);
        var val = (min+max)/2;
        if (pos > -1) {
            var percent = pos / options.length;
            val = min + (percent * (max - min));
        }
        return val;
    }

    function generateSkinAndHairColors(avatar) {

        //TODO: vary colors based on charisma and age
        //Merge and tweak colors
        var skinColor = '';
        if (_.isString(avatar.face_options.skin_colors)) {
            skinColor = net.brehaut.Color(avatar.face_options.skin_colors);
            avatar.face_options.skin_colors = {name: avatar.face_options.skin_colors, skin: skinColor.toString()};
        } else if (avatar.face_options.skin_colors.skin) {
            skinColor = net.brehaut.Color(avatar.face_options.skin_colors.skin);
        }

        var skin_darken_amount, R, G, B;
        //Based on math from http://johnthemathguy.blogspot.com/2013/08/what-color-is-human-skin.html
        if (avatar.face_options.skin_shade == "Light") {
            skin_darken_amount = turnWordToNumber(avatar.face_options.skin_shade_tint, -3.5, 0.5);
            R = 224.3 + 9.6 * skin_darken_amount;
            G = 193.1 + 17.0 * skin_darken_amount;
            B = 177.6 + 21.0 * skin_darken_amount;
            skinColor = net.brehaut.Color("rgb(" + parseInt(R) + "," + parseInt(G) + "," + parseInt(B) + ")");
            avatar.face_options.skin_colors = {name: "light:" + skin_darken_amount, skin: skinColor.toString()};
        } else if (avatar.face_options.skin_shade == "Dark") {
            skin_darken_amount = turnWordToNumber(avatar.face_options.skin_shade_tint, -3.5, 3);
            R = 168.8 + 38.5 * skin_darken_amount;
            G = 122.5 + 32.1 * skin_darken_amount;
            B = 96.7 + 26.3 * skin_darken_amount;
            skinColor = net.brehaut.Color("rgb(" + parseInt(R) + "," + parseInt(G) + "," + parseInt(B) + ")");
            avatar.face_options.skin_colors = {name: "dark:" + skin_darken_amount, skin: skinColor.toString()};
        }

        if (!_.isObject(avatar.face_options.skin_colors)) {
            avatar.face_options.skin_colors = {name: 'skin', skin: 'rgb(228,131,86)'};
        }

        //TODO: Check that skin is not too white
        var red = net.brehaut.Color('#885544');
        if (!avatar.face_options.skin_colors.highlights) avatar.face_options.skin_colors.highlights = skinColor.lightenByRatio(.4).toString();
        if (!avatar.face_options.skin_colors.cheek) avatar.face_options.skin_colors.cheek = skinColor.blend(red, .1).darkenByRatio(.2).toString();
        if (!avatar.face_options.skin_colors.darkflesh) avatar.face_options.skin_colors.darkflesh = skinColor.blend(red, .1).darkenByRatio(.3).toString();
        if (!avatar.face_options.skin_colors.deepshadow) avatar.face_options.skin_colors.deepshadow = skinColor.darkenByRatio(.4).toString();

        var age_hair_percent = Math.min(Math.max(0, avatar.face_options.age - 55) / 60, 1);
        var hairColor = net.brehaut.Color(avatar.face_options.hair_color_roots);
        if (!avatar.face_options.hair_color) {
            var gray = net.brehaut.Color('#eeeeee');
            avatar.face_options.hair_color = hairColor.blend(gray, age_hair_percent).desaturateByRatio(age_hair_percent).toString();
        }
        if (!avatar.face_options.beard_color) {
            var gray_d = net.brehaut.Color('#dddddd');
            avatar.face_options.beard_color = hairColor.blend(gray_d, age_hair_percent).desaturateByRatio(age_hair_percent).toString();
        }
    }

    AvatarClass.prototype.buildFace = function () {
        var container = new createjs.Container();
        this.lines = [];
        var avatar = this;

        var face_zones = buildFaceZones(avatar);
        var race_data = avatar.getRaceData();

        generateSkinAndHairColors(avatar);

        //Loop through each rendering order and draw each layer
        _.each(race_data.rendering_order || [], function (layer) {
            if (layer.decoration) {
                addSceneChildren(container, buildDecoration(avatar, layer));

            } else if (layer.feature) {
                var render_layer = _.find(avatar.renderers, function (rend) {
                    return (rend.style == layer.style) && (rend.feature == layer.feature);
                });
                if (render_layer && render_layer.renderer) {
                    var feature_shapes = render_layer.renderer(face_zones, avatar, layer);
                    addSceneChildren(container, feature_shapes);
                } else {
                    console.error("avatar.js - Renderer named " + layer.feature + " not found, skipping.");
                }
            }
        });

        return container;
    };
    AvatarClass.prototype.randomFaceOption = function (key, dontForceSetting, skipRedraw) {
        var option_name = '';
        var result, currentVal;
        var data = this.getRaceData();
        if (_.str.endsWith(key, '_options') && data[key]) {
            var options = data[key];
            option_name = key.split('_options')[0];
            currentVal = this.face_options[option_name];

            if (!dontForceSetting || (dontForceSetting && !this.face_options[option_name])) {
                //Set a random option
                result = randOption(options, this.face_options, currentVal);
                this.face_options[option_name] = result;
            } else if (_.isObject(options[0]) && _.isString(currentVal)) {
                //The value is set as text, if it's an array of objects then set the object to the val
                var obj = _.find(options, function (opt) {
                    return opt.name == currentVal;
                });
                if (obj) this.face_options[option_name] = obj;
            }
        }

        if (!skipRedraw) {
            this.drawOrRedraw();
        }
        return result;
    };
    AvatarClass.prototype.unregisterEvent = function (shapeNames) {
        var avatar = this;
        if (shapeNames == 'all') {
            _.each(avatar.event_list, function (event) {
                if (event.shape) {
                    event.shape.removeEventListener(event.eventType || 'click');
                }
            });
            avatar.event_list = [];
        }

        var newEventList = [];
        _.each(avatar.event_list, function (event) {
            if (event.shapeNames == shapeNames && event.shape) {
                event.shape.removeEventListener(event.eventType || 'click');
            } else {
                newEventList.push(event);
            }
        });
        avatar.event_list = newEventList;
    };
    AvatarClass.prototype.registerEvent = function (shapeNames, functionToRun, eventType, dontRegister) {
        eventType = eventType || 'click';
        if (!functionToRun) return;
        var avatar = this;

        if (!dontRegister) {
            avatar.event_list.push({shapeNames: shapeNames, functionToRun: functionToRun, eventType: eventType});
        }

        _.each(shapeNames.split(","), function (shapeName) {
            var shape = findShape(avatar.lines, shapeName);
            if (shape && shape.shape) {
                shape.shape.addEventListener(eventType, function () {
                    functionToRun(avatar);
                });
            }
        });
    };
    AvatarClass.prototype.getBounds = function () {
        var p1 = findPoint(this, 'facezone topleft');
        var p2 = findPoint(this, 'facezone bottomright');
        var p2x = parseInt(p2.x - p1.x);
        var p2y = parseInt(p2.y - p1.y);

        return ({top_x: parseInt(p1.x), top_y: parseInt(p1.y), bottom_x: p2x, bottom_y: p2y});
    };

    //================
    //Private functions
    function getFirstRaceFromData() {
        for (key in _data) {
            //wonky way to get first key
            return key;
        }
        throw "No first race found in _data";
    }

    function registerEvents(avatar) {
        var usesMouseOver = false;
        _.each(avatar.event_list, function (event) {
            avatar.registerEvent(event.shapeNames, event.functionToRun, event.eventType, true);
            if (event.eventType == 'mouseover' || event.eventType == 'mouseout') usesMouseOver = true;
        });
        if (usesMouseOver) {
            avatar.stage.enableMouseOver();
        }
    }

    function buildDecoration(avatar, decoration) {
        var shapes = [];

        var data = avatar.getRaceData();
        var data_item = _.find(data.decorations || [], function (dec) {
            return dec.name == decoration.decoration;
        });
        if (data_item) {
            decoration = JSON.parse(JSON.stringify(decoration)); //Deep-copy this
            $.extend(decoration, data_item);
        }

        if (decoration.type == 'rectangle') {
            var p1, p2;
            if (decoration.docked) {
                var image_tl = findPoint(avatar, 'facezone topleft');
                var image_br = findPoint(avatar, 'facezone bottomright');
                var height = decoration.height || 16;
                var width = decoration.width || 16;
                if (decoration.docked == "bottom") {
                    p1 = {x: image_tl.x, y: image_br.y - height};
                    p2 = {x: image_br.x, y: image_br.y}

                    if (decoration.forceInBounds) {
                        var canvas_h = avatar.$canvas.height();
                        if (p2.y > canvas_h) {
                            p1.y += (canvas_h - p2.y);
                            p2.y += (canvas_h - p2.y);
                        }
                    }
                } //TODO: Add other docked locations


            } else {
                p1 = (_.isString(decoration.p1)) ? findPoint(avatar, decoration.p1) : decoration.p1;
                p2 = (_.isString(decoration.p2)) ? findPoint(avatar, decoration.p2) : decoration.p2;
            }
            if (p1 && _.isObject(p1) && p2 && _.isObject(p2)) {
                var p1x = parseInt(p1.x);
                var p1y = parseInt(p1.y);
                var p2x = parseInt(p2.x - p1.x);
                var p2y = parseInt(p2.y - p1.y);

                if (decoration.forceInBounds) {
                    var canvas_w = avatar.$canvas.width();
                    var canvas_h = avatar.$canvas.height();
                    if (p1x < 1) p1x = 1;
                    if (p1y < 1) p1y = 1;
                    if (p2x > canvas_w) p2x = (canvas_w - p1x) - 2;
                    if (p2y > canvas_h) p2y = (canvas_h - p1y) - 2;
                }

                var rect = new createjs.Shape();
                if (decoration.size) rect.graphics.setStrokeStyle(decoration.size);
                if (decoration.line_color || decoration.color) rect.graphics.beginStroke(decoration.line_color || decoration.color);
                if (decoration.fill_color || decoration.color) rect.graphics.beginFill(decoration.fill_color || decoration.color);
                rect.alpha = decoration.alpha || 1;
                rect.graphics.drawRect(p1x, p1y, p2x, p2y);
                rect.graphics.endFill();
                shapes.push(rect);
                avatar.lines.push({name: decoration.name || 'decoration ' + (decoration.name || "item"), line: [p1, {x: p2x, y: p2y}], shape: rect, scale_x: 1, scale_y: 1, x: 1, y: 1});

                if (decoration.text) {
                    var font_size = decoration.font_size || 10;
                    var font_name = decoration.font_name || "Arial";
                    var font_color = decoration.font_color || decoration.color || "Black";
                    var font_text = decoration.text;

                    if (font_text.indexOf("{{") > -1) {
                        _.templateSettings = {
                            interpolate: /\{\{(.+?)\}\}/g
                        };

                        var text_template = _.template(font_text);
                        try {
                            font_text = text_template(avatar.face_options);
                        } catch (ex) {
                            //Decoration couldn't parse variable
                            font_text = "";
                        }
                    }

                    var text = new createjs.Text(font_text, font_size + "px " + font_name, font_color);
                    var textBounds = text.getBounds();
                    var textWidth = p2x;
                    if (textBounds && textBounds.width) {
                        textWidth = textBounds.width;
                    }
                    text.x = p1x + ((p2x - textWidth) / 2);
                    text.y = ((p2y - font_size) / 2) + p1y + (p2y / 2);
                    text.textBaseline = "alphabetic";
                    shapes.push(text);
                }


            }
        } else if (decoration.type == 'image') {
            //TODO: Add images - is there a way to do this from a local file?
        }

        return shapes;
    }

    function buildFaceZones(avatar) {
        var face_options = avatar.face_options;
        var stage_options = avatar.stage_options;
        var stage = avatar.stage;

        var face_zones = {neck: {}, face: {}, nose: {}, ears: {}, eyes: {}, chin: {}, hair: {}};

        var height = (stage_options.height || stage_options.size || (stage.canvas.height * stage_options.percent_height)) * (1 - stage_options.buffer);
//        if (!height) {
//            height = (stage.canvas.height * stage_options.percent_height) * (1 - stage_options.buffer);
//        }

        var full_height = height;

        var age = maths.clamp(face_options.age, 4, 25);
        var age_size = (50 + age) / 75;  //TODO: Use a Height in Inches
        height *= age_size;

        var height_offset = (stage_options.size || (stage.canvas.height * stage_options.percent_height)) * (stage_options.buffer / 2);
        stage_options.height_offset = height_offset;

        var half_height = height / 2;
        stage_options.half_height = half_height;
        face_zones.face_width = half_height * (0.55 + (face_options.thickness / 35));

        var eye_spacing = 0.005;
        if (face_options.eye_spacing == "Pinched") {
            eye_spacing = 0;
        } else if (face_options.eye_spacing == "Squeezed") {
            eye_spacing = -.005;
        } else if (face_options.eye_spacing == "Thin") {
            eye_spacing = 0.01;
        } else if (face_options.eye_spacing == "Wide") {
            eye_spacing = 0.02;
        }

        var eye_size = 1;
        if (face_options.eye_size == "Tiny") {
            eye_size = .8;
        } else if (face_options.eye_size == "Small") {
            eye_size = .9;
        } else if (face_options.eye_size == "Big") {
            eye_size = 1.05;
        } else if (face_options.eye_size == "Large") {
            eye_size = 1.1;
            eye_size += .01;
        } else if (face_options.eye_size == "Massive") {
            eye_size = 1.2;
            eye_size += .02;
        } else if (face_options.eye_size == "Big Eyed") {
            eye_size = 1.3;
            eye_spacing += .025;
        } else if (face_options.eye_size == "Huge Eyed") {
            eye_size = 1.4;
            eye_spacing += .03;
        } else if (face_options.eye_size == "Giant") {
            eye_size = 1.5;
            eye_spacing += .035;
        }

        var mouth_height = 0.05;
        if (face_options.mouth_height == "Low") {
            mouth_height = 0.04;
        } else if (face_options.mouth_height == "Raised") {
            mouth_height = 0.06;
        } else if (face_options.mouth_height == "High") {
            mouth_height = 0.07;
        }

        var nose_height = 0.01;
        if (face_options.nose_height == "Low") {
            nose_height = 0;
        } else if (face_options.nose_height == "Raised") {
            nose_height = 0.02;
        }

        var forehead_height = 0.01;
        if (face_options.forehead_height == "Under") {
            forehead_height = 0.1;
        } else if (face_options.forehead_height == "Low") {
            forehead_height = 0.11;
        } else if (face_options.forehead_height == "Less") {
            forehead_height = 0.12;
        } else if (face_options.forehead_height == "Normal") {
            forehead_height = 0.13;
        } else if (face_options.forehead_height == "Above") {
            forehead_height = 0.14;
        } else if (face_options.forehead_height == "Raised") {
            forehead_height = 0.15;
        } else if (face_options.forehead_height == "High") {
            forehead_height = 0.16;
        } else if (face_options.forehead_height == "Floating") {
            forehead_height = 0.17;
        }


        var x = stage_options.x;
        var y = stage_options.y;

        if (age_size < 1) {
            y += (full_height - height + 2);
            x += (full_height - height) / 2;
        }

        face_zones.thick_unit = face_zones.face_width * .007;

        face_zones.neck = {
            left: -face_zones.face_width * .7,
            top: 0,
            right: 1.4 * face_zones.face_width,
            bottom: height * .6,
            x: x + half_height,
            y: y + height_offset + half_height
        };
        face_zones.face = {
            left: -face_zones.face_width,
            top: -half_height,
            right: 2 * face_zones.face_width,
            bottom: height,
            x: x + half_height,
            y: y + height_offset + half_height
        };

        face_zones.eyes = {
            top: (-half_height / 16) * eye_size,
            bottom: (2 * half_height / 12) * eye_size,
            y: y + height_offset + (half_height * (0.8 + forehead_height)),

            left: (-half_height / 8) * eye_size,
            right: (2 * half_height / 8) * eye_size,
            left_x: x + (half_height * (0.75 - eye_spacing)),
            right_x: x + (half_height * (1.25 + eye_spacing)),

            iris: {
                top: -half_height / 24,
                bottom: 2 * half_height / 16,
                y: y + height_offset + (half_height * (0.8 + forehead_height)),

                left: -half_height / 16,
                right: 2 * half_height / 16,
                left_x: x + (half_height * (0.75 - eye_spacing)),
                right_x: x + (half_height * (1.25 + eye_spacing))
            },

            pupil: {
                top: -half_height / 65,
                bottom: 2 * half_height / 28,
                y: y + height_offset + (half_height * (0.805 + forehead_height)),

                left: -half_height / 32,
                right: 2 * half_height / 32,
                left_x: x + (half_height * (0.75 - eye_spacing)),
                right_x: x + (half_height * (1.25 + eye_spacing))
            }

        };

        face_zones.ears = {
            top: -half_height / 5,
            bottom: 2 * half_height / 5,
            y: y + height_offset + (half_height * (0.9 + forehead_height)),

            left: -half_height / 16,
            right: 2 * half_height / 16,
            left_x: x + half_height + face_zones.face.left,
            right_x: x + half_height + (face_zones.face.right / 2)
        };

        face_zones.nose = {
            left: -half_height / 15, top: -half_height / 15,
            right: 2 * half_height / 15, bottom: 2 * half_height / 15,
            radius: half_height / 15,
            x: x + half_height,
            y: y + height_offset + (half_height * (1.13 + (forehead_height * 1.2) + nose_height))
        };

        face_zones.mouth = {
            left: -half_height / 6, top: -half_height / 18,
            right: 2 * half_height / 6, bottom: 2 * half_height / 18,
            x: x + half_height,
            y: y + height_offset + (half_height * (1.5 + (forehead_height / 2) + nose_height + mouth_height))
        };

        namePoint(avatar, 'facezone topleft', {
            x: face_zones.ears.left_x + (2 * face_zones.ears.left),
            y: y
        });
        namePoint(avatar, 'facezone bottomright', {
            x: face_zones.ears.right_x + face_zones.ears.right,
            y: face_zones.neck.y + face_zones.neck.bottom
        });

        return face_zones;
    }

    //-----------------------------
    //Drawing Helpers

    function addSceneChildren(container, children) {
        _.each(children, function (c) {
            if (_.isArray(c)) {
                addSceneChildren(container, c);
            } else {
                container.addChild(c);
            }
        });
        return container;
    }

    function transformLineToGlobalCoordinates(lines, shape_name) {
        var line_new = [];

        var shape = findShape(lines, shape_name);

        _.each(shape.line, function (point) {
            var new_point = _.clone(point);
            new_point.x = (shape.x || 0) + ((shape.scale_x || 1) * .1 * point.x);
            new_point.y = (shape.y || 0) + ((shape.scale_y || 1) * .1 * point.y);

            line_new.push(new_point);
        });
        return line_new;

    }

    function lineSegmentCompared(source_line, compare_line, method, level_adjust) {
        level_adjust = level_adjust || 0;
        method = method || 'above';
        var return_line = [];

        if (method == 'above') {
            var highest_compare_point = Number.MAX_VALUE;
            _.each(compare_line, function (point) {
                if (point.y < highest_compare_point) {
                    highest_compare_point = point.y;
                }
            });

            _.each(source_line, function (point) {
                if ((point.y + level_adjust) <= highest_compare_point) {
                    return_line.push(point);
                }
            })
        } else if (method == 'below') {
            var lowest_compare_point = Number.MIN_VALUE;
            _.each(compare_line, function (point) {
                if (point.y > lowest_compare_point) {
                    lowest_compare_point = point.y;
                }
            });

            _.each(source_line, function (point) {
                if ((point.y - level_adjust) >= lowest_compare_point) {
                    return_line.push(point);
                }
            })
        }
        return return_line;
    }

    function transformShapeLine(options_lists, face_options, existing_list) {
        if (!_.isArray(options_lists)) options_lists = [options_lists];

        if (existing_list) {
            existing_list = JSON.parse(JSON.stringify(existing_list));
        } else {
            existing_list = [];
        }

        _.each(options_lists, function (options) {
            var type = options.type || 'circle';
            var steps = options.steps || 18;
            options.radius = options.radius || 1;

            var starting_step = options.starting_step || 0;
            var ending_step = options.ending_step || existing_list.length || steps;

            var c, x, y;
            if (type == 'smooth') {
                if (options.starting_step !== undefined) starting_step = (existing_list.length + options.starting_step) % (existing_list.length);
                if (options.ending_step !== undefined) ending_step = (existing_list.length + options.ending_step) % (existing_list.length);

                if (starting_step < ending_step) {
                    for (c = starting_step; c < ending_step; c++) {
                        existing_list[c].line = false;
                    }
                } else {
                    for (c = 0; c < ending_step; c++) {
                        existing_list[c].line = false;
                    }
                    for (c = starting_step; c < existing_list.length; c++) {
                        existing_list[c].line = false;
                    }
                }
            } else if (type == 'contract') {
                var mid_x = comparePoints(existing_list, 'x', 'middle');
                var mid_y = comparePoints(existing_list, 'y', 'middle');

                if (options.starting_step !== undefined) starting_step = (existing_list.length + options.starting_step) % (existing_list.length);
                if (options.ending_step !== undefined) ending_step = (existing_list.length + options.ending_step) % (existing_list.length);

                if (starting_step < ending_step) {
                    for (c = starting_step; c < ending_step; c++) {
                        existing_list[c].x = mid_x - ((mid_x - existing_list[c].x) * (options.multiplier || .9));
                        existing_list[c].y = mid_y - ((mid_y - existing_list[c].y) * (options.multiplier || .9));
                    }
                } else {
                    for (c = 0; c < ending_step; c++) {
                        existing_list[c].x = mid_x - ((mid_x - existing_list[c].x) * (options.multiplier || .9));
                        existing_list[c].y = mid_y - ((mid_y - existing_list[c].y) * (options.multiplier || .9));
                    }
                    for (c = starting_step; c < existing_list.length; c++) {
                        existing_list[c].x = mid_x - ((mid_x - existing_list[c].x) * (options.multiplier || .9));
                        existing_list[c].y = mid_y - ((mid_y - existing_list[c].y) * (options.multiplier || .9));
                    }
                }
            } else if (type == 'midline of loop') {
                //Takes a loop and averages the points through the middle
                var e_length = existing_list.length;
                var e_length_mid = e_length / 2;
                var new_list = [];

                for (c = 0; c < e_length_mid; c++) {
                    var xy = _.clone(existing_list[c]);
                    new_list.push(xy);
                }
                var id = 0;
                for (c = e_length - 1; c > e_length_mid; c--) {
                    var point = existing_list[c];
                    new_list[id].x += point.x;
                    new_list[id].x /= 2;
                    new_list[id].y += point.y;
                    new_list[id].y /= 2;
                    id++;
                }
                existing_list = new_list;

            } else if (type == 'reverse') {
                var axis = options.axis || 0;
                if (axis == 'left') {
                    axis = comparePoints(existing_list, 'x', 'lowest');
                } else if (axis == 'right') {
                    axis = comparePoints(existing_list, 'x', 'highest');
                } else if (axis == 'top') {
                    axis = comparePoints(existing_list, 'y', 'lowest');
                } else if (axis == 'bottom') {
                    axis = comparePoints(existing_list, 'y', 'highest');
                }

                if (options.direction == 'vertical') {
                    for (c = 0; c < existing_list.length; c++) {
                        existing_list[c].y = axis - (existing_list[c].y - axis);
                    }
                } else {  //Assume horizontal
                    for (c = 0; c < existing_list.length; c++) {
                        existing_list[c].x = axis - (existing_list[c].x - axis);
                    }
                }
            } else if (type == 'shift') {
                if (options.starting_step !== undefined) starting_step = (existing_list.length + options.starting_step) % (existing_list.length);
                if (options.ending_step !== undefined) ending_step = (existing_list.length + options.ending_step) % (existing_list.length);

                if (starting_step < ending_step) {
                    for (c = starting_step; c < ending_step; c++) {
                        existing_list[c].x += options.x_offset || 0;
                        existing_list[c].y += options.y_offset || 0;
                    }
                } else {
                    for (c = 0; c < ending_step; c++) {
                        existing_list[c].x += options.x_offset || 0;
                        existing_list[c].y += options.y_offset || 0;
                    }
                    for (c = starting_step; c < existing_list.length; c++) {
                        existing_list[c].x += options.x_offset || 0;
                        existing_list[c].y += options.y_offset || 0;
                    }

                }

            } else if (type == 'pinch') {
                if (options.starting_step !== undefined) starting_step = (existing_list.length + options.starting_step) % (existing_list.length);
                if (options.ending_step !== undefined) ending_step = (existing_list.length + options.ending_step) % (existing_list.length);

                if (starting_step < ending_step) {
                    for (c = starting_step; c < ending_step; c++) {
                        existing_list[c].y *= options.pinch_amount || .8;
                    }
                } else {
                    //TODO: There's a better way to do this double loop
                    for (c = 0; c < ending_step; c++) {
                        existing_list[c].y *= options.pinch_amount || .8;
                    }
                    for (c = starting_step; c < existing_list.length; c++) {
                        existing_list[c].y *= options.pinch_amount || .8;
                    }

                }
            }
            else if (type == 'randomize') {
                if (options.starting_step !== undefined) starting_step = (existing_list.length + options.starting_step) % (existing_list.length);
                if (options.ending_step !== undefined) ending_step = (existing_list.length + options.ending_step) % (existing_list.length);

                for (c = starting_step; c < ending_step; c++) {
                    var point = existing_list[c];
                    point.x += ((random(face_options) - .5) * options.x_range || .1);
                    point.y += ((random(face_options) - .5) * options.y_range || .1);
                    existing_list[c] = point;
                }

            } else if (type == 'circle') {
                for (c = starting_step; c < ending_step; c++) {
                    x = Math.cos(c / steps * 2 * Math.PI);
                    y = Math.sin(c / steps * 2 * Math.PI);

                    existing_list.push({x: x * (options.radius_x || options.radius), y: y * (options.radius_y || options.radius)});
                }
            } else if (type == 'oval') {
                for (c = starting_step; c < ending_step; c++) {
                    x = Math.cos(c / steps * 2 * Math.PI);
                    y = Math.sin(c / steps * 2 * Math.PI);

                    x = x < 0 ? -Math.pow(Math.abs(x), options.warp_x || 1) : Math.pow(x, options.warp_x || 1);
                    x = x < 0 ? x * (options.shrink_left || 1) : x * (options.shrink_right || 1);

                    y = y < 0 ? -Math.pow(Math.abs(y), options.warp_y || 1) : Math.pow(y, options.warp_y || 1);
                    y = y < 0 ? y * (options.shrink_top || 1) : y * (options.shrink_bottom || 1);

                    if (options.pinch_bottom && y > 0) {
                        x = x < 0 ? -Math.pow(Math.abs(x), options.pinch_bottom || 1) : Math.pow(x, options.pinch_bottom || 1);
                    }
                    if (options.pinch_top && y < 0) {
                        x = x < 0 ? -Math.pow(Math.abs(x), options.pinch_top || 1) : Math.pow(x, options.pinch_top || 1);
                    }
                    if (options.warp_y_bottom && y > 0) {
                        y = Math.pow(y, options.warp_y_bottom || 1);
                    }
                    if ((typeof options.raise_below == "number") && y > options.raise_below) {
                        y *= options.raise_below_amount || .9;
                    }
                    var point = {x: x * (options.radius_x || options.radius), y: y * (options.radius_y || options.radius)};
                    if ((typeof options.facet_below == "number") && (y > options.facet_below)) {
                        var next_y = Math.sin((c + 1) / steps * 2 * Math.PI);

                        if ((typeof options.dont_facet_below == "number") && y > options.dont_facet_below && next_y > options.dont_facet_below) {
                            // Don't make the lower points a line
                        } else {
                            point.line = true;
                        }
                    }

                    existing_list.push(point);
                }
            } else if (_.str.startsWith(type, 'almond-horizontal')) {
                for (c = starting_step; c < ending_step; c++) {
                    x = Math.cos(c / steps * 2 * Math.PI) * (options.radius_x || options.radius);
                    y = Math.sin(c / steps * 2 * Math.PI) * (options.radius_y || options.radius) * .5;
                    existing_list.push({x: x, y: y});
                    if (c % (steps / 2)) {
                        existing_list.push({x: x, y: y});
                    }
                }
            } else if (type == 'neck') {
                existing_list = [
                    {x: -options.radius, y: -options.radius},
                    {x: -options.radius, y: -options.radius},
                    {x: options.radius, y: -options.radius},
                    {x: options.radius, y: -options.radius},
                    {x: options.radius * (options.curvature || 1), y: 0},
                    {x: options.radius, y: options.radius},
                    {x: options.radius, y: options.radius},
                    {x: -options.radius, y: options.radius},
                    {x: -options.radius, y: options.radius},
                    {x: -options.radius * (options.curvature || 1), y: 0}
                ];
            }
        });
        return existing_list;
    }

    function comparePoints(existing_list, attribute, cardinality, returnPoint) {
        var result = null;
        var best_point = null;
        if (attribute == 'height') {
            var y_max = comparePoints(existing_list, 'y', 'highest');
            var y_min = comparePoints(existing_list, 'y', 'lowest');
            result = Math.max(y_max - y_min, y_min - y_max);

        } else if (attribute == 'width') {
            var x_max = comparePoints(existing_list, 'x', 'highest');
            var x_min = comparePoints(existing_list, 'x', 'lowest');
            result = Math.max(x_max - x_min, x_min - x_max);

        } else if (attribute == 'closest') {
            var closest_distance = Number.MAX_VALUE;
            var closest_point = null;
            for (var c = 0; c < existing_list.length; c++) {
                var point = existing_list[c];
                var dist = Helpers.distanceXY(point, cardinality);
                if (dist < closest_distance) {
                    closest_point = point;
                    closest_distance = dist;
                }
            }
            result = closest_point;

        } else {
            var lowest = Number.MAX_VALUE;
            var highest = Number.MIN_VALUE;

            _.each(existing_list, function (point) {
                if (point[attribute] > highest) {
                    highest = point[attribute];
                    if (cardinality == 'highest') {
                        best_point = point;
                    }
                }
                if (point[attribute] < lowest) {
                    lowest = point[attribute];
                    if (cardinality == 'lowest') {
                        best_point = point;
                    }
                }
            });

            if (cardinality == 'highest') {
                result = highest;
            } else if (cardinality == 'lowest') {
                result = lowest;
            } else if (cardinality == 'middle') {
                result = (highest + lowest) / 2;
                //TODO: Return point if returnPoint requested
            }
        }
        if (returnPoint) {
            result = best_point;
        }
        return result;
    }

    function midPointBetween(p1, p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        }
    }

    //Point and line tracking
    function findShape(lines, name) {
        var shape = _.find(lines, function (shape) {
            return shape.name == name
        });
        if (!shape) {
            console.error("avatar.js - Error: " + name + " not found when trying to 'findShape'");
        }
        return shape || {};
    }

    function findPoint(avatar, name) {
        var existingPoint = _.find(avatar.registered_points, function (point) {
            return point.name == name;
        });
        var found = null;
        if (existingPoint && existingPoint.point) {
            found = existingPoint.point;
        } else {
            console.error("avatar.js - Error: " + name + " not found when trying to 'findPoint'");
        }
        return found || {};
    }

    function namePoint(avatar, name, point) {
        var existingPoint = _.find(avatar.registered_points, function (point) {
            return point.name == name;
        });
        if (existingPoint) {
            existingPoint.point = point;
        } else {
            avatar.registered_points = avatar.registered_points || [];
            avatar.registered_points.push({name: name, point: point});
        }
    }

    //Path creation and editing
    function transformPathFromLocalCoordinates(points_local, width_radius, height_radius, center_x, center_y) {
        if (!_.isArray(points_local)) points_local = [points_local];

        var points = [];
        for (var p = 0; p < points_local.length; p++) {
            var point = _.clone(points_local[p]);
            var x = (width_radius * point.x / 10) + (center_x || 0);
            var y = (height_radius * point.y / 10) + (center_y || 0);
            point.x = x;
            point.y = y;
            points.push(point);
        }
        return points;
    }

    function transformPathFromGlobalCoordinates(points_global, width_radius, height_radius, center_x, center_y) {
        //NOTE: Untested function
        if (!_.isArray(points_global)) points_global = [points_global];

        var points = [];
        for (var p = 0; p < points_global.length; p++) {
            var point = _.clone(points_global[p]);
            var x = point.x - (center_x || 0);
            var y = point.y - (center_y || 0);
            point.x = x / width_radius * 10;
            point.y = y / height_radius * 10;
            points.push(point);
        }
        return points;
    }

    function createPathFromLocalCoordinates(points_local, style, width_radius, height_radius) {
        var points = transformPathFromLocalCoordinates(points_local, width_radius, height_radius);
        return createPath(points, style);
    }

    function createPath(points, style) {
        if (!points || !points.length || points.length < 2) return null;
        style = style || {};

        var color = style.line_color || style.color || 'black';
        if (color == 'blank') color = 'rgba(0,0,0,0)';
        var thickness = style.thickness || 1;
        var fill_color = style.fill_color || null;

        var returnedShapes = [];

        if (style.dot_array) {

            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                var circle = new createjs.Shape();
                circle.graphics.beginStroke(color).drawEllipse(point.x - (thickness / 2), point.y - (thickness / 2), thickness, thickness);

                if (style.x) circle.x = style.x;
                if (style.y) circle.y = style.y;
                if (style.alpha) circle.alpha = style.alpha;
                if (style.rotation) circle.rotation = style.rotation;
                returnedShapes.push(circle);
            }

        } else {
            var line = new createjs.Shape();

            line.graphics.beginStroke(color).setStrokeStyle(thickness);

            if (fill_color) {
                line.graphics.beginFill(fill_color);
            } else if (style.fill_colors) {
                var x_offset_start, x_offset_end, y_offset_start, y_offset_end, radius, fill_steps;
                if (style.fill_method == 'linear') {
                    x_offset_start = assignNumbersInOrder(style.x_offset_start, -style.radius, comparePoints(points, 'x', 'lowest'), 0);
                    x_offset_end = assignNumbersInOrder(style.x_offset_end, style.radius, comparePoints(points, 'x', 'highest'), 0);
                    y_offset_start = assignNumbersInOrder(style.y_offset_start, 0);
                    y_offset_end = assignNumbersInOrder(style.y_offset_end, 0);
                    fill_steps = style.fill_steps || [0, 1];

                    line.graphics.beginLinearGradientFill(
                        style.fill_colors, fill_steps, x_offset_start, y_offset_start, x_offset_end, y_offset_end)

                } else { //Assume Radial
                    x_offset_start = assignNumbersInOrder(style.x_offset_start, style.x_offset, comparePoints(points, 'x', 'middle'), 0);
                    x_offset_end = assignNumbersInOrder(style.x_offset_end, style.x_offset, comparePoints(points, 'x', 'middle'), 0);
                    y_offset_start = assignNumbersInOrder(style.y_offset_start, style.y_offset, comparePoints(points, 'y', 'middle'), 0);
                    y_offset_end = assignNumbersInOrder(style.y_offset_end, style.y_offset, comparePoints(points, 'y', 'middle'), 0);
                    fill_steps = style.fill_steps || [0, 1];
                    radius = style.radius || 10;

                    line.graphics.beginRadialGradientFill(
                        style.fill_colors, fill_steps, x_offset_start, y_offset_start, 0, x_offset_end, y_offset_end, radius);
                }
            }

            var p1, p2, p3, mid;

            if (style.close_line) {
                p1 = points[0];
                p2 = points[1];
                mid = midPointBetween(p1, p2);
                line.graphics.moveTo(mid.x, mid.y);
            } // TODO: There's some overlap if closed - maybe don't draw p0, and just loop through p1,p2?

            if (style.x) line.x = style.x;
            if (style.y) line.y = style.y;
            if (style.alpha) line.alpha = style.alpha;
            if (style.rotation) line.rotation = style.rotation;

            for (var i = 1; i < points.length; i++) {
                p1 = points[(points.length + i - 1) % (points.length)];
                p2 = points[i];
                mid = midPointBetween(p1, p2);
                if (p1.line) {
                    line.graphics.lineTo(p1.x, p1.y);
                } else {
                    line.graphics.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y);
                }
            }

            if (style.close_line) {
                p1 = points[points.length - 1];
                p2 = points[0];
                p3 = points[1];
                mid = midPointBetween(p1, p2);
                line.graphics.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y);
                mid = midPointBetween(p2, p3);
                line.graphics.quadraticCurveTo(p2.x, p2.y, mid.x, mid.y);

            } else {
                line.graphics.lineTo(points[points.length - 1].x, points[points.length - 1].y);
            }
            returnedShapes.push(line);
        }
        if (returnedShapes.length && returnedShapes.length == 1) {
            return returnedShapes[0];
        } else {
            return returnedShapes;
        }
    }

    function assignNumbersInOrder(num1, num2, num3, num4, num5) {
        var result = num1;
        if (typeof num1 != 'number' || isNaN(num1)) {
            result = num2;
            if (typeof num2 != 'number' || isNaN(num2)) {
                result = num3;
                if (typeof num3 != 'number' || isNaN(num3)) {
                    result = num4;
                    if (typeof num4 != 'number' || isNaN(num4)) {
                        result = num5;
                        if (typeof num5 != 'number' || isNaN(num5)) {
                            result = 0;
                        }
                    }
                }
            }
        }
        return result
    }

    function createMultiPathFromLocalCoordinates(points_local, style, width_radius, height_radius) {
        var points = transformPathFromLocalCoordinates(points_local, width_radius, height_radius);
        return createMultiPath(points, style);
    }

    function amountFromVarOrRange(point_amount, gradient, setting, percent, isColor) {
        var amount = setting;

        if (point_amount) {
            amount = point_amount;
        } else if (gradient) {
            if (!_.isArray(gradient)) gradient = [gradient];
            var grad_length = gradient.length;
            if (grad_length == 1) {
                amount = gradient[0];
            } else {
                var pos_percent = percent * (grad_length - 1);
                var pos_floor = Math.floor(pos_percent);
                var pos_ceil = Math.ceil(pos_percent);

                if (pos_floor == pos_ceil) {
                    amount = gradient[pos_floor];
                } else {
                    var val_at_pos_floor = gradient[pos_floor];
                    var val_at_pos_ceil = gradient[pos_ceil];

                    var pos_percent_at_floor = pos_floor / (grad_length - 1);
                    var pos_percent_at_ceil = pos_ceil / (grad_length - 1);

                    var percent_between_floor_and_ceil = (percent - pos_percent_at_floor) / (pos_percent_at_ceil - pos_percent_at_floor);
                    if (isColor) {
                        var color_floor = net.brehaut.Color(val_at_pos_floor);
                        var color_ceil = net.brehaut.Color(val_at_pos_ceil);
                        amount = color_floor.blend(color_ceil, percent_between_floor_and_ceil).toString();
                    } else {
                        amount = ((val_at_pos_ceil - val_at_pos_floor) * percent_between_floor_and_ceil) + val_at_pos_floor;
                    }
                }
            }
        }

        return amount;
    }

    function createMultiPath(points, style) {
        if (!points || !points.length || points.length < 2) return null;
        style = style || {};

        //NOTE: Color, Thickness, and Alpha can be:
        // 1) Specified on each line segment (highest priority)
        // 2) Given as a range (e.g. '[0,.1,.9,1]'
        // 3) Given as a standard variable (e.g. 'style.thickness')

        var color = style.line_color || 'black';
        var thickness = style.thickness || 1;

        if (style.break_line_every) {
            points = hydratePointsAlongLine(points, style.break_line_every, true);
        }

        var returnedShapes = [];

        var line = new createjs.Shape();
        for (var i = 1; i < points.length; i++) {

            var p1 = points[i - 1];
            var p2 = points[i];
            var p3 = points[i + 1];

            //TODO: get p3 and do a mid for quads?

            var percent = (i / points.length);
            var thickness_now = amountFromVarOrRange(p1.thickness, style.thickness_gradients, thickness, percent);
            var color_now = amountFromVarOrRange(p1.color, style.line_color_gradients, color, percent, true);

            if (thickness_now > 0) {
                line.graphics.beginStroke(color_now).setStrokeStyle(thickness_now);

                if (style.dot_array) {
                    line.graphics.drawEllipse(p1.x - (thickness / 2), p1.y - (thickness / 2), thickness, thickness);
                } else if (!p1.line && p3) {
                    line.graphics.moveTo(p1.x, p1.y).quadraticCurveTo(p2.x, p2.y, p3.x, p3.y);
                } else {
                    line.graphics.moveTo(p1.x, p1.y).lineTo(p2.x, p2.y);
                }
            }
        }

        if (style.alpha !== undefined) line.alpha = style.alpha;
        if (style.x) line.x = style.x;
        if (style.y) line.y = style.y;
        if (style.rotation) line.rotation = style.rotation;

        line.graphics.endStroke();

        returnedShapes.push(line);

        return returnedShapes;
    }

    function extrudeHorizontalArc(linePoints, distX, distY, distPeak) {
        //Have distY be positive to do an inner arc
        var newPoints = [];

        var midX = 0;
        _.each(linePoints, function (point) {
            midX += point.x;
        });
        midX /= linePoints.length;

        if (distY > 0) {
            _.each(linePoints, function (point) {
                var usePoint = true;
                var newX, newY;

                if (point.x < midX) {
                    newX = point.x + distX;
                    newY = point.y + distY;
                    if (newX > midX) usePoint = false;
                } else if (point.x > midX) {
                    newX = point.x - distX;
                    newY = point.y + distY;
                    if (newX < midX) usePoint = false;
                }
                if (usePoint) {
                    var newPoint = _.clone(point);
                    newPoint.x = newX;
                    newPoint.y = newY;
                    newPoints.push(newPoint);
                }
            });
            if (typeof distPeak == "number" && newPoints.length && newPoints.length > 2) {
                var midPos = Math.ceil(newPoints.length / 2);

                var newPoint = _.clone(newPoints[midPos]);
                newPoint.x = midX;
                newPoint.y += distPeak;
                newPoints.splice(midPos, 0, newPoint);
            }

        } else {

            _.each(linePoints, function (point) {
                var newX, newY;

                if (point.x < midX) {
                    newX = point.x - distX;
                    newY = point.y + distY;
                } else if (point.x >= midX) {
                    newX = point.x + distX;
                    newY = point.y + distY;
                }
                var newPoint = _.clone(point);
                newPoint.x = newX;
                newPoint.y = newY;
                newPoints.push(newPoint);
            });

        }
        return newPoints;
    }

    function distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    function angleBetween(point1, point2) {
        return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    function hydratePointsAlongLine(line, spacing, dontLinkLastFirst) {
        spacing = spacing || 5;
        var newLine = [];
        var lastPoint = line[0];

        var currentPoint;
        _.each(line, function (currentPoint) {
            var dist = distanceBetween(lastPoint, currentPoint);
            var angle = angleBetween(lastPoint, currentPoint);
            for (var i = 0; i < dist; i += spacing) {
                var newPoint = _.clone(currentPoint);
                newPoint.x = lastPoint.x + (Math.sin(angle) * i);
                newPoint.y = lastPoint.y + (Math.cos(angle) * i);
                newLine.push(newPoint);
            }
            lastPoint = currentPoint;
        });

        if (!dontLinkLastFirst) {
            //Do again for last-first point
            lastPoint = line[line.length - 1];
            currentPoint = line[0];
            var dist = distanceBetween(lastPoint, currentPoint);
            var angle = angleBetween(lastPoint, currentPoint);
            for (var i = 0; i < dist; i += spacing) {
                var newPoint = _.clone(currentPoint);
                newPoint.x = lastPoint.x + (Math.sin(angle) * i);
                newPoint.y = lastPoint.y + (Math.cos(angle) * i);
                newLine.push(newPoint);
            }
        }
        return newLine;
    }

    function constrainPolyLineToBox(poly_line, box) {
        var constrained_line = [];

        var last_crossed = null;
        var last_point = null;
        _.each(poly_line, function(point, i){
            var directionOfCurrentPoint = whereIsPointInBox(point, box);
            if (!last_point || !last_point.inside || !directionOfCurrentPoint.inside) {
                var i_last = (i - 1 + poly_line.length) % poly_line.length;
                var line_start = poly_line[i_last]; //Find previous point, or last point if less
                var line_end = point;

                //Track where points crossed boundary lines
                var cross_points = [];
                var cross_top = checkLineIntersection(line_start, line_end, box.tl, {x: box.br.x, y: box.tl.y}, 'top');
                if (cross_top.onLine1 && cross_top.onLine2) cross_points.push(cross_top);

                var cross_right = checkLineIntersection(line_start, line_end, box.br, {x: box.br.x, y: box.tl.y}, 'right');
                if (cross_right.onLine1 && cross_right.onLine2) cross_points.push(cross_right);

                var cross_bottom = checkLineIntersection(line_start, line_end, box.br, {x: box.tl.x, y: box.br.y}, 'bottom');
                if (cross_bottom.onLine1 && cross_bottom.onLine2) cross_points.push(cross_bottom);

                var cross_left = checkLineIntersection(line_start, line_end, box.tl, {x: box.tl.x, y: box.br.y}, 'left');
                if (cross_left.onLine1 && cross_left.onLine2) cross_points.push(cross_left);

                //The closest should be the next in line
                cross_points = cross_points.sort(function (point_crossed) {
                    return Helpers.distanceXY(point, point_crossed)
                });
                cross_points = cross_points.reverse();

                //For all points that cross the boundary, add cross points and corner points
                _.each(cross_points, function (cross_point) {
                    var point_clone = _.clone(point);
                    point_clone.line = true;
                    point_clone.x = cross_point.x;
                    point_clone.y = cross_point.y;

                    if (last_crossed && (cross_point.crossed != last_crossed)) {
                        //Cover corner points
                        var point_clone2 = _.clone(point);
                        point_clone2.line = true;

                        if ((cross_point.crossed == 'top' && last_crossed == 'right') || (cross_point.crossed == 'right' && last_crossed == 'top')) {
                            point_clone2.x = box.br.x;
                            point_clone2.y = box.tl.y;
                            constrained_line.push(point_clone2);
                        } else if ((cross_point.crossed == 'top' && last_crossed == 'left') || (cross_point.crossed == 'left' && last_crossed == 'top')) {
                            point_clone2.x = box.tl.x;
                            point_clone2.y = box.tl.y;
                            constrained_line.push(point_clone2);
                        } else if ((cross_point.crossed == 'bottom' && last_crossed == 'right') || (cross_point.crossed == 'right' && last_crossed == 'bottom')) {
                            point_clone2.x = box.br.x;
                            point_clone2.y = box.br.y;
                            constrained_line.push(point_clone2);
                        } else if ((cross_point.crossed == 'bottom' && last_crossed == 'left') || (cross_point.crossed == 'left' && last_crossed == 'bottom')) {
                            point_clone2.x = box.tl.x;
                            point_clone2.y = box.br.y;
                            constrained_line.push(point_clone2);
                        } else if (cross_point.crossed == 'right' && last_crossed == 'left') {
//                        if (directionOfCurrentPoint.bottom) { //TODO: This wont work for everything
                            point_clone2.x = box.tl.x;
                            point_clone2.y = box.br.y;
                            constrained_line.push(point_clone2);
                            var p3 = _.clone(point_clone2);
                            p3.x = box.br.x;
                            constrained_line.push(p3);
                        } else if (cross_point.crossed == 'left' && last_crossed == 'right') {
//                        if (directionOfCurrentPoint.bottom) { //TODO: This wont work for everything
                            point_clone2.x = box.tl.x;
                            point_clone2.y = box.br.y;
                            var p3 = _.clone(point_clone2);
                            p3.x = box.br.x;
                            constrained_line.push(point_clone2);
                            constrained_line.push(p3);
                        }
//                    last_crossed = cross_point.crossed;
                    }
                    constrained_line.push(point_clone);

                    if (cross_point.crossed) {
                        last_crossed = cross_point.crossed;
                    }
                });
            }
            if (directionOfCurrentPoint.inside) {
                constrained_line.push(_.clone(point));
            }

            last_point = point;
        });

        return constrained_line;
    }

    function whereIsPointInBox(point, box) {
        // point = {x, y}
        // box = {tl.x, tl.y, br.x, br.y}

        var whereIsPoint = {};
        if (point.x <= box.br.x && point.x >= box.tl.x &&
            point.y <= box.br.y && point.y >= box.tl.y) {
            whereIsPoint.inside = true;
        } else if (point.x >= box.br.x) {
            if (point.y < box.tl.y) {
                whereIsPoint.top = true;
                whereIsPoint.right = true;
            } else if (point.y > box.br.y) {
                whereIsPoint.bottom = true;
                whereIsPoint.right = true;
            } else {
                whereIsPoint.middle = true;
                whereIsPoint.right = true;
            }
        } else if (point.x <= box.tl.x) {
            if (point.y < box.tl.y) {
                whereIsPoint.top = true;
                whereIsPoint.left = true;
            } else if (point.y > box.br.y) {
                whereIsPoint.bottom = true;
                whereIsPoint.left = true;
            } else {
                whereIsPoint.middle = true;
                whereIsPoint.left = true;
            }
        } else {
            if (point.y < box.tl.y) {
                whereIsPoint.top = true;
                whereIsPoint.middle = true;
            } else if (point.y > box.br.y) {
                whereIsPoint.bottom = true;
                whereIsPoint.middle = true;
            } else {
                whereIsPoint.inside = true;
            }
        }

        return whereIsPoint;
    }

    function checkLineIntersection(line1Start, line1End, line2Start, line2End, crossedName) {
        //From: http://jsfiddle.net/justin_c_rounds/Gd2S2/
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite)
        // and booleans for whether line segment 1 or line segment 2 contain the point

        var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
        denominator = ((line2End.y - line2Start.y) * (line1End.x - line1Start.x)) - ((line2End.x - line2Start.x) * (line1End.y - line1Start.y));
        if (denominator == 0) {
            return result;
        }
        a = line1Start.y - line2Start.y;
        b = line1Start.x - line2Start.x;
        numerator1 = ((line2End.x - line2Start.x) * a) - ((line2End.y - line2Start.y) * b);
        numerator2 = ((line1End.x - line1Start.x) * a) - ((line1End.y - line1Start.y) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        // if we cast these lines infinitely in both directions, they intersect here:
        result.x = line1Start.x + (a * (line1End.x - line1Start.x));
        result.y = line1Start.y + (a * (line1End.y - line1Start.y));

        // it is worth noting that this should be the same as:
        // x = line2Start.x + (b * (line2End.x - line2Start.x));
        // y = line2Start.x + (b * (line2End.y - line2Start.y));

        // if line1 is a segment and line2 is infinite, they intersect if:
        if (a > 0 && a < 1) {
            result.onLine1 = true;
        }
        // if line2 is a segment and line1 is infinite, they intersect if:
        if (b > 0 && b < 1) {
            result.onLine2 = true;
        }
        if (crossedName) {
            result.crossed = crossedName;
        }
        // if line1 and line2 are segments, they intersect if both of the above are true
        return result;
    }


    //---------------------
    //Stage management
    function setupStage(canvas) {
        return new createjs.Stage(canvas);
    }

    function findStageByCanvas(canvas_id) {
        var isString = typeof canvas_id == "string";
        var stage = null;

        //Search by canvas_id or $canvas
        for (var i = 0; i < STAGES.length; i++) { //Searches through the main 'avatar' class, not just this instance
            var STAGE = STAGES[i];
            if (isString) {
                if (STAGE.canvas_id == canvas_id) {
                    stage = STAGE.stage;
                    break;
                }
            } else {
                if (STAGE.$canvas == canvas_id) {
                    stage = STAGE.stage;
                    break;
                }
            }
        }
        return stage;
    }

    function addStageByCanvas(options) {
        var item = {};
        if (options.canvas_id) {
            item.canvas_id = options.canvas_id;
            item.$canvas = $(item.canvas_id);
        }
        if (options.$canvas) {
            item.$canvas = options.$canvas;
        }
        if (options.stage) {
            item.stage = options.stage;
        } else {
            throw "error in avatar.js - addStageByCanvas needs a stage to be passed in"
        }
        STAGES.push(item);
    }

    //----------------------
    //Random numbers
    AvatarClass.prototype.randomSetSeed = function (seed) {
        this.face_options = this.face_options || {};
        this.face_options.rand_seed = seed || Math.random();
    };

    function random(face_options) {
        face_options = face_options || {};
        face_options.rand_seed = face_options.rand_seed || Math.random();
        var x = Math.sin(face_options.rand_seed++) * 300000;
        return x - Math.floor(x);
    }

    function randInt(max, face_options) {
        max = max || 100;
        return parseInt(random(face_options) * max + 1);
    }

    function randOption(options, face_options, dontUseVal) {
        var len = options.length;
        var numChosen = randInt(len, face_options) - 1;
        var result = options[numChosen];
        if (dontUseVal) {
            if (result == dontUseVal) {
                numChosen = (numChosen + 1) % len;
                result = options[numChosen];
            }
        }
        return result;
    }

    AvatarClass.prototype._private_functions = {
        getFirstRaceFromData: getFirstRaceFromData,
        registerEvents: registerEvents,
        buildDecoration: buildDecoration,
        buildFaceZones: buildFaceZones,
        addSceneChildren: addSceneChildren,
        transformPathFromLocalCoordinates: transformPathFromLocalCoordinates,
        transformPathFromGlobalCoordinates: transformPathFromGlobalCoordinates,
        transformLineToGlobalCoordinates: transformLineToGlobalCoordinates,
        lineSegmentCompared: lineSegmentCompared,
        transformShapeLine: transformShapeLine,
        comparePoints: comparePoints,
        midPointBetween: midPointBetween,
        createPathFromLocalCoordinates: createPathFromLocalCoordinates,
        createPath: createPath,
        createMultiPathFromLocalCoordinates: createMultiPathFromLocalCoordinates,
        createMultiPath: createMultiPath,
        amountFromVarOrRange: amountFromVarOrRange,
        namePoint: namePoint,
        findPoint: findPoint,
        findShape: findShape,
        turnWordToNumber: turnWordToNumber,
        whereIsPointInBox: whereIsPointInBox,
        checkLineIntersection: checkLineIntersection,
        extrudeHorizontalArc: extrudeHorizontalArc,
        distanceBetween: distanceBetween,
        constrainPolyLineToBox: constrainPolyLineToBox,
        angleBetween: angleBetween,
        hydratePointsAlongLine: hydratePointsAlongLine,
        setupStage: setupStage,
        findStageByCanvas: findStageByCanvas,
        addStageByCanvas: addStageByCanvas,
        random: random,
        randInt: randInt,
        randOption: randOption
    };

    return AvatarClass;
})($, _, net, createjs, Helpers, maths);

//TODO: Is this the best way to have helper functions?
Avatar.getRaces = function () {
    return new Avatar('get_races');
};
