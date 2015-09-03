//This set of functions adds rendering capabilities to avatar.js, specifically to draw things like human faces

new Avatar('add_render_function', {style:'lines', feature:'face', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
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

    var face_line = a.transformShapeLine(options, face_options);

    //TODO: Add Some skin variations, noise, dirtiness
    var skin_lighter = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.05).toString();
    var skin_bright = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.1).toString();
    var cheek_darker = net.brehaut.Color(face_options.skin_colors.cheek).darkenByRatio(0.05).toString();
    var fill_colors = [cheek_darker, skin_lighter, skin_bright, skin_lighter, cheek_darker];
    var fill_steps = [0, .25,.5, .75, 1];

    var face = a.createPathFromLocalCoordinates(face_line, {
            close_line: true, line_color: face_options.skin_colors.highlights,
            fill_method: 'linear', fill_colors: fill_colors, fill_steps: fill_steps,
            radius: radius_x * .1},
        radius_x, radius_y);
    face.x = zone.x;
    face.y = zone.y;
    lines.push({name: 'face', line: face_line, shape: face, scale_x: radius_x, scale_y: radius_y, x: zone.x, y: zone.y});
    shapes.push(face);

    return shapes;
}});

new Avatar('add_render_function', {style:'lines', feature:'neck', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
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

    var neck_color = net.brehaut.Color(face_options.skin_colors.skin).darkenByRatio(0.1).toString();
    var neck_line = a.transformShapeLine({type: 'neck', radius: 5, curvature: neck_curvature}, face_options);
    var neck = a.createPathFromLocalCoordinates(neck_line, {close_line: true, line_color: face_options.skin_colors.highlights, fill_color: neck_color}, scale_x, scale_y);
    neck.x = zone.x;
    neck.y = zone.y + (f.thick_unit * 175);
    lines.push({name: 'neck', line: neck_line, shape: neck, scale_x: scale_x, scale_y: scale_y, x: zone.x, y: zone.y});
    shapes.push(neck);

    if (face_options.gender == 'Male') {
        var darker_skin = net.brehaut.Color(face_options.skin_colors.skin).darkenByRatio(0.2).toString();
        var neck_apple_line = a.transformShapeLine({type: 'circle', radius: 0.5}, face_options);
        scale_x = (zone.right - zone.left);
        scale_y = (zone.bottom - zone.top) * apple_height;

        var neck_apple = a.createPathFromLocalCoordinates(neck_apple_line, {close_line: true, line_color: face_options.skin_colors.skin, fill_color: darker_skin}, scale_x, scale_y);
        neck_apple.x = zone.x;
        neck_apple.y = zone.y + (f.thick_unit * 225);
        neck_apple.alpha = apple_transparency;
        lines.push({name: 'neck_apple', line: neck_apple_line, shape: neck_apple, scale_x: scale_x, scale_y: scale_y, x: zone.x, y: zone.y + (f.thick_unit * 225)});
        shapes.push(neck_apple);
    }

    return shapes;
}});

new Avatar('add_render_function', {style:'lines', feature:'ears', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
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
    var inner_cavity_size_adjust = .2; //.3-.6
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
        inner_cavity_size_adjust = .25;
    } else if (face_options.ear_thickness == "Splayed") {
        ear_width_adjust = 2;
        ear_height_adjust = 1.2;
        inner_cavity_size_adjust = .3;
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
    var y;
    for (var i = 0; i < ear_line_side.length; i++) {
        y = ear_height_adjust * ear_line_side[i].y;
        var l_offset = 0;
        var r_offset = 0;
        if (i == ear_line_side.length - 1) {
            l_offset = left_lobe_height;
            r_offset = right_lobe_height;
        }
        ear_line_l.push({x: ear_width_adjust * ear_line_side[i].x, y: y + l_offset});
        ear_line_r.push({x: -ear_width_adjust * ear_line_side[i].x, y: y + r_offset});
    }

    var ear_r = a.createPathFromLocalCoordinates(ear_line_r, {close_line: true, thickness: f.thick_unit, fill_color: face_options.skin_colors.skin, color: face_options.skin_colors.deepshadow}, width, height);
    var x = zone.left_x - (f.thick_unit * ear_inset_adjust);
    y = zone.y - (f.thick_unit * ear_head_height_adjust);
    ear_r.x = x;
    ear_r.y = y;
    lines.push({name: 'ear right line', line: ear_line_r, shape: ear_r, scale_x: width, scale_y: height, x: x, y: y});
    shapes.push(ear_r);

    var ear_l = a.createPathFromLocalCoordinates(ear_line_l, {close_line: true, thickness: f.thick_unit, fill_color: face_options.skin_colors.skin, color: face_options.skin_colors.deepshadow}, width, height);
    x = zone.right_x + (f.thick_unit * ear_inset_adjust);
    y = zone.y - (f.thick_unit * ear_head_height_adjust);
    ear_l.x = x;
    ear_l.y = y;
    lines.push({name: 'ear left line', line: ear_line_l, shape: ear_l, scale_x: width, scale_y: height, x: x, y: y});
    shapes.push(ear_l);


    var in_scale = .7;
    var in_x_offset = 2;
    var in_y_offset = -8;
    var darker_ear = net.brehaut.Color(face_options.skin_colors.skin).darkenByRatio(0.2).toString();
    var ear_r_in_top = a.createPathFromLocalCoordinates(ear_line_r, {close_line: true, thickness: f.thick_unit, fill_color: darker_ear, color: face_options.skin_colors.deepshadow}, width * in_scale, height * in_scale);
    x = zone.left_x - (f.thick_unit * ear_inset_adjust) + (f.thick_unit * in_x_offset);
    y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
    ear_r_in_top.x = x;
    ear_r_in_top.y = y;
    lines.push({name: 'ear right line top in', line: ear_line_r, shape: ear_r_in_top, scale_x: width * in_scale, scale_y: height * in_scale, x: x, y: y});
    shapes.push(ear_r_in_top);

    var ear_l_in_top = a.createPathFromLocalCoordinates(ear_line_l, {close_line: true, thickness: f.thick_unit, fill_color: darker_ear, color: face_options.skin_colors.deepshadow}, width * in_scale, height * in_scale);
    x = zone.right_x + (f.thick_unit * ear_inset_adjust) - (f.thick_unit * in_x_offset);
    y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
    ear_l_in_top.x = x;
    ear_l_in_top.y = y;
    lines.push({name: 'ear left line top in', line: ear_line_l, shape: ear_l_in_top, scale_x: width * in_scale, scale_y: height * in_scale, x: x, y: y});
    shapes.push(ear_l_in_top);


    width *= inner_cavity_size_adjust;
    height *= inner_cavity_size_adjust;
    in_x_offset = 4;
    in_y_offset = 6;

    var ear_r_in = a.createPathFromLocalCoordinates(ear_line_r, {close_line: true, thickness: f.thick_unit, fill_color: face_options.skin_colors.darkflesh, color: face_options.skin_colors.deepshadow}, width, height);
    x = zone.left_x - (f.thick_unit * ear_inset_adjust) + (f.thick_unit * in_x_offset);
    y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
    ear_r_in.x = x;
    ear_r_in.y = y;
    ear_r_in.rotation = 6;
    lines.push({name: 'ear right line in', line: ear_line_r, shape: ear_r_in, scale_x: 1, scale_y: 1, x: x, y: y});
    shapes.push(ear_r_in);

    var ear_l_in = a.createPathFromLocalCoordinates(ear_line_l, {close_line: true, thickness: f.thick_unit, fill_color: face_options.skin_colors.darkflesh, color: face_options.skin_colors.deepshadow}, width, height);
    x = zone.right_x + (f.thick_unit * ear_inset_adjust) - (f.thick_unit * in_x_offset);
    y = zone.y - (f.thick_unit * ear_head_height_adjust) + (f.thick_unit * in_y_offset);
    ear_l_in.x = x;
    ear_l_in.y = y;
    ear_l_in.rotation = -6;
    lines.push({name: 'ear left line in', line: ear_line_l, shape: ear_l_in, scale_x: 1, scale_y: 1, x: x, y: y});
    shapes.push(ear_l_in);

    return shapes;
}});

