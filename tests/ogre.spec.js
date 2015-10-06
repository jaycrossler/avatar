describe("Avatar Ogre Race", function () {
    it("is registered", function () {
        var av_races = new Avatar('get_races');
        var is_ogre = _.indexOf(av_races, 'Ogre');

        expect(av_races.length).toBeGreaterThan(0);
        expect(is_ogre).toBeGreaterThan(-1);
    });
    it("have Greenish skin", function () {
        //TODO: There is periodically an array size exception. Figure out where
        try {
            var av = new Avatar({age: 30, race: 'Ogre'});
        } catch (ex) {
            console.log("EXCEPTION");
            console.log("Seed: " + av.face_options.rand_seed);
        }
        var skin = av.face_options.skin_colors.skin;
        var skin_color = net.brehaut.Color(skin);

        expect(skin_color.green).toBeGreaterThan(skin_color.red);
        expect(skin_color.green).toBeGreaterThan(skin_color.blue);
    });
});