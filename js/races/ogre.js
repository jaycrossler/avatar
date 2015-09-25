var ogreTemplate = new Avatar('copy_data_template', 'Human');

ogreTemplate.ear_shape_options.push('Pointed');

ogreTemplate.eye_color_options = ['Red', 'Pink', 'Purple', 'Yellow'];
ogreTemplate.eye_cloudiness_options = ['Pink', 'Blue', 'Misty'];

ogreTemplate.skin_colors_options = [
    {name: 'Fair', highlights: 'rgb(40,202,30)', skin: 'rgb(50,185,50)'},
    {name: 'Dark', highlights: 'rgb(80,80,80)', skin: 'rgb(80,185,70)'}
];

ogreTemplate.skin_shade_options = ['Preset'];

new Avatar('set_data_template', 'Ogre', ogreTemplate);