new Avatar('add_render_function', {style:'lines', feature:'eyes', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    if (!face_options.eye_shape) {
        console.error("ERROR - face_options.eye_shape not set - likely no face_options were set");
    }

    var rotation_amount = 4; //-6 to 15, sets emotion
    if (face_options.eye_rotation == "Flat") {
        rotation_amount = -2;
    } else if (face_options.eye_rotation == "Small") {
        rotation_amount = 2;
    } else if (face_options.eye_rotation == "Medium") {
        rotation_amount = 4;
    } else if (face_options.eye_rotation == "Large") {
        rotation_amount = 7;
    } else if (face_options.eye_rotation == "Slanted") {
        rotation_amount = 11;
    }

    var iris_size = 3.6;  // 3.5 to 3.9
    var iris_lift = 1.3;
    var pupil_transparency = 0.7; //.1 - .9 for weird eyes, but .7 works best
    var iris_transparency = 0.5; //.1 - .9 for weird eyes, but .5 works best
    var pupil_color = 'black'; //best dark colors, black or dark blue. red looks freaky
    var eyebrow_thick_start = 4;
    var eyebrow_thick_stop = 2 * f.thick_unit;  //TODO: Still not working fully
    var eye_squint = 1.4;
    var iris_side_movement = -0; // -8 - 8  //TODO: Can go farther once eyes are overdrawn

    var eyebrow_height = 20; //15 - 40
    var eyebrow_transparency = 0.9;
    var eyebrow_rotation = -6; //-6 to 10
    var eyeline_transparency = 0.8;

    if (face_options.gender == 'Female') {
        eyebrow_thick_start *= 1.2;
        eyebrow_thick_stop *= 1.2;
    }

    eyebrow_thick_start += parseInt(face_options.age / 12);

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
        eye_fill_steps = [0, .8, .92, 1];
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


    eyebrow_thick_start *= f.thick_unit;

    //Left Eye
    var zone = f.eyes;
    var x = zone.left_x;
    var y = zone.y;
    var left_eye_line = [];
    if (face_options.eye_shape == 'Almond') {
        left_eye_line = a.transformShapeLine([
            {type: 'almond-horizontal', modifier: 'left', radius: 4.2},
            {type: 'pinch', pinch_amount: 0.6, starting_step: -3, ending_step: 4},
            {type: 'pinch', pinch_amount: 0.9, starting_step: -3, ending_step: 9}
        ], face_options);
    }

    var left_eye = a.createPathFromLocalCoordinates(left_eye_line, {
            close_line: true, line_color: face_options.skin_colors.darkflesh,
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
        left_eye_line_top = a.transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 11, ending_step: 19}, face_options);
    }
    var left_eye_top = a.createPathFromLocalCoordinates(left_eye_line_top, {close_line: false, line_color: face_options.skin_colors.cheek, thickness: f.thick_unit * 5}, width_eye, height_eye);
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
        left_eye_line_bottom = a.transformShapeLine([
                {type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 0, ending_step: 9},
                {type: 'pinch', pinch_amount: 0.7, starting_step: -3, ending_step: 4}
            ]
            , face_options);
    }
    var left_eye_bottom = a.createPathFromLocalCoordinates(left_eye_line_bottom, {close_line: false, line_color: face_options.skin_colors.darkflesh}, width_eye, height_eye);
    left_eye_bottom.x = x;
    left_eye_bottom.y = y;
    left_eye_bottom.alpha = eyeline_transparency;
    left_eye_bottom.rotation = rotation_amount;
    lines.push({name: 'left eye bottom', line: left_eye_line_bottom, shape: left_eye_bottom, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount});
    shapes.push(left_eye_bottom);

    var left_eyebrow_line_top = [
        {x: 10, y: 2},
        {x: -2, y: -6},
        {x: -10, y: 1}
    ];
    if (face_options.eyebrow_shape == "Slim") {
        left_eyebrow_line_top = [
            {x: 10, y: 1},
            {x: -2, y: -6},
            {x: -10, y: 1}
        ];
        eyebrow_thick_start /= 2;
    } else if (face_options.eyebrow_shape == "Squiggle") {
        left_eyebrow_line_top = [
            {x: 12, y: -1},
            {x: 4, y: 2},
            {x: -2, y: -5},
            {x: -10, y: 1}
        ];
    } else if (face_options.eyebrow_shape == "Squiggle Flip") {
        left_eyebrow_line_top = [
            {x: 12, y: 1},
            {x: 4, y: -2},
            {x: -2, y: 2},
            {x: -10, y: -1}
        ];
    } else if (face_options.eyebrow_shape == "Arch") {
        left_eyebrow_line_top = [
            {x: 11, y: 0},
            {x: 4, y: -3},
            {x: -2, y: -5},
            {x: -10, y: 2}
        ];
    }

    x = zone.left_x;
    y = zone.y - (f.thick_unit * 1.5 * eyebrow_height);
    var width_eyebrow = width_eye / 2.5;
    var height_eyebrow = height_eye / 4;

