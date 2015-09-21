//hair
new Avatar('add_render_function', {style: 'lines', feature: 'hair', renderer: function (face_zones, avatar) {
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
        if (face_options.age < 23) {
            face_options.hair_style = 'Bowl with Peak';
            inner_hair_peak = 5;
        } else {
            return [];
        }
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

        var color = _.clone(face_options.hair_color);
        var fill_color = color;
        if (color == 'White' || color == '#000000') color = 'gray';
        color = maths.hexColorToRGBA(color, 1);
        fill_color = maths.hexColorToRGBA(fill_color, 1);

        var full_hair_line = inner_hair_line.concat(outer_hair_line.reverse());
        full_hair_line = a.transformShapeLine({type: 'smooth'}, face_options, full_hair_line);
        var outer_hair = a.createPath(full_hair_line, {close_line: true, thickness: f.thick_unit * 2, color: color, fill_color: fill_color});
        lines.push({name: 'full hair', line: full_hair_line, shape: outer_hair, x: zone.x, y: zone.y, scale_x: 1, scale_y: 1});
        shapes = shapes.concat(outer_hair);

        var stubble_fill_canvas = a.findShape(avatar.textures, 'stubble lines', null, 'canvas');
        var outer_hair_texture = a.createPath(full_hair_line, {
            close_line: true, line_color: 'blank', fill_canvas: stubble_fill_canvas
        });
        outer_hair_texture.alpha = 0.2;
        shapes = shapes.concat(outer_hair_texture);


    }
    return shapes;
}});