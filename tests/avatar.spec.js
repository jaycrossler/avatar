describe("Avatar", function () {
    it("is ready in grunt and Jasmine", function () {
        expect("Test").toContain("Test");
    });
    it("loads with dependencies", function () {
        var av = new Avatar();
        var ver = av.version;

        expect(ver).toContain("avatar.js (version ");
    });
    it("has a version and summary", function () {
        var av = new Avatar();
        var ver = av.version;

        expect(ver).toContain("avatar.js (version ");
        expect(ver).toContain("Drawing");
    });
    it("returns a seed as valid JSON", function () {
        var av = new Avatar();
        var seed = av.getSeed();

        expect(JSON.stringify(seed)).toContain('{"rand_seed":');
    });
    it("returns a seed that is a valid number", function () {
        var av = new Avatar();
        var seed = av.getSeed();
        var rand_seed = seed.rand_seed;

        expect(rand_seed).toEqual(jasmine.any(Number));
    });
    it("creates an avatar with options same as what was entered", function () {
        var av = new Avatar({age: 80, gender: 'Female'});
        var seed = av.getSeed();

        expect(seed.age).toEqual(80);
        expect(seed.gender).toEqual('Female');
    });
    it("can return a Human linked template as valid JSON", function () {
        var av_data = new Avatar('get_linked_template', 'Human');

        expect(JSON.parse(JSON.stringify(av_data))).toBeTruthy();
    });
    it("can copy a Human linked template as valid JSON", function () {
        var av_data = new Avatar('copy_data_template', 'Human');

        expect(JSON.parse(JSON.stringify(av_data))).toBeTruthy();
    });
    it("can write to a new race template", function () {
        var av_data = new Avatar('copy_data_template', 'Human');
        av_data.eye_cloudiness_options = ['Pink'];
        new Avatar('set_data_template', 'Test', av_data);
        var av = new Avatar({race: 'Test'});

        expect(av.face_options.eye_cloudiness).toEqual('Pink');
    });
    it("returns a link to private functions", function () {
        var av_funcs = new Avatar('get_private_functions');
        var type_check = typeof av_funcs.findPoint;

        expect(type_check).toBe('function');
    });
    it("has races including human", function () {
        var av_racess = new Avatar('get_races');
        var is_human = _.indexOf(av_racess, 'Human');

        expect(av_racess.length).toBeGreaterThan(0);
        expect(is_human).toBeGreaterThan(-1);
    });
    it("can create a canvas", function () {
        var $canvas_av = $('<canvas>').attr({height: 400, width: 400, id: 'test_canvas'}).css({width: 400, height: 400}).appendTo('body');
        var blank_canvas = $canvas_av[0].toDataURL();

        expect(blank_canvas.length).toEqual(jasmine.any(Number));
    });
    it("draws onto a canvas and mid point is not white", function () {
        var $canvas_av = $('<canvas>').attr({id: 'avatar_canvas', height: 400, width: 400}).css({width: 400, height: 400}).appendTo('body');
        var blank_canvas = $canvas_av[0].toDataURL("image/png"); //.replace("image/png", "image/octet-stream");
        var context = $canvas_av[0].getContext("2d");

        var midPixel1 = context.getImageData(100, 100, 1, 1).data;
        expect(blank_canvas.length).toEqual(jasmine.any(Number));
        expect(midPixel1[0]).toEqual(0);

        new Avatar({rand_seed: 1}, {canvas_name: 'avatar_canvas'});
        var drawn_canvas = $canvas_av[0].toDataURL("image/png"); //.replace("image/png", "image/octet-stream");
        var midPixel2 = context.getImageData(100, 100, 1, 1).data;

        expect(drawn_canvas.length).toEqual(jasmine.any(Number));
        expect(midPixel2[0]).not.toEqual(0);
    });

    it("has valid named fazezone points that take up real size", function () {
        $('<canvas>').attr({height: 400, width: 400, id: 'test_canvas'}).css({width: 400, height: 400}).appendTo('body');

        var av = new Avatar({rand_seed: 1}, {canvas_name: 'test_canvas'});
        var fz_tl = av._private_functions.findPoint(av, 'facezone topleft');
        var fz_br = av._private_functions.findPoint(av, 'facezone bottomright');

        expect(fz_tl.x).toEqual(jasmine.any(Number));
        expect(fz_tl.y).toEqual(jasmine.any(Number));
        expect(fz_br.x).toEqual(jasmine.any(Number));
        expect(fz_br.y).toEqual(jasmine.any(Number));
        expect(fz_tl.x).toBeLessThan(fz_br.x);
        expect(fz_tl.y).toBeLessThan(fz_br.y);

    });
});