//        var left_eyebrow_line_top = [];
//        if (face_options.eye_shape == 'Almond') {
//            left_eyebrow_line_top = a.transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 10, ending_step: 17 + eyebrow_length}, face_options);
//        }
    var left_eyebrow_top = a.createPathFromLocalCoordinates(left_eyebrow_line_top, {close_line: false, line_color: face_options.hair_color, thickness: eyebrow_thick_start, thickness_end: eyebrow_thick_stop}, width_eyebrow, height_eyebrow);
    left_eyebrow_top.x = x;
    left_eyebrow_top.y = y;
    left_eyebrow_top.alpha = eyebrow_transparency;
    left_eyebrow_top.rotation = rotation_amount + eyebrow_rotation;
    lines.push({name: 'left eyebrow top', line: left_eyebrow_line_top, shape: left_eyebrow_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount + 5, alpha: eyebrow_transparency});
    shapes.push(left_eyebrow_top);


    x = zone.left_x + (f.thick_unit * 4);
    y = zone.y - (f.thick_unit * 8);
    var left_eyebrow_line_inside = a.transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: 4.2, starting_step: 14, ending_step: 19}, face_options);
    var left_eyebrow_inside = a.createPathFromLocalCoordinates(left_eyebrow_line_inside, {close_line: false, line_color: face_options.skin_colors.darkflesh}, width_eye, height_eye);
    left_eyebrow_inside.x = x;
    left_eyebrow_inside.y = y;
    left_eyebrow_inside.alpha = eyeline_transparency;
    left_eyebrow_inside.rotation = rotation_amount + 10;
    lines.push({name: 'left eyebrow inside', line: left_eyebrow_line_inside, shape: left_eyebrow_inside, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount + 10});
    shapes.push(left_eyebrow_inside);


    zone = f.eyes.iris;
    x = zone.left_x + (f.thick_unit * iris_side_movement);
    y = zone.y - (f.thick_unit * iris_lift);
    var left_iris_line = a.transformShapeLine({type: 'circle', radius: iris_size}, face_options);
    var left_iris = a.createPathFromLocalCoordinates(left_iris_line, {close_line: true, fill_color: face_options.eye_color}, width_iris, height_iris);
    left_iris.x = x;
    left_iris.y = y;
    left_iris.alpha = iris_transparency;
    lines.push({name: 'left iris', line: left_iris_line, shape: left_iris, scale_x: width_iris, scale_y: height_iris, x: x, y: y, alpha: iris_transparency});
    shapes.push(left_iris);


    zone = f.eyes;
    x = zone.left_x;
    y = zone.y;
    var left_eye_round = a.createPathFromLocalCoordinates(left_eye_line, {close_line: true, line_color: face_options.skin_colors.darkflesh}, width_eye, height_eye);
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
    var right_eye_line = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eye_line);
    var right_eye = a.createPathFromLocalCoordinates(right_eye_line, {
            close_line: true, line_color: face_options.skin_colors.darkflesh,
            fill_colors: eye_fill_colors, fill_steps: eye_fill_steps, radius: width_eye * .37, x_offset: +(2 * f.thick_unit)},
        width_eye, height_eye);

    right_eye.x = x;
    right_eye.y = y;
    right_eye.rotation = -rotation_amount;
    lines.push({name: 'right eye', line: right_eye_line, shape: right_eye, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});
    shapes.push(right_eye);


    x = zone.right_x;
    y = zone.y - (f.thick_unit * 4);
    var right_eye_line_top = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eye_line_top);
    var right_eye_top = a.createPathFromLocalCoordinates(right_eye_line_top, {close_line: false, line_color: face_options.skin_colors.cheek, thickness: f.thick_unit * 5}, width_eye, height_eye);
    right_eye_top.x = x;
    right_eye_top.y = y;
    right_eye_top.rotation = -rotation_amount;
    right_eye_top.alpha = eyeline_transparency;
    lines.push({name: 'right eye top', line: right_eye_line_top, shape: right_eye_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});
    shapes.push(right_eye_top);


    x = zone.right_x - f.thick_unit;
    y = zone.y + (f.thick_unit * 1.5);
    var right_eye_line_bottom = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eye_line_bottom);
    var right_eye_bottom = a.createPathFromLocalCoordinates(right_eye_line_bottom, {close_line: false, line_color: face_options.skin_colors.darkflesh, thickness: f.thick_unit}, width_eye, height_eye);
    right_eye_bottom.x = x;
    right_eye_bottom.y = y;
    right_eye_bottom.rotation = -rotation_amount;
    right_eye_bottom.alpha = eyeline_transparency;
    lines.push({name: 'right eye bottom', line: right_eye_line_bottom, shape: right_eye_bottom, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});
    shapes.push(right_eye_bottom);


    x = zone.right_x;
    y = zone.y - (f.thick_unit * 1.5 * eyebrow_height);
    var right_eyebrow_line_top = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eyebrow_line_top);
    var right_eyebrow_top = a.createPathFromLocalCoordinates(right_eyebrow_line_top, {close_line: false, line_color: face_options.hair_color, thickness: eyebrow_thick_start, thickness_end: eyebrow_thick_stop}, width_eyebrow, height_eyebrow);
    right_eyebrow_top.x = x;
    right_eyebrow_top.y = y;
    right_eyebrow_top.alpha = eyebrow_transparency;
    right_eyebrow_top.rotation = -rotation_amount - eyebrow_rotation;
    lines.push({name: 'right eyebrow top', line: right_eyebrow_line_top, shape: right_eyebrow_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, alpha: eyebrow_transparency, rotation: -rotation_amount - 5});
    shapes.push(right_eyebrow_top);


    x = zone.right_x - (f.thick_unit * 4);
    y = zone.y - (f.thick_unit * 8);
    var right_eyebrow_line_inside = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eyebrow_line_inside);
    var right_eyebrow_inside = a.createPathFromLocalCoordinates(right_eyebrow_line_inside, {close_line: false, line_color: face_options.skin_colors.darkflesh}, width_eye, height_eye);
    right_eyebrow_inside.x = x;
    right_eyebrow_inside.y = y;
    right_eyebrow_inside.rotation = -rotation_amount - 10;
    right_eyebrow_inside.alpha = eyeline_transparency;
    lines.push({name: 'right eyebrow inside', line: right_eyebrow_line_inside, shape: right_eyebrow_inside, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount - 10});
    shapes.push(right_eyebrow_inside);


    zone = f.eyes.iris;
    x = zone.right_x + (f.thick_unit * iris_side_movement);
    y = zone.y - (f.thick_unit * iris_lift);
    var right_iris_line = a.transformShapeLine({type: 'circle', radius: iris_size}, face_options);
    var right_iris = a.createPathFromLocalCoordinates(right_iris_line, {close_line: true, fill_color: face_options.eye_color}, width_iris, height_iris);
    right_iris.x = x;
    right_iris.y = y;
    right_iris.alpha = iris_transparency;
    lines.push({name: 'right iris', line: right_iris_line, shape: right_iris, scale_x: width_iris, scale_y: height_iris, x: x, y: y, alpha: iris_transparency});
    shapes.push(right_iris);


    zone = f.eyes;
    x = zone.right_x;
    y = zone.y;
    var right_eye_round = a.createPathFromLocalCoordinates(right_eye_line, {close_line: true, line_color: face_options.skin_colors.darkflesh}, width_eye, height_eye);
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
}});

