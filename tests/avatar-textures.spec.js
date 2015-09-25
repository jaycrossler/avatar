describe("Avatar-Textures", function () {
    it("has had texture functions loaded into Avatar.js", function () {
        var av_funcs = new Avatar('get_private_functions');
        var type_check = typeof av_funcs.generateTextures;

        expect(type_check).toBe('function');
    });
});