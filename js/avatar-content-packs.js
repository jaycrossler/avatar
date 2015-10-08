(function (Avatar, net, maths) {
    var IMAGES = []; //Global list of any images that were loaded by content packs

    var isPhantomJS = (/PhantomJS/.test(window.navigator.userAgent)); //Used during test cases

    var a = new Avatar('get_private_functions');

    //-----------------------------
    //Image Management
    function findImage(url) {
        var existing_image = _.find(IMAGES, function (image) {
            return image.url == url;
        });
        return existing_image ? existing_image.parent_object : null;
    }

    function findOrLoadImage(avatar, url, run_after_loaded) {
        //Don't use cached images if more than 1 avatar is being drawn, as the overdraw can screw things up
        var isFirstStage = (avatar.numberOfStagesDrawn() == 1);

        var cached = isFirstStage && findImage(url);
        if (!isPhantomJS && cached) {
            return run_after_loaded(cached);
        } else {
            var img = new Image();
            img.onload = run_after_loaded;
            img.src = url;
            IMAGES.push({url: url, parent_object: img});
        }
    }

    //-----------------------------
    //Adding Content Pack
    a.registerContentPack = function (avatar, name, pack_data) {
        if (!_.isString(name)) {
            throw "Name of content pack missing"
        }
        if (!_.isObject(pack_data)) {
            throw "Detail object of content pack missing"
        }
        avatar.content_packs[name] = _.extend({name: name}, avatar.content_packs[name], pack_data);
    };

    function find_pack_that_can_be_shown(avatar, layer) {
        return _.filter(avatar.content_packs, function (pack) {
            var feature_list = pack.replace_features;
            if (_.isString(feature_list)) feature_list = [feature_list];

            //Check that the pack matches the feature being drawn
            var isFeatureMatch = _.indexOf(feature_list, layer.feature) > -1;

            //Check that the overall drawing style matches
            var isMatchingStyle = (pack.style == layer.style);

            var hasData, isFilterMatch, isAllowedPack;
            if (isFeatureMatch && isMatchingStyle) {
                //Check if the race or avatar specifies this pack is allowed
                var packOptions = avatar.face_options.use_content_packs || avatar.getRaceData().use_content_packs;
                if (_.isString(packOptions)) packOptions = [packOptions];

                isAllowedPack = (_.indexOf(packOptions, 'all') > -1 || _.indexOf(packOptions, pack.name) > -1);

                //Check that the pack seems to have valid data
                hasData = _.isObject(pack.data) && _.isArray(pack.data.frames) && pack.data.image;

                //Check that the pack doesn't have any filters that exclude it from running
                isFilterMatch = true;
                if (!layer.ignore_filters) {
                    for (var key in pack.filter || {}) {
                        var filter = pack.filter[key];
                        //Only exclude if key is set, but is different than filter
                        if (avatar.face_options[key] && avatar.face_options[key] != filter) {
                            isFilterMatch = false;
                        }
                    }
                }
            }

            return isMatchingStyle && isAllowedPack && hasData && isFeatureMatch && isFilterMatch;
        });
    }

    function find_frames_that_can_be_shown(avatar, matching_packs, item_override) {
        var matching_frames = [];

        //Check if there are any 'overrides' specified in face_options, then use those if so
        _.each(matching_packs, function (pack) {
            if ((item_override && item_override.name) || (pack.name && avatar.face_options[pack.name])) {
                var override_with_frame = item_override.name || avatar.face_options[pack.name];
                var frame = _.find(pack.data.frames, function (frame) {
                    return frame.name == override_with_frame
                });
                if (frame) {
                    frame.pack = pack;
                    matching_frames.push(frame)
                }
            }
        });

        if (matching_frames.length == 0) {
            //None specified, find some that match filters
            _.each(matching_packs, function (pack) {
                //Look through all matching packs to find frames that match filters
                var matching_frames_in = _.filter(pack.data.frames, function (frame) {
                    //TODO: Check for at least 3 points
                    var isFilterMatch = true;
                    for (var key in frame.filter || {}) {
                        var filter = frame.filter[key];
                        //Only exclude if key is set, but is different than filter
                        if (avatar.face_options[key] && avatar.face_options[key] != filter) {
                            isFilterMatch = false;
                        }
                    }

                    return isFilterMatch;
                });
                //Add a link to the parent pack to each frame
                _.each(matching_frames_in, function (frame) {
                    frame.pack = pack;
                });
                matching_frames = matching_frames.concat(matching_frames_in);
            });
        }
        return matching_frames;
    }

    //Rendering features
    a.content_packs_renderer = function (avatar, layer, item_override) {
        var matching_frames = [];
        var render_layer;

        var matching_packs = find_pack_that_can_be_shown(avatar, layer);
        if (matching_packs.length) {
            matching_frames = find_frames_that_can_be_shown(avatar, matching_packs, item_override);
        }
        //There's at least one frame of the pack that matches filters.
        if (matching_frames.length) {
            //NOTE: Sometimes a renderer might be built and later not used because frequency isn't high enough
            var matching_frame = a.randOption(matching_frames, avatar.face_options);
            var matching_pack = matching_frame.pack;

            render_layer = matching_pack;

            render_layer.renderer = function (face_zones, avatar, layer, options) {
                avatar.content_packs_used = avatar.content_packs_used || {};
                avatar.content_packs_used[matching_pack.name] = matching_frame.name;

                if (_.isFunction(matching_pack.custom_renderer)) {
                    return matching_pack.custom_renderer(face_zones, avatar, layer, matching_pack, matching_frame, options);
                } else {
                    return default_image_renderer(face_zones, avatar, layer, matching_pack, matching_frame, options);
                }
            }
        }

        return render_layer;
    };

    function default_image_renderer(face_zones, avatar, layer, pack, frame, options) {
        var a = avatar._private_functions;
        var shapes = [];

        var frame_coordinates = frame.coordinates || [];
        var coordinate_transform_list = [];

        //Find the coordinates from the frame and match them to points on avatar
        _.each(frame_coordinates, function (from_source) {
            var from = {point: from_source.point, x: from_source.x - frame.x, y: from_source.y - frame.y};
            var to = a.findPoint(avatar, from.point) || {};

            if (to) {
                coordinate_transform_list.push({from: from, to: to});

                if (pack.show_reference_points) {
                    var to_point = new createjs.Shape();
                    to_point.graphics.beginFill('#f00').drawCircle(to.x, to.y, 4);
                    shapes.push(to_point);
                    console.log('To', to.x, to.y);
                }
            }
        });

        //Map the three triangle coordinates from shape onto the face targets
        if (coordinate_transform_list.length > 2) {
            //Build triangles of first three mapped points
            var source = [coordinate_transform_list[0].from, coordinate_transform_list[1].from, coordinate_transform_list[2].from];
            var dest = [coordinate_transform_list[0].to, coordinate_transform_list[1].to, coordinate_transform_list[2].to];

            //Build the final transform matrix from three points in each reference frame
            var matrix = maths.buildTransformFromTriangleToTriangle(source, dest);

            //TODO: Verify that loading these is not asynchronous on image draw especially on mobile
            var render_it = function (obj) {
                return default_render_after_image_loaded(avatar, pack, frame, matrix, obj);
            };

            var shape = findOrLoadImage(avatar, pack.data.image, render_it);
            shapes.push(shape);

        }
        return shapes;
    }

    function remove_color_and_range(imageData, bg_color, bg_x) {
        var bg_color_obj = net.brehaut.Color(bg_color);
        var bg_r = parseInt(bg_color_obj.red * 255);
        var bg_g = parseInt(bg_color_obj.green * 255);
        var bg_b = parseInt(bg_color_obj.blue * 255);

        //Set any colors within the specified range to transparent
        var data = imageData.data;
        for (var i = 0, n = data.length; i < n; i += 4) {
            var red = data[i];
            var green = data[i + 1];
            var blue = data[i + 2];

            if ((red > bg_r - bg_x) && (red < bg_r + bg_x) &&
                (blue > bg_b - bg_x) && (blue < bg_b + bg_x) &&
                (green > bg_g - bg_x) && (green < bg_g + bg_x)) {
                imageData.data[i + 3] = 0;
            }
        }
        return imageData;
    }

    function apply_color_transform_to_zone(imageData, avatar, frame) {
        //TODO: Integrate in tan_colors packs and other transforms from online
        _.each(frame.zones || [], function (zone) {
            var x_start, y_start, width, height;

            if (zone.all) {
                x_start = 0;
                y_start = 0;
                width = frame.width;
                height = frame.height;
            } else {
                x_start = zone.x - frame.x;
                y_start = zone.y - frame.y;
                width = zone.width;
                height = zone.height;
            }

            if (x_start < 0) {
                width -= (0 - x_start);
                x_start = 0;
            }
            if (y_start < 0) {
                height -= (0 - y_start);
                y_start = 0;
            }
            var x_end = x_start + width;
            var y_end = y_start + height;

            //Find the color that should be applied
            var to_color = avatar.face_options[zone.color];
            var to_color_object = net.brehaut.Color(to_color);
            var c_red = parseInt(to_color_object.red * 255);
            var c_green = parseInt(to_color_object.green * 255);
            var c_blue = parseInt(to_color_object.blue * 255);

            var data = imageData.data;

            //Loop through all pixels in the zone
            for (var x = x_start; x < x_end; x++) {
                for (var y = y_start; y < y_end; y++) {
                    var i = 4 * (x + y * frame.width);
                    var red = data[i];
                    var green = data[i + 1];
                    var blue = data[i + 2];
                    if (red < 40 && green < 40 && blue < 50) {
                        imageData.data[i] = c_red;
                        imageData.data[i + 1] = c_green;
                        imageData.data[i + 2] = c_blue;
                    }
                }
            }
        });
        return imageData;
    }

    function default_render_after_image_loaded(avatar, pack, frame, matrix, parent_or_img) {

        //Get either the cached image or the loaded image object
        var was_cached = false;
        var img;
        if (parent_or_img.src) {
            was_cached = true;
            img = parent_or_img;
        } else {
            img = parent_or_img.target;
        }

        //Extract the sub-image from the file into a temp canvas
        var canvas_from_image_frame_cutout = document.createElement('canvas');
        canvas_from_image_frame_cutout.width = frame.width + frame.x;
        canvas_from_image_frame_cutout.height = frame.height + frame.y;
        var context = canvas_from_image_frame_cutout.getContext('2d');
        context.drawImage(img, frame.x, frame.y, frame.width, frame.height, 0, 0, frame.width, frame.height);

        //Remove background colors
        if (!avatar.no_local_editing) {
            try {
                //Get the image data and remove background color (with a range)

                //getImageData throws an exception if there is a security problem
                var imageData = context.getImageData(0, 0, frame.width, frame.height);

                if (pack.data.removeBackgroundNoise || pack.data.removeBackgroundColor) {
                    // iterate over all pixels
                    imageData = remove_color_and_range(imageData,
                            pack.data.removeBackgroundColor || 'white',
                            pack.data.removeBackgroundNoise || 20);

                }
                imageData = apply_color_transform_to_zone(imageData, avatar, frame);

                context.putImageData(imageData, 0, 0);
            } catch (ex) {
                if (ex.name == "SecurityError") {
                    avatar.no_local_editing = true;
                    var error = "Can't apply image complex transforms because images need to be served from a web url on the same server";
                    console.error(error);
                    avatar.logMessage({msg:error, name:'exception'});

                } else {
                    //Some other exception
                    debugger;
                }
            }
        }
        var canvas1 = document.createElement('canvas');
        canvas1.width = img.width;
        canvas1.height = img.height;
        var context1 = canvas1.getContext('2d');

        //Apply matrix transform to canvas and add as shape
        context1.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
        context1.drawImage(canvas_from_image_frame_cutout, 0, 0);


        //Draw these asynchronously rather than passing them back into the stage list
        var bitmap;
        if (isPhantomJS) {
            //Note:PhantomJS running tests is throwing a security error when editing canvases locally using
            // the EaselJS Bitmap object, so when using PhantomJS, write pixels directly to canvas
            //TODO: Write pixels onto a rectangle and add as a shape

            var dWidth = canvas_from_image_frame_cutout.width;
            var dHeight = canvas_from_image_frame_cutout.height;
            var main_context = avatar.stage.canvas.getContext('2d');
            main_context.globalCompositeOperation = 'multiply';
            try {
                main_context.drawImage(canvas_from_image_frame_cutout, 0, 0,
                    dWidth, dHeight,
                    matrix[4], matrix[5], dWidth * matrix[0], dHeight * matrix[3]
                );
            } catch (ex) {
                avatar.logMessage({ex:ex, name:'exception'});
            }
            main_context.globalCompositeOperation = 'normal';

        } else {
            bitmap = new createjs.Bitmap(canvas1);
            bitmap.compositeOperation = 'multiply';
            if (!was_cached) {
                //Wasn't cached, so asynchronously add after loaded
                avatar.drawOnStage(bitmap, avatar.stage);
                avatar.faceShapeCollection.addChild(bitmap);
            }
//            avatar.stage.update(); //Overdraws canvas direct adds
        }
        return bitmap;
    }

})(Avatar, net, maths);