new Avatar('add_render_function', {style:'lines', feature:'nose', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
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
        width *= 1.1;
    } else if (face_options.nose_shape == 'Thin') {
        width *= 0.9;
    } else if (face_options.nose_shape == 'Bulbous') {
        width *= 1.2;
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
        width *= 1.15;
        height *= 1.3;
        thickness *= 1.4;
        nose_side_offset++;
    } else if (face_options.nose_size == 'Giant') {
        nose_length = 6;
        width *= 1.2;
        height *= 1.4;
        thickness *= 1.5;
        nose_side_offset += 2;
    } else if (face_options.nose_size == 'Huge') {
        nose_length = 7;
        width *= 1.3;
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
    var nose_bottom_squiggle = a.createPathFromLocalCoordinates(nose_line, {thickness: 2 * thickness, color: face_options.skin_colors.deepshadow}, width, height);
    nose_bottom_squiggle.x = f.nose.x;
    nose_bottom_squiggle.y = f.nose.y;
    lines.push({name: 'nose bottom line', line: nose_line, shape: nose_bottom_squiggle});


    //Sides of nose, that get taller based on size
    var nose_line_side = [
        {x: 12, y: 8},
        {x: 16, y: 3},
        {x: 9, y: -4},
        {x: 7, y: -7},
        {x: 7, y: -12},
        {x: 6, y: -14},
        {x: 7, y: -16},
        {x: 8, y: -18},
        {x: 8, y: -24}

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
    var full_nose_line = a.transformShapeLine({type: 'smooth'}, face_options, nose_full_line);
    var alpha = 1;

    var fill_color = net.brehaut.Color(face_options.skin_colors.skin).darkenByRatio(0.05).toString();
    var nose_fill_colors = [face_options.skin_colors.highlights, maths.hexColorToRGBA(fill_color, 0.9), maths.hexColorToRGBA(face_options.skin_colors.skin, 0.3)];
    var nose_fill_steps = [0, .5, 1];

    var full_nose = a.createPathFromLocalCoordinates(full_nose_line, {
        close_line: true, thickness: f.thick_unit * .2, line_color: face_options.skin_colors.skin,
        fill_colors: nose_fill_colors, fill_method: 'radial',
        fill_steps: nose_fill_steps, y_offset: (5 * f.thick_unit), radius: (80 * f.thick_unit)
    }, width, height);
    full_nose.x = f.nose.x;
    full_nose.y = f.nose.y;
    full_nose.alpha = alpha;
    lines.push({name: 'full nose', line: full_nose_line, shape: full_nose, x: f.nose.x, y: f.nose.y, scale_x: 1, scale_y: 1, alpha: alpha});
    shapes = shapes.concat(full_nose);

    shapes.push(nose_bottom_squiggle);

    var l_r = a.createPathFromLocalCoordinates(nose_line_r, {thickness: thickness, thickness_end: thickness * .3, color: face_options.skin_colors.deepshadow}, width, height);
    l_r.x = f.nose.x;
    l_r.y = f.nose.y;
    lines.push({name: 'nose right line', line: nose_line_r, shape: l_r});
    shapes.push(l_r);

    var l_l = a.createPathFromLocalCoordinates(nose_line_l, {thickness: thickness, thickness_end: thickness * .3, color: face_options.skin_colors.deepshadow}, width, height);
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
    var l5 = a.createPathFromLocalCoordinates(mouth_high_left_line, {close_line: false, thickness: 0, color: face_options.skin_colors.deepshadow, fill_color: 'pink'}, width, height);
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
    var l6 = a.createPathFromLocalCoordinates(mouth_high_right_line, {close_line: false, thickness: 0, color: face_options.skin_colors.deepshadow, fill_color: 'pink'}, width, height);
    l6.x = f.mouth.x;
    l6.y = f.mouth.y - (f.thick_unit * 24);
    l6.alpha = 0.5;
    lines.push({name: 'mouth high right line', line: mouth_high_right_line, shape: l6, x: f.mouth.x, y: f.mouth.y - (f.thick_unit * 24), scale_x: width, scale_y: height});
    shapes.push(l6);


    return shapes;
}});

