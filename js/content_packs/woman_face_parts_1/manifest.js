var image = '../js/content_packs/woman_face_parts_1/woman-face-parts-eye-glasses-hat-lips-hair-head-character-40398911.jpg'
var content_pack_data_glasses = {
    image: image,
    frames: [
        {name: '1 round rims', x: 18, y: 292, width: 160, height: 72, filter: {},
            coordinates: [
                {point: 'left eye center', x: 65, y: 332},
                {point: 'right eye center', x: 135, y: 333},
                {point: 'eyebrow midpoint', x: 100, y: 305}
            ], zones: []
        },
        {name: '2 horn rimmed', x: 204, y: 296, width: 170, height: 65, filter: {},
            coordinates: [
                {point: 'left eye center', x: 254, y: 332},
                {point: 'right eye center', x: 327, y: 332},
                {point: 'eyebrow midpoint', x: 289, y: 309}
            ], zones: []
        },
        {name: '3 goggles', x: 386, y: 307, width: 155, height: 61, filter: {},
            coordinates: [
                {point: 'left eye center', x: 429, y: 337},
                {point: 'right eye center', x: 496, y: 339},
                {point: 'eyebrow midpoint', x: 464, y: 309}
            ], zones: []
        },
        {name: '4 wide glasses', x: 554, y: 289, width: 180, height: 60, filter: {},
            coordinates: [
                {point: 'left eye center', x: 603, y: 320},
                {point: 'right eye center', x: 685, y: 321},
                {point: 'eyebrow midpoint', x: 645, y: 304}
            ], zones: []
        },
        {name: '5 pointey-edged glasses', x: 9, y: 375, width: 183, height: 56, filter: {},
            coordinates: [
                {point: 'left eye center', x: 65, y: 404},
                {point: 'right eye center', x: 136, y: 404},
                {point: 'eyebrow midpoint', x: 104, y: 385}
            ], zones: []
        },
        {name: '6 D-shaped rims', x: 216, y: 371, width: 149, height: 62, filter: {},
            coordinates: [
                {point: 'left eye center', x: 257, y: 403},
                {point: 'right eye center', x: 328, y: 404},
                {point: 'eyebrow midpoint', x: 290, y: 380}
            ], zones: []
        },

        {name: '7 boxy rims', x: 384, y: 373, width: 150, height: 63, filter: {},
            coordinates: [
                {point: 'left eye center', x: 422, y: 405},
                {point: 'right eye center', x: 491, y: 404},
                {point: 'eyebrow midpoint', x: 457, y: 380}
            ], zones: []
        },
        {name: '8 oval glasses', x: 565, y: 364, width: 159, height: 64, filter: {},
            coordinates: [
                {point: 'left eye center', x: 611, y: 396},
                {point: 'right eye center', x: 685, y: 397},
                {point: 'eyebrow midpoint', x: 645, y: 369}
            ], zones: []
        },
        {name: '9 v-like rims', x: 744, y: 358, width: 170, height: 63, filter: {},
            coordinates: [
                {point: 'left eye center', x: 793, y: 389},
                {point: 'right eye center', x: 869, y: 389},
                {point: 'eyebrow midpoint', x: 829, y: 364}
            ], zones: []
        }
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
        {name: '2 surprised eyes', x: 280, y: 32, width: 206, height: 72, filter: {},
            coordinates: [
                {point: 'left eye center', x: 326, y: 85},
                {point: 'right eye center', x: 438, y: 85},
                {point: 'eyebrow midpoint', x: 378, y: 51}
            ], zones: []
        },
        {name: '3 arched thick brows', x: 540, y: 24, width: 225, height: 77, filter: {},
            coordinates: [
                {point: 'left eye center', x: 590, y: 79},
                {point: 'right eye center', x: 714, y: 81},
                {point: 'eyebrow midpoint', x: 653, y: 63}
            ], zones: []
        },
        {name: '4 squinted thick eyes', x: 21, y: 108, width: 216, height: 75, filter: {},
            coordinates: [
                {point: 'left eye center', x: 68, y: 171},
                {point: 'right eye center', x: 190, y: 169},
                {point: 'eyebrow midpoint', x: 130, y: 147}
            ], zones: []
        },
        {name: '5 wide lashes with thick brows', x: 269, y: 121, width: 227, height: 62, filter: {},
            coordinates: [
                {point: 'left eye center', x: 318, y: 168},
                {point: 'right eye center', x: 449, y: 167},
                {point: 'eyebrow midpoint', x: 384, y: 148}
            ], zones: []
        },
        {name: '6 thick brows with many eyelashes', x: 537, y: 121, width: 224, height: 67, filter: {},
            coordinates: [
                {point: 'left eye center', x: 593, y: 168},
                {point: 'right eye center', x: 712, y: 169},
                {point: 'eyebrow midpoint', x: 652, y: 141}
            ], zones: []
        },
        {name: '7 wide eyes with thick brows', x: 18, y: 200, width: 228, height: 67, filter: {},
            coordinates: [
                {point: 'left eye center', x: 72, y: 251},
                {point: 'right eye center', x: 194, y: 251},
                {point: 'eyebrow midpoint', x: 132, y: 229}
            ], zones: []
        },
        {name: '8 pointy almond eyes', x: 272, y: 204, width: 224, height: 67, filter: {},
            coordinates: [
                {point: 'left eye center', x: 325, y: 257},
                {point: 'right eye center', x: 440, y: 257},
                {point: 'eyebrow midpoint', x: 380, y: 221}
            ], zones: []
        },
        {name: '9 upturned eyes', x: 534, y: 205, width: 227, height: 72, filter: {},
            coordinates: [
                {point: 'left eye center', x: 586, y: 257},
                {point: 'right eye center', x: 714, y: 257},
                {point: 'eyebrow midpoint', x: 648, y: 227}
            ], zones: []
        }
    ],
    animations: {},
    removeBackgroundColor: '#white',
    removeBackgroundNoise: 20
};

new Avatar('register_content_pack', 'woman_face_parts_1_eyes', {
    style: 'lines', replace_features: ['eyes'], use_frequency: .5, filter: {gender: 'Female'},
    data: content_pack_data_eyes, show_reference_points: false
});
