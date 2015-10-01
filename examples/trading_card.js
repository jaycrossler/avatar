var firstNames_Male = "Bob,Thomas,William,Waldo,Michael,Kicaid,Johny,Donald,Morgan,Mouse,Sanya,Merlin,Rashid,Joseph".split(",");
var firstNames_Female = "Luccio,Jane,Jackie,Jasmine,Ashley,Betty,Deirdre,Fiona,Kelly".split(",");
var lastNames = "Mariner,Observer,Odyssey,Pioneer,Ranger,Scout,Surveyor,Trailer".split(",");

var seed;
var av;
var height;


$(document).ready(function () {
    var $card_holder = $("#card_holder");
    $card_holder
        .css({
            width: '536px', height: '750px',
            border: '4px solid black',
            textAlign: 'center',
            backgroundImage: 'url(../images/253726_unknowndepths_trading-card-game-template-02-2.jpg)'
        });

    var $canvas = $("<canvas>")
        .attr({width: 536, height: 600, id: 'avatar'})
        .css({width: 536, height: 600})
        .appendTo($card_holder);
    var canvas = $canvas[0];

    $('<div>')
        .css({
            width: '536px', height: '750px',
            position: 'absolute', top: 12, left: 13,
            pointerEvents: 'none',
            backgroundImage: 'url(../images/253726_unknowndepths_trading-card-game-template-overlay-half.png)'
        })
        .appendTo($card_holder);

    $('<div>')
        .css({
            position: 'absolute', top: 30, left: 90,
            fontSize: 100, fontWeight: 'bold',
            fontFamily: 'Times New Roman',
            pointerEvents: 'none', color: '#f00'
        })
        .text("Avatar.js")
        .appendTo($card_holder);


    var $name_plate = $('<div>')
        .css({
            top: 660,
            width: '536px',
            fontSize: 36,
            fontFamily: 'Times New Roman',
            pointerEvents: 'none', color: '#ff0',
            position:'absolute'
        })
        .text("John Doe")
        .appendTo($card_holder);


    var races = [];

    function setupRaces() {
        _.each(Avatar.getRaces(), function (race_name, i) {

            //Pull a pointer to the current avatar  template for that race
            var AvatarRace = new Avatar('get_linked_template', race_name);

            //Remove any existing decorations
            AvatarRace.rendering_order = _.filter(AvatarRace.rendering_order, function (dec) {
                return !dec.decoration
            });

            races.push(race_name);
        });
    }


    function name_from(gender) {
        var last = '';
        if (gender == "Male") {
            return firstNames_Male[Math.floor(Math.random() * firstNames_Male.length)] + " " + (last || lastNames[Math.floor(Math.random() * lastNames.length)]);
        } else {
            return firstNames_Female[Math.floor(Math.random() * firstNames_Female.length)] + " " + (last || lastNames[Math.floor(Math.random() * lastNames.length)]);
        }
    }

    function generateAvatar() {
        seed = parseInt(Math.random() * 300000);
        var race = races[Math.floor(Math.random() * races.length)];

        if(av) {
            av.face_options = null;
            av.erase();
        }
        av = new Avatar({rand_seed: seed, race:race}, {canvas_name: $canvas, x: 105, y: 140, height: 370});
        var name = name_from(av.face_options.gender);
        $name_plate.text(name);

        av.unregisterEvent('all');
        av.registerEvent('face', function (avatar) {
            seed = parseInt(Math.random() * 300000);
            race = races[Math.floor(Math.random() * races.length)];

            avatar.face_options = null;
            avatar.drawOrRedraw({rand_seed: seed, race:race});
            var name = name_from(av.face_options.gender);
            $name_plate.text(name);
        });
    }

//    //Pull a pointer to the current avatar template for that race
//    var AvatarRace = new Avatar('get_linked_template', 'Human');
//
//    AvatarRace.rendering_order = [
//        {feature: "shoulders", style: "lines"},
//        {feature: "neck", style: "lines"},
//        {feature: "face", style: "lines"},
//        {feature: "eye_position", style: "lines"},
//        {feature: "nose", style: "lines"}, //Uses: right eye innermost
//        {feature: "chin", style: "lines"}, //Uses: chin mid line, face
//        {feature: "mouth", style: "lines"}, //NOTE: Shown twice to predraw positions
//        {feature: "wrinkles", style: "lines"}, //Uses: face, left eye, right eye, lips, full nose, chin top line
//        {feature: "beard", style: "lines"}, //Uses: face, left eye
//        {feature: "mouth", style: "lines"},
//        {feature: "mustache", style: "lines"},
//        {feature: "eyes", style: "lines"},
//        {feature: "hair", style: "lines"}, //Uses: face, left eye
//        {feature: "ears", style: "lines"}
//    ];

    setupRaces();
    generateAvatar();

});