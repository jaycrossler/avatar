var content_pack_data = {
    image: '../js/content_packs/scars_1/scars1-tran.png',
    frames: [

        {name: 'sewn right cheek wound', x: 41, y: 12, width: 253, height: 101, filter: {},
            coordinates: [
                {point: 'right mouth wedge', x: 49, y: 135},
                {point: 'right cheek', x: 290, y: 95},
                {point: 'nose - face right point', x: 206, y: 0}
            ], zones: []
        },

        {name: 'sewn left cheek wound', x: 41, y: 12, width: 253, height: 101, filter: {},
            coordinates: [
                {point: 'left mouth wedge', x: 49, y: 135},
                {point: 'left cheek', x: 290, y: 95},
                {point: 'nose - face left point', x: 206, y: 0}
            ], zones: []
        },

        {name: 'bite mark right cheek', x: 433, y: 277, width: 148, height: 149, filter: {},
            coordinates: [
                {point: 'right mouth wedge', x: 300, y: 300},
                {point: 'right cheek', x: 578, y: 294},
                {point: 'nose - face right point', x: 571, y: 500}
            ], zones: []
        },
        {name: 'bite mark left cheek', x: 433, y: 277, width: 148, height: 149, filter: {},
            coordinates: [
                {point: 'left mouth wedge', x: 300, y: 300},
                {point: 'left cheek', x: 578, y: 294},
                {point: 'nose - face left point', x: 571, y: 500}
            ], zones: []
        },

        {name: 'bloody point right cheek', x: 437, y: 482, width: 152, height: 43, filter: {},
         coordinates: [
             {point: 'right mouth wedge', x: 569, y: 685},
             {point: 'nose - face right point', x: 671, y: 385},
             {point: 'mouth - face right point', x: 360, y: 379}
         ], zones: []
        },

        {name: 'bloody point right neck', x: 437, y: 482, width: 152, height: 43, filter: {},
         coordinates: [
             {point: 'middle neck adams apple', x: 680, y: 685},
             {point: 'mouth - face right point', x: 671, y: 335},
             {point: 'neck mid right', x: 360, y: 379}
         ], zones: []
        }

    ]
};

new Avatar('register_content_pack', 'scars_1', {
    style: 'lines', replace_features: ['scar'], use_frequency: 1, filter: {},
    data: content_pack_data
});

