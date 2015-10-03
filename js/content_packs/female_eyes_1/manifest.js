var content_pack_data = {
    image: '../js/content_packs/female_eyes_1/woman-eyes-collection-vector-illustration-8573624.jpg',
    frames: [
        {name: '1 hazel eyes with medium lashes', x: 39, y: 58, width: 617, height: 194, filter: {},
            coordinates: [
                {point: 'left eye center', x: 169, y: 180},
                {point: 'right eye center', x: 507, y: 180},
                {point: 'eyebrow midpoint', x: 310, y: 90},
                {point: 'left eyebrow innermost', x: 292, y: 116}
            ],
            zones: [
                {x: 51, y: 64, width: 560, height: 64, color: 'hair_color'}
            ]
        },
        {name: '2 grey eyes with thick eyebrows', x: 72, y: 260, width: 562, height: 176, filter: {},
            coordinates: [
                {point: 'left eye center', x: 173, y: 393},
                {point: 'right eye center', x: 519, y: 393},
                {point: 'eyebrow midpoint', x: 352, y: 320},
                {point: 'left eyebrow innermost', x: 241, y: 340}
            ],
            zones: [
                {x: 72, y: 260, width: 562, height: 89, color: 'hair_color'}
            ]
        },
        {name: '3 red eyes with medium eyebrows', x: 49, y: 500, width: 571, height: 156, filter: {},
            coordinates: [
                {point: 'left eye center', x: 178, y: 606},
                {point: 'right eye center', x: 500, y: 606},
                {point: 'eyebrow midpoint', x: 340, y: 521},
                {point: 'left eyebrow innermost', x: 274, y: 544}
            ],
            zones: [
                {x: 49, y: 500, width: 571, height: 55, color: 'hair_color'}
            ]
        },
        {name: '4 grey eyes with thin eyebrows', x: 78, y: 706, width: 519, height: 148, filter: {},
            coordinates: [
                {point: 'left eye center', x: 180, y: 796},
                {point: 'right eye center', x: 487, y: 796},
                {point: 'eyebrow midpoint', x: 327, y: 715},
                {point: 'left eyebrow innermost', x: 253, y: 748}
            ],
            zones: [
                {x: 78, y: 706, width: 519, height: 46, color: 'hair_color'}
            ]
        },
        {name: '5 light green eyes with thin eyebrows', x: 723, y: 79, width: 526, height: 132, filter: {},
            coordinates: [
                {point: 'left eye center', x: 830, y: 179},
                {point: 'right eye center', x: 1152, y: 179},
                {point: 'eyebrow midpoint', x: 988, y: 110},
                {point: 'left eyebrow innermost', x: 926, y: 121}
            ],
            zones: [
                {x: 723, y: 79, width: 526, height: 51, color: 'hair_color'}
            ]
        },
        {name: '6 light blue eyes with thin eyebrows', x: 717, y: 260, width: 533, height: 188, filter: {},
            coordinates: [
                {point: 'left eye center', x: 825, y: 390},
                {point: 'right eye center', x: 1128, y: 388},
                {point: 'eyebrow midpoint', x: 980, y: 300},
                {point: 'left eyebrow innermost', x: 914, y: 337}
            ],
            zones: [
                {x: 717, y: 260, width: 533, height: 81, color: 'hair_color'}
            ]
        },
        {name: '7 brown eyes with diamond eyebrows', x: 715, y: 481, width: 542, height: 172, filter: {},
            coordinates: [
                {point: 'left eye center', x: 818, y: 599},
                {point: 'right eye center', x: 1126, y: 597},
                {point: 'eyebrow midpoint', x: 988, y: 509},
                {point: 'left eyebrow innermost', x: 895, y: 544}
            ],
            zones: [
                {x: 715, y: 481, width: 542, height: 66, color: 'hair_color'}
            ]
        },
        {name: '8 bright green eyes with thin round eyebrows', x: 708, y: 676, width: 541, height: 166, filter: {},
            coordinates: [
                {point: 'left eye center', x: 809, y: 790},
                {point: 'right eye center', x: 1126, y: 788},
                {point: 'eyebrow midpoint', x: 965, y: 705},
                {point: 'left eyebrow innermost', x: 895, y: 544}
            ],
            zones: [
                {x: 708, y: 676, width: 541, height: 74, color: 'hair_color'}
            ]
        }
    ],
    animations: {},
    removeBackgroundColor: 'white',
    removeBackgroundNoise: 4
};

new Avatar('register_content_pack', 'female_eyes_1', {
    style: 'lines', replace_features: ['eyes'], use_frequency: 0.5, filter: {gender: 'Female'},
//    custom_renderer: function (face_zones, avatar, pack, frame) {},

    data: content_pack_data
});

