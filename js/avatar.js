var Avatar = (function () {

    //-----------------------------
    //Private Global variables
    var VERSION = '0.0.1',
        summary = 'Functions for building and drawing a graphical character avatar on a canvas.',
        author = 'Jay Crossler - http://github.com/jaycrossler',
        file_name = 'avatar.js';

    var _face_options = {
        style: 'lines',
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
        teeth_condition: 'Normal',
        emotionality: 0,

        //DNA settings that don't change easily
        gender: 'male',
        height: 0,
        skin_pigment: null,
        eye_shape: null, //TODO
        eyelid_shape: null, //TODO
        hair_texture: 'Smooth',
        head_size: 'Normal',
        hairiness: 'Normal',
        face_shape: 'Oval',
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
    var _data = {
        skin_type_colors: [
            {name:'Fair', highlights: '254,202,182', skin: '245,185,158', cheek: '246,171,142', darkflesh: '217,118,76', deepshadow: '202,168,110'},
            {name:'Light Brown', highlights: '229,144,50', skin: '228,131,86', cheek: '178,85,44', darkflesh: '143,70,29', deepshadow: '152,57,17'},
            {name:'Tanned', highlights: '245,194,151', skin: '234,154,95', cheek: '208,11,56', darkflesh: '168,66,17', deepshadow: '147,68,27'},
            {name:'White', highlights: '250,220,196', skin: '245,187,149', cheek: '239,165,128', darkflesh: '203,137,103', deepshadow: '168,102,68'},
            {name:'Medium', highlights: '247,188,154', skin: '243,160,120', cheek: '213,114,75', darkflesh: '154,79,48', deepshadow: '127,67,41'}
        ],
        nose_shapes: "Flat,Wide,Thin,Turned up/perky,Normal,Hooked down,Bulbous,Giant Nostrils".split(","),
        nose_sizes: "Tiny,Small,Normal,Large,Big,Giant,Huge".split(","),
        eye_colors: "Hazel,Amber,Green,Blue,Gray,Brown,Dark Brown,Black,Red,Violet".split(","),
        eye_shapes: "Almond".split(",") //TODO: Expand
    };

    //-----------------------------
    //Initialization
    function AvatarClass(face_options, stage_options, canvas_name) {
        var rand_seed = face_options.rand_seed || Math.floor(Math.random()*10000);
        randomSetSeed(rand_seed);

        this.face_options = $.extend({}, _face_options, face_options || {});
        this.stage_options = $.extend({}, _stage_options, stage_options || {});

        if (!this.face_options.nose_shape) this.face_options.nose_shape = randOption(_data.nose_shapes); //Empty Cavity
        if (!this.face_options.nose_size) this.face_options.nose_size = randOption(_data.nose_sizes);
        if (!this.face_options.eye_color) this.face_options.eye_color = randOption(_data.eye_colors);
        if (!this.face_options.eye_shape) this.face_options.eye_shape = randOption(_data.eye_shapes);

        this.face_options.face_width_proportion = 0.6 + random()/7;

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

        expandFaceOptions(this.face_options, this.stage_options);

        if (this.stage) {
            var face = this.buildFace(this.face_options, this.stage_options, this.stage);
            this.drawOnStage(face, this.stage);
        }
    }

    AvatarClass.prototype.version = function () {
        return file_name + ' (version ' + VERSION + ') - ' + summary + ' by ' + author;
    }();
    AvatarClass.prototype.data = _data;

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
            container = buildFace_Circles(container, face_options, face_zones, 'neck,ears,face,eyes,nose,mouth'.split(','));
        } else if (face_options.style == 'lines') {
            buildFace_Circles(container, face_options, face_zones, 'neck,ears'.split(','));
            addSceneChildren(container, buildFace_Lines(face_zones,face_options));
            addSceneChildren(container, buildNose_Lines(face_zones,face_options));
            addSceneChildren(container, buildEyes_Lines(face_zones,face_options));
            buildFace_Circles(container, face_options, face_zones, 'mouth'.split(','));

        }
        return container;
    };

    //================
    //Private functions
    function expandFaceOptions(face_options, stage_options) {

        //Add in colors based on setting
        //TODO: Make this generic
        var skin_pigment_colors = _.find(_data.skin_type_colors, function(skin){ return skin.name==face_options.skin_pigment});
        if (!skin_pigment_colors) skin_pigment_colors = randOption(_data.skin_type_colors);

        for (var key in skin_pigment_colors) {
            if (key != 'name') {
                skin_pigment_colors[key] = Helpers.rgb2hex(skin_pigment_colors[key]);
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
        face_zones.face_width = half_height * face_options.face_width_proportion;

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
                top: -half_height / 50,
                bottom: 2 * half_height / 25,
                y: y + height_offset + (half_height * (0.8 + face_options.forehead_height)),

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

    function buildFace_Circles(container, face_options, face_zones, zones_to_draw) {
        var f = face_zones; //Text shortener
        var zone;

        zones_to_draw = zones_to_draw || 'neck,ears,face,eyes,nose,mouth'.split(',');

        if (_.indexOf(zones_to_draw, 'neck')>-1) {
            var neck = new createjs.Shape();
            zone = f.neck;
            neck.graphics.beginStroke(face_options.colors.highlights).beginFill(face_options.colors.skin).drawRect(zone.left, zone.top, zone.right, zone.bottom);
            neck.x = zone.x;
            neck.y = zone.y;
            container.addChild(neck);
        }

        if (_.indexOf(zones_to_draw, 'ears')>-1) {
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

        if (_.indexOf(zones_to_draw, 'face')>-1) {
            var face = new createjs.Shape();
            zone = f.face;
            face.graphics.beginStroke(face_options.colors.highlights).beginFill(face_options.colors.skin).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            face.x = zone.x;
            face.y = zone.y;
            container.addChild(face);
        }

        if (_.indexOf(zones_to_draw, 'eyes')>-1) {
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

        if (_.indexOf(zones_to_draw, 'nose')>-1) {
            var nose = new createjs.Shape();
            zone = f.nose;
            nose.graphics.beginStroke(face_options.colors.deepshadow).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
            nose.x = zone.x;
            nose.y = zone.y;
            container.addChild(nose);
        }

        if (_.indexOf(zones_to_draw, 'mouth')>-1) {
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
    // Face makers
    function buildFace_Lines(f, face_options) {
        var shapes = [];

        var zone = f.face;
        var face_line = [];
        if (face_options.face_shape == 'Oval'){
            face_line = makeShapeLine('circle', 10);
        }

        var squish = 2.94;
        var l = createPathFromLocalCoordinates(face_line, {close_line:true, line_color:face_options.colors.highlights, fill_color:face_options.colors.skin}, (zone.right-zone.left)/squish, (zone.bottom-zone.top)/squish);
        l.x = zone.x;
        l.y = zone.y;
        shapes.push(l);

        return shapes;
    }
    function buildEyes_Lines(f, face_options) {
        var shapes = [];

        var rotation_amount = 3;
        var iris_size = 2.8;
        var pupil_transparency = 0.7;
        var iris_transparency = 0.6;
        var pupil_color = 'black';

        //Left Eye
        var zone = f.eyes;
        var left_eye_line = [];
        if (face_options.eye_shape == 'Almond'){
            left_eye_line = makeShapeLine('almond-horizontal-left', 4.2);
        }
        var left_eye = createPathFromLocalCoordinates(left_eye_line, {close_line:true, line_color:face_options.colors.darkflesh, fill_color:'white'}, (zone.right-zone.left), (zone.bottom-zone.top));
        left_eye.x = zone.left_x;
        left_eye.y = zone.y *1.03;
        left_eye.rotation = rotation_amount;
        shapes.push(left_eye);

        zone = f.eyes.iris;
        var left_iris_line = makeShapeLine('circle', iris_size);
        var left_iris = createPathFromLocalCoordinates(left_iris_line, {close_line:true, fill_color:face_options.eye_color}, (zone.right-zone.left), (zone.bottom-zone.top));
        left_iris.x = zone.left_x;
        left_iris.y = zone.y * 1.03;
        left_iris.alpha = iris_transparency;
        shapes.push(left_iris);

        zone = f.eyes;
        var left_eye_round = createPathFromLocalCoordinates(left_eye_line, {close_line:true, line_color:face_options.colors.darkflesh}, (zone.right-zone.left), (zone.bottom-zone.top));
        left_eye_round.x = zone.left_x;
        left_eye_round.y = zone.y *1.03;
        left_eye_round.rotation = rotation_amount;
        shapes.push(left_eye_round);

        var left_pupil = new createjs.Shape();
        zone = f.eyes.pupil;
        left_pupil.graphics.beginFill(pupil_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        left_pupil.x = zone.left_x;
        left_pupil.y = zone.y;
        left_pupil.alpha = pupil_transparency;
        shapes.push(left_pupil);


        //Right Eye
        zone = f.eyes;
        var right_eye_line = [];
        if (face_options.eye_shape == 'Almond'){
            right_eye_line = makeShapeLine('almond-horizontal-right', 4.2);
        }
        var right_eye = createPathFromLocalCoordinates(right_eye_line, {close_line:true, line_color:face_options.colors.darkflesh, fill_color:'white'}, (zone.right-zone.left), (zone.bottom-zone.top));
        right_eye.x = zone.right_x;
        right_eye.y = zone.y *1.03;
        right_eye.rotation = -rotation_amount;
        shapes.push(right_eye);

        zone = f.eyes.iris;
        var right_iris_line = makeShapeLine('circle', iris_size);
        var right_iris = createPathFromLocalCoordinates(right_iris_line, {close_line:true, fill_color:face_options.eye_color}, (zone.right-zone.left), (zone.bottom-zone.top));
        right_iris.x = zone.right_x;
        right_iris.y = zone.y * 1.03;
        right_iris.alpha = iris_transparency;
        shapes.push(right_iris);

        zone = f.eyes;
        var right_eye_round = createPathFromLocalCoordinates(right_eye_line, {close_line:true, line_color:face_options.colors.darkflesh}, (zone.right-zone.left), (zone.bottom-zone.top));
        right_eye_round.x = zone.right_x;
        right_eye_round.y = zone.y *1.03;
        right_eye_round.rotation = -rotation_amount;
        shapes.push(right_eye_round);

        var right_pupil = new createjs.Shape();
        zone = f.eyes.pupil;
        right_pupil.graphics.beginFill(pupil_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
        right_pupil.x = zone.right_x;
        right_pupil.y = zone.y;
        right_pupil.alpha = pupil_transparency;
        shapes.push(right_pupil);

        return shapes;
    }

    function buildNose_Lines(f, face_options) {
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
            nose_side_offset ++;
        } else if (face_options.nose_shape == 'Giant Nostrils') {
            width *= 1.3;
            height *= 0.8;
            nose_side_offset ++;
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
            nose_side_offset ++;
        } else if (face_options.nose_size == 'Giant') {
            nose_length = 6;
            width *= 1.3;
            height *= 1.4;
            thickness *= 1.5;
            nose_side_offset +=2;
        } else if (face_options.nose_size == 'Huge') {
            nose_length = 7;
            width *= 1.5;
            height *= 1.6;
            thickness *= 2;
            nose_side_offset +=3;
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
        for (var i=0; i<nose_length;i++) { //Only draw as many points as nose_size
            nose_line_l.push({x: nose_side_offset + nose_line_side[i].x, y: nose_line_side[i].y});
            nose_line_r.push({x: -nose_side_offset + (-1 * nose_line_side[i].x), y: nose_line_side[i].y});
        }

        var l_r = createPathFromLocalCoordinates(nose_line_r, {thickness: thickness, thickness_end:thickness *.3, color: face_options.colors.deepshadow}, width, height);
        l_r.x = f.nose.x;
        l_r.y = f.nose.y;
        shapes.push(l_r);

        var l_l = createPathFromLocalCoordinates(nose_line_l, {thickness: thickness, thickness_end:thickness *.3, color: face_options.colors.deepshadow}, width, height);
        l_l.x = f.nose.x;
        l_l.y = f.nose.y;
        shapes.push(l_l);

        return shapes;
    }

    //-----------------------------
    //Drawing Helpers
    function addSceneChildren(container, children) {
        _.each(children, function(c){
            container.addChild(c);
        });
        return container;
    }

    function makeShapeLine(type, radius_1, radius_2) {
        var line = [];
        if (type == 'circle') {
            var steps = 18;
            for (var c = 0; c < steps; c++) {
                var x = Math.cos(c / steps * 2 * Math.PI) * radius_1;
                var y = Math.sin(c / steps * 2 * Math.PI) * radius_1;
                line.push({x: x, y: y});
            }
        } else if (_.str.startsWith(type,'almond-horizontal')) {
            var steps = 18;
            for (var c = 0; c < steps; c++) {
                var x = Math.cos(c / steps * 2 * Math.PI) * radius_1;
                var y = Math.sin(c / steps * 2 * Math.PI) * radius_1 * .5;
                line.push({x: x, y: y});
                if (c % (steps/2)) {
                    line.push({x: x, y: y});
                }
            }

        }
        return line;

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
        for (var p=0; p < points_local.length; p++) {
            var x = (width_radius * points_local[p].x / 10);
            var y = (height_radius * points_local[p].y / 10);
            points.push({x: x, y: y});
        }
        return createPath(points, style);
    }

    function createPath(points, style) {
        if (!points || !points.length || points.length < 2) return null;
        style = style || {};

        var color = style.line_color || style.color || 'black';
        var thickness = style.thickness || 1;
        var fill_color = style.fill_color || null;

        //TODO: Add Fill Color variations
        //TODO: Line color fades

        var line = new createjs.Shape();

        line.graphics.beginStroke(color).setStrokeStyle(thickness);
        if (fill_color) line.graphics.beginFill(fill_color);

        var p1, p2, p3, mid;

        if (style.close_line){
            p1 = points[0];
            p2 = points[1];
            mid = midPointBetween(p1, p2);
            line.graphics.moveTo(mid.x, mid.y);
        } // TODO: There's some overlap if closed

        for (var i = 1; i < points.length; i++) {
            p1 = points[(points.length + i - 1) % (points.length)];
            p2 = points[i];
            mid = midPointBetween(p1, p2);
            line.graphics.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y);
        }

        if (style.close_line) {
            p1 = points[points.length-1];
            p2 = points[0];
            p3 = points[1];
            mid = midPointBetween(p1, p2);
            line.graphics.quadraticCurveTo(p1.x, p1.y, mid.x, mid.y);
            mid = midPointBetween(p2, p3);
            line.graphics.quadraticCurveTo(p2.x, p2.y, mid.x, mid.y);

        } else {
            line.graphics.lineTo(points[points.length-1].x, points[points.length-1].y);
        }

        return line;
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
    var _randseed = 0;
    function randomSetSeed (seed){
        _randseed = seed || 42;
    }
    function random (){
        _randseed = _randseed || 42;
        var x = Math.sin(_randseed++) * 10000;
        return x - Math.floor(x);
    }
    function randInt (max){
        max = max || 100;
        return parseInt(random() * max +1);
    }
    function randOption (options){
        var len = options.length;
        return options[randInt(len)-1];
    }

    return AvatarClass; //TODO: Is return all the 'this' variables, should return only version and two functions
})();