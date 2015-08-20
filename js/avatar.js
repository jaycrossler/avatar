var Avatar = (function () {

    //-----------------------------
    //Private Global variables
    var VERSION = '0.0.1',
        summary = 'Functions for building and drawing a graphical character avatar on a canvas.',
        author = 'Jay Crossler - http://github.com/jaycrossler',
        file_name = 'avatar.js';

    var _face_options = {
        style: 'circles',
        rand_seed: 0,

        //'Living' settings that can change over time
        age: 30,
        era: 'Industrial',
        scars: 0,
        thickness: 0,
        cleanliness: 0,
        hair_style: 'Conservative',
        beard_style: 'none',
        tattoo_style: 'none',
        glasses_style: 'none',
        skin_texture: 'Normal',
        teeth_shape: 'Normal',
        emotionality: 0,

        //DNA settings that don't change easily
        gender: 'male',
        height: 0,
        skin_pigment: 'Medium',
        eye_shape: 'Round',
        hair_texture: 'Smooth',
        head_size: 'Normal',
        hairiness: 'Normal',
        face_shape: 'Oval',

        //Operational settings
        face_color: 'Yellow',
        eye_color: 'Blue',
        nose_color: 'Brown',
        lip_color: 'Red',
        eye_spacing: 0.02,
        forehead_height: 0.1,
        nose_height: 0.03,
        mouth_height: 0.05,

        face_width_proportion: 0.67
    };
    var _stage_options = {
        percent_height: 1,
        buffer: 0.02,
        x: 0,
        y: 0
    };
    var STAGES = []; //Global list of all stages used to lookup any existing ones

    //-----------------------------
    //Initialization
    function AvatarClass(face_options, stage_options, canvas_name) {
        this.face_options = $.extend({}, _face_options, face_options || {});
        this.stage_options = $.extend({}, _stage_options, stage_options || {});

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

        if (this.stage) {
            var face = this.buildFace(this.face_options, this.stage_options, this.stage);
            this.drawOnStage(face, this.stage);
        }
    }

    AvatarClass.prototype.version = function () {
        return file_name + ' (version ' + VERSION + ') - ' + summary + ' by ' + author;
    }();

    //-----------------------------
    //Supporting functions
    AvatarClass.prototype.drawOnStage = function (face, stage) {
        stage.addChild(face);
        stage.update();
    };
    AvatarClass.prototype.buildFace = function (face_options, stage_options, stage) {

        var container = new createjs.Container();

        var face_zones = buildFaceZones(face_options, stage_options, stage);
        if (face_options.style == 'circles') {
            container = buildFace_Circles(container, face_options, face_zones);
        }

        return container;
    };

    //================
    //Private functions
    function buildFaceZones(face_options, stage_options, stage) {

        var face_zones = {neck: {}, face: {}, nose: {}, ears: {}, eyes: {}, chin: {}, hair: {}};

        var height = (stage_options.size || (stage.canvas.height * stage_options.percent_height)) * (1 - stage_options.buffer);
        stage_options.height = height;

        var height_offset = (stage_options.size || (stage.canvas.height * stage_options.percent_height)) * (stage_options.buffer / 2);
        stage_options.height_offset = height_offset;

        var half_height = height / 2;
        stage_options.half_height = half_height;
        face_zones.face_width = half_height * face_options.face_width_proportion;

        var x = stage_options.x;
        var y = stage_options.y;

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
            top: -half_height / 12,
            bottom: 2 * half_height / 12,
            y: y + height_offset + (half_height * (0.8 + face_options.forehead_height)),

            left: -half_height / 9,
            right: 2 * half_height / 9,
            left_x: x + (half_height * (0.8 - face_options.eye_spacing)),
            right_x: x + (half_height * (1.2 + face_options.eye_spacing)),

            iris: {
                top: -half_height / 22,
                bottom: 2 * half_height / 22,
                y: y + height_offset + (half_height * (0.8 + face_options.forehead_height)),

                left: -half_height / 22,
                right: 2 * half_height / 22,
                left_x: x + (half_height * (0.8 - face_options.eye_spacing)),
                right_x: x + (half_height * (1.2 + face_options.eye_spacing))
            }
        };

        face_zones.ears = {
            top: -half_height / 5,
            bottom: 2 * half_height / 5,
            y: y + height_offset + (half_height * (0.9 + face_options.forehead_height)),

            left: -half_height / 16,
            right: 2 * half_height / 16,
            left_x: x + half_height + face_zones.face.left,
            right_x: x + half_height + (face_zones.face.right/2)
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

    function buildFace_Circles(container, face_options, face_zones) {
        var f = face_zones; //Text shortener
        var zone;

        var neck = new createjs.Shape();
        zone = f.neck;
        neck.graphics.beginStroke('black').beginFill(face_options.face_color).drawRect(zone.left, zone.top, zone.right, zone.bottom);
        neck.x = zone.x;
        neck.y = zone.y;
        container.addChild(neck);

        var left_ear = new createjs.Shape();
        zone = f.ears;
        left_ear.graphics.beginStroke('black').beginFill(face_options.face_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        left_ear.x = zone.left_x;
        left_ear.y = zone.y;
        container.addChild(left_ear);

        var right_ear = new createjs.Shape();
        zone = f.ears;
        right_ear.graphics.beginStroke('black').beginFill(face_options.face_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        right_ear.x = zone.right_x;
        right_ear.y = zone.y;
        container.addChild(right_ear);

        var face = new createjs.Shape();
        zone = f.face;
        face.graphics.beginStroke('black').beginFill(face_options.face_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        face.x = zone.x;
        face.y = zone.y;
        container.addChild(face);

        var left_eye = new createjs.Shape();
        zone = f.eyes;
        left_eye.graphics.beginStroke('black').beginFill('white').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        left_eye.x = zone.left_x;
        left_eye.y = zone.y;
        container.addChild(left_eye);

        var left_iris = new createjs.Shape();
        zone = f.eyes.iris;
        left_iris.graphics.beginStroke('black').beginFill(face_options.eye_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        left_iris.x = zone.left_x;
        left_iris.y = zone.y;
        container.addChild(left_iris);

        var right_eye = new createjs.Shape();
        zone = f.eyes;
        right_eye.graphics.beginStroke('black').beginFill('white').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        right_eye.x = zone.right_x;
        right_eye.y = zone.y;
        container.addChild(right_eye);

        var right_iris = new createjs.Shape();
        zone = f.eyes.iris;
        right_iris.graphics.beginStroke('black').beginFill(face_options.eye_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        right_iris.x = zone.right_x;
        right_iris.y = zone.y;
        container.addChild(right_iris);


//        var nose = new createjs.Shape();
//        zone = f.nose;
//        nose.graphics.beginStroke('black').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
//        nose.x = zone.x;
//        nose.y = zone.y;
//        container.addChild(nose);

        var nose2 = new createjs.Shape();
        zone = f.nose;
        var x = buildDrawingGridFunction(0, 0, zone.radius, 'x');
        var y = buildDrawingGridFunction(0, 0, zone.radius, 'y');

//        nose.graphics.beginStroke('black').beginFill(face_options.nose_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        nose2.graphics.beginStroke('black')
            .moveTo(x(10), y(5))
            .arcTo(x(8), y(2), x(5), y(5), x(2.5))
            .arcTo(x(0), y(8), x(-5), y(5), x(2.5))
            .arcTo(x(-8), y(2), x(-10), y(5), x(2.5))

//            .lineTo(zone.left * 0.5, 1.1 * (zone.bottom-zone.top) *.5)
//            .lineTo(zone.left * 0.9, 0.5 * (zone.bottom-zone.top) *.5)

//            .arcTo(zone.left * 0.5, 1.1 * (zone.bottom-zone.top) *.5, zone.left * 0.9, 0.5 * (zone.bottom-zone.top) *.5, 5)

//            .lineTo(zone.right * 0.8, zone.top-zone.bottom * 0.8)
//            .lineTo(zone.right, zone.top-zone.bottom)
//            .arcTo(zone.right * 0.8, zone.top-zone.bottom * 0.8, zone.right, zone.top-zone.bottom);
        nose2.x = zone.x;
        nose2.y = zone.y;

        container.addChild(nose2);



        var mouth = new createjs.Shape();
        zone = f.mouth;
        mouth.graphics.beginStroke('black').beginFill(face_options.lip_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        mouth.x = zone.x;
        mouth.y = zone.y;
        container.addChild(mouth);

        var mouth_line = new createjs.Shape();
        zone = f.mouth;
        mouth_line.graphics.setStrokeStyle(.5).beginStroke('black').moveTo(zone.x + zone.left, zone.y).lineTo(zone.x + zone.right/2, zone.y);
        container.addChild(mouth_line);

        return container;
    }

    function buildDrawingGrid (x, y, radius) {
        var grid = [];
        for (var i=-10; i<=10; i++){
            grid[i] = [];
            for (var j=-10; j<=10; j++){
                grid[i][j] = {x: x + (radius*i/10), y: y+(radius*j/10)};
            }
        }
        return grid;
    }
    function buildDrawingGridFunction (x, y, radius, type) {
        var locator = function(step) {
            return (type=='x' ? x : y) + (radius*step/10);
        };
        return locator;
    }
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

    return AvatarClass; //TODO: Is return all the 'this' variables, should return only version and two functions
})();