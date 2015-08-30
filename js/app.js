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

    av1 = new Avatar({rand_seed: 241, name: 'John Doe'}, {canvas_name: 'demoCanvas'});
    function setup_main_avatar() {
        av1.unregisterEvent('all');
        av1.registerEvent('face', function (avatar) {
            avatar.face_options = null;
            avatar.drawOrRedraw();
            console.log(avatar.face_options.rand_seed);
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

            var avatar = new Avatar({name: name}, {size: size *.9, x: x, y: y}, 'demoCanvas');
            avatar.registerEvent('face', function(avatar){
                av1.face_options = null;
                av1.drawOrRedraw({rand_seed:avatar.initialization_seed});
                setup_main_avatar();
            });
            avatar.registerEvent('face', function(avatar){
                $('#avatar_name').text(avatar.face_options.name || "Avatar");
            }, 'mouseover');

        }
    }
});