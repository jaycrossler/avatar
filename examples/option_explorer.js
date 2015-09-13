var avatars=[];
var seed = parseInt(Math.random() * 300000);

//TODO: Add option 2

var $canvas;
var data_options = {};

$(document).ready(function () {
    //Pointer to the canvas that we'll draw avatars on
    $canvas = $("#avatar_canvas");

    //Get a link to the main template that we use to define avatars
    data_options = new Avatar('copy_data_template');

    //Take out any existing decorations
    data_options.rendering_order = _.filter(data_options.rendering_order, function(dec){return !dec.decoration});

    //Add a new text decoration that shows the age
    data_options.rendering_order.push({decoration: "text-plate", type: 'rectangle', height: 14, docked: 'bottom', forceInBounds: true, font_size: 10,
                                     text: '{{text}}', text_color: 'black', line_color: 'brown', fill_color: 'white', alpha: 0.8});

    build_option_explorer('face_shape_options'); //TODO: Store via cookie or QS
    explore_options('face_shape_options');

});
function build_option_explorer(highlight_option_name){
    var $chooser_holder = $('#chooser_holder');
    var $chooser = $('<select>');
    //------------------------
    $('<label>')
        .text("Force:")
        .appendTo($chooser_holder);

    var $chooser_1 = $('<select>')
        .attr('id', 'chooser_1')
        .on('change', function(){
            var val = $(this).val();

            show_setting_options('chooser_1_setting','chooser_1', val);

        })
        .appendTo($chooser_holder);

    $('<label>')
        .text("To be:")
        .appendTo($chooser_holder);

    $('<select>')
        .attr('id', 'chooser_1_setting')
        .appendTo($chooser_holder);

    $('<br>')
        .appendTo($chooser_holder);

    //------------------------
    $('<label>')
        .text("Show a range of options on:")
        .appendTo($chooser_holder);
    $chooser
        .attr('id', 'option_range_select')
        .on('change', function(){
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

    for (var key in data_options) {
        if (key != "rendering_order" && key != "decorations") {
            var text = key;
            if (_.str.endsWith(text,'_options')) {
                text = text.substr(0, text.length - '_options'.length);

                $('<option>')
                    .attr({value: key, selected: key==highlight_option_name})
                    .text(text)
                    .appendTo($chooser);

                $('<option>')
                    .attr({value: key})
                    .text(text)
                    .appendTo($chooser_1)
            }
        }
    }

    $('<br>')
        .appendTo($chooser_holder);

    $('<button>')
        .text("Random New Avatar")
        .on('click', function(){
            seed = parseInt(Math.random() * 300000);
            _.each(avatars,function(av){
                var face_options = av.getSeed();
                face_options.rand_seed = seed;
                av.face_options = null;
                av.drawOrRedraw(face_options);

                $chooser.val('');
            });
        })
        .appendTo($chooser_holder)

}
function show_setting_options (chooser_id, chooser_main_id, setting_name){
    var $chooser_select = $('#'+ chooser_id);
    $chooser_select.find('option')
        .remove()
        .end();

    $('<option>')
        .attr({value: ''})
        .text(' -- Set Value --')
        .appendTo($chooser_select);


    var data_items = data_options[setting_name] || [];
    _.each(data_items, function(item_name) {
        $('<option>')
            .attr({value: item_name})
            .text(item_name)
            .appendTo($chooser_select)
    });
    $chooser_select.off('change');
    $chooser_select.on('change', function(){
//        //TODO: add second attr

        var setting = $(this).val();
        var option = $('#'+chooser_main_id).val();
        if (_.str.endsWith(option,'_options')) {
            option = option.substr(0, option.length - '_options'.length);
        }

        var settings = {};
        settings[option] = setting;

        var range_val = $('#option_range_select').val();
        explore_options(range_val, settings);

    })
}

function explore_options(options_name, forced_attributes) {

    var data_items = data_options[options_name] || [];
    _.each(avatars, function(avatar){
        avatar.erase();
    });
    avatars = [];

    var option = options_name;
    if (_.str.endsWith(option,'_options')) {
        option = option.substr(0, option.length - '_options'.length);
    }

    //For each of the options, modify the rendering instructions, and draw a template
    _.each(data_items, function(item_name, i){

        var avatar_options = forced_attributes || {};
        avatar_options['rand_seed'] = seed;
        avatar_options[option] = item_name;
        avatar_options['text'] = item_name; //Pass this to a decoration

        var x = (i % 6) * 170;
        var y = Math.floor(i / 6) * 230;

        var av = new Avatar(avatar_options, {canvas_name: 'avatar_canvas', height:200, width:160, x:x, y:y});
        avatars.push(av);

        //On every click, generate a new random seed for each face
        av.registerEvent('face', function (avatar) {
             var text = " : new Avatar(" + av.getSeed(true)+ ");";
             $('#avatar_name').text(text);

         }, 'click');

    });
}