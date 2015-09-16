var avatars = [];
var seed = parseInt(Math.random() * 300000);

var $canvas;
var data_options = {};

$(document).ready(function () {
    //Pointer to the canvas that we'll draw avatars on
    $canvas = $("#avatar_canvas");

    //Get a link to the main template that we use to define avatars
    data_options = new Avatar('get_linked_template');

    //Take out any existing decorations
    data_options.rendering_order = _.filter(data_options.rendering_order, function (dec) {
        return !dec.decoration
    });

    //Add a new text decoration that shows the age
    data_options.rendering_order.push({decoration: "text-plate", type: 'rectangle', height: 14, docked: 'bottom', forceInBounds: true, font_size: 10,
        text: '{{text}}', text_color: 'black', line_color: 'brown', fill_color: 'white', alpha: 0.8});

    //Now, get just a copy for reference (so it doesn't get reset later)
    data_options = new Avatar('copy_data_template');

    var compare_var = Helpers.getQueryVariable("compare") || "face_shape_options";
    var set1 = Helpers.getQueryVariable("set1");
    var set1val = Helpers.getQueryVariable("set1val");
    var set2 = Helpers.getQueryVariable("set2");
    var set2val = Helpers.getQueryVariable("set2val");


    if (set1 && !_.str.endsWith(set1, "_options")) set1 = set1 + "_options";
    if (set2 && !_.str.endsWith(set2, "_options")) set2 = set2 + "_options";

    build_option_explorer(compare_var, set1, set2);

    if (set1val) {
        show_setting_options('chooser_1_setting', set1, set1val);
    }
    if (set2val) {
        show_setting_options('chooser_2_setting', set2, set2val);
    }

    explore_options(compare_var);

});
function build_option_explorer(highlight_option_name, set1, set2) {
    var $chooser_holder = $('#chooser_holder');
    var $chooser = $('<select>');
    //------------------------
    $('<label>')
        .text("Set:")
        .appendTo($chooser_holder);
    var $chooser_1 = $('<select>')
        .attr('id', 'chooser_1')
        .on('change', function () {
            var val = $(this).val();
            show_setting_options('chooser_1_setting', val);
        })
        .appendTo($chooser_holder);
    $('<label>')
        .text("To be:")
        .appendTo($chooser_holder);
    var $chooser_1_setting = $('<select>')
        .attr('id', 'chooser_1_setting')
        .appendTo($chooser_holder);

    $('<br>')
        .appendTo($chooser_holder);
    //------------------------
    $('<label>')
        .text("Set:")
        .appendTo($chooser_holder);
    var $chooser_2 = $('<select>')
        .attr('id', 'chooser_2')
        .on('change', function () {
            var val = $(this).val();
            show_setting_options('chooser_2_setting', val);
        })
        .appendTo($chooser_holder);
    $('<label>')
        .text("To be:")
        .appendTo($chooser_holder);
    var $chooser_2_setting = $('<select>')
        .attr('id', 'chooser_2_setting')
        .appendTo($chooser_holder);
    $('<br>')
        .appendTo($chooser_holder);

    //------------------------
    $('<label>')
        .text("Show a range of options on:")
        .appendTo($chooser_holder);
    $chooser
        .attr('id', 'option_range_select')
        .on('change', function () {
            var val = $(this).val();
            explore_options(val);
        })
        .appendTo($chooser_holder);

    //------------------------
    $('<option>')
        .attr({value: ''})
        .text(' -- Show Range --')
        .appendTo($chooser);

    $('<option>')
        .attr({value: ''})
        .text(' -- Set Value --')
        .appendTo($chooser_1);

    $('<option>')
        .attr({value: ''})
        .text(' -- Set Value --')
        .appendTo($chooser_2);

    for (var key in data_options) {
        if (key != "rendering_order" && key != "decorations") {
            var text = key;
            if (_.str.endsWith(text, '_options')) {
                text = text.substr(0, text.length - '_options'.length);

                $('<option>')
                    .attr({value: key, selected: key == highlight_option_name})
                    .text(text)
                    .appendTo($chooser);

                $('<option>')
                    .attr({value: key, selected: key == set1})
                    .text(text)
                    .appendTo($chooser_1);

                $('<option>')
                    .attr({value: key, selected: key == set2})
                    .text(text)
                    .appendTo($chooser_2);
            }
        }
    }

    $('<br>')
        .appendTo($chooser_holder);

    $('<button>')
        .text("Random New Avatar")
        .on('click', function () {
            seed = parseInt(Math.random() * 300000);
            _.each(avatars, function (av) {
                var face_options = av.getSeed();
                face_options.rand_seed = seed;
                av.face_options = null;

                if ($chooser_1.val()) {
                    var val1 = $chooser_1.val();
                    if (val1) {
                        if (_.str.endsWith(val1, '_options')) {
                            val1 = val1.substr(0, val1.length - '_options'.length);
                        }
                        face_options[val1] = $chooser_1_setting.val();
                    }
                }
                if ($chooser_2.val()) {
                    var val2 = $chooser_2.val();
                    if (val2) {
                        if (_.str.endsWith(val2, '_options')) {
                            val2 = val2.substr(0, val2.length - '_options'.length);
                        }
                        face_options[val2] = $chooser_2_setting.val();
                    }
                }

                av.drawOrRedraw(face_options);

                $chooser.val(highlight_option_name);
            });
        })
        .appendTo($chooser_holder)

}
function show_setting_options(chooser_id, setting_name, setting_val) {
    var $chooser_select = $('#' + chooser_id);
    $chooser_select.find('option')
        .remove()
        .end();

    $('<option>')
        .attr({value: ''})
        .text(' -- Set Value --')
        .appendTo($chooser_select);


    var data_items = data_options[setting_name] || [];
    _.each(data_items, function (item_name) {
        $('<option>')
            .attr({value: item_name, selected: setting_val == item_name})
            .text(item_name)
            .appendTo($chooser_select)
    });
    $chooser_select.off('change');
    $chooser_select.on('change', function () {

        var settings = {};
        _.each(['1', '2'], function (num) {
            var option = $('#chooser_' + num).val();
            var setting = $('#chooser_' + num + '_setting').val();
            if (_.str.endsWith(option, '_options')) {
                option = option.substr(0, option.length - '_options'.length);
            }
            settings[option] = setting;
        });

        var range_val = $('#option_range_select').val();
        explore_options(range_val, settings);
    });
}

function explore_options(options_name, forced_attributes) {

    var data_items = data_options[options_name] || [];
    _.each(avatars, function (avatar) {
        avatar.erase();
    });
    avatars = [];

    var option = options_name;
    if (_.str.endsWith(option, '_options')) {
        option = option.substr(0, option.length - '_options'.length);
    }

    //For each of the options, modify the rendering instructions, and draw a template
    _.each(data_items, function (item_name, i) {

        var avatar_options = forced_attributes || {};
        avatar_options['rand_seed'] = seed;
        avatar_options[option] = item_name;
        avatar_options['text'] = item_name; //Pass this to a decoration

        var x = (i % 6) * 170;
        var y = Math.floor(i / 6) * 230;

        var av = new Avatar(avatar_options, {canvas_name: 'avatar_canvas', height: 200, width: 160, x: x, y: y});
        avatars.push(av);

        //On every click, generate a new random seed for each face
        av.registerEvent('face', function () {
            var text = " : new Avatar(" + av.getSeed(true) + ");";
            $('#avatar_name').text(text);

        }, 'click');

    });
}