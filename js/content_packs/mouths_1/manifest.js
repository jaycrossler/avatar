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
                { x: 57, y: 70, width: 254, height: 126, color: 'lip_color'}
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

