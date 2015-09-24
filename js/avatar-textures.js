(function (Avatar, net) {
    //TODO: Have textures be removed based on face_options modified

    var a = new Avatar('get_private_functions');

    //-----------------------------
    //Textures
    a.generateTextures = function(avatar) {
        //TODO: Have Some of these run for the entire class?

        avatar.textures = _.without(avatar.textures, function (tex) {
            return tex.type == 'single use'
        });
        avatar.textures = [];

        var height_object = a.getHeightOfStage(avatar);
        var resolution = height_object.resolution;


        //Build stubble colors
        var hair_tinted_gray = avatar.face_options.beard_color;
        var hair_tinted_gray2 = avatar.face_options.beard_color;

        if (avatar.face_options.hair_color && hair_tinted_gray && hair_tinted_gray == 'Hair') {
            hair_tinted_gray = avatar.face_options.hair_color;
            hair_tinted_gray2 = avatar.face_options.hair_color;
        }
        if (!hair_tinted_gray) {
            hair_tinted_gray = net.brehaut.Color('#666666').toString();
            hair_tinted_gray2 = net.brehaut.Color('#888888').toString();
        }
        hair_tinted_gray = net.brehaut.Color('#444444').blend(net.brehaut.Color(hair_tinted_gray), .1).toString();
        hair_tinted_gray2 = net.brehaut.Color('#666666').blend(net.brehaut.Color(hair_tinted_gray2), .2).toString();

        var canvas_size = 64;
        //Build Stubble texture
        var canvas = document.createElement('canvas');
        canvas.width = canvas_size;
        canvas.height = canvas_size;
        var context = canvas.getContext('2d');

        addRandomLines(context, avatar.face_options, canvas_size, resolution * 80, resolution * 4, resolution / 2, hair_tinted_gray);
        addRandomLines(context, avatar.face_options, canvas_size, resolution * 140, resolution, resolution / 2, hair_tinted_gray2);
        addRandomLines(context, avatar.face_options, canvas_size, resolution * 300, resolution * 8, resolution / 2, '#444');
        avatar.textures.push({type: 'single use', name: 'stubble lines', canvas: canvas, context: context});


        var canvas3 = document.createElement('canvas');
        canvas3.width = canvas_size;
        canvas3.height = canvas_size;
        var context3 = canvas.getContext('2d');

        addRandomLines(context3, avatar.face_options, canvas_size, resolution * 80, resolution / 2, resolution * 4, hair_tinted_gray);
        addRandomLines(context3, avatar.face_options, canvas_size, resolution * 140, resolution / 2, resolution, hair_tinted_gray2);
        avatar.textures.push({type: 'single use', name: 'hair horizontal lines', canvas: canvas3, context: context3});


        var skin_color = avatar.face_options.skin_colors.skin;
        var skin_lighter_2 = net.brehaut.Color(skin_color).lightenByRatio(.02).toString();
        var skin_darker_1 = net.brehaut.Color(skin_color).darkenByRatio(.01).toString();

        //Build Skin texture
        var canvas2 = document.createElement('canvas');
        canvas2.width = canvas_size;
        canvas2.height = canvas_size;
        var context2 = canvas2.getContext('2d');
        addRandomSpots(context2, avatar.face_options, canvas_size, resolution * 10, resolution * 1.5, skin_lighter_2);
        addRandomSpots(context2, avatar.face_options, canvas_size, resolution * 10, resolution * 1.5, skin_darker_1);
        avatar.textures.push({type: 'single use', name: 'face bumps', canvas: canvas2, context: context2});


        //Build Acne texture
        var acne_amount = a.turnWordToNumber(avatar.face_options.acne_amount, 0, 9, 'None,Very Light,Light,Few,Some,Spattering,Speckled,Heavy,Very Heavy');

        var face_reddish = net.brehaut.Color(skin_color).blend(net.brehaut.Color('#f00'), .15).toString();
        var canvas4 = document.createElement('canvas');
        canvas4.width = canvas_size * 5;
        canvas4.height = canvas_size * 5;
        var context4 = canvas4.getContext('2d');
        addRandomSpots(context4, avatar.face_options, canvas_size * 5, resolution * acne_amount, resolution * 2, face_reddish);
        avatar.textures.push({type: 'single use', name: 'face spots', canvas: canvas4, context: context4});

    };

    function addRandomSpots(context, face_options, context_size, number, radius, color) {
        context.strokeStyle = color;
        for (var i = 0; i < number; i++) {
            var x = a.randInt(context_size, face_options);
            var y = a.randInt(context_size, face_options);
            var rad = a.randInt(radius, face_options);

            context.fillStyle = color;
            context.beginPath();
            context.moveTo(x, y);
            context.arc(x, y, parseInt(rad), 0, 2 * Math.PI);
            context.closePath();
            context.fill();
            context.stroke();
        }
        return context;
    }

    function addRandomLines(context, face_options, context_size, number, length_y, length_x, color) {
        context.strokeStyle = color;
        for (var i = 0; i < number; i++) {
            var x = a.randInt(context_size, face_options);
            var y = a.randInt(context_size, face_options);
            var x_off = parseInt(a.randInt(length_x * 2, face_options) - length_x);
            var y_off = parseInt(a.randInt(length_y * 2, face_options) - length_y);

            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + x_off, y + y_off);
            context.closePath();
            context.stroke()
        }
        return context;
    }

})(Avatar, net);