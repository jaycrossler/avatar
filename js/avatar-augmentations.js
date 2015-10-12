//TODO: Need to indicate that it should be under some layer (scar under beard)
//TODO: Builder should have some drag and drop and rotate/move
//TODO: Should work with 1 or 2 or 4? points

new Avatar('add_render_function', {style: 'lines', feature: 'augmentations', renderer: function (face_zones, avatar, layer) {
    var a = avatar._private_functions;
    var shapes = [];

    var augmentations = avatar.face_options.augmentations || [];
    _.each (augmentations || [], function(item){

        item.style = item.style || layer.style;

        var render_pack;
        if (avatar._private_functions.content_packs_renderer) {
            var content_pack_render_layer = a.content_packs_renderer(avatar, item, item);
            if (content_pack_render_layer) {
                //Find the frequency it should be applied. If not set, use 100%
                var freq = content_pack_render_layer.use_frequency;
                if (_.isUndefined(freq)) freq = 1;
                if (avatar._private_functions.random(avatar.face_options)<freq) {
                    render_pack = content_pack_render_layer;
                }
            }
        }

        if (render_pack && render_pack.renderer) {
            var feature_shapes = render_pack.renderer(face_zones, avatar, layer, item.options);

            if (!layer.hide) {
                shapes = shapes.concat(feature_shapes);
            }
            var log = "Added Augmentation - type: " + item.feature + ', pack: ' + render_pack.name + ', item: ' + render_pack.frame.name;
//            console.log(log);
            avatar.logMessage(log);
        } else {
//            console.log("Couldn't find Augmentation - " + item.feature);
            avatar.logMessage("Couldn't find Augmentation - " + item.feature);
        }
    });


    return shapes;
}});