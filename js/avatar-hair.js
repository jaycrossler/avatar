function createHairPattern(options, zone, hair_line, outer_hair_line, a) {
    //Can take in numbers like '123123' or '212,1231,53' and make hair

    var type = options.type || 'droopy';
    var pattern = options.pattern || '1111121111';
    var point_pattern = options.point_pattern || '';
    var head_width = a.comparePoints(hair_line, 'width');
    var hair_left = a.comparePoints(hair_line, 'x', 'lowest');

    var head_height = zone.bottom + zone.top;

    var hair_pieces = pattern.split(",");
    var left_hair, mid_hair, right_hair;
    if (hair_pieces.length == 1) {
        left_hair = [];
        mid_hair = '' + parseInt(hair_pieces[0]);
        right_hair = [];
    } else if (hair_pieces.length == 3) {
        left_hair = '' + parseInt(hair_pieces[0]);
        mid_hair = '' + parseInt(hair_pieces[1]);
        right_hair = '' + parseInt(hair_pieces[2]);
    }

    if (mid_hair.length < 2) {
        mid_hair = "1" + mid_hair + "1";
    }
    var head_slice_width = head_width / (mid_hair.length - 1);
    var head_slice_height = head_height / 8;

    //TODO: Handle left and right
    var new_hair_line = [];
    _.each(mid_hair, function (length_number, i) {
        var x = hair_left + (i * head_slice_width);

        var height = parseInt(length_number) * head_slice_height;
        var hair_line_height = a.comparePoints(hair_line, 'crosses x', x);
        var y = hair_line_height + height;

        new_hair_line.push({x: x, y: y});
//            new_hair_line.push({
//                x: zone.x+zone.left+(i * head_slice_width),
//                y: zone.y+zone.top+height
//            });

    });

//        var spacing = comparePoints(hair_line, 'width') / hair_line.length;
//
//        var hair_spaced = hydratePointsAlongLine(new_hair_line, spacing, true);
//        _.each(new_hair_line, function(nhl, i){
//            nhl.y += hair_spaced[i].y;
//        });


    return hair_line.concat(new_hair_line.reverse());
}

//hair
new Avatar('add_render_function', {style: 'lines', feature: 'hair', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];

    var hair_line_level_adjust = -f.thick_unit * 2;
    var outer_hair_x = 10;
    var outer_hair_y = 20;


    if (face_options.age < 20) {
        outer_hair_y *= (face_options.age / 20);
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


//        var inner_hair_line = a.extrudeHorizontalArc(hair_line, f.thick_unit * inner_hair_x, f.thick_unit * inner_hair_y);
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

//        var full_hair_line = inner_hair_line.concat(outer_hair_line.reverse());
//        full_hair_line = a.transformShapeLine({type: 'smooth'}, face_options, full_hair_line);

//        var outer_hair = a.createPath(full_hair_line, {close_line: true, thickness: f.thick_unit * 2, color: color, fill_color: fill_color});
//        lines.push({name: 'full hair', line: full_hair_line, shape: outer_hair});
//        shapes = shapes.concat(outer_hair);

        var hair_builder = {style: face_options.hair_style, pattern: '111121111', point_pattern: '', pattern_name: face_options.hair_pattern};
        if (face_options.hair_pattern == "Mid Bump") {
            hair_builder.pattern = '111121111';
        } else if (face_options.hair_pattern == "Eye Droop") {
            hair_builder.pattern = '411114356224';
        } else if (face_options.hair_pattern == "Side Part") {
            hair_builder.pattern = '0,123212321,0';
        } else if (face_options.hair_pattern == "Bowl") {
            hair_builder.pattern = '0,2222222,0';
        } else if (face_options.hair_pattern == "Receding") {
            hair_builder.pattern = '0,1111111,0';
        } else if (face_options.hair_pattern == "Bowl with Peak") {
            hair_builder.pattern = '0,111131111,0';
        } else if (face_options.hair_pattern == "Bowl with Big Peak") {
            hair_builder.pattern = '0,111242111,0';
            hair_builder.point_pattern = ' ,    P    , ';
        } else if (face_options.hair_pattern == "Side Part2") {
            hair_builder.pattern = '0,4323234,0';
        } else if (face_options.hair_pattern == "Twin Peaks") {
            hair_builder.pattern = '0,11242124211,0';
        }

        if (face_options.hair_style == "Spiky") {
            //Replace each blank with a "P"
            var point_pattern = _.str.repeat(" ", hair_builder.pattern.length);
            _.each(hair_builder.point_pattern, function (style, i) {
                if (style != " ") point_pattern[i] = style;
            });
            _.each(hair_builder.pattern, function (style, i) {
                if (style == ",") point_pattern[i] = ',';
                if (style == " ") point_pattern[i] = 'P';
            })
        } else if (face_options.hair_style == "Bald" || face_options.hair_style == "None" || face_options.age < 2) {
            hair_builder = {};
        }


        if (hair_builder.style) {
            var added_hair_line = createHairPattern(hair_builder, zone, hair_line, outer_hair_line, a);
            var added_outer_hair = a.createPath(added_hair_line, {
                close_line: true, thickness: f.thick_unit * 2, line_color: color,
                fill_color: fill_color
            });
            lines.push({name: 'full hair second layer', line: added_hair_line, shape: added_outer_hair});
            shapes = shapes.concat(added_outer_hair);

            var stubble_fill_canvas = a.findShape(avatar.textures, 'stubble lines', null, 'canvas');
            var added_outer_hair_fill = a.createPath(added_hair_line, {
                close_line: true, line_color: 'blank', fill_canvas: stubble_fill_canvas
            });
            added_outer_hair_fill.alpha = 0.2;
            shapes = shapes.concat(added_outer_hair_fill);
        }


    }
    return shapes;
}});