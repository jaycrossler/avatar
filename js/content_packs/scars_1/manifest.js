var content_pack_data = {
    image: '../js/content_packs/scars_1/scars1-tran.png',
    frames: [

        {name: 'sewn right cheek wound', x: 41, y: 12, width: 253, height: 101, filter: {},
         coordinates: [
             {point: 'right mouth wedge', x: 49, y: 135},
             {point: 'right cheek', x: 290, y: 95},
             {point: 'face boundary #1', x: 206, y: 0}
         ], zones: []
        },

        {name: 'sewn left cheek wound', x: 41, y: 12, width: 253, height: 101, filter: {},
         coordinates: [
             {point: 'left mouth wedge', x: 49, y: 135},
             {point: 'left cheek', x: 290, y: 95},
             {point: 'face boundary #7', x: 206, y: 0}
         ], zones: []
        }
    ]
};

new Avatar('register_content_pack', 'scars_1', {
    style: 'lines', replace_features: ['scar'], use_frequency: 0.5, filter: {},
    data: content_pack_data
});

