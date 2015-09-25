describe("Avatar", function () {
    it("is ready in grunt", function() {
        expect("Test").toContain("Test");
    });
    it("loads with dependencies", function () {
        var av = new Avatar();
        var ver = av.version;

        expect(ver).toContain("avatar.js (version ");
    });
    it("has a version", function () {
        var av = new Avatar();
        var ver = av.version;

        expect(ver).toContain("avatar.js (version ");
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
        var av = new Avatar({age:80, gender:'Female'});
        var seed = av.getSeed();

        expect(seed.age).toEqual(80);
        expect(seed.gender).toEqual('Female');
    });


});