var firstNames = "Bob,Thomas,William,Waldo,Michael,Kicaid,Luccio,Johny,Donald,Morgan,Mouse,Sanya,Merlin,Rashid,Joseph".split(",");
var lastNames = "Conestoga,Mariner,Observer,Odyssey,Pioneer,Ranger,Scout,Surveyor,Trailblazer".split(",");

var av1;
$(document).ready(function () {
    var $canvas = $('canvas');
    var width = $canvas.width();
    var height = $canvas.height();
    var size = 130;

    $canvas.width($(document).width());
    $canvas.height($(document).height() - 90);

    var template = new Avatar('copy_data_template', 'Human');
    template.gender_options = ['Female'];
    template.skin_type_color_options = [
        {name: 'Fair', highlights: '40,202,30', skin: '50,185,50', cheek: '30,80,30', darkflesh: '20,60,20', deepshadow: '10,50,10'},
        {name: 'Dark', highlights: '80,80,80', skin: '80,185,70', cheek: '30,30,30', darkflesh: '20,20,20', deepshadow: '10,10,10'}
    ];
    av1 = new Avatar('set_data_template', 'Ogre', template);

    av1.drawOrRedraw({rand_seed: 241, name: 'John Doe', race:'Ogre'}, {canvas_name: 'demoCanvas'});
    setup_main_avatar();

    function setup_main_avatar() {
        av1.unregisterEvent('all');
        av1.registerEvent('face', function (avatar) {
            avatar.face_options = null;
            avatar.drawOrRedraw();

            var text = avatar.face_options.name || "Avatar";
            text += " : new Avatar({rand_seed: " + avatar.initialization_seed + "});";
            $('#avatar_name').text(text);

        });
        av1.registerEvent('face', function (avatar) {
            var text = avatar.face_options.name || "Avatar";
            text += " : new Avatar({rand_seed: " + avatar.initialization_seed + "});";
            $('#avatar_name').text(text);
        }, 'mouseover');
    }


    for (var x = 320; x < width - (size / 1.5); x += (size / 1.5)) {
        for (var y = 0; y < height - (size / 2); y += size) {
            var name = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
            var age = parseInt(Math.random() * 100);

            var avatar = new Avatar({name: name, age: age}, {size: size *.9, x: x, y: y}, 'demoCanvas');
            avatar.registerEvent('face', function(avatar){
                var seed = avatar.initialization_seed;
                var age = avatar.face_options.age;
                av1.face_options = null;
                av1.drawOrRedraw({rand_seed:seed});
                setup_main_avatar();
                avatar.face_options = null;
                avatar.drawOrRedraw({race:'Ogre', rand_seed:seed, age: age});
            });
            avatar.registerEvent('face', function(avatar){
                $('#avatar_name').text(avatar.face_options.name || "Avatar");
            }, 'mouseover');

        }
    }
});