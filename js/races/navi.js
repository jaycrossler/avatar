var naviTemplate = new Avatar('copy_data_template', 'Human');

naviTemplate.ear_shape_options.push('Pointed');

naviTemplate.eye_cloudiness = ['Pink'];

naviTemplate.skin_colors_options = [
    {skin: '#8888EE', cheek: '#898add'},
    {skin: '#8888CC', cheek: '#898add'},
    {skin: '#8080DD', cheek: '#898add'},
    {skin: '#9090DD', cheek: '#898add'}
];
naviTemplate.skin_shade_options = ['Preset'];
naviTemplate.beard_style_options = ['None'];
naviTemplate.stubble_style_options = ['None'];

naviTemplate.thickness_options = [-1, .5, 0, .5, 1];

naviTemplate.face_shape_options = "Oval,Rectangular,Diamond".split(",");

new Avatar('set_data_template', 'Navi', naviTemplate);
