var seed;
var av;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

$(document).ready(function () {
    var $canvas = $("<canvas>")
        .attr({width: 320, height:400, id:'avatar'})
        .css({width: 320, height:400})
        .appendTo($('#avatar_holder'));

    var canvas = $canvas[0];

    function draw(e) {
        var pos = getMousePos(canvas, e);
        $('#avatar_name').text("x=" + pos.x + " : y=" + pos.y);
    }
    canvas.addEventListener('mousemove', draw, false);


    var $seed_number = $("#seed_number");
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
        av = new Avatar({rand_seed: seed}, {height:300, canvas_name: $canvas});
    }

    $seed_number.on('keypress',generateAvatar);

    //Pull a pointer to the current avatar  template for that race
    var AvatarRace = new Avatar('get_linked_template', 'Human');

    AvatarRace.rendering_order = [
        {decoration:"box-behind"},
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
        {feature: "eyes", style: "lines"},
        {feature: "hair", style: "lines"}, //Uses: face, left eye
        {feature: "ears", style: "lines"}
    ];

    generateAvatar();
});