new Avatar('add_render_function', {style:'lines', feature:'hair', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
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

    var head_line = a.transformLineToGlobalCoordinates(lines, 'face');
    var eye_line = a.transformLineToGlobalCoordinates(lines, 'left eye');

    head_line = a.hydratePointsAlongLine(head_line, f.thick_unit * 30);

    var zone = f.face;
    var hair_line = a.lineSegmentCompared(head_line, eye_line, 'above', hair_line_level_adjust);

    if (hair_line && hair_line.length) {
        var hair_dot_array = a.createPath(hair_line, {dot_array: true, thickness: f.thick_unit * 5, line_color: face_options.hair_color});
        lines.push({name: 'hair dot line', line: hair_line, shape: hair_dot_array, x: 0, y: 0, scale_x: 1, scale_y: 1});
//            shapes = shapes.concat(hair);


        var inner_hair_line = a.extrudeHorizontalArc(hair_line, f.thick_unit * inner_hair_x, f.thick_unit * inner_hair_y, f.thick_unit * inner_hair_peak);
//            var inner_hair_dots = a.createPath(inner_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color});
//            shapes = shapes.concat(inner_hair_dots);

        var outer_hair_line = a.extrudeHorizontalArc(hair_line, f.thick_unit * outer_hair_x, -f.thick_unit * outer_hair_y);
//            var outer_hair_dots = a.createPath(outer_hair_line, {dot_array:true, thickness: f.thick_unit * 2, line_color: face_options.hair_color});
//            shapes = shapes.concat(outer_hair_dots);

        var color = face_options.hair_color;
        var fill_color = color;
        if (color == 'White' || color == '#000000') color = 'gray';

        var full_hair_line = inner_hair_line.concat(outer_hair_line.reverse());
        full_hair_line = a.transformShapeLine({type: 'smooth'}, face_options, full_hair_line);
        var outer_hair = a.createPath(full_hair_line, {close_line: true, thickness: f.thick_unit * 2, color: color, fill_color: fill_color});
        lines.push({name: 'full hair', line: full_hair_line, shape: outer_hair, x: zone.x, y: zone.y, scale_x: 1, scale_y: 1});

        shapes = shapes.concat(outer_hair);

    }
    return shapes;
}});

new Avatar('add_render_function', {style:'lines', feature:'beard', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
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
//            inner_hair_x = 1;
        inner_hair_y = 14;
        outer_hair_x = 1;
        outer_hair_y = 2;
        alpha = .9;
    } else if (face_options.beard_style == 'Chin Warmer') {
        hair_line_level_adjust = 1;
//            inner_hair_x = 0;
        inner_hair_y = 11;
        outer_hair_x = .5;
        outer_hair_y = .5;
        alpha = .8;
    } else if (face_options.beard_style == 'Soup Catcher') {
        hair_line_level_adjust = 1;
//            inner_hair_x = 1;
        inner_hair_y = 15;
        outer_hair_x = 1;
        outer_hair_y = 10;
        alpha = .9;
    } else if (face_options.beard_style == 'Thin Chin Wrap') {
        hair_line_level_adjust = 1;
//            inner_hair_x = 1;
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

    var head_line = a.transformLineToGlobalCoordinates(lines, 'face');
    var eye_line = a.transformLineToGlobalCoordinates(lines, 'left eye');

    var beard_line = a.lineSegmentCompared(head_line, eye_line, 'below', hair_line_level_adjust * 10 * f.thick_unit);

    if (beard_line && beard_line.length && beard_line.length > 2) {
        var beard = a.createPath(beard_line, {thickness: f.thick_unit * 5, line_color: face_options.hair_color});
        lines.push({name: 'beard line', line: beard_line, shape: beard, x: 0, y: 0, scale_x: 1, scale_y: 1});
//            shapes.push(beard);

        var inner_hair_line = a.extrudeHorizontalArc(beard_line, -f.thick_unit * inner_hair_x * 10, -f.thick_unit * inner_hair_y * 10);
        var outer_hair_line = a.extrudeHorizontalArc(beard_line, -f.thick_unit * outer_hair_x * 10, f.thick_unit * outer_hair_y * 10);

        var color = face_options.beard_color || face_options.hair_color;
        if (color == 'Hair') color = face_options.hair_color;
        var fill_color = color;
        if (color == 'White' || color == '#000000') color = 'gray';

        var full_beard_line = outer_hair_line.concat(inner_hair_line.reverse());
        full_beard_line = a.transformShapeLine({type: 'smooth'}, face_options, full_beard_line);

        var full_beard = a.createPath(full_beard_line, {close_line: true, thickness: f.thick_unit * .5, line_color: color, fill_color: fill_color});
        full_beard.alpha = alpha;
        lines.push({name: 'full beard', line: full_beard_line, shape: full_beard, x: 0, y: 0, scale_x: 1, scale_y: 1, alpha: alpha});
        shapes = shapes.concat(full_beard);

    }
    return shapes;
}});

