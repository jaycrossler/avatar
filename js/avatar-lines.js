//-----------------------------------------
//Avatar.js (lines and circle styles)
//This set of functions adds rendering capabilities to avatar.js, specifically to draw things like human faces
//-----------------------------------------

//=====Line Styles==========
//face
new Avatar('add_render_function', {style: 'lines', feature: 'face', renderer: function (face_zones, avatar) {
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
    var fill_steps = [0, .25, .5, .75, 1];

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

//shoulders
new Avatar('add_render_function', {style: 'lines', feature: 'shoulders', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

//TODO: Adjust by strength, align with bottom of neck
    var shoulder_shape_line = [
        {x: -4, y: -10},
        {x: -5, y: -9},
        {x: -10, y: 0},
        {x: -10, y: 0},

        {x: 10, y: 0},
        {x: 10, y: 0},
        {x: 5, y: -9},
        {x: 4, y: -10}
    ];

    var scale_y = f.thick_unit * 60;
    var scale_x = f.thick_unit * 200;
    var x = f.neck.x;
    var y = f.neck.y + (f.thick_unit * 275);

    var skin_lighter = net.brehaut.Color(face_options.skin_colors.skin).toString();
    var skin_bright = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.05).toString();
    var cheek_darker = net.brehaut.Color(face_options.skin_colors.cheek).darkenByRatio(0.05).toString();
    var fill_colors = [skin_bright, skin_lighter, cheek_darker, skin_lighter, skin_bright];
    var fill_steps = [0, .25, .5, .75, 1];

    var shoulder_shape = a.createPathFromLocalCoordinates(shoulder_shape_line, {
        fill_method: 'linear', fill_colors: fill_colors, fill_steps: fill_steps,
        line_color: face_options.skin_colors.highlights, radius: (f.thick_unit * 300),
        close_line: true, x: x, y: y
    }, scale_x, scale_y);
    lines.push({name: 'shoulder', line: shoulder_shape_line, shape: shoulder_shape, scale_x: scale_x, scale_y: scale_y, x: x, y: y});
    shapes = shapes.concat(shoulder_shape);


    return shapes;
}});


//neck
new Avatar('add_render_function', {style: 'lines', feature: 'neck', renderer: function (face_zones, avatar) {
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

    var neck_line, neck;
    if (face_options.neck_size == 'Concave') {
        neck_line = a.transformShapeLine({type: 'neck', radius: 5, curvature: neck_curvature}, face_options);
        neck = a.createPathFromLocalCoordinates(neck_line, {close_line: true, line_color: face_options.skin_colors.cheek, fill_color: neck_color}, scale_x, scale_y);
        neck.x = zone.x;
        neck.y = zone.y + (f.thick_unit * 175);
        lines.push({name: 'neck', line: neck_line, shape: neck, scale_x: scale_x, scale_y: scale_y, x: zone.x, y: zone.y});
        shapes.push(neck);

    } else if (face_options.neck_size == 'Thick') {

        var neck_shape_line = [
            {x: -10, y: -10},
            {x: -10, y: -9},
            {x: -9, y: 0},
            {x: -8, y: 9},
            {x: -8, y: 10},

            {x: 8, y: 10},
            {x: 8, y: 9},
            {x: 9, y: 0},
            {x: 10, y: -9},
            {x: 10, y: -10}
        ];

//        scale_x = (zone.right - zone.left) / 2.3;
        scale_y = (zone.bottom - zone.top) / 2.3;
        scale_x = (f.face.right - f.face.left) / 3.4;
        var x = zone.x;
        var y = zone.y + (f.thick_unit * 175);

        if (face_options.gender == 'Female') {
            scale_x *= .9;
        }
        if (face_options.face_shape == 'Inverted Triangle') {
            scale_x *= .9;
        }

        var skin_lighter = net.brehaut.Color(face_options.skin_colors.skin).toString();
        var skin_bright = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.05).toString();
        var cheek_darker = net.brehaut.Color(face_options.skin_colors.cheek).darkenByRatio(0.05).toString();
        var fill_colors = [cheek_darker, skin_lighter, skin_bright, skin_lighter, cheek_darker];
        var fill_steps = [0, .25, .5, .75, 1];


        var neck_shape = a.createPathFromLocalCoordinates(neck_shape_line, {
            fill_method: 'linear', fill_colors: fill_colors, fill_steps: fill_steps,
            line_color: face_options.skin_colors.cheek, radius: (f.thick_unit * 100),
            close_line: true, x: x, y: y
        }, scale_x, scale_y);
        lines.push({name: 'neck', line: neck_shape_line, shape: neck_shape, scale_x: scale_x, scale_y: scale_y, x: x, y: y});
        shapes = shapes.concat(neck_shape);


    }

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

//ears
new Avatar('add_render_function', {style: 'lines', feature: 'ears', renderer: function (face_zones, avatar) {
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

//eye_positioner
new Avatar('add_render_function', {style: 'lines', feature: 'eye_position', renderer: function (face_zones, avatar) {
    //This doesn't draw anything, just pre-generates the positions that othes will use to guide off of
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;

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

    var eye_squint = 1.4;
    var width_eye = (f.eyes.right - f.eyes.left);
    var height_eye = (f.eyes.bottom - f.eyes.top) * eye_squint;

    var zone = f.eyes;
    var eye_radius = 4.2;
    var x = zone.left_x;
    var y = zone.y;
    var left_eye_line = [];
    if (face_options.eye_shape == 'Almond') {
        left_eye_line = a.transformShapeLine([
            {type: 'almond-horizontal', modifier: 'left', radius: eye_radius},
            {type: 'pinch', pinch_amount: 0.6, starting_step: -3, ending_step: 4},
            {type: 'pinch', pinch_amount: 0.9, starting_step: -3, ending_step: 9}
        ], face_options);
    }

    var left_eye = a.createPathFromLocalCoordinates(left_eye_line, {close_line: true}, width_eye, height_eye);
    left_eye.x = x;
    left_eye.y = y;
    left_eye.rotation = rotation_amount;
    lines.push({name: 'left eye', line: left_eye_line, shape: left_eye, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount});


    zone = f.eyes;
    x = zone.right_x;
    y = zone.y;
    var right_eye_line = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_eye_line);
    var right_eye = a.createPathFromLocalCoordinates(right_eye_line, {close_line: true}, width_eye, height_eye);

    right_eye.x = x;
    right_eye.y = y;
    right_eye.rotation = -rotation_amount;
    lines.push({name: 'right eye', line: right_eye_line, shape: right_eye, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount});

    var inner_point_x = a.comparePoints(right_eye_line, 'x', 'lowest');
    var inner_point_y = a.comparePoints(right_eye_line, 'y', 'middle');
    inner_point_x = x + (inner_point_x * width_eye / 2 / eye_radius);
    inner_point_y = y + (inner_point_y * height_eye / 2 / eye_radius);
    a.namePoint(avatar, 'right eye innermost', {x: inner_point_x, y: inner_point_y});

}});

//eyes
new Avatar('add_render_function', {style: 'lines', feature: 'eyes', renderer: function (face_zones, avatar) {
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
    var eyebrow_thick_stop = 2 * f.thick_unit;
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
    var eye_radius = 4.2;
    var x = zone.left_x;
    var y = zone.y;
    var left_eye_line = [];
    if (face_options.eye_shape == 'Almond') {
        left_eye_line = a.transformShapeLine([
            {type: 'almond-horizontal', modifier: 'left', radius: eye_radius},
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

    var inner_point_x = a.comparePoints(left_eye_line, 'x', 'highest');
    var inner_point_y = a.comparePoints(left_eye_line, 'y', 'middle');
    inner_point_x = x + (inner_point_x * width_eye / 2 / eye_radius);
    inner_point_y = y + (inner_point_y * height_eye / 2 / eye_radius);
    a.namePoint(avatar, 'left eye innermost', {x: inner_point_x, y: inner_point_y});


    x = zone.left_x;
    y = zone.y - (f.thick_unit * 4);
    var left_eye_line_top = [];
    if (face_options.eye_shape == 'Almond') {
        left_eye_line_top = a.transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: eye_radius, starting_step: 11, ending_step: 19}, face_options);
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
                {type: 'almond-horizontal', modifier: 'left', radius: eye_radius, starting_step: 0, ending_step: 9},
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
            {x: 4, y: -4},
            {x: -2, y: -2},
            {x: -10, y: -3}
        ];
    } else if (face_options.eyebrow_shape == "Arch") {
        left_eyebrow_line_top = [
            {x: 11, y: 0},
            {x: 4, y: -3, thickness: 8 * f.thick_unit},
            {x: -2, y: -5, thickness: 8 * f.thick_unit},
            {x: -10, y: 2}
        ];
    }

    x = zone.left_x;
    y = zone.y - (f.thick_unit * 1.5 * eyebrow_height);
    var width_eyebrow = width_eye / 2.5;
    var height_eyebrow = height_eye / 4;

    var eyebrow_fade_color = net.brehaut.Color(face_options.hair_color).desaturateByRatio(.1);
    eyebrow_fade_color.alpha = .5;
    eyebrow_fade_color = eyebrow_fade_color.toString();

    var left_eyebrow_top = a.createMultiPathFromLocalCoordinates(left_eyebrow_line_top, {
        break_line_every:5,
        line_color_gradients: [face_options.hair_color, eyebrow_fade_color],
        thickness_gradients: [eyebrow_thick_start, eyebrow_thick_stop],
        x: x, y: y, rotation: rotation_amount + eyebrow_rotation
    }, width_eyebrow, height_eyebrow);
    lines.push({name: 'left eyebrow top set', line: left_eyebrow_line_top, shape: left_eyebrow_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: rotation_amount + eyebrow_rotation, alpha: eyebrow_transparency});
    shapes = shapes.concat(left_eyebrow_top);

    inner_point_x = a.comparePoints(left_eyebrow_line_top, 'x', 'lowest');
    inner_point_y = a.comparePoints(left_eyebrow_line_top, 'y', 'middle');
    inner_point_x = x + (inner_point_x * width_eyebrow / 2 / eye_radius);
    inner_point_y = y + (inner_point_y * height_eyebrow / 2 / eye_radius);
    a.namePoint(avatar, 'left eyebrow innermost', {x: inner_point_x, y: inner_point_y});


    x = zone.left_x + (f.thick_unit * 4);
    y = zone.y - (f.thick_unit * 8);
    var left_eyebrow_line_inside = a.transformShapeLine({type: 'almond-horizontal', modifier: 'left', radius: eye_radius, starting_step: 14, ending_step: 19}, face_options);
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
    var right_eyebrow_top = a.createMultiPathFromLocalCoordinates(right_eyebrow_line_top, {
        break_line_every:5,
        line_color_gradients: [face_options.hair_color, eyebrow_fade_color],
        thickness_gradients: [eyebrow_thick_start, eyebrow_thick_stop],
        x: x, y: y, rotation: -rotation_amount - eyebrow_rotation, alpha: eyebrow_transparency
    }, width_eyebrow, height_eyebrow);
    lines.push({name: 'right eyebrow top set', line: right_eyebrow_line_top, shape: right_eyebrow_top, scale_x: width_eye, scale_y: height_eye, x: x, y: y, rotation: -rotation_amount - eyebrow_rotation, alpha: eyebrow_transparency});
    shapes = shapes.concat(right_eyebrow_top);



    inner_point_x = a.comparePoints(right_eyebrow_line_top, 'x', 'lowest');
    inner_point_y = a.comparePoints(right_eyebrow_line_top, 'y', 'middle');
    inner_point_x = x + (inner_point_x * width_eyebrow / 2 / eye_radius);
    inner_point_y = y + (inner_point_y * height_eyebrow / 2 / eye_radius);
    a.namePoint(avatar, 'right eyebrow innermost', {x: inner_point_x, y: inner_point_y});

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

//nose
new Avatar('add_render_function', {style: 'lines', feature: 'nose', renderer: function (face_zones, avatar) {
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
        width *= 0.8;
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

    var nose_length = 5;
    var thickness = f.thick_unit;
    if (face_options.nose_size == 'Small') {
        nose_length = 4;
    } else if (face_options.nose_size == 'Tiny') {
        nose_length = 3;
    } else if (face_options.nose_size == 'Large') {
        nose_length = 6;
        width *= 1.1;
        height *= 1.1;
        thickness *= 1.1;
    } else if (face_options.nose_size == 'Big') {
        nose_length = 7;
        width *= 1.15;
        height *= 1.3;
        thickness *= 1.4;
        nose_side_offset++;
    } else if (face_options.nose_size == 'Giant') {
        nose_length = 8;
        width *= 1.2;
        height *= 1.4;
        thickness *= 1.5;
        nose_side_offset += 2;
    } else if (face_options.nose_size == 'Huge') {
        nose_length = 9;
        width *= 1.3;
        height *= 1.6;
        thickness *= 2;
        nose_side_offset += 3;
    }

    //Nose bottom line
    var nose_line = [
        {x: 5, y: 5},
        {x: 10, y: 5},
        {x: 8, y: 2},
        {x: 5, y: 5},
        {x: 0, y: 8},
        {x: -5, y: 5},
        {x: -8, y: 2},
        {x: -10, y: 5},
        {x: -5, y: 5},
        {x: 0, y: 8}

    ];
    var nose_bottom_squiggle = a.createPathFromLocalCoordinates(nose_line, {
        close_line: true, thickness: 1.2 * thickness,
        color: face_options.skin_colors.deepshadow, fill_color: face_options.skin_colors.deepshadow
    }, width, height);
    nose_bottom_squiggle.x = zone.x;
    nose_bottom_squiggle.y = zone.y;
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

    //Find the left eye point, convert it into the nose coordinate scheme, add it to the nose line
    var right_eye_in_point = a.findPoint(avatar, 'right eye innermost');
    right_eye_in_point = a.transformPathFromGlobalCoordinates(right_eye_in_point, width, height, zone.x, zone.y);
    nose_line_side = nose_line_side.concat(right_eye_in_point);

    //Start building the two nose shapes (lines as well as fill)
    for (var i = 0; i < nose_line_side.length; i++) { //Only draw as many points as nose_size
        if (i < nose_length) {
            nose_line_r.push({x: nose_side_offset + nose_line_side[i].x, y: nose_line_side[i].y});
            nose_line_l.push({x: -nose_side_offset + (-1 * nose_line_side[i].x), y: nose_line_side[i].y});
        }
        nose_line_r_full.push({x: nose_side_offset + nose_line_side[i].x, y: nose_line_side[i].y});
        nose_line_l_full.push({x: -nose_side_offset + (-1 * nose_line_side[i].x), y: nose_line_side[i].y});
    }

    var nose_full_line = nose_line_l_full.concat(nose_line_r_full.reverse());
    var full_nose_line = a.transformShapeLine({type: 'smooth'}, face_options, nose_full_line);
    var alpha = 1;

    var nose_top_color = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.05).toString();
    var face_bright_color = net.brehaut.Color(face_options.skin_colors.skin).lightenByRatio(0.1).toString();
    var nose_fill_colors = [face_options.skin_colors.highlights, maths.hexColorToRGBA(nose_top_color, .9), maths.hexColorToRGBA(face_bright_color, 0.7)];
    var nose_fill_steps = [0, .7, 1];

    var full_nose = a.createPathFromLocalCoordinates(full_nose_line, {
        close_line: true, thickness: f.thick_unit * .2, line_color: 'rgba(0,0,0,0)',
        fill_colors: nose_fill_colors, fill_method: 'radial',
        fill_steps: nose_fill_steps, y_offset: (5 * f.thick_unit), radius: (80 * f.thick_unit)
    }, width, height);
    full_nose.x = zone.x;
    full_nose.y = zone.y;
    full_nose.alpha = alpha;
    lines.push({name: 'full nose', line: full_nose_line, shape: full_nose, x: zone.x, y: zone.y, scale_x: width, scale_y: height, alpha: alpha});
    shapes = shapes.concat(full_nose);

    shapes.push(nose_bottom_squiggle);

    var l_r = a.createPathFromLocalCoordinates(nose_line_r, {thickness: thickness, color: face_options.skin_colors.cheek}, width, height);
    l_r.x = zone.x;
    l_r.y = zone.y;
    lines.push({name: 'nose right line', line: nose_line_r, shape: l_r, x: zone.x, y: zone.y, scale_x: width, scale_y: height});
    shapes.push(l_r);

    var l_l = a.createPathFromLocalCoordinates(nose_line_l, {thickness: thickness, color: face_options.skin_colors.cheek}, width, height);
    l_l.x = zone.x;
    l_l.y = zone.y;
    lines.push({name: 'nose left line', line: nose_line_l, shape: l_l, x: zone.x, y: zone.y, scale_x: width, scale_y: height});
    shapes.push(l_l);


    //TODO: These should connect to nose
    var mouth_high_left_line = [
        {x: -3.5, y: -4},
        {x: -4, y: -2},
        {x: -3.7, y: 0},
        {x: -3.5, y: 2}
    ];
    var l5 = a.createPathFromLocalCoordinates(mouth_high_left_line, {close_line: false, thickness: 0, color: face_options.skin_colors.deepshadow, fill_color: 'pink'}, width, height);
    l5.x = f.mouth.x;
    l5.y = f.mouth.y - (f.thick_unit * 24);
    l5.alpha = 0.5;
    lines.push({name: 'above lip left line', line: mouth_high_left_line, shape: l5, x: f.mouth.x, y: f.mouth.y - (f.thick_unit * 24), scale_x: width, scale_y: height});
    shapes.push(l5);

    var mouth_high_right_line = a.transformShapeLine({type:'reverse'}, face_options, mouth_high_left_line);
    var l6 = a.createPathFromLocalCoordinates(mouth_high_right_line, {close_line: false, thickness: 0, color: face_options.skin_colors.deepshadow, fill_color: 'pink'}, width, height);
    l6.x = f.mouth.x;
    l6.y = f.mouth.y - (f.thick_unit * 24);
    l6.alpha = 0.5;
    lines.push({name: 'above lip right line', line: mouth_high_right_line, shape: l6, x: f.mouth.x, y: f.mouth.y - (f.thick_unit * 24), scale_x: width, scale_y: height});
    shapes.push(l6);


    return shapes;
}});

//wrinkles
new Avatar('add_render_function', {style: 'lines', feature: 'wrinkles', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var wrinkle_resistance = a.turnWordToNumber(face_options.wrinkle_resistance, 50, -100);
    var wrinkle_age = face_options.age + wrinkle_resistance;

    var wrinkle_lines = parseInt(wrinkle_age / 15);
    var head_line = a.transformLineToGlobalCoordinates(lines, 'face');
    var left_eye_line = a.transformLineToGlobalCoordinates(lines, 'left eye');

    head_line = a.hydratePointsAlongLine(head_line, f.thick_unit * 30);

    var hair_line = a.lineSegmentCompared(head_line, left_eye_line, 'above');

    if (hair_line && hair_line.length) {
//        var hair_dot_array = a.createPath(hair_line, {close_line: true, thickness: f.thick_unit * 5, line_color: face_options.hair_color});
//        lines.push({name: 'hair dot line', line: hair_line, shape: hair_dot_array, x: 0, y: 0, scale_x: 1, scale_y: 1});
//            shapes = shapes.concat(hair_dot_array);

        var mid_x = a.comparePoints(hair_line, 'x', 'middle');
        var mid_y = a.comparePoints(hair_line, 'y', 'middle') + (f.thick_unit * 30);
        var base_width = (f.thick_unit * 220);
        var height = (f.thick_unit * 100);

        var forehead_wrinkle_line = [
            {x: -4, y: 0},
            {x: -3, y: -.5},
            {x: -1, y: 0},
            {x: -.5, y: -.5},
            {x: 0, y: -.5},
            {x:.5, y: -.5},
            {x: 1, y: 0},
            {x: 3, y: -.5},
            {x: 4, y: 0}
        ];

        var x, y, width;
        var alpha = .2;

        if (face_options.gender == 'female') {
            alpha /= 3;
        }

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
    x = mid_x - (f.thick_unit * 10);
    y = mid_y - (f.thick_unit * 25);

    var mid_nose_divot_line = [
        {x: -1, y: -3},
        {x: 0, y: -1.5},
        {x: -.5, y: 3}
    ];

    height /= 1.2;
    var divot_line = a.createPathFromLocalCoordinates(mid_nose_divot_line, {close_line: false, thickness: (f.thick_unit * 2), color: face_options.skin_colors.deepshadow}, width, height);
    alpha = (wrinkle_age / 350);
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
    height *= (wrinkle_age / 50);
    var divot_line_3 = a.createPathFromLocalCoordinates(nose_divot_line, {close_line: false, thickness: (f.thick_unit), color: face_options.skin_colors.deepshadow}, width, height);
    x = mid_x;
    y = mid_y - (f.thick_unit * 35);
    alpha = (wrinkle_age / 400);
    divot_line_3.x = x;
    divot_line_3.y = y;
    divot_line_3.alpha = alpha;
    lines.push({name: 'mid nose divot line', line: nose_divot_line, shape: divot_line_3, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
    shapes.push(divot_line_3);

    var mouth_line = a.transformLineToGlobalCoordinates(lines, 'lips');
    var mouth_left_point = a.comparePoints(mouth_line, 'x', 'lowest', true);
    var mouth_right_point = a.comparePoints(mouth_line, 'x', 'highest', true);

    var mouth_side_lines_height_up = 6;
    if (face_options.mouth_upturn == "Large") {
        mouth_side_lines_height_up = 6;
    } else if (face_options.mouth_upturn == "Short") {
        mouth_side_lines_height_up = 4;
    } else if (face_options.mouth_upturn == "Small") {
        mouth_side_lines_height_up = 2;
    } else if (face_options.mouth_upturn == "Tiny") {
        mouth_side_lines_height_up = 0;
    }
    var mouth_side_lines_height_down = 6;
    if (face_options.mouth_upturn == "Large") {
        mouth_side_lines_height_down = 6;
    } else if (face_options.mouth_upturn == "Short") {
        mouth_side_lines_height_down = 4;
    } else if (face_options.mouth_upturn == "Small") {
        mouth_side_lines_height_down = 2;
    } else if (face_options.mouth_upturn == "Tiny") {
        mouth_side_lines_height_down = 0;
    }


    var mouth_side_lines_width = 1;
    if (mouth_side_lines_height_up + mouth_side_lines_height_down > 0) {
        //TODO: Convert to path
        var left_mouth_wrinkle = [];
        left_mouth_wrinkle.push({x: mouth_left_point.x - (f.thick_unit * mouth_side_lines_width), y: mouth_left_point.y - (f.thick_unit * mouth_side_lines_height_up)});
        left_mouth_wrinkle.push({x: mouth_left_point.x - (f.thick_unit * mouth_side_lines_width), y: mouth_left_point.y - (f.thick_unit * mouth_side_lines_height_up * .5)});
        left_mouth_wrinkle.push({x: mouth_left_point.x + (f.thick_unit), y: mouth_left_point.y});
        left_mouth_wrinkle.push({x: mouth_left_point.x - (f.thick_unit * mouth_side_lines_width), y: mouth_left_point.y + (f.thick_unit * mouth_side_lines_height_down * .5)});
        left_mouth_wrinkle.push({x: mouth_left_point.x - (f.thick_unit * mouth_side_lines_width), y: mouth_left_point.y + (f.thick_unit * mouth_side_lines_height_down)});

        var left_mouth_curve1 = a.createPath(left_mouth_wrinkle, {
            thickness: 2 * f.thick_unit, line_color: face_options.skin_colors.darkflesh
        });
        shapes.push(left_mouth_curve1);

        var right_mouth_wrinkle = [];
        right_mouth_wrinkle.push({x: mouth_right_point.x + (f.thick_unit * mouth_side_lines_width), y: mouth_right_point.y - (f.thick_unit * mouth_side_lines_height_up)});
        right_mouth_wrinkle.push({x: mouth_right_point.x + (f.thick_unit * mouth_side_lines_width), y: mouth_right_point.y - (f.thick_unit * mouth_side_lines_height_up * .5)});
        right_mouth_wrinkle.push({x: mouth_right_point.x - (f.thick_unit), y: mouth_right_point.y});
        right_mouth_wrinkle.push({x: mouth_right_point.x + (f.thick_unit * mouth_side_lines_width), y: mouth_right_point.y + (f.thick_unit * mouth_side_lines_height_down * .5)});
        right_mouth_wrinkle.push({x: mouth_right_point.x + (f.thick_unit * mouth_side_lines_width), y: mouth_right_point.y + (f.thick_unit * mouth_side_lines_height_down)});

        var right_mouth_curve1 = a.createPath(right_mouth_wrinkle, {
            thickness: 2 * f.thick_unit, line_color: face_options.skin_colors.darkflesh
        });
        shapes.push(right_mouth_curve1);


    }

    //Lines to nose-mouth wrinkles uses wrinkle_mouth_width/height
    var chin_top_line = a.transformLineToGlobalCoordinates(lines, 'chin top line');
    var left_chin_line_point = a.comparePoints(chin_top_line, 'x', 'lowest', true);
    var right_chin_line_point = a.comparePoints(chin_top_line, 'x', 'highest', true);
    var nose_full_line = a.transformLineToGlobalCoordinates(lines, 'full nose');
    if (wrinkle_age > 16) {
        var mouth_line_curve_alpha = (wrinkle_age - 15) / 150;
        if (face_options.gender == 'Female') {
            mouth_line_curve_alpha /= 3;
        }

        //Left chin mouth line
        var left_nose_round_top_point = nose_full_line[2];

        var left_nose_mouth_wrinkle = [];

        left_nose_round_top_point.x -= (f.thick_unit * .5);
        left_nose_round_top_point.y -= (f.thick_unit * 5);
        left_nose_mouth_wrinkle.push(_.clone(left_nose_round_top_point));

        left_nose_round_top_point.x -= (f.thick_unit * 8);
        left_nose_round_top_point.y -= (f.thick_unit * 5);
        left_nose_mouth_wrinkle.push(_.clone(left_nose_round_top_point));

        mouth_left_point.x -= (f.thick_unit * 25);
        mouth_left_point.y += (f.thick_unit * 8);
        if (face_options.wrinkle_mouth_width == "Far Out") {
            mouth_left_point.x -= (f.thick_unit * 8)
        } else if (face_options.wrinkle_mouth_width == "Out") {
            mouth_left_point.x -= (f.thick_unit * 3)
        } else if (face_options.wrinkle_mouth_width == "In") {
            mouth_left_point.x += (f.thick_unit * 3)
        } else if (face_options.wrinkle_mouth_width == "Far In") {
            mouth_left_point.x += (f.thick_unit * 8)
        }

        var mid_point;
        mid_point = (mouth_left_point.y + left_nose_round_top_point.y) /2 - (f.thick_unit*5);
        left_nose_mouth_wrinkle.push({x: mouth_left_point.x-(f.thick_unit), y:mid_point});

        mid_point = (mouth_left_point.y + left_nose_round_top_point.y) /2;
        left_nose_mouth_wrinkle.push({x: mouth_left_point.x, y:mid_point});


        if (face_options.wrinkle_mouth_height == "Far Up") {
            mouth_left_point.y -= (f.thick_unit * 10)
        } else if (face_options.wrinkle_mouth_height == "Up") {
            mouth_left_point.y -= (f.thick_unit * 5)
        } else if (face_options.wrinkle_mouth_height == "Down") {
            mouth_left_point.y += (f.thick_unit * 5)
        } else if (face_options.wrinkle_mouth_height == "Far Down") {
            mouth_left_point.y += (f.thick_unit * 10)
        }
        left_nose_mouth_wrinkle.push(mouth_left_point);

        left_chin_line_point.x -= (f.thick_unit * 4);
        left_nose_mouth_wrinkle.push(left_chin_line_point);


        //Right chin mouth line
        var right_nose_round_top_point = nose_full_line[nose_full_line.length - 3];

        var right_nose_mouth_wrinkle = [];

        right_nose_round_top_point.x += (f.thick_unit * .5);
        right_nose_round_top_point.y -= (f.thick_unit * 5);
        right_nose_mouth_wrinkle.push(_.clone(right_nose_round_top_point));

        right_nose_round_top_point.x += (f.thick_unit * 8);
        right_nose_round_top_point.y -= (f.thick_unit * 5);
        right_nose_mouth_wrinkle.push(_.clone(right_nose_round_top_point));

        mouth_right_point.x += (f.thick_unit * 25);
        mouth_right_point.y += (f.thick_unit * 8);
        if (face_options.wrinkle_mouth_width == "Far Out") {
            mouth_right_point.x += (f.thick_unit * 8)
        } else if (face_options.wrinkle_mouth_width == "Out") {
            mouth_right_point.x += (f.thick_unit * 3)
        } else if (face_options.wrinkle_mouth_width == "In") {
            mouth_right_point.x -= (f.thick_unit * 3)
        } else if (face_options.wrinkle_mouth_width == "Far In") {
            mouth_right_point.x -= (f.thick_unit * 8)
        }

        mid_point = (mouth_right_point.y + right_nose_round_top_point.y) /2 - (f.thick_unit*5);
        right_nose_mouth_wrinkle.push({x: mouth_right_point.x+(f.thick_unit), y:mid_point});

        mid_point = (mouth_right_point.y + right_nose_round_top_point.y) /2;
        right_nose_mouth_wrinkle.push({x: mouth_right_point.x, y:mid_point});

        if (face_options.wrinkle_mouth_height == "Far Up") {
            mouth_right_point.y -= (f.thick_unit * 10)
        } else if (face_options.wrinkle_mouth_height == "Up") {
            mouth_right_point.y -= (f.thick_unit * 5)
        } else if (face_options.wrinkle_mouth_height == "Down") {
            mouth_right_point.y += (f.thick_unit * 5)
        } else if (face_options.wrinkle_mouth_height == "Far Down") {
            mouth_right_point.y += (f.thick_unit * 10)
        }
        right_nose_mouth_wrinkle.push(mouth_right_point);

        right_chin_line_point.x += (f.thick_unit * 4);
        right_nose_mouth_wrinkle.push(right_chin_line_point);

        // Add 3 lines of different thickness to each side
        //                  -thick---   -alpha-  -movex-
        var alpha_widths = [16, 8, 10, 5, 4,.5, 10, 2, 1];

        var curve_thick1 = alpha_widths[0] * f.thick_unit;
        var curve_thick3 = alpha_widths[2] * f.thick_unit;

        if (face_options.gender == 'female') {
            curve_thick1 /= 4;
            curve_thick3 /= 4;
        }

        var curve_thicknessess = [1,.5,.2,.1,0,.05,0];

        if (face_options.wrinkle_pattern_mouth == "None") {
            curve_thicknessess = [0];
        } else if (face_options.wrinkle_pattern_mouth == "Gentle") {
            curve_thicknessess = [.4,.3,.2,.1,.1,.05,.1];
        } else if (face_options.wrinkle_pattern_mouth == "Straight") {
            curve_thicknessess = [1, .7, .6, .4, .5, .4, .3];
        } else if (face_options.wrinkle_pattern_mouth == "Middle") {
            curve_thicknessess = [.3,.2,.7,.7,.6,.1,0];
        } else if (face_options.wrinkle_pattern_mouth == "Bottom") {
            curve_thicknessess = [.3,.1,0,.3,.3,.7,.6];
        } else if (face_options.wrinkle_pattern_mouth == "Heavy") {
            curve_thicknessess = [1,.9,.8,.9,.7,.8,.4];
        }
        for (var piece=0;piece<curve_thicknessess.length;piece++){
            curve_thicknessess[piece] *= (wrinkle_age/200);
        }

        var curve_thicknessess1 = _.map(curve_thicknessess, function(b){
            return maths.clamp(b*curve_thick1,0,8)});
        var curve_thicknessess3 = _.map(curve_thicknessess, function(b){
            return maths.clamp(b*curve_thick3,0,5)});

        var curve_settings1 = {
            break_line_every: 5,
            thickness_gradients: curve_thicknessess1,
            alpha: maths.clamp(mouth_line_curve_alpha / alpha_widths[3],0,.6),
            line_color: face_options.skin_colors.darkflesh
        };
        var curve_settings3 = {
            break_line_every: 20,
            thickness_gradients: curve_thicknessess3,
            alpha: maths.clamp(mouth_line_curve_alpha / alpha_widths[5],0,.5),
            line_color: face_options.skin_colors.cheek
        };

        var left_nose_curve1 = a.createMultiPath(left_nose_mouth_wrinkle, curve_settings1);
        left_nose_curve1.x = -(alpha_widths[6] * f.thick_unit);
        var left_nose_curve3 = a.createMultiPath(left_nose_mouth_wrinkle, curve_settings3);
        left_nose_curve3.x = -(alpha_widths[8] * f.thick_unit);

        var right_nose_curve1 = a.createMultiPath(right_nose_mouth_wrinkle, curve_settings1);
        right_nose_curve1.x = (alpha_widths[6] * f.thick_unit);
        var right_nose_curve3 = a.createMultiPath(right_nose_mouth_wrinkle, curve_settings3);
        right_nose_curve3.x = (alpha_widths[8] * f.thick_unit);

        shapes.push(left_nose_curve1);
        shapes.push(left_nose_curve3);
        shapes.push(right_nose_curve1);
        shapes.push(right_nose_curve3);
    }


    // Cheekbones
    var chin_bottom_line = a.transformLineToGlobalCoordinates(lines, 'chin bottom line');
    var right_cheekbone_wrinkle = [];
    var right_cheekbone_wrinkle_curve1;
    var chin_bottom_line_right = _.clone(a.comparePoints(chin_bottom_line, 'x', 'highest', true));
    var left_cheekbone_wrinkle = [];
    var left_cheekbone_wrinkle_curve1;
    var axis;
    var eye_right_right = a.comparePoints(right_eye_line, 'x', 'highest');
    var eye_left_left = a.comparePoints(left_eye_line, 'x', 'lowest');



    //Cheek color ovals
    var right_cheek_oval = a.transformShapeLine({type: 'oval',radius: 60 * f.thick_unit});
    var skin_lighter = maths.hexColorToRGBA(face_options.skin_colors.skin,.1);
    var cheek_darker = maths.hexColorToRGBA(face_options.skin_colors.skin,.7);

    var fill_colors = [cheek_darker, skin_lighter];
    var fill_steps = [.5, 1];

    var nose_bottom_y = a.comparePoints(nose_full_line, 'y', 'highest');
    var cheek_y = (nose_bottom_y + mid_y) / 2;

    var right_cheek = a.createPath(right_cheek_oval, {
        close_line: true, thickness: f.thick_unit,
        line_color: 'rgba(0,0,0,0)',
//        fill_color: cheek_darker
        fill_colors: fill_colors, fill_method: 'radial',
        fill_steps: fill_steps, radius: (f.thick_unit * 35)  //TODO: Make sure it doesn't go over face
    });
    right_cheek.x = eye_right_right - (f.thick_unit * 5);
    right_cheek.y = cheek_y;
    right_cheek.scaleX = 1.3;
    right_cheek.scaleY = .8;
    shapes.push(right_cheek);


    var left_cheek = a.createPath(right_cheek_oval, {
        close_line: true, thickness: f.thick_unit,
        line_color: 'rgba(0,0,0,0)',
//        fill_color: cheek_darker
        fill_colors: fill_colors, fill_method: 'radial',
        fill_steps: fill_steps, radius: (f.thick_unit * 35)
    });
    left_cheek.x = eye_left_left + (f.thick_unit * 5);
    left_cheek.y = cheek_y;
    left_cheek.scaleX = 1.3;
    left_cheek.scaleY = .8;
    shapes.push(left_cheek);


    //Cheek lines
    mid_y = right_eye_line[0].y;
    var cheekbone_lines = [];

    if (face_options.gender == 'Male') {
        cheekbone_lines.push("140-180");
    }
    if (face_options.gender == 'Female') {
//        cheekbone_lines.push("L");
    }

    if (_.indexOf(cheekbone_lines, 'J') > -1) {

        mid_x = a.comparePoints(head_line, 'x', 'highest');
        right_cheekbone_wrinkle.push({x:mid_x, y:mid_y});

        x = mid_x - (f.thick_unit * 30);
        y = mid_y + (f.thick_unit * 25);

        right_cheekbone_wrinkle.push({x:x, y:y});
        right_cheekbone_wrinkle.push({x:x, y:y}); //TODO: Play with these

        right_cheekbone_wrinkle.push({x:eye_right_right, y:mouth_right_point.y});

        var chin_point = _.clone(chin_bottom_line_right);
        chin_point.y += 20 * f.thick_unit;
        var newPoint = a.comparePoints(head_line, 'closest', chin_point);
        right_cheekbone_wrinkle.push(newPoint);

        right_cheekbone_wrinkle_curve1 = a.createPath(right_cheekbone_wrinkle, {
            break_line_every: 20,
            thickness_gradients: [16 * f.thick_unit, 3.5 * f.thick_unit, 0],
            line_color: face_options.skin_colors.darkflesh,
            alpha:.25
        });
        shapes.push(right_cheekbone_wrinkle_curve1);


        axis = a.comparePoints(chin_bottom_line, 'x', 'middle');
        left_cheekbone_wrinkle = a.transformShapeLine({type:'reverse',axis:axis}, face_options, right_cheekbone_wrinkle);
        left_cheekbone_wrinkle_curve1 = a.createPath(left_cheekbone_wrinkle, {
            break_line_every: 20,
            thickness_gradients: [16 * f.thick_unit, 3.5 * f.thick_unit, 0],
            line_color: face_options.skin_colors.darkflesh,
            alpha:.25
        });
        shapes.push(left_cheekbone_wrinkle_curve1);

    }


//TODO: Have a "half-to" or "fifth-to" function
    var cheek_line_options = {
        break_line_every: 20, dot_array: false,
        thickness_gradients: [12 * f.thick_unit, 3.5 * f.thick_unit, 0],
        line_color: face_options.skin_colors.darkflesh,
        alpha:wrinkle_age/200
    };

    if (_.indexOf(cheekbone_lines, '140-180') > -1) {

        mid_x = a.comparePoints(head_line, 'x', 'highest');

        right_cheekbone_wrinkle.push({x:mid_x-(5*f.thick_unit), y:mid_y+(3* f.thick_unit)});
        right_cheekbone_wrinkle.push({x:mid_x-(10*f.thick_unit), y:mid_y-(1* f.thick_unit)});

        right_nose_round_top_point = nose_full_line[nose_full_line.length - 3];

        right_cheekbone_wrinkle.push({x:eye_right_right, y:right_nose_round_top_point.y});
        right_cheekbone_wrinkle.push({x:eye_right_right-(10*f.thick_unit), y:right_nose_round_top_point.y+(6*f.thick_unit) });

        //Curves 1
        right_cheekbone_wrinkle_curve1 = a.createPath(right_cheekbone_wrinkle, cheek_line_options);
        shapes.push(right_cheekbone_wrinkle_curve1);
        axis = a.comparePoints(chin_bottom_line, 'x', 'middle');
        left_cheekbone_wrinkle = a.transformShapeLine({type:'reverse',axis:axis}, face_options, right_cheekbone_wrinkle);
        left_cheekbone_wrinkle_curve1 = a.createPath(left_cheekbone_wrinkle, cheek_line_options);
        shapes.push(left_cheekbone_wrinkle_curve1);



        var right_cheekbone_wrinkle2 = [];
        right_cheekbone_wrinkle2.push({x:eye_right_right, y:right_nose_round_top_point.y});

        right_cheekbone_wrinkle2.push({x:eye_right_right, y:right_nose_round_top_point.y});

        right_cheekbone_wrinkle2.push({x:eye_right_right-(1 *f.thick_unit), y:mouth_right_point.y});


        var chin_point = _.clone(chin_bottom_line_right);
        chin_point.y += 20 * f.thick_unit;
        var newPoint = a.comparePoints(head_line, 'closest', chin_point);
        right_cheekbone_wrinkle2.push({x:newPoint.x, y:newPoint.y-(2 * f.thick_unit)});

        //Curves 2
        var right_cheekbone_wrinkle_curve2 = a.createPath(right_cheekbone_wrinkle2, cheek_line_options);
        shapes.push(right_cheekbone_wrinkle_curve2);
        axis = a.comparePoints(chin_bottom_line, 'x', 'middle');
        left_cheekbone_wrinkle = a.transformShapeLine({type:'reverse',axis:axis}, face_options, right_cheekbone_wrinkle2);
        var left_cheekbone_wrinkle_curve2 = a.createPath(left_cheekbone_wrinkle, cheek_line_options);
        shapes.push(left_cheekbone_wrinkle_curve2);


    }


    if (_.indexOf(cheekbone_lines, 'L') > -1) {

        mid_x = a.comparePoints(head_line, 'x', 'highest');
        x = mid_x - (f.thick_unit * 10);
        right_cheekbone_wrinkle.push({x:x, y:mid_y});

        right_cheekbone_wrinkle.push({x:eye_right_right, y:mouth_right_point.y});

        chin_bottom_line_right.x += 10 * f.thick_unit;
        right_cheekbone_wrinkle.push(chin_bottom_line_right);

        right_cheekbone_wrinkle_curve1 = a.createPath(right_cheekbone_wrinkle, {
            break_line_every: 20,
            thickness_gradients: [12 * f.thick_unit, 3.5 * f.thick_unit, 0],
            line_color: face_options.skin_colors.darkflesh,
            alpha:.25
        });
        shapes.push(right_cheekbone_wrinkle_curve1);

        axis = a.comparePoints(chin_bottom_line, 'x', 'middle');
        left_cheekbone_wrinkle = a.transformShapeLine({type:'reverse',axis:axis}, face_options, right_cheekbone_wrinkle);
        left_cheekbone_wrinkle_curve1 = a.createPath(left_cheekbone_wrinkle, {
            break_line_every: 20,
            thickness_gradients: [12 * f.thick_unit, 3.5 * f.thick_unit, 0],
            line_color: face_options.skin_colors.darkflesh,
            alpha:.25
        });
        shapes.push(left_cheekbone_wrinkle_curve1);
    }


    return shapes;
}});

//chin
new Avatar('add_render_function', {style: 'lines', feature: 'chin', renderer: function (face_zones, avatar) {
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

//mouth
new Avatar('add_render_function', {style: 'lines', feature: 'mouth', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    //These can change expression alot
    var mouth_width = 1; //.6 - 1.3
    if (face_options.mouth_width == "Tiny") {
        mouth_width = .7;
    } else if (face_options.mouth_width == "Small") {
        mouth_width = .8;
    } else if (face_options.mouth_width == "Short") {
        mouth_width = .9;
    } else if (face_options.mouth_width == "Normal") {
        mouth_width = 1;
    } else if (face_options.mouth_width == "Big") {
        mouth_width = 1.05;
    } else if (face_options.mouth_width == "Wide") {
        mouth_width = 1.1;
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

    if (face_options.face_shape == "Inverted Triangle") {
        mouth_width *= .7;
    }

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
        {x: -10, y: -1 - (mouth_left_lift / 2)},
        {x: -5, y: -(lip_top_top * 2)},
        {x: -1, y: -lip_top_top},
        {x: 1, y: -lip_top_top},
        {x: 5, y: -(lip_top_top * 2)},
        {x: 10, y: -1 - (mouth_right_lift / 2) },
        {x: 13, y: -2 - mouth_right_lift},

        {x: 12, y: 0 - mouth_right_lift},
        {x: 10, y: 1 - (mouth_right_lift / 2) },
        {x: 4, y: lip_bottom_height + lip_bottom_bottom},
        {x: 1, y: lip_bottom_height + lip_bottom_bottom - 1},
        {x: -1, y: lip_bottom_height + lip_bottom_bottom - 1},
        {x: -4, y: lip_bottom_height + lip_bottom_bottom},
        {x: -10, y: 1 - (mouth_left_lift / 2)},
        {x: -12, y: 0 - mouth_left_lift}
    ];
    if (face_options.lip_shape == "Thin") {
        mouth_top_line = [
            {x: -13, y: -2 - (mouth_left_lift * .5)},
            {x: -5, y: -(lip_top_top)},
            {x: -1, y: -(lip_top_top * .8)},
            {x: 1, y: -(lip_top_top * .8)},
            {x: 5, y: -(lip_top_top)},
            {x: 13, y: -2 - (mouth_right_lift * .5)},

            {x: 12, y: -2.5 - (mouth_right_lift * .5)},
            {x: 4, y: (lip_bottom_height + lip_bottom_bottom) * .5},
            {x: 1, y: (lip_bottom_height + lip_bottom_bottom) * .7},
            {x: -1, y: (lip_bottom_height + lip_bottom_bottom) * .7},
            {x: -4, y: (lip_bottom_height + lip_bottom_bottom) * .5},
            {x: -12, y: -2.5 - (mouth_left_lift * .5)}
        ];
    } else if (face_options.lip_shape == "Thick") {
        mouth_top_line = [
            {x: -13, y: -2 - (mouth_left_lift * .7)},
            {x: -5, y: -(lip_top_top * 1.2)},
            {x: -1, y: -(lip_top_top * 1.1)},
            {x: 1, y: -(lip_top_top * 1.1)},
            {x: 5, y: -(lip_top_top * 1.2)},
            {x: 13, y: -2 - (mouth_right_lift * .7)},

            {x: 12, y: -2.5 - (mouth_right_lift * .5)},
            {x: 4, y: (lip_bottom_height + lip_bottom_bottom) * .9},
            {x: 1, y: (lip_bottom_height + lip_bottom_bottom) * 1.1},
            {x: -1, y: (lip_bottom_height + lip_bottom_bottom) * 1.1},
            {x: -4, y: (lip_bottom_height + lip_bottom_bottom) * .9},
            {x: -12, y: -2.5 - (mouth_left_lift * .5)}
        ];
    }

    var lip_mid_color = net.brehaut.Color(face_options.lip_color).darkenByRatio(.3).toString();
    var l = a.createPathFromLocalCoordinates(mouth_top_line, {
        close_line: true, thickness: lip_thickness,
        line_color: face_options.skin_colors.deepshadow, fill_method: 'linear',
        fill_colors: [face_options.lip_color, lip_mid_color, face_options.lip_color],
        fill_steps: [0,.5,1], y_offset_start: -height/2, y_offset_end: height/2,
        x_offset_start:0, x_offset_end:0
    }, width, height);
    l.x = f.mouth.x;
    l.y = f.mouth.y;
    l.name = 'lips';
    lines.push({name: 'lips', line: mouth_top_line, shape: l, x: f.mouth.x, y: f.mouth.y, scale_x: width, scale_y: height});
    shapes.push(l);

    var tongue_line = a.transformShapeLine({type: 'midline of loop'}, face_options, mouth_top_line);
    var l2 = a.createPathFromLocalCoordinates(tongue_line, {close_line: false, thickness: 1, color: face_options.skin_colors.deepshadow}, width, height);
    l2.x = f.mouth.x;
    l2.y = f.mouth.y;
    l2.alpha = 0.5;
    l2.name = 'tongue';
    lines.push({name: 'tongue', line: tongue_line, shape: l2, x: f.mouth.x, y: f.mouth.y, scale_x: width, scale_y: height});
    shapes.push(l2);


    return shapes;
}});


//=====Circle Styles==========
new Avatar('add_render_function', {style: 'circles', feature: 'neck', renderer: function (face_zones, avatar) {
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

new Avatar('add_render_function', {style: 'circles', feature: 'ears', renderer: function (face_zones, avatar) {
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

new Avatar('add_render_function', {style: 'circles', feature: 'face', renderer: function (face_zones, avatar) {
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

new Avatar('add_render_function', {style: 'circles', feature: 'eyes', renderer: function (face_zones, avatar) {
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

new Avatar('add_render_function', {style: 'circles', feature: 'nose', renderer: function (face_zones, avatar) {
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

new Avatar('add_render_function', {style: 'circles', feature: 'mouth', renderer: function (face_zones, avatar) {
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