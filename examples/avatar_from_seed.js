var seed;
var av;
var height;

var augmentations = [
//    {feature: 'glasses', name: '3 goggles', options: {color: 'blue'}, ignore_filters:true},
//    {feature: 'scar', name: 'right cheek cut'}
];

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

$(document).ready(function () {
    height = Helpers.getQueryVariable("height") || 400;
    var width = parseInt(height * .8);

    var $canvas = $("<canvas>")
        .attr({width: width, height: height, id: 'avatar'})
        .css({width: width, height: height})
        .appendTo($('#avatar_holder'));

    var canvas = $canvas[0];
    var $avatar_name = $('#avatar_name');
    var $seed_number = $("#seed_number");

    function draw(e) {
        var pos = getMousePos(canvas, e);
        $avatar_name.text("x=" + parseInt(pos.x) + " : y=" + parseInt(pos.y));
    }

    var bg_color = Helpers.getQueryVariable("bg");
    if (bg_color) {
        $('body').css({backgroundColor:bg_color});
    }
    var hide_title = Helpers.getQueryVariable("hide") || false;
    if (hide_title) {
        $avatar_name.hide();
        $seed_number.hide();
        $('nav').hide();
        $("#seed_number_label").hide();
        $("#details").hide();
        $("#show_points").hide();
        $("body").css({margin: '0px'});
        $('#avatar_holder').css({margin: '0px'});
        $('.container').css({marginLeft:'0px',marginRight:'0px'})
    } else {
        canvas.addEventListener('mousemove', draw, false);
        $('#avatar_holder').css({margin: '40px 0px 0px 0px'});
    }
    $seed_number.val(Helpers.getQueryVariable("seed"));

    function generateAvatar() {
        seed = parseInt($seed_number.val());
        if (!seed) {
            seed = parseInt(Math.random() * 300000);
            $seed_number.val(seed);
        }

        if (av) {
            av.face_options = null;
            av.erase();
        }
        av = new Avatar({rand_seed: seed, augmentations: augmentations}, {canvas_name: $canvas, x: 0});
        var show_points = Helpers.getQueryVariable("points") || false;
        if (show_points){
            av._private_functions.highlight_named_points(av)
        }

        av.unregisterEvent('all');
        av.registerEvent('face', function (avatar) {
            seed = parseInt(Math.random() * 300000);
            $seed_number.val(seed);

            avatar.face_options = null;
            avatar.drawOrRedraw({rand_seed: seed, augmentations: augmentations});
            if (show_points){
                av._private_functions.highlight_named_points(av)
            }

            var text = avatar.face_options.name || "Avatar";
            text += " : new Avatar("+JSON.stringify(av.initialization_options)+");";
            $("#details").text(text);
        });
    }

    $seed_number.on('keypress', generateAvatar);

    $('#show_points').on('click', function(){
        av._private_functions.highlight_named_points(av)
    });

    //Pull a pointer to the current avatar  template for that race
    var AvatarRace = new Avatar('get_linked_template', 'Human');

    AvatarRace.rendering_order = [
//        {decoration: "box-behind"},
        {feature: "shoulders", style: "lines"},
        {feature: "neck", style: "lines"},
        {feature: "face", style: "lines"},
        {feature: "eye_position", style: "lines"},
        {feature: "nose", style: "lines"}, //Uses: right eye innermost
        {feature: "chin", style: "lines"}, //Uses: chin mid line, face
        {feature: "mouth", style: "lines", hide: true}, //NOTE: Shown twice to predraw positions
        {feature: "wrinkles", style: "lines"}, //Uses: face, left eye, right eye, lips, full nose, chin top line
        {feature: "beard", style: "lines"}, //Uses: face, left eye
        {feature: "mouth", style: "lines"},
        {feature: "mustache", style: "lines"},
        {feature: "eyes", style: "lines"},
        {feature: "hair", style: "lines"}, //Uses: face, left eye
        {feature: "ears", style: "lines"},
        {feature: "augmentations", style: "lines"}
    ];

    generateAvatar();
});