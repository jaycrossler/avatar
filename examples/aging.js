var av1;
$(document).ready(function () {
    //Pull a pointer to the current avatar human template
    var AvatarRace = new Avatar('get_linked_template', 'Human');

    //Take out any existing decorations
    AvatarRace.rendering_order = _.filter(AvatarRace.rendering_order, function (dec) {
        return !dec.decoration
    });

    //Add a new text decoration that shows the age
    AvatarRace.rendering_order.push({decoration: "age-plate", type: 'rectangle', height: 12, docked: 'bottom', forceInBounds: true, font_size: 8,
        text: 'Age: {{age}}', text_color: 'black', line_color: 'brown', fill_color: 'white', alpha: 0.8});

    //Create a random seed
    var seed = parseInt(Math.random() * 300000);

    //Build a new avatar and set it up
    av1 = new Avatar({rand_seed: seed, age: 1}, {canvas_name: 'demoCanvas'});
    av1.registerEvent('face', function (avatar) {
        seed = Helpers.randInt(300000);

        var text = avatar.face_options.name || "Avatar";
        var age_of = avatar.face_options.age || 20;
        text += " : new Avatar({rand_seed: " + seed + "});";
        $('#avatar_name').text(text);

        av1.face_options = null;
        av1.drawOrRedraw({rand_seed: seed, age: age_of});

    }, 'click');

    function draw_next_age() {
        var age_of = av1.face_options.age || 20;
        if (age_of > 120) age_of = 1;

        age_of++;
        av1 = new Avatar({rand_seed: seed, age: age_of}, {canvas_name: 'demoCanvas', clear_before_draw:true});

        setTimeout(draw_next_age, 300);
    }
    setTimeout(draw_next_age, 300);

});