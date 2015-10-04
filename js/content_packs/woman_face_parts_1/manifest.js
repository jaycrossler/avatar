var image = '../js/content_packs/woman_face_parts_1/woman-face-parts-eye-glasses-hat-lips-hair-head-character-40398911.jpg'
var content_pack_data_glasses = {
    image: image,
    frames: [
        {name: '1 round rims', x: 18, y: 292, width: 160, height: 72, filter: {},
         coordinates: [
             {point: 'left eye center', x: 60, y: 332},
             {point: 'right eye center', x: 140, y: 333},
             {point: 'eyebrow midpoint', x: 100, y: 311}
         ], zones: []
        },
        {name: '2 horn rimmed', x: 204, y: 296, width: 170, height: 65, filter: {},
         coordinates: [
             {point: 'left eye center', x: 249, y: 332},
             {point: 'right eye center', x: 332, y: 332},
             {point: 'eyebrow midpoint', x: 289, y: 309}
         ], zones: []
        },
        {name: '3 goggles', x: 386, y: 307, width: 155, height: 61, filter: {},
         coordinates: [
             {point: 'left eye center', x: 424, y: 337},
             {point: 'right eye center', x: 501, y: 339},
             {point: 'eyebrow midpoint', x: 464, y: 309}
         ], zones: []
        },
    ],
    animations: {},
    removeBackgroundColor: '#white',
    removeBackgroundNoise: 20
};

new Avatar('register_content_pack', 'woman_face_parts_1_glasses', {
    style: 'lines', replace_features: ['glasses'], use_frequency: 1, filter: {},
    data: content_pack_data_glasses, show_reference_points: false
});



var content_pack_data_eyes = {
    image: image,
    frames: [

    ],
    animations: {},
    removeBackgroundColor: '#white',
    removeBackgroundNoise: 20
};

//new Avatar('register_content_pack', 'woman_face_parts_1_eyes', {
//    style: 'lines', replace_features: ['eyes'], use_frequency:.5, filter: {gender: 'Female'},
//    data: content_pack_data_eyes, show_reference_points: false
//});


