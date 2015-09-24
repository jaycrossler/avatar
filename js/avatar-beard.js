//beard
new Avatar('add_render_function', {style: 'lines', feature: 'beard', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var beard_style = _.clone(face_options.beard_style);
    if (face_options.gender == 'Female' || face_options.age < 18) beard_style = 'None';

    var stubble_style = face_options.stubble_style;
    if (face_options.gender == 'Female' || face_options.age < 15) stubble_style = 'None';

    if (beard_style == "None" && stubble_style == "None") return shapes;

    var stubble_alpha = 0.3;
    if (stubble_style == "Light") {
        stubble_alpha = 0.1;
    } else if (stubble_style == "Medium") {
        stubble_alpha = 0.4;
    } else if (stubble_style == "Heavy") {
        stubble_alpha = 0.7;
    }

    var inner_hair_x = 0;
    var inner_hair_y = 3;
    var outer_hair_x = .5;
    var outer_hair_y = .5;
    var beard_alpha = 0.95;

    if (beard_style == 'None') {
        //Skip
    } else if (beard_style == 'Full Chin') {
        inner_hair_y = 12;
        outer_hair_x = 1;
        outer_hair_y = 2;
        beard_alpha = .9;
    } else if (beard_style == 'Chin Warmer') {
        inner_hair_y = 10;
        outer_hair_x = .5;
        outer_hair_y = .5;
        beard_alpha = .8;
    } else if (beard_style == 'Soup Catcher') {
        inner_hair_y = 13;
        outer_hair_x = 1;
        outer_hair_y = 10;
        beard_alpha = .9;
    } else if (beard_style == 'Thin Chin Wrap') {
        inner_hair_y = 1;
        outer_hair_x = 0;
        outer_hair_y = .2;
        beard_alpha = .4;
    } else if (beard_style == 'Thin Low Chin Wrap') {
        inner_hair_x = 1;
        inner_hair_y = 1;
        outer_hair_x = 0;
        outer_hair_y = .2;
        beard_alpha = .3;
    }
    if (face_options.age < 20) {  //TODO: Make this a scaling function
        inner_hair_x *= .25;
        inner_hair_y *= .25;
        outer_hair_x *= .25;
        outer_hair_y *= .25;
    } else if (face_options.age < 23) {
        inner_hair_x *= .5;
        inner_hair_y *= .5;
        outer_hair_x *= .5;
        outer_hair_y *= .5;
    } else if (face_options.age < 26) {
        inner_hair_x *= .75;
        inner_hair_y *= .75;
        outer_hair_x *= .75;
        outer_hair_y *= .75;
    }

    var color = _.clone(face_options.beard_color || face_options.hair_color);
    if (color == 'Hair') color = face_options.hair_color;
    var fill_color = color;
    if (color == 'White' || color == '#000000') color = 'gray';
    color = maths.hexColorToRGBA(color, 1);
    fill_color = maths.hexColorToRGBA(fill_color, 1);


    var head_line = a.transformLineToGlobalCoordinates(lines, 'face');
    var eye_line = a.transformLineToGlobalCoordinates(lines, 'left eye');
    var nose_bottom_line = a.transformLineToGlobalCoordinates(lines, 'nose bottom line');

    var hair_line_level_adjust = 1;
    var beard_line = a.lineSegmentCompared(head_line, eye_line, 'below', hair_line_level_adjust * 10 * f.thick_unit);

//    var eye_line_bottom_y = a.comparePoints(eye_line, 'y','highest');
//    var beard_line_left = a.comparePoints(eye_line, 'x','lowest');
//    var beard_line_right = a.comparePoints(eye_line, 'x','highest');
//    var beard_line_bottom = a.comparePoints(eye_line, 'y','highest');
//
//    //TODO: Get to same component space
//    beard_line = a.constrainPolyLineToBox(beard_line, {
//        tl:{x:beard_line_left,y:eye_line_bottom_y},
//        br:{x:beard_line_right, y:beard_line_bottom}});

    var beard = a.createPath(beard_line, {thickness: f.thick_unit * 5, line_color: face_options.hair_color});
    lines.push({name: 'beard line', line: beard_line, shape: beard, x: 0, y: 0, scale_x: 1, scale_y: 1});
    //Note: this just added the beard as a reference line without showing it

    var nose_bottom_line_bottom_point = a.comparePoints(nose_bottom_line, "y", "highest");

    var stubble_fill_canvas = a.findShape(avatar.textures, 'stubble lines', null, 'canvas');
    if (beard_style == "None" && stubble_style != "None" && beard_line && beard_line.length && beard_line.length > 2) {
        var inner_stubble_line = a.extrudeHorizontalArc(beard_line, 0, -f.thick_unit * 100);

        var inner_stubble_line_top_point = a.comparePoints(inner_stubble_line, "y", "highest");
        if (inner_stubble_line_top_point > nose_bottom_line_bottom_point) {
            var lower_by = inner_stubble_line_top_point - nose_bottom_line_bottom_point - (f.thick_unit * 10);
            inner_stubble_line = a.transformShapeLine({type: 'shift', y_offset: -lower_by}, face_options, inner_stubble_line);
        }

        var full_stubble_line = beard_line.concat(inner_stubble_line.reverse());
        full_stubble_line = a.transformShapeLine({type: 'smooth'}, face_options, full_stubble_line);


        var full_stubble = a.createPath(full_stubble_line, {
            close_line: true, line_color: 'blank',
            fill_color: '#444'
        });
        full_stubble.alpha = stubble_alpha / 4;
        lines.push({name: 'full stubble', line: full_stubble_line, shape: full_stubble, alpha: beard_alpha});
        shapes = shapes.concat(full_stubble);

        var full_stubble_texture = a.createPath(full_stubble_line, {
            close_line: true, line_color: 'blank',
            fill_canvas: stubble_fill_canvas
        });
        full_stubble_texture.alpha = stubble_alpha;
        shapes = shapes.concat(full_stubble_texture);
    }

    if (beard_style != "None" && beard_line && beard_line.length && beard_line.length > 2) {

        var inner_hair_line = a.extrudeHorizontalArc(beard_line, -f.thick_unit * inner_hair_x * 10, -f.thick_unit * inner_hair_y * 10);
        var outer_hair_line = a.extrudeHorizontalArc(beard_line, -f.thick_unit * outer_hair_x * 10, f.thick_unit * outer_hair_y * 10);

        //TODO: Adjust differently by ear
        var inner_hair_line_top_point = a.comparePoints(inner_hair_line, "y", "highest");
        if (inner_hair_line_top_point < nose_bottom_line_bottom_point) {
            var lower_by = inner_hair_line_top_point - nose_bottom_line_bottom_point;
            inner_hair_line = a.transformShapeLine({type: 'shift', y_offset: -lower_by}, face_options, inner_hair_line);
        }

        var full_beard_line = outer_hair_line.concat(inner_hair_line.reverse());
        full_beard_line = a.transformShapeLine({type: 'smooth'}, face_options, full_beard_line);


        var full_beard = a.createPath(full_beard_line, {
            close_line: true, thickness: f.thick_unit * .5, line_color: color,
            fill_color: fill_color
        });
        full_beard.alpha = beard_alpha;
        lines.push({name: 'full beard', line: full_beard_line, shape: full_beard, x: 0, y: 0, scale_x: 1, scale_y: 1, alpha: beard_alpha});
        shapes = shapes.concat(full_beard);

        var full_beard_texture = a.createPath(full_beard_line, {
            close_line: true, line_color: 'blank',
            fill_canvas: stubble_fill_canvas
        });
        full_beard_texture.alpha = beard_alpha;
        shapes = shapes.concat(full_beard_texture);
    }
    return shapes;
}});


