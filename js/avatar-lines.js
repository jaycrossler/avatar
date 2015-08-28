//TODO: Not able to access Avatar hidden classes

var AvatarTwo = (function (AvatarClass) {
    AvatarClass.prototype.showDetails = function(){
        console.log(Avatar.face_options);
    };

    AvatarClass.prototype.buildFace = function (face_options, stage_options, stage) {

        var container = new createjs.Container();
        this.lines = [];

        var face_zones = buildFaceZones(face_options, stage_options, stage);
        if (face_options.style == 'circles') {
            container = buildFace_Circles(container, face_options, face_zones, 'neck,ears,face,eyes,nose,mouth'.split(','));
        } else if (face_options.style == 'lines') {
            Avatar.addSceneChildren(container, buildNeck_Lines(face_zones, face_options, this.lines));
            buildFace_Circles(container, face_options, face_zones, 'ears'.split(','));
            addSceneChildren(container, buildFace_Lines(face_zones, face_options, this.lines));
            addSceneChildren(container, buildNose_Lines(face_zones, face_options, this.lines));
            addSceneChildren(container, buildEyes_Lines(face_zones, face_options, this.lines));
            addSceneChildren(container, buildBeard_Lines(face_zones, face_options, this.lines));
            addSceneChildren(container, buildMouth_Lines(face_zones, face_options, this.lines));
            addSceneChildren(container, buildHair_Lines(face_zones, face_options, this.lines));
        }
        return container;
    };


    AvatarClass.prototype.buildFace_Lines = function(f, face_options, lines) {
        var shapes = [];
        var squish = 2.94;

        var zone = f.face;
        var face_line = [];
        var radius_x = 10 * (zone.right - zone.left) / squish;
        var radius_y = 10 * (zone.bottom - zone.top) / squish;
        if (face_options.face_shape == 'Oblong') {
            face_line = transformShapeLine({type: 'oval', warp_y: 0.7});
        } else if (face_options.face_shape == 'Oval') {
            face_line = transformShapeLine({type: 'oval', warp_y: 0.55});
        } else if (face_options.face_shape == 'Rectangle') {
            face_line = transformShapeLine({type: 'oval', facet_below: 0.1, warp_y: 0.3});
        } else if (face_options.face_shape == 'Square') {
            face_line = transformShapeLine({type: 'oval', facet_below: 0.1, warp_y: 0.22});
        } else if (face_options.face_shape == 'Inverted Triangle') {
            face_line = transformShapeLine({type: 'oval', facet_below: 0.1, warp_x: 0.6, pinch_bottom: 2});
        } else if (face_options.face_shape == 'Diamond') {
            face_line = transformShapeLine({type: 'oval', warp_x: 0.3});
        } else if (face_options.face_shape == 'Triangular') {
            face_line = transformShapeLine({type: 'oval', facet_below: 0.4, dont_face_below: 0.8, warp_x: 0.6, raise_below:0.6, warp_y_bottom:2, pinch_top: 2, steps: 36});
        } else if (face_options.face_shape == 'Heart') {
            face_line = transformShapeLine({type: 'oval', facet_below: 0.1, warp_x: 0.3, pinch_bottom: 2});
        } else {
            face_line = transformShapeLine({type: 'circle'});
        }

        var l = createPathFromLocalCoordinates(face_line, {close_line: true, line_color: face_options.colors.highlights, fill_color: face_options.colors.skin}, radius_x, radius_y);
        l.x = zone.x;
        l.y = zone.y;
        lines.push({name:'face', line:face_line, shape:l, scale_x:radius_x, scale_y:radius_y, x:zone.x, y:zone.y});
        l.addEventListener("click", function() { console.log(face_options) });
        shapes.push(l);

        return shapes;
    }

    AvatarClass.prototype.buildNeck_Lines = function(f, face_options, lines) {
        var shapes = [];

        var neck_width = 0.75;
        var neck_curvature = 0.9;
        var apple_transparency = 0.4;
        var apple_height = 1.4;
        if (face_options.gender == 'Female') {
            neck_width *= 0.9;
        }
        var zone = f.neck;
        var scale_x = (zone.right - zone.left) * neck_width;
        var scale_y = (zone.bottom - zone.top) / 1.5;

        var neck_line = transformShapeLine({type: 'neck', radius: 5, curvature: neck_curvature});
        var neck = createPathFromLocalCoordinates(neck_line, {close_line: true, line_color: face_options.colors.highlights, fill_color: face_options.colors.skin}, scale_x, scale_y);
        neck.x = zone.x;
        neck.y = zone.y + (f.thick_unit * 175);
        lines.push({name:'neck', line:neck_line, shape:neck, scale_x:scale_x, scale_y:scale_y, x:zone.x, y:zone.y});
        shapes.push(neck);

        if (face_options.gender == 'Male') {
            var darker_skin = net.brehaut.Color(face_options.colors.skin).darkenByRatio(0.2).toString();
            var neck_apple_line = transformShapeLine({type: 'circle', radius: 0.5});
            scale_x = (zone.right - zone.left);
            scale_y = (zone.bottom - zone.top) * apple_height;

            var neck_apple = createPathFromLocalCoordinates(neck_apple_line, {close_line: true, line_color: face_options.colors.skin, fill_color: darker_skin}, scale_x, scale_y);
            neck_apple.x = zone.x;
            neck_apple.y = zone.y + (f.thick_unit * 225);
            neck_apple.alpha = apple_transparency;
            lines.push({name:'neck_apple', line:neck_apple_line, shape:neck_apple, scale_x:scale_x, scale_y:scale_y, x:zone.x, y:zone.y + (f.thick_unit * 225)});
            shapes.push(neck_apple);
        }

        return shapes;
    }

    AvatarClass.prototype.buildEyes_Lines = function(f, face_options, lines) {
        var shapes = [];

        var rotation_amount = 4;
        var iris_size = 2.8;
        var pupil_transparency = 0.7;
        var iris_transparency = 0.6;
        var pupil_color = 'black';
        var eyelid_thick_start = 4 * f.thick_unit;
        var eyelid_thick_stop = 2 * f.thick_unit;

        //TODO: Have squash move right to left

        var eyelid_height = 20;
        var eyelid_transparency = 0.9;

        if (face_options.gender == 'Female') {
            eyelid_thick_start *= 1.2;
            eyelid_thick_stop *= 1.2;
        }

        //TODO: Change this to mirror lines on each side, maybe build a builder function

        //Left Eye
        var zone = f.eyes;
        var scale_x = (zone.right - zone.left);
        var scale_y = (zone.bottom - zone.top);
        var x = zone.left_x;
        var y = zone.y;
        var left_eye_line = [];
        if (face_options.eye_shape == 'Almond') {
            left_eye_line = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2});
        }
        var left_eye = createPathFromLocalCoordinates(left_eye_line, {close_line: true, line_color: face_options.colors.darkflesh, fill_color: 'white'}, scale_x, scale_y);
        left_eye.x = x;
        left_eye.y = y;
        left_eye.rotation = rotation_amount;
        lines.push({name:'left eye', line:left_eye_line, shape:left_eye, scale_x:scale_x, scale_y:scale_y, x:x, y:y, rotation:rotation_amount});
        shapes.push(left_eye);


        x = zone.left_x;
        y = zone.y - (f.thick_unit * 4);
        var left_eye_line_top = [];
        if (face_options.eye_shape == 'Almond') {
            left_eye_line_top = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 11, ending_step: 19});
        }
        var left_eye_top = createPathFromLocalCoordinates(left_eye_line_top, {close_line: false, line_color: face_options.colors.cheek, thickness: f.thick_unit*5}, scale_x, scale_y);
        left_eye_top.x = x;
        left_eye_top.y = y;
        left_eye_top.rotation = rotation_amount;
        lines.push({name:'left eye top', line:left_eye_line_top, shape:left_eye_top, scale_x:scale_x, scale_y:scale_y, x:x, y:y, rotation:rotation_amount});
        shapes.push(left_eye_top);


        x = zone.left_x;
        y = zone.y + (f.thick_unit * 3);
        var left_eye_line_bottom = [];
        if (face_options.eye_shape == 'Almond') {
            left_eye_line_bottom = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 1, ending_step: 7});
        }
        var left_eye_bottom = createPathFromLocalCoordinates(left_eye_line_bottom, {close_line: false, line_color: face_options.colors.cheek, thickness: f.thick_unit}, scale_x, scale_y);
        left_eye_bottom.x = x;
        left_eye_bottom.y = y;
        left_eye_bottom.rotation = rotation_amount;
        lines.push({name:'left eye bottom', line:left_eye_line_bottom, shape:left_eye_bottom, scale_x:scale_x, scale_y:scale_y, x:x, y:y, rotation:rotation_amount});
        shapes.push(left_eye_bottom);


        x = zone.left_x;
        y = zone.y - (f.thick_unit * eyelid_height);
        var left_eyebrow_line_top = [];
        if (face_options.eye_shape == 'Almond') {
            left_eyebrow_line_top = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 10, ending_step: 19});
        }
        var left_eyebrow_top = createPathFromLocalCoordinates(left_eyebrow_line_top, {close_line: false, line_color: face_options.hair_color, thickness: eyelid_thick_start, thickness_end: eyelid_thick_stop}, scale_x, scale_y);
        left_eyebrow_top.x = x;
        left_eyebrow_top.y = y;
        left_eyebrow_top.alpha = eyelid_transparency;
        left_eyebrow_top.rotation = rotation_amount + 5;
        lines.push({name:'left eyebrow top', line:left_eyebrow_line_top, shape:left_eyebrow_top, scale_x:scale_x, scale_y:scale_y, x:x, y:y, rotation:rotation_amount + 5, alpha: eyelid_transparency});
        shapes.push(left_eyebrow_top);


        x = zone.left_x + (f.thick_unit * 4);
        y = zone.y - (f.thick_unit * 8);
        var left_eyebrow_line_inside = transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 14, ending_step: 19});
        var left_eyebrow_inside = createPathFromLocalCoordinates(left_eyebrow_line_inside, {close_line: false, line_color: face_options.colors.darkflesh}, scale_x, scale_y);
        left_eyebrow_inside.x = x;
        left_eyebrow_inside.y = y;
        left_eyebrow_inside.rotation = rotation_amount + 10;
        lines.push({name:'left eyebrow inside', line:left_eyebrow_line_inside, shape:left_eyebrow_inside, scale_x:scale_x, scale_y:scale_y, x:x, y:y, rotation:rotation_amount + 10});
        shapes.push(left_eyebrow_inside);


        zone = f.eyes.iris;
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.left_x;
        y = zone.y;
        var left_iris_line = transformShapeLine({type: 'circle', radius: iris_size});
        var left_iris = createPathFromLocalCoordinates(left_iris_line, {close_line: true, fill_color: face_options.eye_color}, scale_x, scale_y);
        left_iris.x = x;
        left_iris.y = y;
        left_iris.alpha = iris_transparency;
        lines.push({name:'left iris', line:left_iris_line, shape:left_iris, scale_x:scale_x, scale_y:scale_y, x:x, y:y, alpha:iris_transparency});
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
        lines.push({name:'left eye round', line:left_eye_line, shape:left_eye_round, scale_x:scale_x, scale_y:scale_y, x:x, y:y});
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
        lines.push({name:'left pupil', line:[], shape:left_pupil, scale_x:scale_x, scale_y:scale_y, x:x, y:y});
        shapes.push(left_pupil);


        //Right Eye
        zone = f.eyes;
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y;
        var right_eye_line = [];
        if (face_options.eye_shape == 'Almond') {
            right_eye_line = transformShapeLine({type: 'almond-horizontal', modifier: 'right', radius: 4.2});
        }
        var right_eye = createPathFromLocalCoordinates(right_eye_line, {close_line: true, line_color: face_options.colors.darkflesh, fill_color: 'white'}, scale_x, scale_y);
        right_eye.x = x;
        right_eye.y = y;
        right_eye.rotation = -rotation_amount;
        lines.push({name:'right eye', line:right_eye_line, shape:right_eye, scale_x:scale_x, scale_y:scale_y, x:x, y:y, rotation: -rotation_amount});
        shapes.push(right_eye);


        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y - (f.thick_unit * 4);
        var right_eye_line_top = [];
        if (face_options.eye_shape == 'Almond') {
            right_eye_line_top = transformShapeLine({type: 'almond-horizontal', modifier: 'right', radius: 4.2, starting_step: 8, ending_step: 17});
        }
        var right_eye_top = createPathFromLocalCoordinates(right_eye_line_top, {close_line: false, line_color: face_options.colors.cheek}, scale_x, scale_y);
        right_eye_top.x = x;
        right_eye_top.y = y;
        right_eye_top.rotation = -rotation_amount;
        lines.push({name:'right eye top', line:right_eye_line_top, shape:right_eye_top, scale_x:scale_x, scale_y:scale_y, x:x, y:y, rotation: -rotation_amount});
        shapes.push(right_eye_top);


        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y - (f.thick_unit * 3);
        var right_eye_line_bottom = [];
        if (face_options.eye_shape == 'Almond') {
            right_eye_line_bottom = transformShapeLine({type: 'almond-horizontal', modifier: 'right', radius: 4.2, starting_step: 3, ending_step: 9});
        }
        var right_eye_bottom = createPathFromLocalCoordinates(right_eye_line_bottom, {close_line: false, line_color: face_options.colors.cheek, thickness: f.thick_unit}, scale_x, scale_y);
        right_eye_bottom.x = x;
        right_eye_bottom.y = y;
        right_eye_bottom.rotation = -rotation_amount;
        lines.push({name:'right eye bottom', line:right_eye_line_bottom, shape:right_eye_bottom, scale_x:scale_x, scale_y:scale_y, x:x, y:y, rotation: -rotation_amount});
        shapes.push(right_eye_bottom);


        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y - (f.thick_unit * eyelid_height);
        var right_eyebrow_line_top = [];
        if (face_options.eye_shape == 'Almond') {
            right_eyebrow_line_top = transformShapeLine({type: 'almond-horizontal', modifier: 'right', radius: 4.2, starting_step: 9, ending_step: 18});
        }
        var right_eyebrow_top = createPathFromLocalCoordinates(right_eyebrow_line_top, {close_line: false, line_color: face_options.hair_color, thickness: eyelid_thick_start, thickness_end: eyelid_thick_stop}, scale_x, scale_y);
        right_eyebrow_top.x = x;
        right_eyebrow_top.y = y;
        right_eyebrow_top.alpha = eyelid_transparency;
        right_eyebrow_top.rotation = -rotation_amount - 5;
        lines.push({name:'right eyebrow top', line:right_eyebrow_line_top, shape:right_eyebrow_top, scale_x:scale_x, scale_y:scale_y, x:x, y:y, alpha: eyelid_transparency, rotation: -rotation_amount - 5});
        shapes.push(right_eyebrow_top);


        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x - (f.thick_unit * 4);
        y = zone.y - (f.thick_unit * 8);
        var right_eyebrow_line_inside = transformShapeLine({type: 'almond-horizontal', modifier: 'right', radius: 4.2, starting_step: 9, ending_step: 14});
        var right_eyebrow_inside = createPathFromLocalCoordinates(right_eyebrow_line_inside, {close_line: false, line_color: face_options.colors.darkflesh}, scale_x, scale_y);
        right_eyebrow_inside.x = x;
        right_eyebrow_inside.y = y;
        right_eyebrow_inside.rotation = -rotation_amount - 10;
        lines.push({name:'right eyebrow inside', line:right_eyebrow_line_inside, shape:right_eyebrow_inside, scale_x:scale_x, scale_y:scale_y, x:x, y:y, rotation: -rotation_amount - 10});
        shapes.push(right_eyebrow_inside);


        zone = f.eyes.iris;
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top);
        x = zone.right_x;
        y = zone.y;
        var right_iris_line = transformShapeLine({type: 'circle', radius: iris_size});
        var right_iris = createPathFromLocalCoordinates(right_iris_line, {close_line: true, fill_color: face_options.eye_color}, scale_x, scale_y);
        right_iris.x = x;
        right_iris.y = y;
        right_iris.alpha = iris_transparency;
        lines.push({name:'right iris', line:right_iris_line, shape:right_iris, scale_x:scale_x, scale_y:scale_y, x:x, y:y, alpha:iris_transparency});
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
        lines.push({name:'right eye round', line:right_eye_line, shape:right_eye_round, scale_x:scale_x, scale_y:scale_y, x:x, y:y, rotation: -rotation_amount});
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
        lines.push({name:'right pupil', line:[], shape:right_pupil, scale_x:scale_x, scale_y:scale_y, x:x, y:y, alpha: pupil_transparency});
        shapes.push(right_pupil);

        return shapes;
    }

    AvatarClass.prototype.buildNose_Lines = function(f, face_options, lines) {
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
        lines.push({name:'nose bottom line', line:nose_line, shape:l});
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
        lines.push({name:'nose right line', line:nose_line_r, shape:l_r});
        shapes.push(l_r);

        var l_l = createPathFromLocalCoordinates(nose_line_l, {thickness: thickness, thickness_end: thickness * .3, color: face_options.colors.deepshadow}, width, height);
        l_l.x = f.nose.x;
        l_l.y = f.nose.y;
        lines.push({name:'nose left line', line:nose_line_l, shape:l_l});
        shapes.push(l_l);

        return shapes;
    }

    AvatarClass.prototype.buildHair_Lines = function(f, face_options, lines) {
        var shapes = [];

        var hair_line_level_adjust = -f.thick_unit * 110;
        var inner_hair_x = 100;
        var inner_hair_y = 400;
        var outer_hair_x = 100;
        var outer_hair_y = 200;
        var inner_hair_peak = 200;

        var head_line = transformLineToGlobalCoordinates(lines, 'face');
        var eye_line = transformLineToGlobalCoordinates(lines, 'left eye');

        var zone = f.face;
        var hair_line = lineSegmentCompared(head_line, eye_line, 'above', hair_line_level_adjust);

        if (hair_line && hair_line.length) {
            var hair = createPathFromLocalCoordinates(hair_line, {thickness: f.thick_unit * 5, line_color: face_options.hair_color}, 1, 1); //Using 1,1 as already modified
            hair.x = zone.x * .9;  //TODO: Why .9?
            hair.y = zone.y * .9;  //Why .9?
            lines.push({name: 'hair line', line: hair_line, shape: hair, x: zone.x * .9, y: zone.y * .9, scale_x:1, scale_y:1});
//            shapes.push(hair);

            var hair_dots = createPathFromLocalCoordinates(hair_line, {thickness: f.thick_unit * 2, line_color: face_options.hair_color, x: zone.x *.9, y: zone.y *.9}, 1, 1); //Using 1,1 as already modified
            shapes = shapes.concat(hair_dots);

//            hair_line = hydratePointsAlongLine(hair_line, f.thick_unit * 200);

            var inner_hair_line = extrudeHorizontalArc(hair_line, f.thick_unit * inner_hair_x, f.thick_unit * inner_hair_y, f.thick_unit * inner_hair_peak);
            var outer_hair_line = extrudeHorizontalArc(hair_line, f.thick_unit * outer_hair_x, -f.thick_unit * outer_hair_y);

//            var inner_hair_dots = createPathFromLocalCoordinates(inner_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color, x: zone.x *.9, y: zone.y *.9}, 1, 1); //Using 1,1 as already modified
//            shapes = shapes.concat(inner_hair_dots);

//            var outer_hair_dots = createPathFromLocalCoordinates(outer_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color, x: zone.x *.9, y: zone.y *.9}, 1, 1); //Using 1,1 as already modified
//            shapes = shapes.concat(outer_hair_dots);

            var full_hair = inner_hair_line.concat(outer_hair_line.reverse());
            var outer_hair_dots = createPathFromLocalCoordinates(full_hair, {close_line:true, thickness: f.thick_unit * 2, fill_color: face_options.hair_color, x: zone.x *.9, y: zone.y *.9}, 1, 1); //Using 1,1 as already modified
            shapes = shapes.concat(outer_hair_dots);

        }
        return shapes;
    }

    AvatarClass.prototype.buildBeard_Lines = function(f, face_options, lines) {
        //TODO
        var shapes = [];

        var hair_line_level_adjust = -f.thick_unit * 110;
        var inner_hair_x = 100;
        var inner_hair_y = 400;
        var outer_hair_x = 100;
        var outer_hair_y = 200;
        var inner_hair_peak = 200;

        var head_line = transformLineToGlobalCoordinates(lines, 'face');
        var eye_line = transformLineToGlobalCoordinates(lines, 'left eye');

        var zone = f.face;
        var hair_line = lineSegmentCompared(head_line, eye_line, 'below', hair_line_level_adjust);

        if (hair_line && hair_line.length) {
            var hair = createPathFromLocalCoordinates(hair_line, {thickness: f.thick_unit * 5, line_color: face_options.hair_color}, 1, 1); //Using 1,1 as already modified
            hair.x = zone.x * .9;  //TODO: Why .9?
            hair.y = zone.y * .9;  //Why .9?
            lines.push({name: 'hair line', line: hair_line, shape: hair, x: zone.x * .9, y: zone.y * .9, scale_x:1, scale_y:1});
//            shapes.push(hair);

            var hair_dots = createPathFromLocalCoordinates(hair_line, {thickness: f.thick_unit * 2, line_color: face_options.hair_color, x: zone.x *.9, y: zone.y *.9}, 1, 1); //Using 1,1 as already modified
            shapes = shapes.concat(hair_dots);

//            hair_line = hydratePointsAlongLine(hair_line, f.thick_unit * 200);

            var inner_hair_line = extrudeHorizontalArc(hair_line, f.thick_unit * inner_hair_x, f.thick_unit * inner_hair_y, f.thick_unit * inner_hair_peak);
            var outer_hair_line = extrudeHorizontalArc(hair_line, f.thick_unit * outer_hair_x, -f.thick_unit * outer_hair_y);

//            var inner_hair_dots = createPathFromLocalCoordinates(inner_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color, x: zone.x *.9, y: zone.y *.9}, 1, 1); //Using 1,1 as already modified
//            shapes = shapes.concat(inner_hair_dots);

//            var outer_hair_dots = createPathFromLocalCoordinates(outer_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color, x: zone.x *.9, y: zone.y *.9}, 1, 1); //Using 1,1 as already modified
//            shapes = shapes.concat(outer_hair_dots);

            var full_hair = inner_hair_line.concat(outer_hair_line.reverse());
            var outer_hair_dots = createPathFromLocalCoordinates(full_hair, {close_line:true, thickness: f.thick_unit * 2, fill_color: face_options.hair_color, x: zone.x *.9, y: zone.y *.9}, 1, 1); //Using 1,1 as already modified
            shapes = shapes.concat(outer_hair_dots);

        }
        return shapes;
    }

    AvatarClass.prototype.buildMouth_Lines = function(f, face_options, lines) {
        var shapes = [];

        var mouth_width = 1;
        var bottom_lip_height = 1;
        var bottom_lip_bottom = 4;
        var top_lip_height = 0;
        var top_lip_top = 1;

        var lip_thickness = f.thick_unit * 2;
        var width = (f.mouth.right - f.mouth.left) / 2.7 * mouth_width;
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
            {x: 0, y: bottom_lip_bottom},
            {x: -10, y: 1}
        ];
        var l = createPathFromLocalCoordinates(mouth_top_line, {close_line: true, thickness: lip_thickness, color: face_options.colors.deepshadow, fill_color: face_options.lip_color}, width, height);
        l.x = f.mouth.x;
        l.y = f.mouth.y;
        l.name = 'mouth top';
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
        l2.name = 'mouth mid';
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
        shapes.push(l4);

        return shapes;
    }


    return AvatarClass;

})(Avatar || {});