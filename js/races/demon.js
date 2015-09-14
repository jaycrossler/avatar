var demonTemplate = new Avatar('copy_data_template', 'Human');

demonTemplate.eye_color_options = ['Red', 'Pink', 'Purple'];
demonTemplate.eye_cloudiness = ['Pink'];

demonTemplate.hair_style_options = ['Bald'];
demonTemplate.wrinkle_resistance_options = ['Very Low', 'Low', 'Less'];

demonTemplate.skin_shade_options = ['Preset'];
demonTemplate.skin_colors_options = [
    {name: 'Dark', highlights: 'rgb(255,30,30)', skin: 'rgb(200,30,30)'}
];


new Avatar('set_data_template', 'Demon', demonTemplate);
