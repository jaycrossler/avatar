describe("Avatar-Content-Packs", function () {
    it("has at least one content pack loaded", function () {
        var av = new Avatar();
        expect(_.size(av.content_packs)).toBeGreaterThan(0);
    });
    it("has the female eyes pack loaded", function () {
        var av = new Avatar();
        var eyes1 = av.content_packs['female_eyes_1'];
        expect(eyes1.style).toBe('lines');
    });
    it("can load additional content pack data", function () {

        var av = new Avatar();
        var eyes1 = av.content_packs['female_eyes_1'];
        expect(eyes1.note).toBeUndefined();

        av.initialize('register_content_pack', 'female_eyes_1', {note:'test data'});
        var eyes2 = av.content_packs['female_eyes_1'];
        expect(eyes2.note).toBe('test data');
    });
    it("all content packs have data", function () {
        var av = new Avatar();
        for (key in av.content_packs) {
            var pack = av.content_packs[key];
            var data = pack.data;
            expect(data).not.toBeUndefined();
            expect(data.image).not.toBeUndefined();
            expect(data.frames).not.toBeUndefined();
            expect(data.frames.length).toBeGreaterThan(0);
        }
    });

    it("has valid frames that all have triangle reference points", function () {
        var av = new Avatar();
        for (key in av.content_packs) {
            var pack = av.content_packs[key];
            var frames = pack.data.frames;
            for (var i=0; i<frames.length; i++) {
                var frame = frames[i];
                expect(frame.name).toBeTruthy();
                expect(frame.coordinates.length).toBeGreaterThan(2);
            }
        }
    });

    //TODO: Fix testing these
//    it("imports content pack images onto avatar", function () {
//        $('<canvas>').attr({height: 400, width: 400, id: 'test_canvas'}).css({width: 400, height: 400}).appendTo('body');
//        new Avatar('register_content_pack','mouths_1',{use_frequency:1});
//        var av1 = new Avatar({use_content_packs:['mouths_1'], gender:'Female'}, {canvas_name: 'test_canvas'});
//
//    //expect( function(){ parser.parse(raw); } ).toThrow(new Error("Parsing is not possible"));
//        //TODO: This should be throwing a DOM exception Error that it doesn't allow pixel writing, but isn't
//        expect(av1.lastTimeDrawn()).toBeGreaterThan(0);
//
//    });
//
//    it("allows overriding a content pack to choose a specific frame", function () {
//        var av1 = new Avatar({woman_face_parts_1_glasses: '3 goggles', gender:'Female'});
//        var pack_frame_used = av1.content_packs_used['woman_face_parts_1_glasses'];
//
//        //TODO: This won't work as images aren't being allowed to load via phantomjs
//        console.log(JSON.stringify(av1.content_packs_used));
//        expect(pack_frame_used).toBe('3 goggles');
//
//    });


});