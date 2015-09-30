var av1, avatars = [];
var time_taken, time_average;
var time_taken_2;
$(document).ready(function () {
    var timing_start = window.performance.now();

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
            var timing_start = window.performance.now();

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


            //Measure time drawn
            time_taken = av1.lastTimeDrawn();
            for (var a = 0; a < avatars.length; a++) {
                time_taken += avatars[a].lastTimeDrawn();
            }
            time_average = time_taken / (avatars.length + 1);
            var string = "Drawing Time Total: " + Helpers.round(time_taken,5) + ", average: " + Helpers.round(time_average,5) + "ms";
            console.log(string);

            var timing_end = window.performance.now();
            var time_taken_2 = timing_end - timing_start;
            time_average = time_taken_2 / (avatars.length + 1);
            string = "Drawing Time Total (outside .js): " + time_taken_2 + ", average: " + time_average + "ms, difference: " + (time_taken_2 - time_taken);
            console.log(string);


        }, 'click');


        av1.registerEvent('face', function (avatar) {
            var text = avatar.face_options.name || "Avatar";
            text += " : new Avatar({rand_seed: " + avatar.initialization_seed + ", age:" + avatar.face_options.age + "});";
            $('#avatar_name').text(text);
        }, 'mouseover');
    }

    function draw_others() {
        var age = 1;
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
    }
    setTimeout(draw_others, 1000);

    //Measure drawing time from within each avatar
    time_taken = av1.lastTimeDrawn();
    for (var a = 0; a < avatars.length; a++) {
        time_taken += avatars[a].lastTimeDrawn();
    }
    time_average = time_taken / (avatars.length + 1);
    var string = "Drawing Time Total: " + Helpers.round(time_taken,5) + ", average: " + Helpers.round(time_average,5) + "ms";
    console.log(string);
    $('#avatar_name').text(string);

    //Measure again from outside the avatars to double-check accuracy (should take 10ms or so more for non-library stuff)
    var timing_end = window.performance.now();
    time_taken_2 = timing_end - timing_start;
    time_average = time_taken_2 / (avatars.length + 1);
    string = "Drawing Time Total (measured from outside library): " + time_taken_2 + ", average: " + time_average + "ms, difference: " + (time_taken_2 - time_taken);
    console.log(string);

});