//mustache
new Avatar('add_render_function', {style: 'lines', feature: 'mustache', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var mustache_style = face_options.mustache_style;
    if (face_options.gender == 'Female' || face_options.age < 18) mustache_style = 'None';

    var mustache_width_mod = face_options.mustache_width;
    var mustache_height_mod = face_options.mustache_height;

    //TODO: Stretch to cover face
    mustache_width_mod = a.turnWordToNumber(mustache_width_mod, .8, 1.2, 'Small,Short,Medium,Long,Large');
    mustache_height_mod = a.turnWordToNumber(mustache_height_mod, .8, 1.2, 'Small,Short,Medium,Long,Large');

    var color = _.clone(face_options.beard_color || face_options.hair_color);
    if (color == 'Hair') color = face_options.hair_color;
    var fill_color = color;
    if (color == 'White' || color == '#000000') color = 'gray';
    color = maths.hexColorToRGBA(color, 1);
    fill_color = maths.hexColorToRGBA(fill_color, 1);

    if (mustache_style != "None") {

        //TODO: Link mustache points to lip anchors for mouth movement

        var nose_bottom_line = a.transformLineToGlobalCoordinates(lines, 'nose bottom line');
        var mouth_line = a.transformLineToGlobalCoordinates(lines, 'lips');
        var mouth_top_point = a.comparePoints(mouth_line, 'y', 'lowest', true);
        var nose_bottom_line_bottom_point = a.comparePoints(nose_bottom_line, "y", "highest", true);

        var mustache_line = [];
        var double_it = true;
        if (mustache_style == 'Propeller') {
            mustache_line = [
                {x: 0, y: 0},
                {x: -4, y: 1},
                {x: -10, y: 2},
                {x: -13, y: 1},
                {x: -15, y: 3},
                {x: -12, y: -1},
                {x: 0, y: -1}
            ]
        } else if (mustache_style == 'Handlebar') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -2},
                {x: 8, y: 4},
                {x: 12, y: 1},
                {x: 10, y: 3},
                {x: 8, y: 4},
                {x: 2, y: 2},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Pointy Handlebar') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -2},
                {x: 8, y: 2},
                {x: 12, y: 2},
                {x: 12, y: 2},
                {x: 9, y: 3},
                {x: 5, y: 4},
                {x: 2, y: 2},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Low Handlebar') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -2},
                {x: 8, y: 2},
                {x: 12, y: 0},
                {x: 9, y: 2},
                {x: 5, y: 3},
                {x: 2, y: 2},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Long Curled Handlebar') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -2},
                {x: 8, y: 2},
                {x: 12, y: 0},
                {x: 14, y: -2},
                {x: 12, y: -4},
                {x: 10, y: -2},
                {x: 10, y: -2},
                {x: 12, y: -4},
                {x: 14, y: -2},
                {x: 12, y: 0},
                {x: 9, y: 2},
                {x: 5, y: 3},
                {x: 2, y: 2},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Curled Handlebar') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -2},
                {x: 8, y: 2},
                {x: 11, y: 0},
                {x: 13, y: -2},
                {x: 11, y: -3},
                {x: 10, y: -1},
                {x: 10, y: -1},
                {x: 11, y: -3},
                {x: 13, y: -2},
                {x: 11, y: 0},
                {x: 9, y: 2},
                {x: 5, y: 3},
                {x: 2, y: 2},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Lower Dali') {
            mustache_line = [
                {x: 0, y: -1},
                {x: 10, y: 0},
                {x: 10, y: 0},
                {x: 3, y: 0},
                {x: 0, y: -.5}
            ]
        } else if (mustache_style == 'Butterfly') {
            mustache_line = [
                {x: 0, y: -1},
                {x: 2, y: -1.1},
                {x: 10, y: 1.5},
                {x: 1, y: 2},
                {x: 0, y: 0}
            ]
        } else if (mustache_style == 'Fu Manchu') {
            mustache_line = [
                {x: 0, y: .5},
                {x: 6, y: -1.1},
                {x: 10, y: 1.5},
                {x: 10.5, y: 3},
                {x: 11, y: 10},
                {x: 11, y: 20},
                {x: 9, y: 23},
                {x: 9.5, y: 8},
                {x: 9.2, y: 2},

                {x: 1, y: 3.5},
                {x: 0, y: 1.5}
            ]
        } else if (mustache_style == 'Dali') {
            mustache_line = [
                {x: 0, y: -1},
                {x: 2, y: -1.1},
                {x: 8, y: 1.5},
                {x: 15, y: -10},
                {x: 15, y: -10},
                {x: 7, y: 3},
                {x: 1, y: 2},
                {x: 0, y: 0}
            ]
        } else if (mustache_style == 'Sparrow') {
            mustache_line = [
                {x: 0, y: .5},
                {x: 2, y: -0.1},
                {x: 10, y: 5},
                {x: 10, y: 8},
                {x: 10, y: 10},
                {x: 10, y: 8},
                {x: 4, y: 4},
                {x: .5, y: 4},
                {x: 0, y: 1}
            ]
        } else if (mustache_style == 'Zappa') {
            mustache_line = [
                {x: 0, y: .2},
                {x: 6, y: 0},
                {x: 9, y: 2},
                {x: 10, y: 5},
                {x: 10, y: 8},
                {x: 10.5, y: 9},
                {x: 9, y: 8},
                {x: 7, y: 4},
                {x: 0, y: 4.5}
            ]
        } else if (mustache_style == 'Anchor') {
            mustache_line = [
                {x: 0, y: -1},
                {x: 2, y: -1},
                {x: 2, y: 3},
                {x: 12, y: 0},
                {x: 1, y: 3.5},
                {x: 0, y: 2}
            ]
        } else if (mustache_style == 'Copstash') {
            mustache_line = [
                {x: 0, y: 0},
                {x: 3, y: -.1},
                {x: 8, y: 2.5},
                {x: 6, y: 2.5},
                {x: 1, y: 3},
                {x: 0, y: 1}
            ]
        } else {
            double_it = false;
        }

        if (double_it) {
            var other_side_mustache = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, mustache_line);
            mustache_line = mustache_line.concat(other_side_mustache.reverse());
        }

        var alpha = .9;
        var x = nose_bottom_line_bottom_point.x;
        var y = ((mouth_top_point.y * 2) + (nose_bottom_line_bottom_point.y * 8)) / 10;
        var line_thickness = (f.thick_unit * 2);
        var width = f.thick_unit * 70 * mustache_width_mod;
        var height = f.thick_unit * 80 * mustache_height_mod;

        var mustache_outline = a.transformPathFromLocalCoordinates(mustache_line, width, height);
        var mustache_shape = a.createPath(mustache_outline, {
            close_line: true, thickness: line_thickness, color: color, fill_color: fill_color
        });
        mustache_shape.alpha = alpha;
        mustache_shape.x = x;
        mustache_shape.y = y;
        lines.push({name: 'mustache', line: mustache_outline, shape: mustache_shape, x: x, y: y, alpha: alpha, scale_x: width, scale_y: height});
        shapes.push(mustache_shape);


        var hair_canvas = a.findShape(avatar.textures, 'stubble lines', null, 'canvas');
        var mustache_shape_texture = a.createPath(mustache_outline, {
            close_line: true, line_color: 'blank', fill_canvas: hair_canvas
        });
        mustache_shape_texture.alpha = 0.2;
        mustache_shape_texture.x = x;
        mustache_shape_texture.y = y;
        shapes.push(mustache_shape_texture);

    }


    return shapes;
}});