new Avatar('add_render_function', {style:'lines', feature:'wrinkles', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var wrinkle_lines = parseInt(face_options.age / 15);
    var head_line = a.transformLineToGlobalCoordinates(lines, 'face');
    var left_eye_line = a.transformLineToGlobalCoordinates(lines, 'left eye');

    head_line = a.hydratePointsAlongLine(head_line, f.thick_unit * 30);

    var hair_line = a.lineSegmentCompared(head_line, left_eye_line, 'above');

    if (hair_line && hair_line.length) {
        var hair_dot_array = a.createPath(hair_line, {close_line: true, thickness: f.thick_unit * 5, line_color: face_options.hair_color});
        lines.push({name: 'hair dot line', line: hair_line, shape: hair_dot_array, x: 0, y: 0, scale_x: 1, scale_y: 1});
//            shapes = shapes.concat(hair_dot_array);

        var mid_x = a.comparePoints(hair_line, 'x', 'middle');
        var mid_y = a.comparePoints(hair_line, 'y', 'middle') + (f.thick_unit * 30);
        var base_width = (f.thick_unit * 220);
        var height = (f.thick_unit * 100);

        //TODO: Should warp this to match head shape
        var forehead_wrinkle_line = [
            {x: -4, y: 0},
            {x: 0, y: -.5},
            {x: 4, y: 0}
        ];

        var x, y, width;
        var alpha = .2;

        for (var i = 0; i < wrinkle_lines; i++) {
            width = base_width - (f.thick_unit * i * 25);
            var forehead_wrinkle = a.createPathFromLocalCoordinates(forehead_wrinkle_line, {close_line: false, thickness: (f.thick_unit * 2), color: face_options.skin_colors.deepshadow}, width, height);
            x = mid_x;
            y = mid_y - (f.thick_unit * i * 15);
            forehead_wrinkle.x = x;
            forehead_wrinkle.y = y;
            forehead_wrinkle.alpha = alpha;
            lines.push({name: 'forehead wrinkle line ' + i, line: forehead_wrinkle_line, shape: forehead_wrinkle, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
            shapes.push(forehead_wrinkle);
        }
    }

    var right_eye_line = a.transformLineToGlobalCoordinates(lines, 'right eye');
    mid_x = a.comparePoints(head_line, 'x', 'middle');
    mid_y = right_eye_line[0].y;

    var mid_nose_divot_line = [
        {x: -1, y: -3},
        {x: 0, y: -1.5},
        {x: -.5, y: 3}
    ];
    height /= 1.2;
    var divot_line = a.createPathFromLocalCoordinates(mid_nose_divot_line, {close_line: false, thickness: (f.thick_unit * 2), color: face_options.skin_colors.deepshadow}, width, height);
    x = mid_x - (f.thick_unit * 10);
    y = mid_y - (f.thick_unit * 25);
    alpha = (face_options.age / 350);
    divot_line.x = x;
    divot_line.y = y;
    divot_line.alpha = alpha;
    lines.push({name: 'mid nose divot line', line: mid_nose_divot_line, shape: divot_line, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
    shapes.push(divot_line);

    var divot_line_r_2 = a.transformShapeLine({type: 'reverse', direction: 'horizontal'}, face_options, mid_nose_divot_line);
    var divot_line_2 = a.createPathFromLocalCoordinates(divot_line_r_2, {close_line: false, thickness: (f.thick_unit * 2), color: face_options.skin_colors.deepshadow}, width, height);
    x = mid_x + (f.thick_unit * 10);
    divot_line_2.x = x;
    divot_line_2.y = y;
    divot_line_2.alpha = alpha;
    lines.push({name: 'mid nose divot line 2', line: divot_line_r_2, shape: divot_line_2, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
    shapes.push(divot_line_2);

    var nose_divot_line = [
        {x: 0, y: -3},
        {x: 0, y: -1.5},
        {x: 0, y: 1.5},
        {x: 0, y: 3}
    ];
    height *= (face_options.age / 50);
    var divot_line_3 = a.createPathFromLocalCoordinates(nose_divot_line, {close_line: false, thickness: (f.thick_unit), color: face_options.skin_colors.deepshadow}, width, height);
    x = mid_x;
    y = mid_y - (f.thick_unit * 35);
    alpha = (face_options.age / 400);
    divot_line_3.x = x;
    divot_line_3.y = y;
    divot_line_3.alpha = alpha;
    lines.push({name: 'mid nose divot line', line: nose_divot_line, shape: divot_line_3, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
    shapes.push(divot_line_3);


    return shapes;
}});

new Avatar('add_render_function', {style:'lines', feature:'chin', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
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
    var chin_top_line = a.createPathFromLocalCoordinates(chin_line, {close_line: false, thickness: (f.thick_unit * 2), color: face_options.skin_colors.deepshadow}, width, height);
    var x = f.mouth.x;
    var y = f.mouth.y + (f.thick_unit * 30);
    var alpha = .5;
    chin_top_line.x = x;
    chin_top_line.y = y;
    chin_top_line.alpha = alpha;
    lines.push({name: 'chin top line', line: chin_line, shape: chin_top_line, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
    shapes.push(chin_top_line);

    var chin_mid_line = a.createPathFromLocalCoordinates(chin_line, {close_line: false, thickness: (f.thick_unit * 7), color: face_options.skin_colors.deepshadow}, width * .9, height);
    x = f.mouth.x;
    y = f.mouth.y + (f.thick_unit * 32);
    alpha = .2;
    chin_mid_line.x = x;
    chin_mid_line.y = y;
    chin_mid_line.alpha = alpha;
    lines.push({name: 'chin mid line', line: chin_line, shape: chin_mid_line, x: x, y: y, alpha: alpha, scale_x: width * .9, scale_y: height});
    shapes.push(chin_mid_line);

    var chin_line_lower = [
        {x: -5, y: 1},
        {x: 0, y: 0},
        {x: 5, y: 1}
    ];
    width *= 1.5;
    var chin_under_line = a.createPathFromLocalCoordinates(chin_line_lower, {close_line: false, thickness: (f.thick_unit * 1.5), color: face_options.skin_colors.deepshadow}, width, height);
    x = f.mouth.x;
    y = f.mouth.y + (f.thick_unit * 45);
    alpha = .15;
    chin_under_line.x = x;
    chin_under_line.y = y;
    chin_under_line.alpha = alpha;
    lines.push({name: 'chin bottom line', line: chin_line_lower, shape: chin_under_line, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
    shapes.push(chin_under_line);

    var head_line = a.transformLineToGlobalCoordinates(lines, 'face');
    var chin_mid_line_piece = a.transformLineToGlobalCoordinates(lines, 'chin mid line');
    var chin = a.lineSegmentCompared(head_line, chin_mid_line_piece, 'below', f.thick_unit * -5);

    var chin_fill_colors = [face_options.skin_colors.cheek, face_options.skin_colors.skin];
    var chin_fill_steps = [0, 1];
    var chin_height, chin_shape;
    if (face_options.chin_shape == 'Pronounced') {
        //TODO: This could use some work to make it look more realistic

        if (chin && chin.length && chin.length > 2 && face_options.age < 20) {
            chin = a.transformShapeLine({type: 'contract', multiplier: 0.7}, face_options, chin);
            chin_height = a.comparePoints(chin, 'height');

            chin_shape = a.createPath(chin, {
                close_line: true, thickness: f.thick_unit, smooth: true, line_color: face_options.skin_colors.skin,
                fill_colors: chin_fill_colors, fill_method: 'radial',
                fill_steps: chin_fill_steps, radius: chin_height / 1.5
            });
            chin_shape.y = (f.thick_unit * 10);
            shapes.push(chin_shape);
        }

    } else if (face_options.chin_shape == 'Oval') {

        if (chin && chin.length && chin.length > 2 && face_options.age < 20) {
            chin_height = a.comparePoints(chin, 'height');

            chin_shape = a.createPath(chin, {
                close_line: true, thickness: f.thick_unit, smooth: true, line_color: face_options.skin_colors.skin,
                fill_colors: chin_fill_colors, fill_method: 'radial',
                fill_steps: chin_fill_steps, radius: chin_height / 2
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

    if (draw_divot && face_options.age < 20) {
        var mid_x = a.comparePoints(chin, 'x', 'middle');
        var mid_y = a.comparePoints(chin, 'y', 'middle');

        var chin_divot_line = [
            {x: 0, y: -3},
            {x: 0, y: 0},
            {x: -.5, y: 3}
        ];

        var divot_line = a.createPathFromLocalCoordinates(chin_divot_line, {close_line: false, thickness: (f.thick_unit * 5), color: face_options.skin_colors.deepshadow}, width, height);
        x = mid_x - (f.thick_unit);
        y = mid_y + (f.thick_unit * 8);
        alpha = .1;
        divot_line.x = x;
        divot_line.y = y;
        divot_line.alpha = alpha;
        lines.push({name: 'chin divot line', line: chin_divot_line, shape: divot_line, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
        shapes.push(divot_line);

        if (face_options.chin_divot == 'Double') {
            chin_divot_line = a.transformShapeLine({type: 'reverse', direction: 'horizontal'}, face_options, chin_divot_line);
            var divot_line_2 = a.createPathFromLocalCoordinates(chin_divot_line, {close_line: false, thickness: (f.thick_unit * 5), color: face_options.skin_colors.deepshadow}, width, height);
            divot_line_2.x = x + (f.thick_unit * 6);
            divot_line_2.y = y;
            divot_line_2.alpha = alpha;
            divot_line_2.name = 'chin divot line 2';
            lines.push({name: 'chin divot line 2', line: chin_divot_line, shape: divot_line_2, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
            shapes.push(divot_line_2);
        }
    }

    return shapes;
}});

new Avatar('add_render_function', {style:'lines', feature:'mouth', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    //These can change expression alot
    var mouth_width = 1; //.6 - 1.3
    if (face_options.mouth_width == "Tiny") {
        mouth_width = .6;
    } else if (face_options.mouth_width == "Small") {
        mouth_width = .75;
    } else if (face_options.mouth_width == "Short") {
        mouth_width = .9;
    } else if (face_options.mouth_width == "Normal") {
        mouth_width = 1;
    } else if (face_options.mouth_width == "Big") {
        mouth_width = 1.1;
    } else if (face_options.mouth_width == "Wide") {
        mouth_width = 1.2;
    }

    var lip_bottom_height = 0.5; // 0 - 2
    if (face_options.lip_bottom_height == "Down") {
        lip_bottom_height = 0;
    } else if (face_options.lip_bottom_height == "Low") {
        lip_bottom_height = .25;
    } else if (face_options.lip_bottom_height == "Raised") {
        lip_bottom_height = 1;
    } else if (face_options.lip_bottom_height == "High") {
        lip_bottom_height = 1.3;
    }

    var lip_bottom_bottom = 1.5; // 1-5
    if (face_options.lip_bottom_bottom == "Down") {
        lip_bottom_bottom = 1;
    } else if (face_options.lip_bottom_bottom == "Low") {
        lip_bottom_bottom = 1.2;
    } else if (face_options.lip_bottom_bottom == "Raised") {
        lip_bottom_bottom = 2;
    } else if (face_options.lip_bottom_bottom == "High") {
        lip_bottom_bottom = 2.5;
    }

    var lip_top_height = 1.5; //.2 - 1.5
    if (face_options.lip_top_height == "Down") {
        lip_top_height = .5;
    } else if (face_options.lip_top_height == "Low") {
        lip_top_height = 1;
    } else if (face_options.lip_top_height == "Raised") {
        lip_top_height = 1.75;
    } else if (face_options.lip_top_height == "High") {
        lip_top_height = 2;
    }

    var lip_top_top = 1; //.2 - 2
    if (face_options.lip_top_top == "Down") {
        lip_top_top = .2;
    } else if (face_options.lip_top_top == "Low") {
        lip_top_top = .5;
    } else if (face_options.lip_top_top == "Raised") {
        lip_top_top = 1.3;
    } else if (face_options.lip_top_top == "High") {
        lip_top_top = 1.5;
    }

    var mouth_left_lift = 0;
    if (face_options.mouth_left_upturn == "Down") {
        mouth_left_lift = -2;
    } else if (face_options.mouth_left_upturn == "Low") {
        mouth_left_lift = -1;
    } else if (face_options.mouth_left_upturn == "Raised") {
        mouth_left_lift = 1;
    } else if (face_options.mouth_left_upturn == "High") {
        mouth_left_lift = 2;
    }
    var mouth_right_lift = 0;
    if (face_options.mouth_right_upturn == "Down") {
        mouth_right_lift = -2;
    } else if (face_options.mouth_right_upturn == "Low") {
        mouth_right_lift = -1;
    } else if (face_options.mouth_right_upturn == "Raised") {
        mouth_right_lift = 1;
    } else if (face_options.mouth_right_upturn == "High") {
        mouth_right_lift = 2;
    }

    lip_top_top += lip_top_height;

    var lip_thickness = f.thick_unit * 2;
    var width = (f.mouth.right - f.mouth.left) / 2.6 * mouth_width;
    var height = (f.mouth.bottom - f.mouth.top);

    if (face_options.gender == 'Female') {
        lip_thickness *= 1.4;
        lip_bottom_bottom += 1.5;
        lip_bottom_height += 1;
        lip_top_top += 1;
    }

    //Mouth top and bottom line
    var mouth_top_line = [
        {x: -13, y: -2 - mouth_left_lift},
        {x: -10, y: -1 - (mouth_left_lift/2)},
        {x: -5, y: -(lip_top_top * 2)},
        {x: -1, y: -lip_top_top},
        {x: 1, y: -lip_top_top},
        {x: 5, y: -(lip_top_top * 2)},
        {x: 10, y: -1 - (mouth_right_lift/2) },
        {x: 13, y: -2 - mouth_right_lift},

        {x: 12, y: 0 - mouth_right_lift},
        {x: 10, y: 1 - (mouth_right_lift/2) },
        {x: 4, y: lip_bottom_height + lip_bottom_bottom},
        {x: 1, y: lip_bottom_height + lip_bottom_bottom - 1},
        {x: -1, y: lip_bottom_height + lip_bottom_bottom - 1},
        {x: -4, y: lip_bottom_height + lip_bottom_bottom},
        {x: -10, y: 1 - (mouth_left_lift/2)},
        {x: -12, y: 0 - mouth_left_lift}
    ];
    if (face_options.lip_shape == "Thin") {
        mouth_top_line = [
            {x: -13, y: -2 - (mouth_left_lift *.5)},
            {x: -5, y: -(lip_top_top)},
            {x: -1, y: -(lip_top_top *.8)},
            {x: 1, y: -(lip_top_top *.8)},
            {x: 5, y: -(lip_top_top)},
            {x: 13, y: -2 - (mouth_right_lift *.5)},

            {x: 12, y: -2.5 - (mouth_right_lift *.5)},
            {x: 4, y: (lip_bottom_height + lip_bottom_bottom) *.5},
            {x: 1, y: (lip_bottom_height + lip_bottom_bottom) * .7},
            {x: -1, y: (lip_bottom_height + lip_bottom_bottom) * .7},
            {x: -4, y: (lip_bottom_height + lip_bottom_bottom) *.5},
            {x: -12, y: -2.5 - (mouth_left_lift *.5)}
        ];
    } else if (face_options.lip_shape == "Thick") {
        mouth_top_line = [
            {x: -13, y: -2 - (mouth_left_lift *.7)},
            {x: -5, y: -(lip_top_top * 1.2)},
            {x: -1, y: -(lip_top_top * 1.1)},
            {x: 1, y: -(lip_top_top * 1.1)},
            {x: 5, y: -(lip_top_top * 1.2)},
            {x: 13, y: -2 - (mouth_right_lift *.7)},

            {x: 12, y: -2.5 - (mouth_right_lift *.5)},
            {x: 4, y: (lip_bottom_height + lip_bottom_bottom) *.9},
            {x: 1, y: (lip_bottom_height + lip_bottom_bottom) * 1.1},
            {x: -1, y: (lip_bottom_height + lip_bottom_bottom) * 1.1},
            {x: -4, y: (lip_bottom_height + lip_bottom_bottom) *.9},
            {x: -12, y: -2.5 - (mouth_left_lift *.5)}
        ];
    }

    var l = a.createPathFromLocalCoordinates(mouth_top_line, {close_line: true, thickness: lip_thickness, color: face_options.skin_colors.deepshadow, fill_color: face_options.lip_color}, width, height);
    l.x = f.mouth.x;
    l.y = f.mouth.y;
    l.name = 'lips';
    lines.push({name: 'lips', line: mouth_top_line, shape: l, x: f.mouth.x, y: f.mouth.y, scale_x: width, scale_y: height});
    shapes.push(l);

    var tongue_line = a.transformShapeLine({type:'midline of loop'}, face_options, mouth_top_line);
    var l2 = a.createPathFromLocalCoordinates(tongue_line, {close_line: false, thickness: 1, color: face_options.skin_colors.deepshadow}, width, height);
    l2.x = f.mouth.x;
    l2.y = f.mouth.y;
    l2.alpha = 0.5;
    l2.name = 'tongue';
    lines.push({name: 'tongue', line: tongue_line, shape: l2, x: f.mouth.x, y: f.mouth.y, scale_x: width, scale_y: height});
    shapes.push(l2);


    return shapes;
}});


new Avatar('add_render_function', {style:'circles', feature:'neck', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];
    var neck = new createjs.Shape();
    var zone = f.neck;
    neck.graphics.beginStroke(face_options.skin_colors.highlights).beginFill(face_options.skin_colors.skin).drawRect(zone.left, zone.top, zone.right, zone.bottom);
    neck.x = zone.x;
    neck.y = zone.y;
    shapes.push(neck);
    return shapes;
}});

new Avatar('add_render_function', {style:'circles', feature:'ears', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];

    var left_ear = new createjs.Shape();
    var zone = f.ears;
    left_ear.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill(face_options.skin_colors.cheek).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    left_ear.x = zone.left_x;
    left_ear.y = zone.y;
    shapes.push(left_ear);

    var right_ear = new createjs.Shape();
    zone = f.ears;
    right_ear.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill(face_options.skin_colors.cheek).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    right_ear.x = zone.right_x;
    right_ear.y = zone.y;
    shapes.push(right_ear);
    return shapes;
}});

new Avatar('add_render_function', {style:'circles', feature:'face', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];

    var face = new createjs.Shape();
    var zone = f.face;
    face.graphics.beginStroke(face_options.skin_colors.highlights).beginFill(face_options.skin_colors.skin).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    face.x = zone.x;
    face.y = zone.y;
    shapes.push(face);
    return shapes;
}});

new Avatar('add_render_function', {style:'circles', feature:'eyes', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];

    var left_eye = new createjs.Shape();
    var zone = f.eyes;
    left_eye.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill('white').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    left_eye.x = zone.left_x;
    left_eye.y = zone.y;
    shapes.push(left_eye);

    var left_iris = new createjs.Shape();
    zone = f.eyes.iris;
    left_iris.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill(face_options.eye_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    left_iris.x = zone.left_x;
    left_iris.y = zone.y;
    shapes.push(left_iris);

    var left_pupil = new createjs.Shape();
    zone = f.eyes.pupil;
    left_pupil.graphics.beginFill('black').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    left_pupil.x = zone.left_x;
    left_pupil.y = zone.y;
    shapes.push(left_pupil);

    var right_eye = new createjs.Shape();
    zone = f.eyes;
    right_eye.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill('white').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    right_eye.x = zone.right_x;
    right_eye.y = zone.y;
    shapes.push(right_eye);

    var right_iris = new createjs.Shape();
    zone = f.eyes.iris;
    right_iris.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill(face_options.eye_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    right_iris.x = zone.right_x;
    right_iris.y = zone.y;
    shapes.push(right_iris);

    var right_pupil = new createjs.Shape();
    zone = f.eyes.pupil;
    right_pupil.graphics.beginFill('black').drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    right_pupil.x = zone.right_x;
    right_pupil.y = zone.y;
    shapes.push(right_pupil);

    return shapes;
}});

new Avatar('add_render_function', {style:'circles', feature:'nose', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];
    var nose = new createjs.Shape();
    var zone = f.nose;
    nose.graphics.beginStroke(face_options.skin_colors.deepshadow).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    nose.x = zone.x;
    nose.y = zone.y;
    shapes.push(nose);
    return shapes;
}});

new Avatar('add_render_function', {style:'circles', feature:'mouth', renderer: function(face_zones, avatar) {
    var f = face_zones;
    var face_options = avatar.face_options;
    var shapes = [];

    var mouth = new createjs.Shape();
    var zone = f.mouth;
    mouth.graphics.beginStroke(face_options.skin_colors.deepshadow).beginFill(face_options.lip_color).drawEllipse(zone.left, zone.top, zone.right, zone.bottom);
    mouth.x = zone.x;
    mouth.y = zone.y;
    shapes.push(mouth);

    var mouth_line = new createjs.Shape();
    zone = f.mouth;
    mouth_line.graphics.setStrokeStyle(.5 * f.thick_unit).beginStroke('black').moveTo(zone.x + zone.left, zone.y).lineTo(zone.x + zone.right / 2, zone.y);
    shapes.push(mouth_line);

    return shapes;
}});