var seed;
var av;
var height;

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
        $avatar_name.text("x=" + pos.x + " : y=" + pos.y);
    }

    var hide_title = Helpers.getQueryVariable("hide") || false;
    if (hide_title) {
        $avatar_name.hide();
        $seed_number.hide();
        $("#seed_number_label").hide();
        $("body").css({margin: '0px'});
    } else {
        canvas.addEventListener('mousemove', draw, false);
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
        av = new Avatar({rand_seed: seed}, {canvas_name: $canvas, x: 0});
        av.unregisterEvent('all');
        av.registerEvent('face', function (avatar) {
            seed = parseInt(Math.random() * 300000);
            $seed_number.val(seed);

            avatar.face_options = null;
            avatar.drawOrRedraw({rand_seed: seed});

            var text = avatar.face_options.name || "Avatar";
            text += " : new Avatar({rand_seed: " + avatar.initialization_seed + "});";
            $avatar_name.text(text);
        });
    }

    $seed_number.on('keypress', generateAvatar);

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
        {feature: "mouth", style: "lines"}, //NOTE: Shown twice to predraw positions
        {feature: "wrinkles", style: "lines"}, //Uses: face, left eye, right eye, lips, full nose, chin top line
        {feature: "beard", style: "lines"}, //Uses: face, left eye
        {feature: "mouth", style: "lines"},
        {feature: "mustache", style: "lines"},
        {feature: "eyes", style: "lines"},
        {feature: "hair", style: "lines"}, //Uses: face, left eye
        {feature: "ears", style: "lines"}
    ];

    generateAvatar();
});