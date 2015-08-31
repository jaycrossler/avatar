var Avatar = (function ($, _, net, createjs, Helpers, maths) {
    //Uses jquery and Underscore and colors.js and createjs's easel.js

    //TODO: Hair Peak have multiple shapes, apply more than one peak
    //TODO: Hair and beard use variables
    //TODO: Eye spacing as fraction of face width
    //TODO: Eye lines shifted, jagged in the middle
    //TODO: Neck like coathanger shape
    //TODO: Cheekbones and shading
    //TODO: Wrinkles
    //TODO: Age progression
    //TODO: Scars and Jewelery
    //TODO: Background images on canvas
    //TODO: Sprite images
    //TODO: Emotions
    //TODO: Outfits
    //TODO: Other Races

    //-----------------------------
    //Private Global variables
    var VERSION = '0.0.3',
        summary = 'Functions for building and drawing a graphical character avatar on a canvas.',
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

        skin_pigment: null,
        face_shape: null,
        skull_thickness: 'Normal',
        chin_divot: null,
        chin_shape: null,

        neck_size: 'Normal',

        eye_color: null,
        eye_shape: null,
        eyelid_shape: null,
        eye_cloudiness: null,

        hair_texture: 'Smooth',
        head_size: 'Normal',
        hairiness: 'Normal',

        nose_shape: null,
        nose_size: null,

        teeth_shape: 'Normal',

        ear_shape: null,
        ear_thickness: null,
        ear_lobe_left: null,
        ear_lobe_right: null,

        //Operating settings, these should become obsolete
        eye_spacing: 0.02,
        forehead_height: null,
        nose_height: null,
        mouth_height: null
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
        skin_type_color_options: [
            {name: 'Fair', highlights: '254,202,182', skin: '245,185,158', cheek: '246,171,142', darkflesh: '217,118,76', deepshadow: '202,168,110'},
            {name: 'Brown', highlights: '229,144,50', skin: '228,131,86', cheek: '178,85,44', darkflesh: '143,70,29', deepshadow: '152,57,17'},
            {name: 'Tanned', highlights: '245,194,151', skin: '234,154,95', cheek: '208,110,56', darkflesh: '168,66,17', deepshadow: '147,68,27'},
            {name: 'White', highlights: '250,220,196', skin: '245,187,149', cheek: '239,165,128', darkflesh: '203,137,103', deepshadow: '168,102,68'},
            {name: 'Medium', highlights: '247,188,154', skin: '243,160,120', cheek: '213,114,75', darkflesh: '154,79,48', deepshadow: '127,67,41'},
            {name: 'Yellow', highlights: '255,218,179', skin: '250,187,134', cheek: '244,159,104', darkflesh: '189,110,46', deepshadow: '138,67,3'},
            {name: 'Pink', highlights: '253,196,179', skin: '245,158,113', cheek: '236,134,86', darkflesh: '182,88,34', deepshadow: '143,60,18'},
            {name: 'Bronzed', highlights: '236,162,113', skin: '233,132,86', cheek: '219,116,75', darkflesh: '205,110,66', deepshadow: '173,83,46'},
            {name: 'Light Brown', highlights: '242,207,175', skin: '215,159,102', cheek: '208,138,86', darkflesh: '195,134,80', deepshadow: '168,112,63'},
            {name: 'Peach', highlights: '247,168,137', skin: '221,132,98', cheek: '183,90,57', darkflesh: '165,87,51', deepshadow: '105,29,15'}
        ],
        gender_options: "Male,Female".split(","),
        thickness_options: [-1, .5, 0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6],  //TODO: Turn these to word options

        face_shape_options: "Oblong,Oval,Round,Rectangular,Square,Triangular,Diamond,Inverted Triangle,Heart".split(","),
        chin_divot_options: "Double,Small,Large,Smooth".split(","),
        chin_shape_options: "Pronounced,Smooth".split(","),

        hair_color_options: "Yellow,Brown,Black,White,Gray,Dark Brown,Dark Yellow,Red".split(","),
        hair_style_options: "Bald,Bowl,Bowl with Peak,Bowl with Big Peak".split(","),
        hairiness_options: "Bald,Thin Hair,Thick Hair,Hairy,Fuzzy,Bearded,Covered in Hair,Fury".split(","), //TODO

        beard_color_options: "Hair,Yellow,Brown,Black,White,Gray,Dark Brown,Dark Yellow,Red".split(","),
        beard_style_options: "None,Full Chin,Chin Warmer,Soup Catcher,Thin Chin Wrap,Thin Low Chin Wrap".split(","),

        nose_shape_options: "Flat,Wide,Thin,Turned up/perky,Normal,Hooked down,Bulbous,Giant Nostrils".split(","),
        nose_size_options: "Tiny,Small,Normal,Large,Big,Giant,Huge".split(","),

        eye_shape_options: "Almond".split(","),
        eye_color_options: "Hazel,Amber,Green,Blue,Gray,Brown,Dark Brown,Black,Violet".split(","),
        eye_lids_options: "None,Smooth,Folded,Thick".split(","), //TODO
        eye_cloudiness_options: "Normal,Clear,Misty".split(","),

        ear_shape_options: "Round".split(","),
        ear_thickness_options: "Wide,Normal,Big,Tall,Splayed".split(","),
        ear_lobe_left_options: "Hanging,Attached".split(","),
        ear_lobe_right_options: "Hanging,Attached,Same".split(","),

        lip_color_options: "#f00,#e00,#d00,#c00,#f10,#f01,#b22,#944".split(","),
        mouth_height_options: [.04, .05, .06, .07],

        nose_height_options: [0, .01, .01],

        forehead_height_options: [.1, .11, .12, .13, .14, .15, .16, .17],
        decorations: []
    }};

    //-----------------------------
    //Initialization
    function AvatarClass(face_options, stage_options, canvas_name) {
        this.version = file_name + ' (version ' + VERSION + ') - ' + summary + ' by ' + author;
        if (face_options == 'get_data_template') {
            stage_options = stage_options || getFirstRaceFromData();
            return this.data[stage_options] || {error: 'race does not exist'};
        } else if (face_options == 'copy_data_template') {
            stage_options = stage_options || getFirstRaceFromData();
            if (this.data[stage_options]) {
                var data = this.data[stage_options];
                data = JSON.parse(JSON.stringify(data));
                return data;
            } else {
                return {error: 'race does not exist'};
            }

        } else if (face_options == 'set_data_template') {
            this.data[stage_options] = canvas_name;
        } else {
            this.drawOrRedraw(face_options, stage_options, canvas_name);
        }
    }

    AvatarClass.prototype.drawOrRedraw = function (face_options, stage_options, canvas_name) {
        if (this.face_options === null) {
            this.initialization_seed = null;
        }

        this.face_options = $.extend({}, this.face_options || _face_options, face_options || {});
        this.stage_options = $.extend({}, this.stage_options || _stage_options, stage_options || {});
        this.event_list = this.event_list || [];
        this.registered_points = this.registered_points || [];

        //Determine the random seed to use.  Either use the one passed in, the existing one, or a random one.
        face_options = face_options || {};
        var rand_seed = face_options.rand_seed || this.initialization_seed || Math.floor(Math.random() * 100000);
        this.initialization_seed = rand_seed;
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
            var existing_stage = findStageByCanvas(this.stage_options.canvas_name);
            if (!this.$canvas && $(this.stage_options.canvas_name)) {
                this.$canvas = $('#' + this.stage_options.canvas_name);
            }

            if (existing_stage) {
                this.stage = existing_stage;
            } else {
                this.stage = setupStage(this.stage_options.canvas_name);
                addStageByCanvas({canvas_id: this.stage_options.canvas_name, $canvas: this.$canvas, stage: this.stage});
            }
        }

        //Turn Decimal color values into hex
        expandFaceColors(this);

        //Draw the faces
        if (this.stage) {
            if (this.faceShapeCollection) {
                this.faceShapeCollection.removeAllChildren();
                this.faceShapeCollection.visible = false;
            }
            var face = this.buildFace(this.face_options);
            this.drawOnStage(face, this.stage);
            this.faceShapeCollection = face;

            registerEvents(this);

            this.stage.update();
        }
    };

    AvatarClass.prototype.data = _data;
    AvatarClass.prototype.getRaceData = function () {
        var race = this.face_options.race || getFirstRaceFromData();
        return _data[race] || _data[getFirstRaceFromData()];
    };

    //-----------------------------
    //Supporting functions
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
    AvatarClass.prototype.buildFace = function (face_options) {
        var container = new createjs.Container();
        this.lines = [];

        var face_zones = buildFaceZones(this);
        if (face_options.style == 'circles') {
            container = buildFace_Circles(container, face_options, face_zones, 'neck,ears,face,eyes,nose,mouth'.split(','));

        } else if (face_options.style == 'lines') {
            var neck = buildNeck_Lines(face_zones, this);
            var face = buildFace_Lines(face_zones, this);
            var nose = buildNose_Lines(face_zones, this);
            var eyes = buildEyes_Lines(face_zones, this);
            var chin = buildChin_Lines(face_zones, this);
            var beard = buildBeard_Lines(face_zones, this);
            var mouth = buildMouth_Lines(face_zones, this);
            var hair = buildHair_Lines(face_zones, this);
            var ears = buildEars_Lines(face_zones, this);
            addSceneChildren(container, [neck, face, chin, beard, nose, eyes, mouth, hair, ears]);
        }
        addSceneChildren(container, buildDecorations(this));

        return container;
    };
    AvatarClass.prototype.randomFaceOption = function (key, dontForceSetting, skipRedraw) {
        var option_name = '';
        var result;
        if (!_.str.endsWith(key, '_options')) {
            key = key + "_options";
        }
        var data = this.getRaceData();
        if (data[key]) {
            var options = data[key];
            option_name = key.split('_options')[0];
            var currentVal = this.face_options[option_name];

            if (!dontForceSetting || (dontForceSetting && !this.face_options[option_name])) {
                result = randOption(options, this.face_options, currentVal);
                this.face_options[option_name] = result;
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
        var p1 = getPoint(this, 'facezone topleft');
        var p2 = getPoint(this, 'facezone bottomright');
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

    function expandFaceColors(avatar) {
        if (avatar.face_options.colors) return;

        //Add in colors based on setting
        var data = avatar.getRaceData();
        var skin_pigment_colors = _.find(data.skin_type_color_options, function (skin) {
            return skin.name == avatar.face_options.skin_pigment
        });
        if (!skin_pigment_colors) skin_pigment_colors = randOption(data.skin_type_color_options, avatar.face_options);

        for (var key in skin_pigment_colors) {
            var val = skin_pigment_colors[key];
            if (key != 'name' && val.substr(0, 1) != "#") {
                skin_pigment_colors[key] = Helpers.rgb2hex(val);
            }
        }
        avatar.face_options.colors = $.extend({}, avatar.face_options.colors || {}, skin_pigment_colors);
        //TODO: vary colors based on charisma
    }

    function buildDecorations(avatar) {
        var shapes = [];
        var data = avatar.getRaceData();

        var canvas_w = avatar.$canvas.width();
        var canvas_h = avatar.$canvas.height();

        _.each(data.decorations || [], function (decoration, i) {
            if (decoration.type == 'rectangle') {
                var p1 = (_.isString(decoration.p1)) ? getPoint(avatar, decoration.p1) : decoration.p1;
                var p2 = (_.isString(decoration.p2)) ? getPoint(avatar, decoration.p2) : decoration.p2;
                if (p1 && _.isObject(p1) && p2 && _.isObject(p2)) {
                    var p1x = parseInt(p1.x);
                    var p1y = parseInt(p1.y);
                    var p2x = parseInt(p2.x - p1.x);
                    var p2y = parseInt(p2.y - p1.y);

                    if (decoration.forceInBounds) {
                        if (p1x < 1) p1x = 1;
                        if (p1y < 1) p1y = 1;
                        if (p2x > canvas_w) p2x = (canvas_w - p1x) - 2;
                        if (p2y > canvas_h) p2y = (canvas_h - p1y) - 2;
                    }

                    var rect = new createjs.Shape();
                    if (decoration.size) rect.graphics.setStrokeStyle(decoration.size);
                    if (decoration.line_color || decoration.color) rect.graphics.beginStroke(decoration.line_color || decoration.color);
                    if (decoration.fill_color || decoration.color) rect.graphics.beginFill(decoration.line_color || decoration.color);
                    rect.alpha = decoration.alpha || 1;
                    rect.graphics.drawRect(p1x, p1y, p2x, p2y);
                    shapes.push(rect);
                    avatar.lines.push({name: decoration.name || 'decoration ' + i, line: [p1, {x: p2x, y: p2y}], shape: rect, scale_x: 1, scale_y: 1, x: 1, y: 1});

                }
            } else if (decoration.type == 'image') {
                //TODO:
            }
        });
        return shapes;
    }

    function buildFaceZones(avatar) {
        var face_options = avatar.face_options;
        var stage_options = avatar.stage_options;
        var stage = avatar.stage;

        var face_zones = {neck: {}, face: {}, nose: {}, ears: {}, eyes: {}, chin: {}, hair: {}};

        var height = (stage_options.size || (stage.canvas.height * stage_options.percent_height)) * (1 - stage_options.buffer);
        var full_height = height;

        var age = maths.clamp(face_options.age, 4, 25);
        var age_size = (50 + age) / 75;  //TODO: Use a Height in Inches
        height *= age_size;

        stage_options.height = height;

        var height_offset = (stage_options.size || (stage.canvas.height * stage_options.percent_height)) * (stage_options.buffer / 2);
        stage_options.height_offset = height_offset;

        var half_height = height / 2;
        stage_options.half_height = half_height;
        face_zones.face_width = half_height * (0.55 + (face_options.thickness / 35));

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
            top: -half_height / 16,
            bottom: 2 * half_height / 12,
            y: y + height_offset + (half_height * (0.8 + face_options.forehead_height)),

            left: -half_height / 8,
            right: 2 * half_height / 8,
            left_x: x + (half_height * (0.75 - face_options.eye_spacing)),
            right_x: x + (half_height * (1.25 + face_options.eye_spacing)),

            iris: {
                top: -half_height / 24,
                bottom: 2 * half_height / 16,
                y: y + height_offset + (half_height * (0.8 + face_options.forehead_height)),

                left: -half_height / 16,
                right: 2 * half_height / 16,
                left_x: x + (half_height * (0.75 - face_options.eye_spacing)),
                right_x: x + (half_height * (1.25 + face_options.eye_spacing))
            },

            pupil: {
                top: -half_height / 65,
                bottom: 2 * half_height / 28,
                y: y + height_offset + (half_height * (0.805 + face_options.forehead_height)),

                left: -half_height / 32,
                right: 2 * half_height / 32,
                left_x: x + (half_height * (0.75 - face_options.eye_spacing)),
                right_x: x + (half_height * (1.25 + face_options.eye_spacing))
            }

        };

        face_zones.ears = {
            top: -half_height / 5,
            bottom: 2 * half_height / 5,
            y: y + height_offset + (half_height * (0.9 + face_options.forehead_height)),

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
            y: y + height_offset + (half_height * (1.13 + (face_options.forehead_height * 1.2) + face_options.nose_height))
        };

        face_zones.mouth = {
            left: -half_height / 6, top: -half_height / 18,
            right: 2 * half_height / 6, bottom: 2 * half_height / 18,
            x: x + half_height,
            y: y + height_offset + (half_height * (1.5 + (face_options.forehead_height / 2) + face_options.nose_height + face_options.mouth_height))
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
    // Face circle makers
    function buildFace_Circles(container, face_options, face_zones, zones_to_draw) {
        var f = face_zones; //Text shortener
        var zone;

        zones_to_draw = zones_to_draw || 'neck,ears,face,eyes,nose,mouth'.split(',');

        if (_.indexOf(zones_to_draw, 'neck') > -1) {
            var neck = new createjs.Shape();
            zone = f.neck;
            neck.graphics.beginStroke(face_options.colors.highlights).beginFill(face_options.colors.skin).drawRect(zone.left, zone.top, zone.right, zone.bottom);
            neck.x = zone.x;
            neck.y = zone.y;
            container.addChild(neck);
        }

        if (_.indexOf(zones_to_draw, 'ears') > -1) {
            var left_ear = new createjs.Shape();
            zone = f.ears;
            left_ear.graphics.beginStroke(face_options.colors.deepshadow).beginFill(face_options.colors.cheek).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            left_ear.x = zone.left_x;
            left_ear.y = zone.y;
            container.addChild(left_ear);

            var right_ear = new createjs.Shape();
            zone = f.ears;
            right_ear.graphics.beginStroke(face_options.colors.deepshadow).beginFill(face_options.colors.cheek).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            right_ear.x = zone.right_x;
            right_ear.y = zone.y;
            container.addChild(right_ear);
        }

        if (_.indexOf(zones_to_draw, 'face') > -1) {
            var face = new createjs.Shape();
            zone = f.face;
            face.graphics.beginStroke(face_options.colors.highlights).beginFill(face_options.colors.skin).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            face.x = zone.x;
            face.y = zone.y;
            container.addChild(face);
        }

        if (_.indexOf(zones_to_draw, 'eyes') > -1) {
            var left_eye = new createjs.Shape();
            zone = f.eyes;
            left_eye.graphics.beginStroke(face_options.colors.deepshadow).beginFill('white').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            left_eye.x = zone.left_x;
            left_eye.y = zone.y;
            container.addChild(left_eye);

            var left_iris = new createjs.Shape();
            zone = f.eyes.iris;
            left_iris.graphics.beginStroke(face_options.colors.deepshadow).beginFill(face_options.eye_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            left_iris.x = zone.left_x;
            left_iris.y = zone.y;
            container.addChild(left_iris);

            var left_pupil = new createjs.Shape();
            zone = f.eyes.pupil;
            left_pupil.graphics.beginFill('black').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            left_pupil.x = zone.left_x;
            left_pupil.y = zone.y;
            container.addChild(left_pupil);

            var right_eye = new createjs.Shape();
            zone = f.eyes;
            right_eye.graphics.beginStroke(face_options.colors.deepshadow).beginFill('white').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            right_eye.x = zone.right_x;
            right_eye.y = zone.y;
            container.addChild(right_eye);

            var right_iris = new createjs.Shape();
            zone = f.eyes.iris;
            right_iris.graphics.beginStroke(face_options.colors.deepshadow).beginFill(face_options.eye_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            right_iris.x = zone.right_x;
            right_iris.y = zone.y;
            container.addChild(right_iris);

            var right_pupil = new createjs.Shape();
            zone = f.eyes.pupil;
            right_pupil.graphics.beginFill('black').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            right_pupil.x = zone.right_x;
            right_pupil.y = zone.y;
            container.addChild(right_pupil);
        }

        if (_.indexOf(zones_to_draw, 'nose') > -1) {
            var nose = new createjs.Shape();
            zone = f.nose;
            nose.graphics.beginStroke(face_options.colors.deepshadow).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            nose.x = zone.x;
            nose.y = zone.y;
            container.addChild(nose);
        }

        if (_.indexOf(zones_to_draw, 'mouth') > -1) {
            var mouth = new createjs.Shape();
            zone = f.mouth;
            mouth.graphics.beginStroke(face_options.colors.deepshadow).beginFill(face_options.lip_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            mouth.x = zone.x;
            mouth.y = zone.y;
            container.addChild(mouth);

            var mouth_line = new createjs.Shape();
            zone = f.mouth;
            mouth_line.graphics.setStrokeStyle(.5 * f.thick_unit).beginStroke('black').moveTo(zone.x + zone.left, zone.y).lineTo(zone.x + zone.right / 2, zone.y);
            container.addChild(mouth_line);
        }

        return container;
    }

    //-----------------------------
    // Face line makers
    function buildFace_Lines(f, avatar) {
        var face_options = avatar.face_options;
        var lines = avatar.lines;

        var shapes = [];
        var squish = 2.94; //2.9 - 3.1 (also adjust ears x offset)

        var zone = f.face;
        var radius_x = 10 * (zone.right - zone.left) / squish;
        var radius_y = 10 * (zone.bottom - zone.top) / squish;
        var options = {type: 'circle'};
        if (face_options.face_shape == 'Oblong') {
            options = {type: 'oval', warp_y: 0.7};
        } else if (face_options.face_shape == 'Oval') {
            options = {type: 'oval', warp_y: 0.55};
        } else if (face_options.face_shape == 'Rectangle') {
            options = {type: 'oval', facet_below: 0.1, warp_y: 0.3};
        } else if (face_options.face_shape == 'Square') {
            options = {type: 'oval', facet_below: 0.1, warp_y: 0.22};
        } else if (face_options.face_shape == 'Inverted Triangle') {
            options = {type: 'oval', facet_below: 0.1, warp_x: 0.6, pinch_bottom: 2};
        } else if (face_options.face_shape == 'Diamond') {
            options = {type: 'oval', warp_x: 0.3};
        } else if (face_options.face_shape == 'Triangular') {
            options = {type: 'oval', raise_below: 0.6, pinch_top: 2, steps: 36};
        } else if (face_options.face_shape == 'Heart') {
            options = {type: 'oval', facet_below: 0.1, warp_x: 0.3, pinch_bottom: 2};
        }
        options = $.extend({}, {facet_below: 0.4, dont_facet_below: 0.8, warp_x: 0.6, warp_y_bottom: 2}, options);

        var face_line = transformShapeLine(options, face_options);

        //TODO: Add Some skin variations, noise, dirtiness
        var fill_colors = [face_options.colors.cheek, face_options.colors.skin, face_options.colors.skin, face_options.colors.cheek];
        var fill_steps = [0,.25,.75,1];

        var face = createPathFromLocalCoordinates(face_line, {
                close_line: true, line_color: face_options.colors.highlights,
                //Adds a gradient inside face
                fill_method: 'linear', fill_colors: fill_colors, fill_steps: fill_steps,
                radius: radius_x * .1},
            radius_x, radius_y);
        face.x = zone.x;
        face.y = zone.y;
        lines.push({name: 'face', line: face_line, shape: face, scale_x: radius_x, scale_y: radius_y, x: zone.x, y: zone.y});
        shapes.push(face);

        return shapes;
    }

    function buildNeck_Lines(f, avatar) {
        var face_options = avatar.face_options;
        var lines = avatar.lines;
        var shapes = [];

        var neck_width = 0.75; //.5-.85
        var neck_curvature = 0.85; //.7 - .95
        var apple_transparency = 0.4; //.3 - .6
        var apple_height = 1.4; //0-2
        if (face_options.gender == 'Female') {
            neck_width *= 0.9;
        }
        if (face_options.face_shape == "Inverted Triangle") {
            neck_width *= 0.9;
        }

        var zone = f.neck;
        var scale_x = (zone.right - zone.left) * neck_width;
        var scale_y = (zone.bottom - zone.top) / 1.5;

        var neck_color = net.brehaut.Color(face_options.colors.skin).darkenByRatio(0.1).toString();
        var neck_line = transformShapeLine({type: 'neck', radius: 5, curvature: neck_curvature}, face_options);
        var neck = createPathFromLocalCoordinates(neck_line, {close_line: true, line_color: face_options.colors.highlights, fill_color: neck_color}, scale_x, scale_y);
        neck.x = zone.x;
        neck.y = zone.y + (f.thick_unit * 175);
        lines.push({name: 'neck', line: neck_line, shape: neck, scale_x: scale_x, scale_y: scale_y, x: zone.x, y: zone.y});
        shapes.push(neck);

        if (face_options.gender == 'Male') {
            var darker_skin = net.brehaut.Color(face_options.colors.skin).darkenByRatio(0.2).toString();
            var neck_apple_line = transformShapeLine({type: 'circle', radius: 0.5}, face_options);
            scale_x = (zone.right - zone.left);
            scale_y = (zone.bottom - zone.top) * apple_height;

            var neck_apple = createPathFromLocalCoordinates(neck_apple_line, {close_line: true, line_color: face_options.colors.skin, fill_color: darker_skin}, scale_x, scale_y);
            neck_apple.x = zone.x;
            neck_apple.y = zone.y + (f.thick_unit * 225);
            neck_apple.alpha = apple_transparency;
            lines.push({name: 'neck_apple', line: neck_apple_line, shape: neck_apple, scale_x: scale_x, scale_y: scale_y, x: zone.x, y: zone.y + (f.thick_unit * 225)});
            shapes.push(neck_apple);
        }

        return shapes;
    }

    function buildEars_Lines(f, avatar) {
        var face_options = avatar.face_options;
        var lines = avatar.lines;
        var shapes = [];

        var zone = f.ears;
        var width = 0.5 * (zone.right - zone.left);
        var height = 0.6 * (zone.bottom - zone.top);

        var ear_height_adjust = 1; //.3-1.2
        var ear_width_adjust = 1; //.7-2
        var right_lobe_height = 0; //0-3
        var left_lobe_height = 0; //0-3
        var inner_cavity_size_adjust = .4; //.3-.6
        var ear_inset_adjust = 2;  //0-5
        var ear_head_height_adjust = 0;  //-20 - 20
        ear_head_height_adjust -= 10;

        if (face_options.ear_thickness == "Wide") {
            ear_width_adjust = 1.5;
            ear_height_adjust = 1.1;
        } else if (face_options.ear_thickness == "Big") {
            ear_width_adjust = 1.9;
            ear_height_adjust = 1.3;

        } else if (face_options.ear_thickness == "Tall") {
            ear_width_adjust = 1.4;
            ear_height_adjust = 1.2;
            ear_head_height_adjust = 5;
        } else if (face_options.ear_thickness == "Small") {
            ear_width_adjust = .8;
            ear_height_adjust = .7;
        } else if (face_options.ear_thickness == "Tiny") {
            ear_width_adjust = .7;
            ear_height_adjust = .4;
            inner_cavity_size_adjust = .4;
        } else if (face_options.ear_thickness == "Splayed") {
            ear_width_adjust = 2;
            ear_height_adjust = 1.2;
            inner_cavity_size_adjust = .5;
        }

        if (face_options.ear_lobe_left == "Hanging") {
            left_lobe_height = 3;
        } else if (face_options.ear_lobe_left == "Attached") {
            left_lobe_height = 0;
        }

        if (face_options.ear_lobe_right == "Hanging") {
            right_lobe_height = 3;
        } else if (face_options.ear_lobe_right == "Attached") {
            right_lobe_height = 0;
        } else if (face_options.ear_lobe_right == "Same") {
            right_lobe_height = left_lobe_height;
        }


        var ear_line_side;
        if (face_options.ear_shape == 'Pointed') {
            ear_line_side = [
                {x: -3, y: -4},
                {x: -5, y: -6, line: true},
                {x: 3, y: -12, line: true},
                {x: 9, y: -6, line: true},
                {x: 3, y: -0},
                {x: 6, y: 4},
                {x: 3, y: 5},
                {x: -3, y: 3}
            ];
        } else {
            ear_line_side = [
                {x: -3, y: -4},
                {x: -5, y: -6},
                {x: 3, y: -8},
                {x: 9, y: -6},
                {x: 3, y: -0},
                {x: 6, y: 4},
                {x: 3, y: 5},
                {x: -3, y: 3}
            ];
        }
        var ear_line_l = [];
        var ear_line_r = [];
        for (var i = 0; i < ear_line_side.length; i++) {
            var y = ear_height_adjust * ear_line_side[i].y;
            var l_offset = 0;
            var r_offset = 0;
            if (i == ear_line_side.length - 1) {
                l_offset = left_lobe_height;
                r_offset = right_lobe_height;
            }
            ear_line_l.push({x: ear_width_adjust * ear_line_side[i].x, y: y + l_offset});
            ear_line_r.push({x: -ear_width_adjust * ear_line_side[i].x, y: y + r_offset});
        }

        var ear_r = createPathFromLocalCoordinates(ear_line_r, {close_line: true, thickness: f.thick_unit, fill_color: face_options.colors.skin, color: face_options.colors.deepshadow}, width, height);
        var x = zone.left_x - (f.thick_unit * ear_inset_adjust);
        var y = zone.y - (f.thick_unit * ear_head_height_adjust);
        ear_r.x = x;
        ear_r.y = y;
        lines.push({name: 'ear right line', line: ear_line_r, shape: ear_r, scale_x: width, scale_y: height, x: x, y: y});
        shapes.push(ear_r);

        var ear_l = createPathFromLocalCoordinates(ear_line_l, {close_line: true, thickness: f.thick_unit, fill_color: face_options.colors.skin, color: face_options.colors.deepshadow}, width, height);
        x = zone.right_x + (f.thick_unit * ear_inset_adjust);
        y = zone.y - (f.thick_unit * ear_head_height_adjust);
        ear_l.x = x;
        ear_l.y = y;
        lines.push({name: 'ear left line', line: ear_line_l, shape: ear_l, scale_x: width, scale_y: height, x: x, y: y});
        shapes.push(ear_l);


        var in_scale = .7;
        var in_x_offset = 2;
        var in_y_offset = -8;
        var darker_ear = net.brehaut.Color(face_options.colors.skin).darkenByRatio(0.2).toString();
        var ear_r_in_top = createPathFromLocalCoordinates(ear_line_r, {close_line: true, thickness: f.thick_unit, fill_color: darker_ear, color: face_options.colors.deepshadow}, width * in_scale, height * in_scale);
        x = zone.left_x - (f.thick_unit * ear_inset_adjust) + (f.thick_unit * in_x_offset);
        y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
        ear_r_in_top.x = x;
        ear_r_in_top.y = y;
        lines.push({name: 'ear right line top in', line: ear_line_r, shape: ear_r_in_top, scale_x: width * in_scale, scale_y: height * in_scale, x: x, y: y});
        shapes.push(ear_r_in_top);

        var ear_l_in_top = createPathFromLocalCoordinates(ear_line_l, {close_line: true, thickness: f.thick_unit, fill_color: darker_ear, color: face_options.colors.deepshadow}, width * in_scale, height * in_scale);
        x = zone.right_x + (f.thick_unit * ear_inset_adjust) - (f.thick_unit * in_x_offset);
        y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
        ear_l_in_top.x = x;
        ear_l_in_top.y = y;
        lines.push({name: 'ear left line top in', line: ear_line_l, shape: ear_l_in_top, scale_x: width * in_scale, scale_y: height * in_scale, x: x, y: y});
        shapes.push(ear_l_in_top);


        width *= inner_cavity_size_adjust;
        height *= inner_cavity_size_adjust;
        in_x_offset = 1;
        in_y_offset = 2;

        var ear_r_in = createPathFromLocalCoordinates(ear_line_r, {close_line: true, thickness: f.thick_unit, fill_color: face_options.colors.darkflesh, color: face_options.colors.deepshadow}, width, height);
        x = zone.left_x - (f.thick_unit * ear_inset_adjust) + (f.thick_unit * in_x_offset);
        y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
        ear_r_in.x = x;
        ear_r_in.y = y;
        lines.push({name: 'ear right line in', line: ear_line_r, shape: ear_r_in, scale_x: 1, scale_y: 1, x: x, y: y});
        shapes.push(ear_r_in);

        var ear_l_in = createPathFromLocalCoordinates(ear_line_l, {close_line: true, thickness: f.thick_unit, fill_color: face_options.colors.darkflesh, color: face_options.colors.deepshadow}, width, height);
        x = zone.right_x + (f.thick_unit * ear_inset_adjust) - (f.thick_unit * in_x_offset);
        y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
        ear_l_in.x = x;
        ear_l_in.y = y;
        lines.push({name: 'ear left line in', line: ear_line_l, shape: ear_l_in, scale_x: 1, scale_y: 1, x: x, y: y});
        shapes.push(ear_l_in);

        return shapes;
    }

    function buildEyes_Lines(f, avatar) {
        var face_options = avatar.face_options;
        var lines = avatar.lines;
        if (!face_options.eye_shape) {
            console.error("ERROR - face_options.eye_shape not set - likely no face_options were set");
        }
        var shapes = [];

        var rotation_amount = 4; //-6 to 15, sets emotion
        var iris_size = 3.6;  // 3.5 to 3.9
        var iris_lift = 1.3;
        var pupil_transparency = 0.7; //.1 - .9 for weird eyes, but .7 works best
        var iris_transparency = 0.5; //.1 - .9 for weird eyes, but .5 works best
        var pupil_color = 'black'; //best dark colors, black or dark blue. red looks freaky
        var eyebrow_thick_start = 4 * f.thick_unit;
        var eyebrow_thick_stop = 2 * f.thick_unit;  //TODO: Still not working fully
        var eye_squint = 1.4;
        var iris_side_movement = -0; // -8 - 8  //TODO: Can go farther once eyes are overdrawn

        var eyebrow_height = 20; //15 - 40
        var eyebrow_transparency = 0.9;
        var eyebrow_rotation = -6; //-6 to 10
        var eyebrow_length = 2; //0-5
        var eyeline_transparency = 0.8;

        if (face_options.gender == 'Female') {
            eyebrow_thick_start *= 1.2;
            eyebrow_thick_stop *= 1.2;
        }

        var eye_fill_colors = ["#fff", "#cbb", "#444"];
        var eye_fill_steps = [0, .92, 1];
        if (face_options.eye_cloudiness == 'Clear') {
            eye_fill_colors = ["#fff", "#edd", "#444"];
        } else if (face_options.eye_cloudiness == 'Pink') {
            eye_fill_colors = ["#fff", "#e88", "#444"];
        } else if (face_options.eye_cloudiness == 'Dark') {
            eye_fill_colors = ["#fff", "#988", "#444"];
        } else if (face_options.eye_cloudiness == 'Misty') {
            eye_fill_colors = ["#fff", "#baa", "#444"];
        } else if (face_options.eye_cloudiness == 'Blue') {
            eye_fill_steps = [0, .8,.92, 1];
            eye_fill_colors = ["#fff", "#99e", "#ddf", "#444"];
        }

        //TODO: Have eyebrow patterns shift

        //TODO: Build a builder function

        //Scales
        var width_eye = (f.eyes.right - f.eyes.left);
        var height_eye = (f.eyes.bottom - f.eyes.top) * eye_squint;
        var width_pupil = (f.eyes.pupil.right - f.eyes.pupil.left);
        var height_pupil = (f.eyes.pupil.bottom - f.eyes.pupil.top);
        var width_iris = (f.eyes.iris.right - f.eyes.iris.left);
        var height_iris = (f.eyes.iris.bottom - f.eyes.iris.top);


        //Left Eye
        var zone = f.eyes;
        var x = zone.left_x;
        var y = zone.y;
        var left_eye_line = [];
        if (face_options.eye_shape == 'Almond') {
            left_eye_line = transformShapeLine([
                {type: 'almond-horizontal', modifier: 'left', radius: 4.2},
                {type: 'pinch', pinch_amount: 0.6, starting_step: -3, ending_step: 4},
                {type: 'pinch', pinch_amount: 0.9, starting_step: -3, ending_step: 9}
            ], face_options);
        }

        var left_eye = createPathFromLocalCoordinates(left_eye_line, {
                close_line: true, line_color: face_options.colors.darkflesh,
                fill_colors: eye_fill_colors, fill_method: 'radial',
                fill_steps: eye_fill_steps, radius: width_eye * .37, x_offset: -(2 * f.thick_unit)},
            width_eye, height_eye);
        left_eye.x = x;
        left_eye.y = y;
        left_eye.rotation = rotation_amount;
        lines.push({name: 'left eye', line: left_eye_line, shape: left_eye, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount});
        shapes.push(left_eye);


        x = zone.left_x;
        y = zone.y - (f.thick_unit * 4);
        var left_eye_line_top = [];
        if (face_options.eye_shape == 'Almond') {
            left_eye_line_top = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 11, ending_step: 19}, face_options);
        }
        var left_eye_top = createPathFromLocalCoordinates(left_eye_line_top, {close_line: false, line_color: face_options.colors.cheek, thickness: f.thick_unit * 5}, width_eye, height_eye);
        left_eye_top.x = x;
        left_eye_top.y = y;
        left_eye_top.alpha = eyeline_transparency;
        left_eye_top.rotation = rotation_amount;
        lines.push({name: 'left eye top', line: left_eye_line_top, shape: left_eye_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount});
        shapes.push(left_eye_top);


        x = zone.left_x + f.thick_unit;
        y = zone.y + (f.thick_unit * 1.5);
        var left_eye_line_bottom = [];
        if (face_options.eye_shape == 'Almond') {
            left_eye_line_bottom = transformShapeLine([
                    {type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 0, ending_step: 9},
                    {type: 'pinch', pinch_amount: 0.7, starting_step: -3, ending_step: 4}
                ]
                , face_options);
        }
        var left_eye_bottom = createPathFromLocalCoordinates(left_eye_line_bottom, {close_line: false, line_color: face_options.colors.darkflesh}, width_eye, height_eye);
        left_eye_bottom.x = x;
        left_eye_bottom.y = y;
        left_eye_bottom.alpha = eyeline_transparency;
        left_eye_bottom.rotation = rotation_amount;
        lines.push({name: 'left eye bottom', line: left_eye_line_bottom, shape: left_eye_bottom, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount});
        shapes.push(left_eye_bottom);


        x = zone.left_x;
        y = zone.y - (f.thick_unit * eyebrow_height);
        var left_eyebrow_line_top = [];
        if (face_options.eye_shape == 'Almond') {
            left_eyebrow_line_top = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 10, ending_step: 17 + eyebrow_length}, face_options);
        }
        var left_eyebrow_top = createPathFromLocalCoordinates(left_eyebrow_line_top, {close_line: false, line_color: face_options.hair_color, thickness: eyebrow_thick_start, thickness_end: eyebrow_thick_stop}, width_eye, height_eye);
        left_eyebrow_top.x = x;
        left_eyebrow_top.y = y;
        left_eyebrow_top.alpha = eyebrow_transparency;
        left_eyebrow_top.rotation = rotation_amount + eyebrow_rotation;
        lines.push({name: 'left eyebrow top', line: left_eyebrow_line_top, shape: left_eyebrow_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount + 5, alpha: eyebrow_transparency});
        shapes.push(left_eyebrow_top);


        x = zone.left_x + (f.thick_unit * 4);
        y = zone.y - (f.thick_unit * 8);
        var left_eyebrow_line_inside = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 14, ending_step: 19}, face_options);
        var left_eyebrow_inside = createPathFromLocalCoordinates(left_eyebrow_line_inside, {close_line: false, line_color: face_options.colors.darkflesh}, width_eye, height_eye);
        left_eyebrow_inside.x = x;
        left_eyebrow_inside.y = y;
        left_eyebrow_inside.alpha = eyeline_transparency;
        left_eyebrow_inside.rotation = rotation_amount + 10;
        lines.push({name: 'left eyebrow inside', line: left_eyebrow_line_inside, shape: left_eyebrow_inside, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount + 10});
        shapes.push(left_eyebrow_inside);


        zone = f.eyes.iris;
        x = zone.left_x + (f.thick_unit * iris_side_movement);
        y = zone.y - (f.thick_unit * iris_lift);
        var left_iris_line = transformShapeLine({type: 'circle', radius: iris_size}, face_options);
        var left_iris = createPathFromLocalCoordinates(left_iris_line, {close_line: true, fill_color: face_options.eye_color}, width_iris, height_iris);
        left_iris.x = x;
        left_iris.y = y;
        left_iris.alpha = iris_transparency;
        lines.push({name: 'left iris', line: left_iris_line, shape: left_iris, scale_x: width_iris, scale_y: height_iris, x: x, y: y, alpha: iris_transparency});
        shapes.push(left_iris);


        zone = f.eyes;
        x = zone.left_x;
        y = zone.y;
        var left_eye_round = createPathFromLocalCoordinates(left_eye_line, {close_line: true, line_color: face_options.colors.darkflesh}, width_eye, height_eye);
        left_eye_round.x = x;
        left_eye_round.y = y;
        left_eye_round.rotation = rotation_amount;
        lines.push({name: 'left eye round', line: left_eye_line, shape: left_eye_round, scale_x: width_eye, scale_y: height_eye, x: x, y: y});
        shapes.push(left_eye_round);


        zone = f.eyes.pupil;
        x = zone.left_x + (f.thick_unit * iris_side_movement);
        y = zone.y - (6 * f.thick_unit) - (iris_lift * f.thick_unit);
        var left_pupil = new createjs.Shape();
        left_pupil.graphics.beginFill(pupil_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        left_pupil.x = x;
        left_pupil.y = y;
        left_pupil.alpha = pupil_transparency;
        lines.push({name: 'left pupil', line: [], shape: left_pupil, scale_x: width_pupil, scale_y: height_pupil, x: x, y: y});
        shapes.push(left_pupil);


        //Right Eye
        zone = f.eyes;
        x = zone.right_x;
        y = zone.y;
        var right_eye_line = transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eye_line);
        var right_eye = createPathFromLocalCoordinates(right_eye_line, {
                close_line: true, line_color: face_options.colors.darkflesh,
                fill_colors: eye_fill_colors, fill_steps: eye_fill_steps, radius: width_eye * .37, x_offset: +(2 * f.thick_unit)},
            width_eye, height_eye);

        right_eye.x = x;
        right_eye.y = y;
        right_eye.rotation = -rotation_amount;
        lines.push({name: 'right eye', line: right_eye_line, shape: right_eye, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});
        shapes.push(right_eye);


        x = zone.right_x;
        y = zone.y - (f.thick_unit * 4);
        var right_eye_line_top = transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eye_line_top);
        var right_eye_top = createPathFromLocalCoordinates(right_eye_line_top, {close_line: false, line_color: face_options.colors.cheek, thickness: f.thick_unit * 5}, width_eye, height_eye);
        right_eye_top.x = x;
        right_eye_top.y = y;
        right_eye_top.rotation = -rotation_amount;
        right_eye_top.alpha = eyeline_transparency;
        lines.push({name: 'right eye top', line: right_eye_line_top, shape: right_eye_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});
        shapes.push(right_eye_top);


        x = zone.right_x - f.thick_unit;
        y = zone.y + (f.thick_unit * 1.5);
        var right_eye_line_bottom = transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eye_line_bottom);
        var right_eye_bottom = createPathFromLocalCoordinates(right_eye_line_bottom, {close_line: false, line_color: face_options.colors.darkflesh, thickness: f.thick_unit}, width_eye, height_eye);
        right_eye_bottom.x = x;
        right_eye_bottom.y = y;
        right_eye_bottom.rotation = -rotation_amount;
        right_eye_bottom.alpha = eyeline_transparency;
        lines.push({name: 'right eye bottom', line: right_eye_line_bottom, shape: right_eye_bottom, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});
        shapes.push(right_eye_bottom);


        x = zone.right_x;
        y = zone.y - (f.thick_unit * eyebrow_height);
        var right_eyebrow_line_top = transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eyebrow_line_top);
        var right_eyebrow_top = createPathFromLocalCoordinates(right_eyebrow_line_top, {close_line: false, line_color: face_options.hair_color, thickness: eyebrow_thick_start, thickness_end: eyebrow_thick_stop}, width_eye, height_eye);
        right_eyebrow_top.x = x;
        right_eyebrow_top.y = y;
        right_eyebrow_top.alpha = eyebrow_transparency;
        right_eyebrow_top.rotation = -rotation_amount - eyebrow_rotation;
        lines.push({name: 'right eyebrow top', line: right_eyebrow_line_top, shape: right_eyebrow_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, alpha: eyebrow_transparency, rotation: -rotation_amount - 5});
        shapes.push(right_eyebrow_top);


        x = zone.right_x - (f.thick_unit * 4);
        y = zone.y - (f.thick_unit * 8);
        var right_eyebrow_line_inside = transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eyebrow_line_inside);
        var right_eyebrow_inside = createPathFromLocalCoordinates(right_eyebrow_line_inside, {close_line: false, line_color: face_options.colors.darkflesh}, width_eye, height_eye);
        right_eyebrow_inside.x = x;
        right_eyebrow_inside.y = y;
        right_eyebrow_inside.rotation = -rotation_amount - 10;
        right_eyebrow_inside.alpha = eyeline_transparency;
        lines.push({name: 'right eyebrow inside', line: right_eyebrow_line_inside, shape: right_eyebrow_inside, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount - 10});
        shapes.push(right_eyebrow_inside);


        zone = f.eyes.iris;
        x = zone.right_x + (f.thick_unit * iris_side_movement);
        y = zone.y - (f.thick_unit * iris_lift);
        var right_iris_line = transformShapeLine({type: 'circle', radius: iris_size}, face_options);
        var right_iris = createPathFromLocalCoordinates(right_iris_line, {close_line: true, fill_color: face_options.eye_color}, width_iris, height_iris);
        right_iris.x = x;
        right_iris.y = y;
        right_iris.alpha = iris_transparency;
        lines.push({name: 'right iris', line: right_iris_line, shape: right_iris, scale_x: width_iris, scale_y: height_iris, x: x, y: y, alpha: iris_transparency});
        shapes.push(right_iris);


        zone = f.eyes;
        x = zone.right_x;
        y = zone.y;
        var right_eye_round = createPathFromLocalCoordinates(right_eye_line, {close_line: true, line_color: face_options.colors.darkflesh}, width_eye, height_eye);
        right_eye_round.x = x;
        right_eye_round.y = y;
        right_eye_round.rotation = -rotation_amount;
        lines.push({name: 'right eye round', line: right_eye_line, shape: right_eye_round, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});
        shapes.push(right_eye_round);


        zone = f.eyes.pupil;
        x = zone.right_x + (f.thick_unit * iris_side_movement);
        y = zone.y - (6 * f.thick_unit) - (iris_lift * f.thick_unit);
        var right_pupil = new createjs.Shape();
        right_pupil.graphics.beginFill(pupil_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        right_pupil.x = x;
        right_pupil.y = y;
        right_pupil.alpha = pupil_transparency;
        lines.push({name: 'right pupil', line: [], shape: right_pupil, scale_x: width_pupil, scale_y: height_pupil, x: x, y: y, alpha: pupil_transparency});
        shapes.push(right_pupil);

        return shapes;
    }

    function buildNose_Lines(f, avatar) {
        var face_options = avatar.face_options;
        var lines = avatar.lines;
        var shapes = [];
        var zone = f.nose;

        var width = zone.radius;
        var height = zone.radius * 1.5;
        var nose_side_offset = 1;
        if (face_options.nose_shape == 'Flat') {
            width *= 0.6;
            nose_side_offset /= 2;
        } else if (face_options.nose_shape == 'Wide') {
            width *= 1.3;
        } else if (face_options.nose_shape == 'Thin') {
            width *= 0.8;
        } else if (face_options.nose_shape == 'Bulbous') {
            width *= 1.3;
            height *= 1.3;
            nose_side_offset++;
        } else if (face_options.nose_shape == 'Giant Nostrils') {
            width *= 1.3;
            height *= 0.8;
            nose_side_offset++;
        }

        var nose_length = 4;
        var thickness = f.thick_unit;
        if (face_options.nose_size == 'Small') {
            nose_length = 3;
        } else if (face_options.nose_size == 'Tiny') {
            nose_length = 2;
        } else if (face_options.nose_size == 'Large') {
            nose_length = 4;
            width *= 1.1;
            height *= 1.1;
            thickness *= 1.1;
        } else if (face_options.nose_size == 'Big') {
            nose_length = 5;
            width *= 1.2;
            height *= 1.3;
            thickness *= 1.4;
            nose_side_offset++;
        } else if (face_options.nose_size == 'Giant') {
            nose_length = 6;
            width *= 1.3;
            height *= 1.4;
            thickness *= 1.5;
            nose_side_offset += 2;
        } else if (face_options.nose_size == 'Huge') {
            nose_length = 7;
            width *= 1.5;
            height *= 1.6;
            thickness *= 2;
            nose_side_offset += 3;
        }


        //Nose bottom line
        var nose_line = [
            {x: 10, y: 5},
            {x: 8, y: 2},
            {x: 5, y: 5},
            {x: 0, y: 8},
            {x: -5, y: 5},
            {x: -8, y: 2},
            {x: -10, y: 5}
        ];
        var l = createPathFromLocalCoordinates(nose_line, {thickness: 2 * thickness, color: face_options.colors.deepshadow}, width, height);
        l.x = f.nose.x;
        l.y = f.nose.y;
        lines.push({name: 'nose bottom line', line: nose_line, shape: l});
        shapes.push(l);


        //Sides of nose, that get taller based on size
        var nose_line_side = [
            {x: 12, y: 8},
            {x: 16, y: 3},
            {x: 9, y: -4},
            {x: 7, y: -7},
            {x: 7, y: -12},
            {x: 6, y: -14},
            {x: 7, y: -16},
            {x: 8, y: -18}
        ];
        var nose_line_l = [];
        var nose_line_r = [];
        var nose_line_l_full = [];
        var nose_line_r_full = [];

        for (var i = 0; i < nose_line_side.length; i++) { //Only draw as many points as nose_size
            if (i < nose_length) {
                nose_line_l.push({x: nose_side_offset + nose_line_side[i].x, y: nose_line_side[i].y});
                nose_line_r.push({x: -nose_side_offset + (-1 * nose_line_side[i].x), y: nose_line_side[i].y});
            }
            nose_line_l_full.push({x: nose_side_offset + nose_line_side[i].x, y: nose_line_side[i].y});
            nose_line_r_full.push({x: -nose_side_offset + (-1 * nose_line_side[i].x), y: nose_line_side[i].y});
        }

        var nose_full_line = nose_line_l_full.concat(nose_line_r_full.reverse());
        var full_nose_line = transformShapeLine({type: 'smooth'}, face_options, nose_full_line);
        var alpha = 0.8;
        var fill_color = net.brehaut.Color(face_options.colors.skin).darkenByRatio(0.05).toString();
        var full_nose = createPathFromLocalCoordinates(full_nose_line, {close_line: true, thickness: f.thick_unit * .2, line_color: face_options.colors.deepshadow, fill_color: fill_color}, width, height);
        full_nose.x = f.nose.x;
        full_nose.y = f.nose.y;
        full_nose.alpha = alpha;
        lines.push({name: 'full nose', line: full_nose_line, shape: full_nose, x: f.nose.x, y: f.nose.y, scale_x: 1, scale_y: 1, alpha: alpha});
        shapes = shapes.concat(full_nose);


        var l_r = createPathFromLocalCoordinates(nose_line_r, {thickness: thickness, thickness_end: thickness * .3, color: face_options.colors.deepshadow}, width, height);
        l_r.x = f.nose.x;
        l_r.y = f.nose.y;
        lines.push({name: 'nose right line', line: nose_line_r, shape: l_r});
        shapes.push(l_r);

        var l_l = createPathFromLocalCoordinates(nose_line_l, {thickness: thickness, thickness_end: thickness * .3, color: face_options.colors.deepshadow}, width, height);
        l_l.x = f.nose.x;
        l_l.y = f.nose.y;
        lines.push({name: 'nose left line', line: nose_line_l, shape: l_l});
        shapes.push(l_l);


        var mouth_high_left_line = [
            {x: -3.5, y: -4},
            {x: -3, y: -2},
            {x: -3.2, y: 0},
            {x: -3.5, y: 2}
        ];
        var l5 = createPathFromLocalCoordinates(mouth_high_left_line, {close_line: false, thickness: 0, color: face_options.colors.deepshadow, fill_color: 'pink'}, width, height);
        l5.x = f.mouth.x;
        l5.y = f.mouth.y - (f.thick_unit * 24);
        l5.alpha = 0.5;
        lines.push({name: 'mouth high left line', line: mouth_high_left_line, shape: l5, x: f.mouth.x, y: f.mouth.y - (f.thick_unit * 24), scale_x: width, scale_y: height});
        shapes.push(l5);


        var mouth_high_right_line = [
            {x: 3.5, y: -4},
            {x: 3, y: -2},
            {x: 3.2, y: 0},
            {x: 3.5, y: 2}
        ];
        var l6 = createPathFromLocalCoordinates(mouth_high_right_line, {close_line: false, thickness: 0, color: face_options.colors.deepshadow, fill_color: 'pink'}, width, height);
        l6.x = f.mouth.x;
        l6.y = f.mouth.y - (f.thick_unit * 24);
        l6.alpha = 0.5;
        lines.push({name: 'mouth high right line', line: mouth_high_right_line, shape: l6, x: f.mouth.x, y: f.mouth.y - (f.thick_unit * 24), scale_x: width, scale_y: height});
        shapes.push(l6);


        return shapes;
    }

    function buildHair_Lines(f, avatar) {
        var face_options = avatar.face_options;
        var lines = avatar.lines;
        var shapes = [];

        var hair_line_level_adjust = -f.thick_unit * 2;
        var inner_hair_x = 10;
        var inner_hair_y = 40;
        var outer_hair_x = 10;
        var outer_hair_y = 20;

        var inner_hair_peak = 0;
        if (face_options.hair_style == "Bowl with Peak") {
            inner_hair_peak = 5;
        } else if (face_options.hair_style == "Bowl with Big Peak") {
            inner_hair_peak = 10;
        } else if (face_options.hair_style == "Bald" || face_options.hairiness == "Bald") {
            return [];
        }

        if (face_options.age < 20) {
            inner_hair_y *= 1.5;
            outer_hair_y *= (face_options.age / 20);
            inner_hair_peak += face_options.age * 2;
        }

        var head_line = transformLineToGlobalCoordinates(lines, 'face');
        var eye_line = transformLineToGlobalCoordinates(lines, 'left eye');

        head_line = hydratePointsAlongLine(head_line, f.thick_unit * 30);

        var zone = f.face;
        var hair_line = lineSegmentCompared(head_line, eye_line, 'above', hair_line_level_adjust);

        if (hair_line && hair_line.length) {
            var hair_dot_array = createPath(hair_line, {dot_array:true, thickness: f.thick_unit * 5, line_color: face_options.hair_color});
            lines.push({name: 'hair dot line', line: hair_line, shape: hair_dot_array, x: 0, y: 0, scale_x: 1, scale_y: 1});
//            shapes = shapes.concat(hair);


            var inner_hair_line = extrudeHorizontalArc(hair_line, f.thick_unit * inner_hair_x, f.thick_unit * inner_hair_y, f.thick_unit * inner_hair_peak);
//            var inner_hair_dots = createPath(inner_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color});
//            shapes = shapes.concat(inner_hair_dots);

            var outer_hair_line = extrudeHorizontalArc(hair_line, f.thick_unit * outer_hair_x, -f.thick_unit * outer_hair_y);
//            var outer_hair_dots = createPath(outer_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color});
//            shapes = shapes.concat(outer_hair_dots);

            var color = face_options.hair_color;
            var fill_color = color;
            if (color == 'White' || color == '#000000') color = 'gray';

            var full_hair_line = inner_hair_line.concat(outer_hair_line.reverse());
            full_hair_line = transformShapeLine({type: 'smooth'}, face_options, full_hair_line);
            var outer_hair = createPath(full_hair_line, {close_line: true, thickness: f.thick_unit * 2, color: color, fill_color: fill_color});
            lines.push({name: 'full hair', line: full_hair_line, shape: outer_hair, x: zone.x, y: zone.y, scale_x: 1, scale_y: 1});

            shapes = shapes.concat(outer_hair);

        }
        return shapes;
    }

    function buildBeard_Lines(f, avatar) {
        var face_options = avatar.face_options;
        var lines = avatar.lines;
        var shapes = [];

        if (face_options.gender == 'Female') return [];

        var hair_line_level_adjust = 5; //-4 - 20, Lots of shapes from combinations of these
        var inner_hair_x = 0;
        var inner_hair_y = 3;
        var outer_hair_x = .5;
        var outer_hair_y = .5;
        var alpha = 0.8;

        if (face_options.beard_style == 'None' || face_options.age < 18) {
            return []
        } else if (face_options.beard_style == 'Full Chin') {
            hair_line_level_adjust = 10;
            inner_hair_x = 1;
            inner_hair_y = 14;
            outer_hair_x = 1;
            outer_hair_y = 2;
            alpha = .9;
        } else if (face_options.beard_style == 'Chin Warmer') {
            hair_line_level_adjust = 1;
            inner_hair_x = 0;
            inner_hair_y = 11;
            outer_hair_x = .5;
            outer_hair_y = .5;
            alpha = .8;
        } else if (face_options.beard_style == 'Soup Catcher') {
            hair_line_level_adjust = 1;
            inner_hair_x = 1;
            inner_hair_y = 15;
            outer_hair_x = 1;
            outer_hair_y = 10;
            alpha = .9;
        } else if (face_options.beard_style == 'Thin Chin Wrap') {
            hair_line_level_adjust = 1;
            inner_hair_x = 1;
            inner_hair_y = 1;
            outer_hair_x = 0;
            outer_hair_y = .2;
            alpha = .4;
        } else if (face_options.beard_style == 'Thin Low Chin Wrap') {
            hair_line_level_adjust = 10;
            inner_hair_x = 1;
            inner_hair_y = 1;
            outer_hair_x = 0;
            outer_hair_y = .2;
            alpha = .3;
        }

        var head_line = transformLineToGlobalCoordinates(lines, 'face');
        var eye_line = transformLineToGlobalCoordinates(lines, 'left eye');

        var beard_line = lineSegmentCompared(head_line, eye_line, 'below', hair_line_level_adjust * 10 * f.thick_unit);

        if (beard_line && beard_line.length && beard_line.length > 2) {
            var beard = createPath(beard_line, {thickness: f.thick_unit * 5, line_color: face_options.hair_color});
            lines.push({name: 'beard line', line: beard_line, shape: beard, x: 0, y: 0, scale_x: 1, scale_y: 1});
//            shapes.push(beard);

            var inner_hair_line = extrudeHorizontalArc(beard_line, -f.thick_unit * inner_hair_x * 10, -f.thick_unit * inner_hair_y * 10);
            var outer_hair_line = extrudeHorizontalArc(beard_line, -f.thick_unit * outer_hair_x * 10, f.thick_unit * outer_hair_y * 10);

            var color = face_options.beard_color || face_options.hair_color;
            if (color == 'Hair') color = face_options.hair_color;
            var fill_color = color;
            if (color == 'White' || color == '#000000') color = 'gray';

            var full_beard_line = outer_hair_line.concat(inner_hair_line.reverse());
            full_beard_line = transformShapeLine({type: 'smooth'}, face_options, full_beard_line);

            var full_beard = createPath(full_beard_line, {close_line: true, thickness: f.thick_unit * .5, line_color: color, fill_color: fill_color});
            full_beard.alpha = alpha;
            lines.push({name: 'full beard', line: full_beard_line, shape: full_beard, x: 0, y: 0, scale_x: 1, scale_y: 1, alpha: alpha});
            shapes = shapes.concat(full_beard);

        }
        return shapes;
    }

    function buildChin_Lines(f, avatar) {
        var face_options = avatar.face_options;
        var lines = avatar.lines;
        var shapes = [];
        var mouth_width = 1; //.6 - 1.3
        var width = (f.mouth.right - f.mouth.left) / 2.6 * mouth_width;
        var height = (f.mouth.bottom - f.mouth.top);

        var chin_line = [
            {x: -5, y: 0},
            {x: 0, y: 1},
            {x: 5, y: 0}
        ];
        var chin_top_line = createPathFromLocalCoordinates(chin_line, {close_line: false, thickness: (f.thick_unit * 2), color: face_options.colors.deepshadow}, width, height);
        var x = f.mouth.x;
        var y = f.mouth.y + (f.thick_unit * 30);
        var alpha = .5;
        chin_top_line.x = x;
        chin_top_line.y = y;
        chin_top_line.alpha = alpha;
        lines.push({name: 'chin top line', line: chin_line, shape: chin_top_line, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
        shapes.push(chin_top_line);

        var chin_mid_line = createPathFromLocalCoordinates(chin_line, {close_line: false, thickness: (f.thick_unit * 7), color: face_options.colors.deepshadow}, width * .9, height);
        x = f.mouth.x;
        y = f.mouth.y + (f.thick_unit * 32);
        alpha = .2;
        chin_mid_line.x = x;
        chin_mid_line.y = y;
        chin_mid_line.alpha = alpha;
        lines.push({name: 'chin mid line', line: chin_line, shape: chin_mid_line, x: x, y: y, alpha: alpha, scale_x: width * .9, scale_y: height});
        shapes.push(chin_mid_line);


        var head_line = transformLineToGlobalCoordinates(lines, 'face');
        var chin_mid_line_piece = transformLineToGlobalCoordinates(lines, 'chin mid line');
        var chin = lineSegmentCompared(head_line, chin_mid_line_piece, 'below', f.thick_unit * -5);

        if (face_options.chin_shape == 'Pronounced') {
            //TODO: This could use some work to make it look more realistic

            if (chin && chin.length && chin.length > 2) {
                chin = transformShapeLine({type:'contract', multiplier:0.7},face_options,chin);

                var chin_fill_colors = [face_options.colors.cheek,face_options.colors.skin];
                var chin_fill_steps = [0, 1];
                var chin_height = comparePoints(chin, 'height');

                var chin_shape = createPath(chin, {
                    close_line:true, thickness: f.thick_unit, smooth:true, line_color: face_options.colors.skin,
                    fill_colors: chin_fill_colors, fill_method: 'radial',
                    fill_steps: chin_fill_steps, radius: chin_height/1.5
                });
                chin_shape.y = (f.thick_unit * 10);
                shapes.push(chin_shape);
            }

        } else if (face_options.chin_shape == 'Oval') {

            if (chin && chin.length && chin.length > 2) {

                var chin_fill_colors = [face_options.colors.cheek,face_options.colors.skin];
                var chin_fill_steps = [0, 1];
                var chin_height = comparePoints(chin, 'height');

                var chin_shape = createPath(chin, {
                    close_line:true, thickness: f.thick_unit, smooth:true, line_color: face_options.colors.skin,
                    fill_colors: chin_fill_colors, fill_method: 'radial',
                    fill_steps: chin_fill_steps, radius: chin_height/2
                });
                chin_shape.y = -f.thick_unit;
                shapes.push(chin_shape);
            }
        }

        var draw_divot = false;
        if (face_options.chin_divot == 'Small') {
            draw_divot = true;
            height /= 2;
        } else if (face_options.chin_divot == 'Large') {
            draw_divot = true;
        } else if (face_options.chin_divot == 'Double') {
            draw_divot = true;
        }

        if (draw_divot) {

            var mid_x = comparePoints(chin, 'x', 'middle');
            var mid_y = comparePoints(chin, 'y', 'middle');

            var chin_divot_line = [
                {x: 0, y: -3},
                {x: 0, y: 0},
                {x: -.5, y: 3}
            ];

            var divot_line = createPathFromLocalCoordinates(chin_divot_line, {close_line: false, thickness: (f.thick_unit * 5), color: face_options.colors.deepshadow}, width, height);
            x = mid_x - (f.thick_unit);
            y = mid_y + (f.thick_unit * 8);
            alpha = .1;
            divot_line.x = x;
            divot_line.y = y;
            divot_line.alpha = alpha;
            divot_line.name = 'chin divot line';
            lines.push({name: 'chin divot line', line: chin_divot_line, shape: divot_line, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
            shapes.push(divot_line);

            if (face_options.chin_divot == 'Double') {
                chin_divot_line = transformShapeLine({type:'reverse', direction: 'horizontal'}, face_options, chin_divot_line);
                var divot_line_2 = createPathFromLocalCoordinates(chin_divot_line, {close_line: false, thickness: (f.thick_unit * 5), color: face_options.colors.deepshadow}, width, height);
                divot_line_2.x = x + (f.thick_unit * 6);
                divot_line_2.y = y;
                divot_line_2.alpha = alpha;
                divot_line_2.name = 'chin divot line 2';
                lines.push({name: 'chin divot line 2', line: chin_divot_line, shape: divot_line_2, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
                shapes.push(divot_line_2);
            }

        }

        return shapes;
    }

    function buildMouth_Lines(f, avatar) {
        var face_options = avatar.face_options;
        var lines = avatar.lines;
        var shapes = [];

        //These can change expression alot
        var mouth_width = 1; //.6 - 1.3
        var bottom_lip_height = 0.5; // 0 - 2
        var bottom_lip_bottom = 1.5; // 1-5
        var top_lip_height = 1.5; //.2 - 1.5
        var top_lip_top = 1; //.2 - 2

        top_lip_top += top_lip_height;

        var lip_thickness = f.thick_unit * 2;
        var width = (f.mouth.right - f.mouth.left) / 2.6 * mouth_width;
        var height = (f.mouth.bottom - f.mouth.top);

        if (face_options.gender == 'Female') {
            lip_thickness *= 1.4;
            bottom_lip_bottom += 1.5;
            bottom_lip_height += 1;
            top_lip_height += 1;
            top_lip_top += 1;
        }

        //Mouth top and bottom line
        var mouth_top_line = [
            {x: -13, y: -2},
            {x: -10, y: -1},
            {x: -5, y: -(top_lip_top * 2)},
            {x: 0, y: -top_lip_top},
            {x: 0, y: -top_lip_top},
            {x: 5, y: -(top_lip_top * 2)},
            {x: 10, y: -1},
            {x: 13, y: -2},

            {x: 10, y: 1},
            {x: 4, y: bottom_lip_height + bottom_lip_bottom},
            {x: 0, y: bottom_lip_height + bottom_lip_bottom - 1},
            {x: -4, y: bottom_lip_height + bottom_lip_bottom},
            {x: -10, y: 1}
        ];
        var l = createPathFromLocalCoordinates(mouth_top_line, {close_line: true, thickness: lip_thickness, color: face_options.colors.deepshadow, fill_color: face_options.lip_color}, width, height);
        l.x = f.mouth.x;
        l.y = f.mouth.y;
        l.name = 'lips';
        lines.push({name: 'lips', line: mouth_top_line, shape: l, x: f.mouth.x, y: f.mouth.y, scale_x: width, scale_y: height});
        shapes.push(l);


//        var tongue_line = [
//            {x: -10, y: 0},
//            {x: 0, y: -top_lip_height},
//            {x: 10, y: 0},
//
//            {x: 10, y: 0},
//            {x: 0, y: bottom_lip_height},
//            {x: -10, y: 0}
//        ];
//        var l2 = createPathFromLocalCoordinates(tongue_line, {close_line: true, thickness: 0, color: face_options.colors.deepshadow, fill_color: 'pink'}, width, height);
//        l2.x = f.mouth.x;
//        l2.y = f.mouth.y;
//        l2.alpha = 0.5;
//        l2.name = 'tongue';
//        lines.push({name: 'tongue', line: tongue_line, shape: l2, x: f.mouth.x, y: f.mouth.y, scale_x: width, scale_y: height});
//        shapes.push(l2);

        var tongue_line = [
            {x: -11, y: -2},
            {x: -10, y: 0},
            {x: -2, y: -top_lip_height},
            {x: 0, y: 1 - top_lip_height},
            {x: 2, y: -top_lip_height},
            {x: 10, y: 0},
            {x: 11, y: -2}


        ];
        var l2 = createPathFromLocalCoordinates(tongue_line, {close_line: false, thickness: 1, color: face_options.colors.deepshadow}, width, height);
        l2.x = f.mouth.x;
        l2.y = f.mouth.y;
        l2.alpha = 0.5;
        l2.name = 'tongue';
        lines.push({name: 'tongue', line: tongue_line, shape: l2, x: f.mouth.x, y: f.mouth.y, scale_x: width, scale_y: height});
        shapes.push(l2);


//
//        var mouth_high_line = [
//            {x: -3, y: 0},
//            {x: 0, y: -0.5},
//            {x: 3, y: 0}
//        ];
//        var l4 = createPathFromLocalCoordinates(mouth_high_line, {close_line: false, thickness: 0, color: face_options.colors.cheek, fill_color: 'pink'}, width, height);
//        l4.x = f.mouth.x;
//        l4.y = f.mouth.y - (f.thick_unit * 24);
//        l4.alpha = 0.5;
//        l4.name = 'mouth high line';
//        lines.push({name: 'mouth high line', line: mouth_high_line, shape: l4, x: f.mouth.x, y: f.mouth.y - (f.thick_unit * 24), scale_x: width, scale_y: height});
//        shapes.push(l4);

        return shapes;
    }

    //-----------------------------
    //Drawing Helpers
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

    function getPoint(avatar, name) {
        //TODO: Have some way to transform from local to global
        //TODO: Use same function name style as getLines
        var existingPoint = _.find(avatar.registered_points, function (point) {
            return point.name == name;
        });
        var found = null;
        if (existingPoint && existingPoint.point) {
            found = existingPoint.point;
        }
        return found;
    }

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

        existing_list = existing_list || [];
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
                        existing_list[c].x = mid_x - ((mid_x - existing_list[c].x) * (options.multiplier||.9));
                        existing_list[c].y = mid_y - ((mid_y - existing_list[c].y) * (options.multiplier||.9));
                    }
                } else {
                    for (c = 0; c < ending_step; c++) {
                        existing_list[c].x = mid_x - ((mid_x - existing_list[c].x) * (options.multiplier||.9));
                        existing_list[c].y = mid_y - ((mid_y - existing_list[c].y) * (options.multiplier||.9));
                    }
                    for (c = starting_step; c < existing_list.length; c++) {
                        existing_list[c].x = mid_x - ((mid_x - existing_list[c].x) * (options.multiplier||.9));
                        existing_list[c].y = mid_y - ((mid_y - existing_list[c].y) * (options.multiplier||.9));
                    }
                }


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
                        existing_list[c].y = axis - existing_list[c].y;
                    }
                } else {  //Assume horizontal
                    for (c = 0; c < existing_list.length; c++) {
                        existing_list[c].x = axis - existing_list[c].x;
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
                existing_list.push({x: -options.radius, y: -options.radius});
                existing_list.push({x: -options.radius, y: -options.radius});
                existing_list.push({x: options.radius, y: -options.radius});
                existing_list.push({x: options.radius, y: -options.radius});

                existing_list.push({x: options.radius * (options.curvature || 1), y: 0});

                existing_list.push({x: options.radius, y: options.radius});
                existing_list.push({x: options.radius, y: options.radius});
                existing_list.push({x: -options.radius, y: options.radius});
                existing_list.push({x: -options.radius, y: options.radius});

                existing_list.push({x: -options.radius * (options.curvature || 1), y: 0});
            }
        });
        return existing_list;
    }

    function comparePoints(existing_list, attribute, cardinality) {
        var result = null;
        if (attribute == 'height') {
            var y_max = comparePoints(existing_list, 'y', 'highest');
            var y_min = comparePoints(existing_list, 'y', 'lowest');
            result = Math.max(y_max - y_min, y_min - y_max);

        } else if (attribute == 'width') {
            var x_max = comparePoints(existing_list, 'x', 'highest');
            var x_min = comparePoints(existing_list, 'x', 'lowest');
            result =  Math.max(x_max - x_min, x_min - x_max);

        } else {
            var lowest = Number.MAX_VALUE;
            var highest = Number.MIN_VALUE;

            _.each(existing_list, function (point) {
                if (point[attribute] > highest) highest = point[attribute];
                if (point[attribute] < lowest) lowest = point[attribute];
            });

            if (cardinality == 'highest') {
                result = highest;
            } else if (cardinality == 'lowest') {
                result = lowest;
            } else if (cardinality == 'middle') {
                result = (highest + lowest) / 2;
            }
        }
        return result;
    }

    function midPointBetween(p1, p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        }
    }

    function createPathFromLocalCoordinates(points_local, style, width_radius, height_radius) {
        var points = [];
        height_radius = height_radius || width_radius;
        for (var p = 0; p < points_local.length; p++) {
            var point = _.clone(points_local[p]);
            var x = (width_radius * point.x / 10);
            var y = (height_radius * point.y / 10);
            point.x = x;
            point.y = y;
            points.push(point);
        }
        return createPath(points, style, Math.max(width_radius, height_radius));
    }

    function findShape(lines, name) {
        var shape = _.find(lines, function (shape) {
            return shape.name == name
        });
        if (!shape) {
            console.log("Error: " + name + " not found");
        }
        return shape || {};
    }

    function createPath(points, style, radius) {
        if (!points || !points.length || points.length < 2) return null;
        style = style || {};

        var color = style.line_color || style.color || 'black';
        var thickness = style.thickness || 1;
        var thickness_end = style.thickness_end || thickness;
        var fill_color = style.fill_color || null;

        //TODO: Line color fades
        //TODO: Line thickness changes
        //TODO: Now, returns shape or array - standardize on one

        var returnedShape;

        if (style.dot_array) {
            var pointList = [];

            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                var circle = new createjs.Shape();
                circle.graphics.beginStroke(color).drawEllipse(point.x - (thickness / 2), point.y - (thickness / 2), thickness, thickness);

                if (style.x) circle.x = style.x;
                if (style.y) circle.y = style.y;
                pointList.push(circle);
            }
            returnedShape = pointList;

        } else {
            var line = new createjs.Shape();

            line.graphics.beginStroke(color).setStrokeStyle(thickness);

            if (fill_color) {
                line.graphics.beginFill(fill_color);
            } else if (style.fill_colors) {
                if (style.fill_method == 'linear') {
                    line.graphics.beginLinearGradientFill(
                        style.fill_colors, style.fill_steps || [0, 1],
                        style.x_offset_start || -style.radius || -10, style.y_offset_start || 0,
                        style.x_offset_end || style.radius || 10, style.y_offset_end || 0)
                } else { //Assume Radial
                    line.graphics.beginRadialGradientFill(
                        style.fill_colors, style.fill_steps || [0, 1],
                        style.x_offset || comparePoints(points, 'x', 'middle'), style.y_offset || comparePoints(points, 'y', 'middle'), 0,
                        style.x_offset || comparePoints(points, 'x', 'middle'), style.y_offset || comparePoints(points, 'y', 'middle'), style.radius || radius || 10);
                }
            }

            var p1, p2, p3, mid;

            if (style.close_line) {
                p1 = points[0];
                p2 = points[1];
                mid = midPointBetween(p1, p2);
                line.graphics.moveTo(mid.x, mid.y);
            } // TODO: There's some overlap if closed - maybe don't draw p0, and just loop through p1,p2?

            for (var i = 1; i < points.length; i++) {
                p1 = points[(points.length + i - 1) % (points.length)];
                p2 = points[i];
                mid = midPointBetween(p1, p2);
                if (p1.line) {
                    line.graphics.lineTo(p1.x, p1.y);
                } else {
                    line.graphics.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y);
                }

                if (thickness != thickness_end) {
                    var current_thickness = thickness + ((i / points.length) * (thickness_end - thickness));
//TODO: Create new Shapes if size changes by pixel integer amount?
//                    line.graphics.setStrokeStyle(current_thickness);
//                    console.log(i + ': ' + current_thickness + ' - ' + thickness + ' - ' + thickness_end);
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
            if (style.x) line.x = style.x;
            if (style.y) line.y = style.y;
            returnedShape = line;
        }
        return returnedShape;
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

    function hydratePointsAlongLine(line, spacing) {
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

        return newLine;
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

    return AvatarClass; //TODO: Is return all the 'this' variables, should return only version and two functions
})($, _, net, createjs, Helpers, maths);