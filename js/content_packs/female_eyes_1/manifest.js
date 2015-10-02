var content_pack_data = {
    image: '../js/content_packs/female_eyes_1/woman-eyes-collection-vector-illustration-8573624.jpg',
    frames: [
        {name: 'hazel eyes with medium lashes', x: 39, y: 58, width: 617, height: 194, filter:{},
            coordinates: [
                {point: 'left eye center', x: 169, y: 180},
                {point: 'right eye center', x: 507, y: 180},
                {point: 'eyebrow midpoint', x:359, y: 119},
                {point: 'left eyebrow innermost', x: 292, y: 116}
            ]
        }
    ],
    animations: {},
    removeBackgroundColor: 'white',
    removeBackgroundNoise: 20
};

new Avatar('register_content_pack', 'female_eyes_1', {
    style: 'lines', replace_features: ['eyes'], use_frequency: 0.5, filter: {gender: 'Female'},
//    custom_renderer: function (face_zones, avatar, pack, frame) {},

    data: content_pack_data
});

