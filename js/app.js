var firstNames = "Bob,Thomas,William,Waldo,Michael,Kicaid,Luccio,Johny,Donald,Morgan,Mouse,Sanya,Merlin,Rashid,Joseph".split(",");
var lastNames = "Conestoga,Mariner,Observer,Odyssey,Pioneer,Ranger,Scout,Surveyor,Trailblazer".split(",");

$(document).ready(function () {
    var $canvas = $('canvas');
    var width = $canvas.width();
    var height = $canvas.height();
    var size = 90;

    $canvas.width($(document).width());
    $canvas.height($(document).height() - 90);

    function new_face() {
        av1.removeFromStage();
        var seed = av1.face_options.rand_seed++;
        console.log(seed);
        av1 = new Avatar({name: 'John Doe', rand_seed: seed}, {canvas_name: 'demoCanvas', face_click: new_face}, 'demoCanvas');
    }

    var av1 = new Avatar({rand_seed: 241, name: 'John Doe'}, {canvas_name: 'demoCanvas', face_click: new_face});

    for (var x = 320; x < width - (size / 1.5); x += (size / 1.5)) {
        for (var y = 0; y < height - (size / 2); y += size) {
            var name = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];

            new Avatar({name: name}, {size: size - 8, x: x, y: y}, 'demoCanvas');
        }
    }

});