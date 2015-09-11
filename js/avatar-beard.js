//beard
new Avatar('add_render_function', {style: 'lines', feature: 'beard', renderer: function (face_zones, avatar) {
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
    var alpha = 0.9;

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

        var color = _.clone(face_options.beard_color || face_options.hair_color);
        if (color == 'Hair') color = face_options.hair_color;
        var fill_color = color;
        if (color == 'White' || color == '#000000') color = 'gray';
        color = maths.hexColorToRGBA(color, 1);
        fill_color = maths.hexColorToRGBA(fill_color, 1);

        var full_beard_line = outer_hair_line.concat(inner_hair_line.reverse());
        full_beard_line = a.transformShapeLine({type: 'smooth'}, face_options, full_beard_line);

        var full_beard = a.createPath(full_beard_line, {close_line: true, thickness: f.thick_unit * .5, line_color: color, fill_color: fill_color});
        full_beard.alpha = alpha;
        lines.push({name: 'full beard', line: full_beard_line, shape: full_beard, x: 0, y: 0, scale_x: 1, scale_y: 1, alpha: alpha});
        shapes = shapes.concat(full_beard);

    }
    return shapes;
}});
