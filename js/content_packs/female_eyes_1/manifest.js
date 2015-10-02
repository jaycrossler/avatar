var content_pack_data = {
    image: 'woman-eyes-collection-vector-illustration-8573624.jpg',
    frames: [
        {name: 'hazel eyes with medium lashes', x: 39, y: 58, width: 580, height: 179, data: {},
            coordinates: [
                {point: 'left eye center', x: 169, y: 180},
                {point: 'right eye center', x: 507, y: 180},
                {point: 'left eyebrow inner', x: 292, y: 116}
            ]
        }
    ],
    animations: {},
    removeBackgroundColor: 'white',
    removeBackgroundNoise: 20
};

new Avatar('register_content_pack', 'female_eyes_1', {
    style: 'vector', replace_renderers: ['eyes'], only_use_this: false,
    filter: {gender: 'Female'},
    renderer: function (face_zones, avatar) {
        //TODO: Should this override or integrate with custom renderer?
    },
    data: content_pack_data
});

