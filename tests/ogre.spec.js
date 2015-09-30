describe("Avatar", function () {
    it("has races including ogre", function () {
        var av_races = new Avatar('get_races');
        var is_ogre = _.indexOf(av_races, 'Ogre');

        expect(av_races.length).toBeGreaterThan(0);
        expect(is_ogre).toBeGreaterThan(-1);
    });
    it("has Ogres that have Greenish skin", function () {
        var av = new Avatar({age: 30, race: 'Ogre'});
        var skin = av.face_options.skin_colors.skin;
        var skin_color = net.brehaut.Color(skin);

        expect(skin_color.green).toBeGreaterThan(skin_color.red);
        expect(skin_color.green).toBeGreaterThan(skin_color.blue);
    });
});