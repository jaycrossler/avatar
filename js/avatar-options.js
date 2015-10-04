(function (AvatarClass) {

    var _face_options = {
        style: 'lines',
        race: 'Human',
        rand_seed: 0,

        //'Living' settings that can change over time
        age: 30,
        era: 'Industrial',
        thickness: 0,
        cleanliness: 0,

        hair_style: null,
        hair_pattern: null,
        hair_texture: 'Smooth',
        hair_color: null,

        beard_color: null,
        beard_style: null,
        stubble_style: null,
        mustache_style: null,
        mustache_width: null,
        mustache_height: null,
        acne_style: null,
        acne_amount: null,
        skin_texture: 'Normal',
        teeth_condition: 'Normal',
        lip_color: null,

        emotionality: 0,
        emotion_shown: 'none', //TODO: Have an array of current emotions?
        tattoos: [],
        jewelry: [],
        scars: [],

        //DNA settings that don't change easily
        gender: null,
        height: 0,

        skin_shade_tint: null,
        skin_shade: null,
        skin_colors: null,
        face_shape: null,
        skull_thickness: 'Normal',
        chin_divot: null,
        chin_shape: null,

        neck_size: null,

        eye_color: null,
        eye_shape: null,
        eye_spacing: null,
        eye_size: null,
        eye_rotation: null,
        eyelid_shape: null,
        eye_cloudiness: null,
        eyebrow_shape: null,
        pupil_color: null,
        eye_sunken: null,

        head_size: 'Normal',
        hairiness: null,
        forehead_height: null,
        hair_color_roots: null,

        nose_shape: null,
        nose_size: null,
        nose_height: null,

        teeth_shape: 'Normal',
        lip_shape: null,
        mouth_height: null,
        mouth_left_upturn: null,
        mouth_right_upturn: null,
        mouth_width: null,
        mouth_upturn: null,
        mouth_downturn: null,
        lip_bottom_height: null,
        lip_top_height: null,
        lip_bottom_bottom: null,
        lip_top_top: null,

        ear_shape: null,
        ear_thickness: null,
        ear_lobe_left: null,
        ear_lobe_right: null,

        wrinkle_pattern_mouth: null,
        wrinkle_mouth_width: null,
        wrinkle_mouth_height: null,
        wrinkle_resistance: null

    };

    var _human_options = {
        rendering_order: [
            {decoration: "box-behind"},
            {feature: "shoulders", style: "lines"},
            {feature: "neck", style: "lines"},
            {feature: "face", style: "lines"},
            {feature: "eye_position", style: "lines"},
            {feature: "nose", style: "lines"}, //Uses: right eye intermost
            {feature: "chin", style: "lines"}, //Uses: chin mid line, face
            {feature: "mouth", style: "lines", hide:true}, //NOTE: Shown twice to predraw positions
            {feature: "wrinkles", style: "lines"}, //Uses: face, left eye, right eye, lips, full nose, chin top line
            {feature: "beard", style: "lines"}, //Uses: face, left eye
            {feature: "mouth", style: "lines"},
            {feature: "mustache", style: "lines"},
            {feature: "eyes", style: "lines"},
            {feature: "hair", style: "lines"}, //Uses: face, left eye
            {feature: "ears", style: "lines"},
            {decoration: "name-plate"}
        ],
        use_content_packs: ['all'],

        //If Preset, then use one of the skin_color_options and change tint, otherwise calculate by tint and lightness
        skin_shade_options: "Light,Dark,Preset".split(","),
        skin_shade_tint_options: "Darkest,Darker,Dark,Very Low,Low,Less,Below,Reduce,Raised,Above,More,High,Very High,Bright,Brighter,Brightest".split(","),
        skin_colors_options: [
            {name: 'Fair', highlights: 'rgb(254,202,182)', skin: 'rgb(245,185,158)', cheek: 'rgb(246,171,142)', darkflesh: 'rgb(217,118,76)', deepshadow: 'rgb(202,168,110'},
            {name: 'Brown', highlights: 'rgb(229,144,90)', skin: 'rgb(228,131,86)', cheek: ' rgb(178,85,44)', darkflesh: 'rgb(143,70,29)', deepshadow: 'rgb(152,57,17'},
            {name: 'Tanned', highlights: 'rgb(245,194,151)', skin: 'rgb(234,154,95)', cheek: 'rgb(208,110,56)', darkflesh: 'rgb(168,66,17)', deepshadow: 'rgb(147,68,27'},
            {name: 'White', highlights: 'rgb(250,220,196)', skin: 'rgb(245,187,149)', cheek: 'rgb(239,165,128)', darkflesh: 'rgb(203,137,103)', deepshadow: 'rgb(168,102,68'},
            {name: 'Medium', highlights: 'rgb(247,188,154)', skin: 'rgb(243,160,120)', cheek: 'rgb(213,114,75)', darkflesh: 'rgb(154,79,48)', deepshadow: 'rgb(127,67,41'},
            {name: 'Yellow', highlights: 'rgb(255,218,179)', skin: 'rgb(250,187,134)', cheek: 'rgb(244,159,104)', darkflesh: 'rgb(189,110,46)', deepshadow: 'rgb(138,67,3'},
            {name: 'Pink', highlights: 'rgb(253,196,179)', skin: 'rgb(245,158,113)', cheek: 'rgb(236,134,86)', darkflesh: 'rgb(182,88,34)', deepshadow: 'rgb(143,60,18'},
            {name: 'Bronzed', highlights: 'rgb(236,162,113)', skin: 'rgb(233,132,86)', cheek: 'rgb(219,116,75)', darkflesh: 'rgb(205,110,66)', deepshadow: 'rgb(173,83,46'},
            {name: 'Light Brown', highlights: 'rgb(242,207,175)', skin: 'rgb(215,159,102)', cheek: 'rgb(208,138,86)', darkflesh: 'rgb(195,134,80)', deepshadow: 'rgb(168,112,63'},
            {name: 'Peach', highlights: 'rgb(247,168,137)', skin: 'rgb(221,132,98)', cheek: 'rgb(183,90,57)', darkflesh: 'rgb(165,87,51)', deepshadow: 'rgb(105,29,15'},
            {name: 'Black', highlights: 'rgb(140,120,110)', skin: 'rgb(160,90,66)', cheek: 'rgb(140,80,40)', darkflesh: 'rgb(120,90,29)', deepshadow: 'rgb(30,30,30'},
            {name: 'Deep Black', highlights: 'rgb(40,40,50)', skin: 'rgb(80,80,80)', cheek: 'rgb(70,70,70)', darkflesh: 'rgb(80,70,29)', deepshadow: 'rgb(30,30,30'}
        ],

        gender_options: "Male,Female".split(","),
        thickness_options: [-1.5, -1, -.5, 0, .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6],  //TODO: Turn these to word options

        face_shape_options: "Oblong,Oval,Round,Rectangular,Square,Triangular,Diamond,Inverted Triangle,Heart".split(","),
        acne_style_options: "None,Very Light,Light,Medium,Heavy".split(","),
        acne_amount_options: 'None,Very Light,Light,Few,Some,Spattering,Speckled,Heavy,Very Heavy'.split(","),
        chin_divot_options: "Double,Small,Large,Smooth".split(","),
        chin_shape_options: "Pronounced,Smooth".split(","),

        hair_color_roots_options: "Midnight Black,Off Black,Darkest Brown,Medium Dark Brown,Chestnut Brown,Light Chestnut Brown,Dark Golden Brown,Light Golden Brown,Dark Honey Blond,Bleached Blond,Light Ash Blond,Light Ash Brown,Lightest Blond,Pale Golden Blond,Strawberry Blond,Light Auburn,Dark Auburn,Darkest Gray,Medium Gray,Light Gray,White Blond,Platinum Blond,Toasted Wheat,Melted Butter,Wheat Milk,Cake Two,Poor Jean,Shoe Brown,Cookie,Tree Bark,Russet Red,Terra Cotta".split(","), //Yellow,Brown,Black,White,Gray,Dark Brown,Dark Yellow,Red
        hair_style_options: "Bald,Droopy".split(","),
        hair_pattern_options: "Mid Bump,Side Part,Eye Droop,Receding,Bowl,Bowl with Peak,Bowl with Big Peak,Side Part2,Twin Peaks".split(","),
        hairiness_options: "Bald,Thin Hair,Thick Hair,Hairy,Fuzzy,Bearded,Covered in Hair,Fury".split(","), //TODO

        beard_color_options: "Hair,Black,Gray".split(","),
        beard_style_options: "None,Full Chin,Chin Warmer,Soup Catcher,Thin Chin Wrap,Thin Low Chin Wrap".split(","),
        mustache_style_options: "None,Propeller,Butterfly,Fu Manchu,Lower Dali,Dali,Sparrow,Zappa,Anchor,Copstash,Handlebar,Low Handlebar,Long Curled Handlebar,Curled Handlebar".split(","),
        mustache_width_options: "Small,Short,Medium,Long,Large".split(","),
        mustache_height_options: "Small,Short,Medium,Long,Large".split(","),
        stubble_style_options: "None,Light,Medium,Heavy".split(","),
        neck_size_options: "Thick,Concave".split(","),

        nose_shape_options: "Flat,Wide,Thin,Turned up/perky,Normal,Hooked down,Bulbous,Giant Nostrils".split(","),
        nose_size_options: "Tiny,Small,Normal,Large,Big,Giant,Huge".split(","),
        nose_height_options: "Low,Normal,Raised".split(","),

        eye_spacing_options: "Pinched,Thin,Normal,Wide".split(","),
        eye_size_options: "Small,Normal,Big".split(","),
        eye_shape_options: "Almond".split(","),
        eye_color_options: "Hazel,Amber,Green,Blue,Gray,Brown,Dark Brown,Black".split(","),
        eye_lids_options: "None,Smooth,Folded,Thick".split(","), //TODO
        eye_cloudiness_options: "Normal,Clear,Misty".split(","),
        eyebrow_shape_options: "Straight,Squiggle,Squiggle Flip,Slim,Lifted,Arch,Thick Arch,Caterpiller,Wide Caterpiller,Unibrow".split(","),
        eye_rotation_options: "Flat,Small,Medium,Large,Slanted".split(","),
        pupil_color_options: "Black".split(","),
        eye_sunken_options: "Cavernous,Deep,Dark,Light,Smooth,None".split(","),

        ear_shape_options: "Round".split(","),
        ear_thickness_options: "Wide,Normal,Big,Tall,Splayed".split(","),
        ear_lobe_left_options: "Hanging,Attached".split(","),
        ear_lobe_right_options: "Hanging,Attached,Same".split(","),

        mouth_height_options: "Low,Normal,Raised,High".split(","),
        mouth_left_upturn_options: "Down,Low,Normal,Raised,High".split(","),
        mouth_right_upturn_options: "Down,Low,Normal,Raised,High".split(","),
        mouth_width_options: "Wide,Big,Normal,Short,Small,Tiny".split(","),
        mouth_upturn_options: "Large,Short,Small,Tiny".split(","),
        mouth_downturn_options: "Large,Short,Small,Tiny".split(","),

        lip_color_options: "#f00,#e00,#d00,#c00,#f10,#f01,#b22,#944".split(","),
        lip_bottom_height_options: "Down,Low,Normal,Raised,High".split(","),
        lip_top_height_options: "Down,Low,Normal,Raised,High".split(","),
        lip_bottom_bottom_options: "Down,Low,Normal,Raised,High".split(","),
        lip_top_top_options: "Down,Low,Normal,Raised,High".split(","),
        lip_shape_options: "Puckered,Thin,Thick".split(","),

        wrinkle_pattern_mouth_options: "None,Gentle,Straight,Top,Middle,Bottom,Heavy".split(","),
        wrinkle_resistance_options: "Very Low,Low,Less,Below,Reduce,Raised,Above,More,High,Very High".split(","),
        wrinkle_mouth_width_options: "Far Out,Out,Middle,In,Far In".split(","),
        wrinkle_mouth_height_options: "Far Up,Up,Middle,Down,Far Down".split(","),

        forehead_height_options: "Under,Low,Less,Normal,Above,Raised,High,Floating".split(","),

        decorations: [
            {name: "box-behind", type: 'rectangle', p1: 'facezone topleft', p2: 'facezone bottomright',
                fill_color: 'blue', alpha: 0.3, line_color: 'light blue', size: '2', forceInBounds: true},
            {name: "name-plate", type: 'rectangle', height: 16, docked: 'bottom', forceInBounds: true, font_size: 9,
                text: '{{name}}', text_color: 'black', line_color: 'brown', fill_color: 'white', alpha: 0.8}
        ]
    };

    AvatarClass.initializeOptions(_face_options, _human_options);

})(Avatar);