var firstNames_Male = "Bob,Thomas,William,Waldo,Michael,Kicaid,Johny,Donald,Morgan,Mouse,Sanya,Merlin,Rashid,Joseph".split(",");
var firstNames_Female = "Luccio,Jane,Jackie,Jasmine,Ashley,Betty,Deirdre,Fiona,Kelly".split(",");
var lastNames = "Mariner,Observer,Odyssey,Pioneer,Ranger,Scout,Surveyor,Trailer".split(",");

function name_from(gender, father_name) {
    var last;
    if (father_name && father_name.indexOf(" ") > 1) {
        last = father_name.split(" ")[1];
    }
    if (gender == "Male") {
        return firstNames_Male[Math.floor(Math.random() * firstNames_Male.length)] + " " + (last || lastNames[Math.floor(Math.random() * lastNames.length)]);
    } else {
        return firstNames_Female[Math.floor(Math.random() * firstNames_Female.length)] + " " + (last || lastNames[Math.floor(Math.random() * lastNames.length)]);
    }
}

function mix_options(mo, fo) {
    var new_options = {};
    for (var key in mo) {
        new_options[key] = (Math.random() < .5) ? mo[key] : fo[key];
    }
    new_options.name = name_from(new_options.gender, fo.name);
    new_options.rand_seed = parseInt(Math.random() * 300000);

    return new_options;
}

var avatars = [];
var seed_m, seed_f, av_m, av_f;
$(document).ready(function () {
    var $canvas_m = $('motherCanvas');
    var $canvas_f = $('fatherCanvas');

    var mr = $('#motherRace');
    var fr = $('#fatherRace');
    var mr_name = $('#motherName');
    var fr_name = $('#fatherName');

    _.each(Avatar.getRaces(), function (race_name, i) {
        $('<option>')
            .attr({value: race_name})
            .text(race_name)
            .appendTo(mr);
        $('<option>')
            .attr({value: race_name})
            .text(race_name)
            .appendTo(fr);
    });

    av_m = new Avatar('pointer');
    av_f = new Avatar('pointer');
    function buildMother() {
        seed_m = parseInt(Math.random() * 300000);
        var race_m = $('#motherRace').val() || 'Human';
        var mother_name = name_from("Female");

        av_m.face_options = null;
        av_m.drawOrRedraw({rand_seed: seed_m, race: race_m, age: 38, gender: 'Female', name: mother_name}, {canvas_name: $canvas_m});

        av_m.unregisterEvent('all');
        av_m.registerEvent('face', buildMother);

        mr_name.text(mother_name);

        buildChildren();
    }

    function buildFather() {
        seed_f = parseInt(Math.random() * 300000);
        var race_f = $('#fatherRace').val() || 'Human';
        var father_name = name_from("Male");

        av_f.face_options = null;
        av_f.drawOrRedraw({rand_seed: seed_f, race: race_f, age: 38, gender: 'Male', name: father_name}, {canvas_name: $canvas_f});

        av_f.unregisterEvent('all');
        av_f.registerEvent('face', buildFather);

        fr_name.text(father_name);

        buildChildren();
    }

    function buildChildren() {
        var mother_vars = av_m.face_options;
        var father_vars = av_f.face_options;
        var $children_canvas = $("#childrenCanvas");

        for (var i = 0; i < avatars.length; i++) {
            avatars[i].erase();
        }

        var kids_num = Helpers.randInt(5);
        var kid_age = 0;
        for (var c = 0; c < kids_num; c++) {
            var avatar_options = mix_options(mother_vars, father_vars);

            kid_age += Helpers.randInt(5);
            avatar_options.age = kid_age;

            var av = new Avatar(avatar_options, {canvas_name: $children_canvas, x: (200 * c)});
            avatars.push(av);
        }
    }

    buildMother();
    buildFather();
    mr.on('change', buildMother);
    fr.on('change', buildFather);

});