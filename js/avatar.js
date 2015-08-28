var Avatar = (function ($, _, net, createjs) {
    //Uses jquery and Underscore and colors.js and createjs's easel.js

    //TODO: Head sizes
    //TODO: Hair Peak have multiple shapes, apply more than one peak
    //TODO: Hair and beard use variables
    //TODO: Beard weird on right side
    //TODO: Eye spacing as fraction of face width
    //TODO: Eye lines shifted, jagged in the middle
    //TODO: Ear lines
    //TODO: Cheekbones
    //TODO: Wrinkles
    //TODO: Age progression
    //TODO: Scars and Jewlery
    //TODO: Background images on canvas
    //TODO: Click areas are off when big?

    //-----------------------------
    //Private Global variables
    var VERSION = '0.0.2',
        summary = 'Functions for building and drawing a graphical character avatar on a canvas.',
        author = 'Jay Crossler - http://github.com/jaycrossler',
        file_name = 'avatar.js';

    var _face_options = {
        style: 'lines',
        rand_seed: 0,

        //'Living' settings that can change over time
        age: 30,
        era: 'Industrial',
        thickness: 0,
        cleanliness: 0,
        hair_style: 'Scruffy',
        hair_color: null,
        beard_color: null,
        beard_style: null,
        skin_texture: 'Normal',
        teeth_condition: 'Normal',

        emotionality: 0,
        emotion_shown: 'none',
        tattoos: [],
        jewelry: [],
        scars: [],

        //DNA settings that don't change easily
        gender: null,
        height: 0,
        skin_pigment: null,
        eye_shape: null, //TODO
        eyelid_shape: null, //TODO
        hair_texture: 'Smooth',
        head_size: 'Normal',
        hairiness: 'Normal',
        face_shape: null,
        neck_size: 'Normal',
        nose_shape: null,
        nose_size: null,
        teeth_shape: 'Normal',
        skull_thickness: 'Normal',
        eye_color: null,


        //Operating settings, these should become obsolete
        lip_color: 'Red',
        eye_spacing: 0.02,
        forehead_height: 0.1,
        nose_height: 0,
        mouth_height: 0.05
    };
    var _stage_options = {
        percent_height: 1,
        buffer: 0.1,
        x: 0,
        y: 0
    };
    var STAGES = []; //Global list of all stages used to lookup any existing ones

    //-----------------------------
    var _data = {
        skin_type_color_options: [
            {name: 'Fair', highlights: '254,202,182', skin: '245,185,158', cheek: '246,171,142', darkflesh: '217,118,76', deepshadow: '202,168,110'},
            {name: 'Light Brown', highlights: '229,144,50', skin: '228,131,86', cheek: '178,85,44', darkflesh: '143,70,29', deepshadow: '152,57,17'},
            {name: 'Tanned', highlights: '245,194,151', skin: '234,154,95', cheek: '208,110,56', darkflesh: '168,66,17', deepshadow: '147,68,27'},
            {name: 'White', highlights: '250,220,196', skin: '245,187,149', cheek: '239,165,128', darkflesh: '203,137,103', deepshadow: '168,102,68'},
//            {name: 'Green', highlights: '250,220,196', skin: '50,187,80', cheek: '239,165,128', darkflesh: '203,137,103', deepshadow: '168,102,68'},
            {name: 'Medium', highlights: '247,188,154', skin: '243,160,120', cheek: '213,114,75', darkflesh: '154,79,48', deepshadow: '127,67,41'}
        ],
        gender_options: "Male,Female".split(","),
        face_shape_options: "Oblong,Oval,Round,Rectangular,Square,Triangular,Diamond,Inverted Triangle,Heart".split(","),
        hair_color_options: "Yellow,Brown,Black,White,Gray,Dark Brown,Dark Yellow,Red".split(","),
        beard_color_options: "Hair,Yellow,Brown,Black,White,Gray,Dark Brown,Dark Yellow,Red".split(","),
        beard_style_options: "None,Full Chin,Chin Warmer,Soup Catcher,Thin Chin Wrap".split(","),
        hairiness_options: "Bald,Thin Hair,Thick Hair,Hairy,Fuzzy,Bearded,Covered in Hair,Fury".split(","), //TODO
        nose_shape_options: "Flat,Wide,Thin,Turned up/perky,Normal,Hooked down,Bulbous,Giant Nostrils".split(","),
        nose_size_options: "Tiny,Small,Normal,Large,Big,Giant,Huge".split(","),
        eye_color_options: "Hazel,Amber,Green,Blue,Gray,Brown,Dark Brown,Black,Red,Violet".split(","),
        eye_lids_options: "None,Smooth,Folded,Thick".split(","), //TODO
        thickness_options: [-1, .5, 0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6],
        eye_shape_options: "Almond".split(",")
    };


    //-----------------------------
    //Initialization
    function AvatarClass(face_options, stage_options, canvas_name) {
        this.drawOrRedraw(face_options, stage_options, canvas_name);
    }

    AvatarClass.prototype.drawOrRedraw = function (face_options, stage_options, canvas_name) {
        this.face_options = $.extend({}, this.face_options || _face_options, face_options || {});
        this.stage_options = $.extend({}, this.stage_options || _stage_options, stage_options || {});

        var rand_seed = this.face_options.rand_seed || Math.floor(Math.random() * 100000);
        this.randomSetSeed(rand_seed);

        for (var key in _data) {
            this.randomFaceOption(key, true, true);
        }

        if (canvas_name) {
            this.stage_options.canvas_name = canvas_name;
        }
        if (this.stage_options.canvas_name) {
            var existing_stage = findStageByCanvas(this.stage_options.canvas_name);
            if (!this.$canvas && $(this.stage_options.canvas_name)) {
                this.$canvas = $(this.stage_options.canvas_name);
            }

            if (existing_stage) {
                this.stage = existing_stage;
            } else {
                this.stage = setupStage(this.stage_options.canvas_name);
                addStageByCanvas({canvas_id: this.stage_options.canvas_name, $canvas: this.$canvas, stage: this.stage});
            }
        }

        expandFaceColors(this.face_options);

        if (this.stage) {
            if (this.faceShapeCollection) {
                this.faceShapeCollection.removeAllChildren();
                this.faceShapeCollection.visible = false;
            }
            var face = this.buildFace(this.face_options, this.stage_options, this.stage);
            this.drawOnStage(face, this.stage);
            this.faceShapeCollection = face;
            this.stage.enableMouseOver();

            this.stage.update();
        }
    };

    AvatarClass.prototype.version = function () {
        return file_name + ' (version ' + VERSION + ') - ' + summary + ' by ' + author;
    }();
    AvatarClass.prototype.data = _data;

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
    AvatarClass.prototype.buildFace = function (face_options, stage_options, stage) {
        var container = new createjs.Container();
        var avatar = this;
        this.lines = [];

        var face_zones = buildFaceZones(face_options, stage_options, stage);
        if (face_options.style == 'circles') {
            container = buildFace_Circles(container, face_options, face_zones, 'neck,ears,face,eyes,nose,mouth'.split(','));

        } else if (face_options.style == 'lines') {
            var neck = buildNeck_Lines(face_zones, face_options, this.lines);
            var face = buildFace_Lines(face_zones, face_options, this.lines);
            var nose = buildNose_Lines(face_zones, face_options, this.lines);
            var eyes = buildEyes_Lines(face_zones, face_options, this.lines);
            var beard = buildBeard_Lines(face_zones, face_options, this.lines);
            var mouth = buildMouth_Lines(face_zones, face_options, this.lines);
            var hair = buildHair_Lines(face_zones, face_options, this.lines);
            var ears = buildEars_Lines(face_zones, face_options, this.lines);
            addSceneChildren(container, [neck, face, nose, eyes, beard, mouth, hair, ears]);

            findShape(this.lines, 'neck').shape.addEventListener("click", function () {
                avatar.randomFaceOption('thickness');
            });
            findShape(this.lines, 'face').shape.addEventListener("click", stage_options.face_click || function () {
                avatar.randomFaceOption('face_shape');
            });
            findShape(this.lines, 'face').shape.addEventListener("mouseover", function () {
                $('#avatar_name').text(avatar.face_options.name || "Avatar");
            });

            findShape(this.lines, 'nose bottom line').shape.addEventListener("click", function () {
                avatar.randomFaceOption('nose_shape', false, true);
                avatar.randomFaceOption('nose_size');
            });
            findShape(this.lines, 'right eye').shape.addEventListener("click", function () {
                avatar.randomFaceOption('eye_color');
            });
            findShape(this.lines, 'left eye').shape.addEventListener("click", function () {
                avatar.randomFaceOption('eye_color');
            });
            findShape(this.lines, 'right iris').shape.addEventListener("click", function () {
                avatar.randomFaceOption('eye_color');
            });
            findShape(this.lines, 'left iris').shape.addEventListener("click", function () {
                avatar.randomFaceOption('eye_color');
            });
            findShape(this.lines, 'lips').shape.addEventListener("click", function () {
                avatar.randomFaceOption('gender');
            });
            findShape(this.lines, 'tongue').shape.addEventListener("click", function () {
                avatar.randomFaceOption('gender');
            });
            findShape(this.lines, 'full hair').shape.addEventListener("click", function () {
                avatar.randomFaceOption('hair_color');
            });
            var beardshape = findShape(this.lines, 'full beard');
            if (beardshape && beardshape.shape) beardshape.shape.addEventListener("click", function () {
                avatar.randomFaceOption('beard_color');
            });

        }
        return container;
    };
    AvatarClass.prototype.randomFaceOption = function (key, dontForceSetting, skipRedraw) {
        var option_name = '';
        var result;
        if (!_.str.endsWith(key, '_options')) {
            key = key + "_options";
        }
        if (_data[key]) {
            var options = _data[key];
            option_name = key.split('_options')[0];

            if (!dontForceSetting || (dontForceSetting && !this.face_options[option_name])) {
                result = randOption(options, this.face_options);
                this.face_options[option_name] = result;
            }

        }
        if (!skipRedraw) {
            this.drawOrRedraw();
        }
        return result;
    };

    //================
    //Private functions
    function expandFaceColors(face_options) {

        if (face_options.colors) return;

        //Add in colors based on setting
        //TODO: Make this generic
        var skin_pigment_colors = _.find(_data.skin_type_color_options, function (skin) {
            return skin.name == face_options.skin_pigment
        });
        if (!skin_pigment_colors) skin_pigment_colors = randOption(_data.skin_type_color_options, face_options);

        for (var key in skin_pigment_colors) {
            var val = skin_pigment_colors[key];
            if (key != 'name' && val.substr(0, 1) != "#") {
                skin_pigment_colors[key] = Helpers.rgb2hex(val);
            }
        }
        face_options.colors = $.extend({}, face_options.colors || {}, skin_pigment_colors);
        //TODO: vary colors based on charisma
    }

    function buildFaceZones(face_options, stage_options, stage) {

        var face_zones = {neck: {}, face: {}, nose: {}, ears: {}, eyes: {}, chin: {}, hair: {}};

        var height = (stage_options.size || (stage.canvas.height * stage_options.percent_height)) * (1 - stage_options.buffer);
        stage_options.height = height;

        var height_offset = (stage_options.size || (stage.canvas.height * stage_options.percent_height)) * (stage_options.buffer / 2);
        stage_options.height_offset = height_offset;

        var half_height = height / 2;
        stage_options.half_height = half_height;
        face_zones.face_width = half_height * (0.55 + (face_options.thickness / 35));

        var x = stage_options.x;
        var y = stage_options.y;

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
    function buildFace_Lines(f, face_options, lines) {
        var shapes = [];
        var squish = 2.94; //2.9 - 3.1 (also adjust ears x offset)

        var zone = f.face;
        var face_line = [];
        var radius_x = 10 * (zone.right - zone.left) / squish;
        var radius_y = 10 * (zone.bottom - zone.top) / squish;
        if (face_options.face_shape == 'Oblong') {
            face_line = transformShapeLine({type: 'oval', warp_y: 0.7}, face_options);
        } else if (face_options.face_shape == 'Oval') {
            face_line = transformShapeLine({type: 'oval', warp_y: 0.55}, face_options);
        } else if (face_options.face_shape == 'Rectangle') {
            face_line = transformShapeLine({type: 'oval', facet_below: 0.1, warp_y: 0.3}, face_options);
        } else if (face_options.face_shape == 'Square') {
            face_line = transformShapeLine({type: 'oval', facet_below: 0.1, warp_y: 0.22}, face_options);
        } else if (face_options.face_shape == 'Inverted Triangle') {
            face_line = transformShapeLine({type: 'oval', facet_below: 0.1, warp_x: 0.6, pinch_bottom: 2}, face_options);
        } else if (face_options.face_shape == 'Diamond') {
            face_line = transformShapeLine({type: 'oval', warp_x: 0.3}, face_options);
        } else if (face_options.face_shape == 'Triangular') {
            face_line = transformShapeLine({type: 'oval', facet_below: 0.4, dont_face_below: 0.8, warp_x: 0.6, raise_below: 0.6, warp_y_bottom: 2, pinch_top: 2, steps: 36}, face_options);
        } else if (face_options.face_shape == 'Heart') {
            face_line = transformShapeLine({type: 'oval', facet_below: 0.1, warp_x: 0.3, pinch_bottom: 2}, face_options);
        } else {
            face_line = transformShapeLine({type: 'circle'}, face_options);
        }

        var l = createPathFromLocalCoordinates(face_line, {close_line: true, line_color: face_options.colors.highlights, fill_color: face_options.colors.skin}, radius_x, radius_y);
        l.x = zone.x;
        l.y = zone.y;
        lines.push({name: 'face', line: face_line, shape: l, scale_x: radius_x, scale_y: radius_y, x: zone.x, y: zone.y});
        shapes.push(l);

        return shapes;
    }

    function buildNeck_Lines(f, face_options, lines) {
        var shapes = [];

        var neck_width = 0.75; //.5-.85
        var neck_curvature = 0.85; //.7 - .95
        var apple_transparency = 0.4; //.3 - .6
        var apple_height = 1.4; //0-2
        if (face_options.gender == 'Female') {
            neck_width *= 0.9;
        }
        var zone = f.neck;
        var scale_x = (zone.right - zone.left) * neck_width;
        var scale_y = (zone.bottom - zone.top) / 1.5;

        var neck_line = transformShapeLine({type: 'neck', radius: 5, curvature: neck_curvature}, face_options);
        var neck = createPathFromLocalCoordinates(neck_line, {close_line: true, line_color: face_options.colors.highlights, fill_color: face_options.colors.skin}, scale_x, scale_y);
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

    function buildEars_Lines(f, face_options, lines) {
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

        var ear_line_side = [
            {x: -3, y: -4},
            {x: -5, y: -6},
            {x: 3, y: -8},
            {x: 9, y: -6},
            {x: 3, y: -0},
            {x: 6, y: 4},
            {x: 3, y: 5},
            {x: -3, y: 3}
        ];
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


        width *= inner_cavity_size_adjust;
        height *= inner_cavity_size_adjust;

        var ear_r_in = createPathFromLocalCoordinates(ear_line_r, {close_line: true, thickness: f.thick_unit, fill_color: face_options.colors.darkflesh, color: face_options.colors.deepshadow}, width, height);
        x = zone.left_x - (f.thick_unit * ear_inset_adjust);
        y = zone.y - (f.thick_unit * ear_head_height_adjust);
        ear_r_in.x = x;
        ear_r_in.y = y;
        lines.push({name: 'ear right line in', line: ear_line_r, shape: ear_r_in, scale_x: 1, scale_y: 1, x: x, y: y});
        shapes.push(ear_r_in);

        var ear_l_in = createPathFromLocalCoordinates(ear_line_l, {close_line: true, thickness: f.thick_unit, fill_color: face_options.colors.darkflesh, color: face_options.colors.deepshadow}, width, height);
        x = zone.right_x + (f.thick_unit * ear_inset_adjust);
        y = zone.y - (f.thick_unit * ear_head_height_adjust);
        ear_l_in.x = x;
        ear_l_in.y = y;
        lines.push({name: 'ear left line in', line: ear_line_l, shape: ear_l_in, scale_x: 1, scale_y: 1, x: x, y: y});
        shapes.push(ear_l_in);

        return shapes;
    }

    function buildEyes_Lines(f, face_options, lines) {
        if (!face_options.eye_shape) {
            console.error("ERROR - face_options.eye_shape not set - likely no face_options were set");
        }
        var shapes = [];

        var rotation_amount = 4; //-6 to 15, sets emotion
        var iris_size = 2.8;  // 2.7 to 2.9
        var pupil_transparency = 0.7; //.1 - .9 for weird eyes, but .7 works best
        var iris_transparency = 0.5; //.1 - .9 for weird eyes, but .5 works best
        var pupil_color = 'black'; //best dark colors, black or dark blue. red looks freaky
        var eyebrow_thick_start = 4 * f.thick_unit;
        var eyebrow_thick_stop = 2 * f.thick_unit;  //TODO: Still not working fully

        var eyebrow_height = 20; //15 - 40
        var eyebrow_transparency = 0.9;

        if (face_options.gender == 'Female') {
            eyebrow_thick_start *= 1.2;
            eyebrow_thick_stop *= 1.2;
        }

        //TODO: Have eyebrow patterns shift

        //TODO: Change this to mirror lines on each side, maybe build a builder function

        //Left Eye
        var zone = f.eyes;
        var scale_x = (zone.right - zone.left);
        var scale_y = (zone.bottom - zone.top);
        var x = zone.left_x;
        var y = zone.y;
        var left_eye_line = [];
        if (face_options.eye_shape == 'Almond') {
            left_eye_line = transformShapeLine([
                {type: 'almond-horizontal', modifier: 'left', radius: 4.2},
                {type: 'pinch', pinch_amount: 0.5, starting_step: -3, ending_step: 4}
            ], face_options);
        }
        var left_eye = createPathFromLocalCoordinates(left_eye_line, {close_line: true, line_color: face_options.colors.darkflesh, fill_color: 'white'}, scale_x, scale_y);
        left_eye.x = x;
        left_eye.y = y;
        left_eye.rotation = rotation_amount;
        lines.push({name: 'left eye', line: left_eye_line, shape: left_eye, scale_x: scale_x, scale_y: scale_y, x: x, y: y, rotation: rotation_amount});
        shapes.push(left_eye);


        x = zone.left_x;
        y = zone.y - (f.thick_unit * 4);
        var left_eye_line_top = [];
        if (face_options.eye_shape == 'Almond') {
            left_eye_line_top = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 11, ending_step: 19}, face_options);
        }
        var left_eye_top = createPathFromLocalCoordinates(left_eye_line_top, {close_line: false, line_color: face_options.colors.cheek, thickness: f.thick_unit * 5}, scale_x, scale_y);
        left_eye_top.x = x;
        left_eye_top.y = y;
        left_eye_top.rotation = rotation_amount;
        lines.push({name: 'left eye top', line: left_eye_line_top, shape: left_eye_top, scale_x: scale_x, scale_y: scale_y, x: x, y: y, rotation: rotation_amount});
        shapes.push(left_eye_top);


        x = zone.left_x;
        y = zone.y + (f.thick_unit * 3);
        var left_eye_line_bottom = [];
        if (face_options.eye_shape == 'Almond') {
            left_eye_line_bottom = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 1, ending_step: 7}, face_options);
        }
        var left_eye_bottom = createPathFromLocalCoordinates(left_eye_line_bottom, {close_line: false, line_color: face_options.colors.cheek, thickness: 4* f.thick_unit}, scale_x, scale_y);
        left_eye_bottom.x = x;
        left_eye_bottom.y = y;
        left_eye_bottom.rotation = rotation_amount;
        lines.push({name: 'left eye bottom', line: left_eye_line_bottom, shape: left_eye_bottom, scale_x: scale_x, scale_y: scale_y, x: x, y: y, rotation: rotation_amount});
        shapes.push(left_eye_bottom);


        x = zone.left_x;
        y = zone.y - (f.thick_unit * eyebrow_height);
        var left_eyebrow_line_top = [];
        if (face_options.eye_shape == 'Almond') {
            left_eyebrow_line_top = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 10, ending_step: 19}, face_options);
        }
        var left_eyebrow_top = createPathFromLocalCoordinates(left_eyebrow_line_top, {close_line: false, line_color: face_options.hair_color, thickness: eyebrow_thick_start, thickness_end: eyebrow_thick_stop}, scale_x, scale_y);
        left_eyebrow_top.x = x;
        left_eyebrow_top.y = y;
        left_eyebrow_top.alpha = eyebrow_transparency;
        left_eyebrow_top.rotation = rotation_amount + 5;
        lines.push({name: 'left eyebrow top', line: left_eyebrow_line_top, shape: left_eyebrow_top, scale_x: scale_x, scale_y: scale_y, x: x, y: y, rotation: rotation_amount + 5, alpha: eyebrow_transparency});
        shapes.push(left_eyebrow_top);


        x = zone.left_x + (f.thick_unit * 4);
        y = zone.y - (f.thick_unit * 8);
        var left_eyebrow_line_inside = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 14, ending_step: 19}, face_options);
        var left_eyebrow_inside = createPathFromLocalCoordinates(left_eyebrow_line_inside, {close_line: false, line_color: face_options.colors.darkflesh}, scale_x, scale_y);
        left_eyebrow_inside.x = x;
        left_eyebrow_inside.y = y;
        left_eyebrow_inside.rotation = rotation_amount + 10;
        lines.push({name: 'left eyebrow inside', line: left_eyebrow_line_inside, shape: left_eyebrow_inside, scale_x: scale_x, scale_y: scale_y, x: x, y: y, rotation: rotation_amount + 10});
        shapes.push(left_eyebrow_inside);


        zone = f.eyes.iris;
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.left_x;
        y = zone.y;
        var left_iris_line = transformShapeLine({type: 'circle', radius: iris_size}, face_options);
        var left_iris = createPathFromLocalCoordinates(left_iris_line, {close_line: true, fill_color: face_options.eye_color}, scale_x, scale_y);
        left_iris.x = x;
        left_iris.y = y;
        left_iris.alpha = iris_transparency;
        lines.push({name: 'left iris', line: left_iris_line, shape: left_iris, scale_x: scale_x, scale_y: scale_y, x: x, y: y, alpha: iris_transparency});
        shapes.push(left_iris);


        zone = f.eyes;
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.left_x;
        y = zone.y;
        var left_eye_round = createPathFromLocalCoordinates(left_eye_line, {close_line: true, line_color: face_options.colors.darkflesh}, scale_x, scale_y);
        left_eye_round.x = x;
        left_eye_round.y = y;
        left_eye_round.rotation = rotation_amount;
        lines.push({name: 'left eye round', line: left_eye_line, shape: left_eye_round, scale_x: scale_x, scale_y: scale_y, x: x, y: y});
        shapes.push(left_eye_round);


        zone = f.eyes.pupil;
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.left_x;
        y = zone.y - (5 * f.thick_unit);
        var left_pupil = new createjs.Shape();
        left_pupil.graphics.beginFill(pupil_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        left_pupil.x = x;
        left_pupil.y = y;
        left_pupil.alpha = pupil_transparency;
        lines.push({name: 'left pupil', line: [], shape: left_pupil, scale_x: scale_x, scale_y: scale_y, x: x, y: y});
        shapes.push(left_pupil);


        //Right Eye
        zone = f.eyes;
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y;
        var right_eye_line = [];
        if (face_options.eye_shape == 'Almond') {
            right_eye_line = transformShapeLine([
                {type: 'almond-horizontal', modifier: 'right', radius: 4.2},
                {type: 'pinch', pinch_amount: 0.5, starting_step: 14, ending_step: 21}
            ], face_options);
        }
        var right_eye = createPathFromLocalCoordinates(right_eye_line, {close_line: true, line_color: face_options.colors.darkflesh, fill_color: 'white'}, scale_x, scale_y);
        right_eye.x = x;
        right_eye.y = y;
        right_eye.rotation = -rotation_amount;
        lines.push({name: 'right eye', line: right_eye_line, shape: right_eye, scale_x: scale_x, scale_y: scale_y, x: x, y: y, rotation: -rotation_amount});
        shapes.push(right_eye);


        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y - (f.thick_unit * 4);
        var right_eye_line_top = [];
        if (face_options.eye_shape == 'Almond') {
            right_eye_line_top = transformShapeLine({type: 'almond-horizontal', modifier: 'right', radius: 4.2, starting_step: 8, ending_step: 17}, face_options);
        }
        var right_eye_top = createPathFromLocalCoordinates(right_eye_line_top, {close_line: false, line_color: face_options.colors.cheek, thickness: f.thick_unit * 5}, scale_x, scale_y);
        right_eye_top.x = x;
        right_eye_top.y = y;
        right_eye_top.rotation = -rotation_amount;
        lines.push({name: 'right eye top', line: right_eye_line_top, shape: right_eye_top, scale_x: scale_x, scale_y: scale_y, x: x, y: y, rotation: -rotation_amount});
        shapes.push(right_eye_top);


        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y + (f.thick_unit * 3);
        var right_eye_line_bottom = [];
        if (face_options.eye_shape == 'Almond') {
            right_eye_line_bottom = transformShapeLine({type: 'almond-horizontal', modifier: 'right', radius: 4.2, starting_step: 3, ending_step: 9}, face_options);
        }
        var right_eye_bottom = createPathFromLocalCoordinates(right_eye_line_bottom, {close_line: false, line_color: face_options.colors.cheek, thickness: f.thick_unit}, scale_x, scale_y);
        right_eye_bottom.x = x;
        right_eye_bottom.y = y;
        right_eye_bottom.rotation = -rotation_amount;
        lines.push({name: 'right eye bottom', line: right_eye_line_bottom, shape: right_eye_bottom, scale_x: scale_x, scale_y: scale_y, x: x, y: y, rotation: -rotation_amount});
        shapes.push(right_eye_bottom);


        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y - (f.thick_unit * eyebrow_height);
        var right_eyebrow_line_top = [];
        if (face_options.eye_shape == 'Almond') {
            right_eyebrow_line_top = transformShapeLine({type: 'almond-horizontal', modifier: 'right', radius: 4.2, starting_step: 9, ending_step: 18}, face_options);
        }
        var right_eyebrow_top = createPathFromLocalCoordinates(right_eyebrow_line_top, {close_line: false, line_color: face_options.hair_color, thickness: eyebrow_thick_start, thickness_end: eyebrow_thick_stop}, scale_x, scale_y);
        right_eyebrow_top.x = x;
        right_eyebrow_top.y = y;
        right_eyebrow_top.alpha = eyebrow_transparency;
        right_eyebrow_top.rotation = -rotation_amount - 5;
        lines.push({name: 'right eyebrow top', line: right_eyebrow_line_top, shape: right_eyebrow_top, scale_x: scale_x, scale_y: scale_y, x: x, y: y, alpha: eyebrow_transparency, rotation: -rotation_amount - 5});
        shapes.push(right_eyebrow_top);


        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x - (f.thick_unit * 4);
        y = zone.y - (f.thick_unit * 8);
        var right_eyebrow_line_inside = transformShapeLine({type: 'almond-horizontal', modifier: 'right', radius: 4.2, starting_step: 9, ending_step: 14}, face_options);
        var right_eyebrow_inside = createPathFromLocalCoordinates(right_eyebrow_line_inside, {close_line: false, line_color: face_options.colors.darkflesh}, scale_x, scale_y);
        right_eyebrow_inside.x = x;
        right_eyebrow_inside.y = y;
        right_eyebrow_inside.rotation = -rotation_amount - 10;
        lines.push({name: 'right eyebrow inside', line: right_eyebrow_line_inside, shape: right_eyebrow_inside, scale_x: scale_x, scale_y: scale_y, x: x, y: y, rotation: -rotation_amount - 10});
        shapes.push(right_eyebrow_inside);


        zone = f.eyes.iris;
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y;
        var right_iris_line = transformShapeLine({type: 'circle', radius: iris_size}, face_options);
        var right_iris = createPathFromLocalCoordinates(right_iris_line, {close_line: true, fill_color: face_options.eye_color}, scale_x, scale_y);
        right_iris.x = x;
        right_iris.y = y;
        right_iris.alpha = iris_transparency;
        lines.push({name: 'right iris', line: right_iris_line, shape: right_iris, scale_x: scale_x, scale_y: scale_y, x: x, y: y, alpha: iris_transparency});
        shapes.push(right_iris);


        zone = f.eyes;
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y;
        var right_eye_round = createPathFromLocalCoordinates(right_eye_line, {close_line: true, line_color: face_options.colors.darkflesh}, scale_x, scale_y);
        right_eye_round.x = x;
        right_eye_round.y = y;
        right_eye_round.rotation = -rotation_amount;
        lines.push({name: 'right eye round', line: right_eye_line, shape: right_eye_round, scale_x: scale_x, scale_y: scale_y, x: x, y: y, rotation: -rotation_amount});
        shapes.push(right_eye_round);


        zone = f.eyes.pupil;
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y - (5 * f.thick_unit);
        var right_pupil = new createjs.Shape();
        right_pupil.graphics.beginFill(pupil_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        right_pupil.x = x;
        right_pupil.y = y;
        right_pupil.alpha = pupil_transparency;
        lines.push({name: 'right pupil', line: [], shape: right_pupil, scale_x: scale_x, scale_y: scale_y, x: x, y: y, alpha: pupil_transparency});
        shapes.push(right_pupil);

        return shapes;
    }

    function buildNose_Lines(f, face_options, lines) {
        var shapes = [];
        var zone = f.nose;

        var width = zone.radius;
        var height = zone.radius;
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
        for (var i = 0; i < nose_length; i++) { //Only draw as many points as nose_size
            nose_line_l.push({x: nose_side_offset + nose_line_side[i].x, y: nose_line_side[i].y});
            nose_line_r.push({x: -nose_side_offset + (-1 * nose_line_side[i].x), y: nose_line_side[i].y});
        }

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

        return shapes;
    }

    function buildHair_Lines(f, face_options, lines) {
        var shapes = [];

        var hair_line_level_adjust = -f.thick_unit * 110;
        var inner_hair_x = 100;
        var inner_hair_y = 400;
        var outer_hair_x = 100;
        var outer_hair_y = 200;
        var inner_hair_peak = 200;

        var head_line = transformLineToGlobalCoordinates(lines, 'face');
        var eye_line = transformLineToGlobalCoordinates(lines, 'left eye');

        head_line = hydratePointsAlongLine(head_line, f.thick_unit * 350);

        var zone = f.face;
        var hair_line = lineSegmentCompared(head_line, eye_line, 'above', hair_line_level_adjust);

        if (hair_line && hair_line.length) {
            var hair = createPathFromLocalCoordinates(hair_line, {thickness: f.thick_unit * 5, line_color: face_options.hair_color}, 1, 1); //Using 1,1 as already modified
            hair.x = zone.x * .9;  //TODO: Why .9?
            hair.y = zone.y * .9;  //Why .9?
            lines.push({name: 'hair line', line: hair_line, shape: hair, x: zone.x * .9, y: zone.y * .9, scale_x: 1, scale_y: 1});
//            shapes.push(hair);

            var hair_dots = createPathFromLocalCoordinates(hair_line, {thickness: f.thick_unit * 2, line_color: face_options.hair_color, x: zone.x * .9, y: zone.y * .9}, 1, 1); //Using 1,1 as already modified
            shapes = shapes.concat(hair_dots);

//            hair_line = hydratePointsAlongLine(hair_line, f.thick_unit * 200);

            var inner_hair_line = extrudeHorizontalArc(hair_line, f.thick_unit * inner_hair_x, f.thick_unit * inner_hair_y, f.thick_unit * inner_hair_peak);
            var outer_hair_line = extrudeHorizontalArc(hair_line, f.thick_unit * outer_hair_x, -f.thick_unit * outer_hair_y);

//            var inner_hair_dots = createPathFromLocalCoordinates(inner_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color, x: zone.x *.9, y: zone.y *.9}, 1, 1); //Using 1,1 as already modified
//            shapes = shapes.concat(inner_hair_dots);

//            var outer_hair_dots = createPathFromLocalCoordinates(outer_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color, x: zone.x *.9, y: zone.y *.9}, 1, 1); //Using 1,1 as already modified
//            shapes = shapes.concat(outer_hair_dots);

            var color = face_options.hair_color;
            var fill_color = color;
            if (color == 'White' || color == '#000000') color = 'gray';

            var full_hair_line = inner_hair_line.concat(outer_hair_line.reverse());
            full_hair_line = transformShapeLine({type:'smooth'},face_options,full_hair_line);
            var outer_hair = createPathFromLocalCoordinates(full_hair_line, {close_line: true, thickness: f.thick_unit * 2, color: color, fill_color: fill_color, x: zone.x * .9, y: zone.y * .9}, 1, 1); //Using 1,1 as already modified
            lines.push({name: 'full hair', line: full_hair_line, shape: outer_hair, x: zone.x * .9, y: zone.y * .9, scale_x: 1, scale_y: 1});

            shapes = shapes.concat(outer_hair);

        }
        return shapes;
    }

    function buildBeard_Lines(f, face_options, lines) {
        var shapes = [];

        if (face_options.gender == 'Female') return [];

        var hair_line_level_adjust = 1; //-4 - 20, Lots of shapes from combinations of these
        var inner_hair_x = 0;
        var inner_hair_y = 3;
        var outer_hair_x = .5;
        var outer_hair_y = .5;
        var alpha = 0.8;

        if (face_options.beard_style == 'None') {
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
            outer_hair_y = 0;
            alpha = .2;
        }

        var head_line = transformLineToGlobalCoordinates(lines, 'face');
        var eye_line = transformLineToGlobalCoordinates(lines, 'left eye');

        var zone = f.face;
        var beard_line = lineSegmentCompared(head_line, eye_line, 'below', hair_line_level_adjust * 100 * f.thick_unit);

        if (beard_line && beard_line.length && beard_line.length > 2) {
            var beard = createPathFromLocalCoordinates(beard_line, {thickness: f.thick_unit * 5, line_color: face_options.hair_color}, 1, 1); //Using 1,1 as already modified
            beard.x = zone.x * .9;  //TODO: Why .9?
            beard.y = zone.y * .9;  //Why .9?
            lines.push({name: 'beard line', line: beard_line, shape: beard, x: zone.x * .9, y: zone.y * .9, scale_x: 1, scale_y: 1});
//            shapes.push(beard);

            var inner_hair_line = extrudeHorizontalArc(beard_line, -f.thick_unit * inner_hair_x * 100, -f.thick_unit * inner_hair_y * 100);
            var outer_hair_line = extrudeHorizontalArc(beard_line, -f.thick_unit * outer_hair_x * 100, f.thick_unit * outer_hair_y * 100);

//            var inner_hair_dots = createPathFromLocalCoordinates(inner_hair_line, {thickness: f.thick_unit * 2, line_color: face_options.hair_color, x: zone.x * .9, y: zone.y * .9}, 1, 1); //Using 1,1 as already modified
//            shapes = shapes.concat(inner_hair_dots);
//
//            var outer_hair_dots = createPathFromLocalCoordinates(outer_hair_line, {thickness: f.thick_unit * 2, line_color: face_options.hair_color, x: zone.x * .9, y: zone.y * .9}, 1, 1); //Using 1,1 as already modified
//            shapes = shapes.concat(outer_hair_dots);

            var color = face_options.beard_color || face_options.hair_color;
            if (color == 'Hair') color = face_options.hair_color;
            var fill_color = color;
            if (color == 'White' || color == '#000000') color = 'gray';

            var full_beard_line = outer_hair_line.concat(inner_hair_line.reverse());
            full_beard_line = transformShapeLine({type:'smooth'},face_options,full_beard_line);

            var full_beard = createPathFromLocalCoordinates(full_beard_line, {close_line: true, thickness: f.thick_unit *.5, line_color: color, fill_color: fill_color, x: zone.x * .9, y: zone.y * .9}, 1, 1); //Using 1,1 as already modified
            full_beard.alpha = alpha;
            lines.push({name: 'full beard', line: full_beard_line, shape: full_beard, x: zone.x * .9, y: zone.y * .9, scale_x: 1, scale_y: 1, alpha: alpha});
            shapes = shapes.concat(full_beard);

        }
        return shapes;
    }

    function buildMouth_Lines(f, face_options, lines) {
        var shapes = [];

        //These can change expression alot
        var mouth_width = 1; //.6 - 1.3
        var bottom_lip_height = 0.5; // 0 - 2
        var bottom_lip_bottom = 3; // 1-5
        var top_lip_height = 1; //.2 - 1.5
        var top_lip_top = .5; //.2 - 2

        top_lip_top += top_lip_height;

        var lip_thickness = f.thick_unit * 2;
        var width = (f.mouth.right - f.mouth.left) / 2.6 * mouth_width;
        var height = (f.mouth.bottom - f.mouth.top);

        if (face_options.gender == 'Female') {
            lip_thickness *= 1.4;
            bottom_lip_bottom += 2;
            bottom_lip_height += 1;
            top_lip_height += 1.5;
            top_lip_top += 1;
        }

        //Mouth top and bottom line
        var mouth_top_line = [
            {x: -10, y: -1},
            {x: -5, y: -(top_lip_top * 2)},
            {x: 0, y: -top_lip_top},
            {x: 0, y: -top_lip_top},
            {x: 5, y: -(top_lip_top * 2)},
            {x: 10, y: -1},

            {x: 10, y: 1},
            {x: 0, y: bottom_lip_height + bottom_lip_bottom},
            {x: -10, y: 1}
        ];
        var l = createPathFromLocalCoordinates(mouth_top_line, {close_line: true, thickness: lip_thickness, color: face_options.colors.deepshadow, fill_color: face_options.lip_color}, width, height);
        l.x = f.mouth.x;
        l.y = f.mouth.y;
        l.name = 'lips';
        lines.push({name: 'lips', line: mouth_top_line, shape: l, x: f.mouth.x, y: f.mouth.y, scale_x: width, scale_y: height});
        shapes.push(l);


        var mouth_mid_line = [
            {x: -10, y: 0},
            {x: 0, y: -top_lip_height},
            {x: 10, y: 0},

            {x: 10, y: 0},
            {x: 0, y: bottom_lip_height},
            {x: -10, y: 0}
        ];
        var l2 = createPathFromLocalCoordinates(mouth_mid_line, {close_line: true, thickness: 0, color: face_options.colors.deepshadow, fill_color: 'pink'}, width, height);
        l2.x = f.mouth.x;
        l2.y = f.mouth.y;
        l2.alpha = 0.5;
        l2.name = 'tongue';
        lines.push({name: 'tongue', line: mouth_mid_line, shape: l2, x: f.mouth.x, y: f.mouth.y, scale_x: width, scale_y: height});
        shapes.push(l2);


        var chin_mid_line = [
            {x: -5, y: 0},
            {x: 0, y: 1},
            {x: 5, y: 0}
        ];
        var l3 = createPathFromLocalCoordinates(chin_mid_line, {close_line: false, thickness: 0, color: face_options.colors.deepshadow, fill_color: 'pink'}, width, height);
        l3.x = f.mouth.x;
        l3.y = f.mouth.y + (f.thick_unit * 30);
        l3.alpha = 0.5;
        l3.name = 'chin mid line';
        lines.push({name: 'chin mid line', line: chin_mid_line, shape: l3, x: f.mouth.x, y: f.mouth.y + (f.thick_unit * 30), scale_x: width, scale_y: height});
        shapes.push(l3);

        var mouth_high_line = [
            {x: -3, y: 0},
            {x: 0, y: -0.5},
            {x: 3, y: 0}
        ];
        var l4 = createPathFromLocalCoordinates(mouth_high_line, {close_line: false, thickness: 0, color: face_options.colors.cheek, fill_color: 'pink'}, width, height);
        l4.x = f.mouth.x;
        l4.y = f.mouth.y - (f.thick_unit * 24);
        l4.alpha = 0.5;
        l4.name = 'mouth high line';
        lines.push({name: 'mouth high line', line: mouth_high_line, shape: l4, x: f.mouth.x, y: f.mouth.y - (f.thick_unit * 24), scale_x: width, scale_y: height});
        shapes.push(l4);

        return shapes;
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
            new_point.x = (shape.x || 0) + ((shape.scale_x || 1) * point.x);
            new_point.y = (shape.y || 0) + ((shape.scale_y || 1) * point.y);

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

                        if ((typeof options.dont_face_below == "number") && y > options.dont_face_below && next_y > options.dont_face_below) {
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
        return createPath(points, style);
    }

    function findShape(lines, name) {
        return _.find(lines, function (shape) {
            return shape.name == name
        });
    }

    function createPath(points, style) {
        if (!points || !points.length || points.length < 2) return null;
        style = style || {};

        var color = style.line_color || style.color || 'black';
        var thickness = style.thickness || 1;
        var thickness_end = style.thickness_end || thickness;
        var fill_color = style.fill_color || null;

        //TODO: Add Fill Color variations
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
            if (fill_color) line.graphics.beginFill(fill_color);

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
            _.each(linePoints, function (point, i) {
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
            if (typeof distPeak == "number") {
                var midPos = Math.ceil(newPoints.length / 2);

                var newPoint = _.clone(newPoints[midPos]);
                newPoint.x = midX;
                newPoint.y += distPeak;
                newPoints.splice(midPos, 0, newPoint);
            }

        } else {

            _.each(linePoints, function (point, i) {
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
        _.each(line, function (currentPoint, j) {
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

    function randOption(options, face_options) {
        var len = options.length;
        return options[randInt(len, face_options) - 1];
    }

    return AvatarClass; //TODO: Is return all the 'this' variables, should return only version and two functions
})($, _, net, createjs);