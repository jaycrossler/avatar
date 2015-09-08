var avatars=[];
$(document).ready(function () {
    var seed = parseInt(Math.random() * 300000);


    //For each race, modify the rendering instructions, and draw a template
    _.each(Avatar.getRaces(), function(race_name, i){

        //Pull a pointer to the current avatar human template
        var AvatarRace = new Avatar('get_linked_template', race_name);

        //Take out any existing decorations
        AvatarRace.rendering_order = _.filter(AvatarRace.rendering_order, function(dec){return !dec.decoration});

        //Add a new text decoration that shows the race
        AvatarRace.rendering_order.push(
            {decoration: "race-plate", type: 'rectangle', height: 16, docked: 'bottom', forceInBounds: true, font_size: 9,
             text: 'Race: {{race}}', text_color: 'black', line_color: 'brown', fill_color: 'white', alpha: 0.8}
        );

        var $canvas = $("<canvas>")
            .attr({width: 320, height:400, id:'avatar_'+i})
            .css({width: 320, height:400})
            .appendTo($('#avatar_holder'));

        var av = new Avatar({rand_seed: seed, race: race_name, age: 38}, {canvas_name: $canvas});
        avatars.push(av);
    });
});