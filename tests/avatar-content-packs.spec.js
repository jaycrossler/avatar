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
});