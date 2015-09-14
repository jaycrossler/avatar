new Avatar('add_render_function', {style: 'lines', feature: 'horns', renderer: function (face_zones, avatar) {
    var f = face_zones;
    var a = avatar._private_functions;
    var face_options = avatar.face_options;
    var lines = avatar.lines;
    var shapes = [];
    var horn_squint = .8;

    var width_horn = (f.thick_unit * 60);
    var horn_radius = .6; //.5-0.9
    var x = f.eyes.left_x - (f.thick_unit * 5);
    var y = f.eyes.y - (f.thick_unit * 120);
    var rotation_amount = -10;

    var horn_fill_colors = ['#fff', '#eee','#ddd'];
    var horn_fill_steps = [.1,.5,1];

    var horn_size = 6;
    if (face_options.horn_size == 'Small') {
        horn_size = 0;
        horn_squint = .7;
    } else if (face_options.horn_size == 'Large') {
        horn_size = 12;
        horn_squint = .9;
    }


    var left_horn_base_line = a.transformShapeLine([
        {type: 'oval', radius_x: horn_radius * width_horn, radius_y: horn_radius * width_horn * horn_squint}
    ], face_options);
    var left_horn_base = a.createPath(left_horn_base_line, {
            close_line: true, line_color: face_options.skin_colors.darkflesh
        });
    left_horn_base.x = x;
    left_horn_base.y = y;
    left_horn_base.rotation = rotation_amount;
    lines.push({name: 'left horn base', line: left_horn_base_line, shape: left_horn_base, scale_x: 1, scale_y: 1, x: x, y: y, rotation: rotation_amount});
//    shapes.push(left_horn_base);


    x = f.eyes.right_x + (f.thick_unit * 5);
    var right_horn_base_line = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, left_horn_base_line);
    var right_horn_base = a.createPath(right_horn_base_line, {
            close_line: true, line_color: face_options.skin_colors.darkflesh
        });
    right_horn_base.x = x;
    right_horn_base.y = y;
    right_horn_base.rotation = -rotation_amount;
    lines.push({name: 'right horn base', line: right_horn_base_line, shape: right_horn_base, scale_x: 1, scale_y: 1, x: x, y: y, rotation: -rotation_amount});
//    shapes.push(right_horn_base);


    var thickness = 2;
    //Horn
    var horn_point_x_offset = width_horn * .9;  //TODO: Adjust by age?
    var horn_point_y_offset = width_horn * 1.2;

    var left_horn_leftmost = a.comparePoints(left_horn_base_line, 'x', 'lowest', true);
    var left_horn_rightmost = a.comparePoints(left_horn_base_line, 'x', 'highest', true);
    var left_horn_bottommost = a.comparePoints(left_horn_base_line, 'y', 'highest', true);

    var horn_thickness = .3;
    if (face_options.horn_thickness == 'Thin') {
        horn_thickness = .4;
    } else if (face_options.horn_thickness == 'Thick') {
        horn_thickness = .2;
    }

    left_horn_rightmost.x += (f.thick_unit * horn_size);

    var horn_line = [];
    horn_line.push({x: left_horn_leftmost.x - horn_point_x_offset, y: left_horn_leftmost.y - horn_point_y_offset});
    horn_line.push({x: left_horn_leftmost.x - (horn_point_x_offset * (.9-horn_thickness)), y: left_horn_rightmost.y - (horn_point_y_offset * (.7-horn_thickness))});
    horn_line.push(left_horn_rightmost);
    horn_line.push(left_horn_bottommost);
    horn_line.push({x: left_horn_leftmost.x - (horn_point_x_offset *.9), y: left_horn_leftmost.y - (horn_point_y_offset * .3)});
    horn_line.push({x: left_horn_leftmost.x - horn_point_x_offset, y: left_horn_leftmost.y - horn_point_y_offset});

    var horn_draw_options = {
            close_line: true, thickness: 1.2 * thickness,
            fill_steps: horn_fill_steps, fill_colors: horn_fill_colors,
            x_offset: a.comparePoints(horn_line,"x","highest"),
            y_offset: a.comparePoints(horn_line,"y","highest"),
            radius: a.comparePoints(horn_line, 'height'),
            line_color: horn_fill_colors[0]
        };

    var left_horn_line = a.createPath(horn_line, horn_draw_options);
    left_horn_line.x = left_horn_base.x;
    left_horn_line.y = left_horn_base.y;
    lines.push({name: 'nose bottom line', line: horn_line, shape: left_horn_line});
    shapes.push(left_horn_line);



    x = f.eyes.right_x + (f.thick_unit * 5);
    var right_horn_line = a.transformShapeLine({type: 'reverse', direction: 'horizontal', axis: 0}, face_options, horn_line);
    var right_horn = a.createPath(right_horn_line, horn_draw_options);
    right_horn.x = x;
    right_horn.y = y;
    lines.push({name: 'right horn', line: right_horn_line, shape: right_horn, scale_x: 1, scale_y: 1, x: x, y: y, rotation: -rotation_amount});
    shapes.push(right_horn);



    return shapes;
}});

var demonTemplate = new Avatar('copy_data_template', 'Human');

demonTemplate.eye_size_options = ['Big', 'Massive', 'Large'];
demonTemplate.eye_color_options = ['Red', 'Pink', 'Purple'];
demonTemplate.eye_cloudiness_options = ['Pink'];
demonTemplate.pupil_color_options = ['Maroon','Red'];
demonTemplate.horn_thickness_options = ['Thick','Medium','Thin'];
demonTemplate.horn_size_options = ['Small','Medium','Large'];

demonTemplate.thickness_options = [3,4,5,6];

demonTemplate.hair_style_options = ['Bald'];
demonTemplate.beard_style_options = ['None'];
demonTemplate.wrinkle_resistance_options = ['Very Low', 'Low', 'Less'];

demonTemplate.skin_shade_options = ['Preset'];
demonTemplate.skin_colors_options = [
    {name: 'Dark', highlights: 'rgb(255,30,30)', skin: 'rgb(200,30,30)'}
];

demonTemplate.rendering_order.push({feature: 'horns', style: 'lines'});


new Avatar('set_data_template', 'Demon', demonTemplate);
