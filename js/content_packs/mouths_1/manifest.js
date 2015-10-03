var content_pack_data = {
    image: '../js/content_packs/mouths_1/25468547-vector-lips-and-mouth-silhouette-and-glossy-open-and-close-up-man-and-woman-face-parts.jpg',
    frames: [
        {name: '1 lips closed', x: 57, y: 70, width: 254, height: 126, filter: {},
            coordinates: [
                {point: 'left mouth wedge', x: 71, y: 98},
                {point: 'right mouth wedge', x: 296, y: 98},
                {point: 'mouth bottom middle', x: 184, y: 152}
            ],
            zones: [
                { all:true, color: 'lip_color'}
            ]
        },
        {name: '2 lips closed', x: 391, y: 66, width: 242, height: 131, filter: {},
            coordinates: [
                {point: 'left mouth wedge', x: 406, y: 91},
                {point: 'right mouth wedge', x: 618, y: 91},
                {point: 'mouth bottom middle', x: 510, y: 153}
            ],
            zones: [
                { all:true, color: 'lip_color'}
            ]
        },
        {name: '3 lips smiling', x: 675, y: 70, width: 267, height: 129, filter: {},
            coordinates: [
                {point: 'left mouth wedge', x: 690, y: 108},
                {point: 'right mouth wedge', x: 924, y: 108},
                {point: 'mouth bottom middle', x: 805, y: 158}
            ],
            zones: [
                { all:true, color: 'lip_color'}
            ]
        }
    ],
    animations: {},
    removeBackgroundColor: '#e0d9c8',
    removeBackgroundNoise: 20
};

new Avatar('register_content_pack', 'mouths_1', {
    style: 'lines', replace_features: ['mouth'], use_frequency: 0.5, filter: {},
    data: content_pack_data, show_reference_points: false
});

