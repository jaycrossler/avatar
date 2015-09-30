var av1;
$(document).ready(function () {
    var $canvas = $('canvas');
    var width = $canvas.width();
    var height = $canvas.height();
    var size = 102;

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
    av1 = new Avatar({rand_seed: seed, age: 100}, {canvas_name: 'demoCanvas'});
    setup_main_avatar();

    function setup_main_avatar() {
        av1.unregisterEvent('all');

        av1.registerEvent('face', function (avatar) {
            seed = Helpers.randInt(300000);

            var text = avatar.face_options.name || "Avatar";
            var age_of = avatar.face_options.age || "Avatar";
            text += " : new Avatar({rand_seed: " + seed + ", age:" + age_of + "});";
            $('#avatar_name').text(text);

            av1.face_options = null;
            av1.drawOrRedraw({rand_seed: seed, age: age_of});

            _.each(avatars, function (avatar_mini) {
                var age_of = avatar_mini.face_options.age || "Avatar";
                avatar_mini.face_options = null;
                avatar_mini.drawOrRedraw({rand_seed: seed, age: age_of});
            });

        }, 'click');


        av1.registerEvent('face', function (avatar) {
            var text = avatar.face_options.name || "Avatar";
            text += " : new Avatar({rand_seed: " + avatar.initialization_seed + ", age:" + age + "});";
            $('#avatar_name').text(text);
        }, 'mouseover');
    }


    var age = 1;
    var avatars = [];
    for (var y = 0; y < height - (size / 2); y += size) {
        for (var x = 320; x < width - (size / 1.5); x += (size / 1.5)) {

            var avatar = new Avatar({age: age, rand_seed: seed}, {size: size * .9, x: x, y: y}, 'demoCanvas');
            avatar.registerEvent('face', function (avatar) {
                //Change the large avatar
                var age_of = avatar.face_options.age;
                av1.face_options = null;
                av1.drawOrRedraw({rand_seed: seed, age: age_of});
                setup_main_avatar();

            });
            avatars.push(avatar);

            age += 3;
        }
    }
});