describe("Canvas/JQuery", function () {
    it("creates a canvas", function () {
        var canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        document.body.appendChild(canvas);

        var context = canvas.getContext("2d");
        var midPixel1 = context.getImageData(100, 100, 1, 1).data;

        expect(midPixel1[0]).toEqual(0);
    });

    it("draws onto a canvas using jquery, starting white turning red", function () {
        var $canvas = $('<canvas>')
            .attr({id: 'test_canvas', height: 200, width: 200})
            .css({width: 200, height: 200})
            .appendTo('body');
        var canvas = $canvas[0];

        var data1 = canvas.toDataURL("image/png");
        var context = canvas.getContext("2d");

        var midPixel1 = context.getImageData(100, 100, 1, 1).data;

        context.strokeStyle = 'blue';
        context.beginPath();
        context.fillStyle = "#FF0000";
        context.lineWidth = 5;
        context.rect(0, 0, 199, 199);
        context.fill();
        context.stroke();
        context.closePath();

        var data2 = canvas.toDataURL("image/png");
        var midPixel2 = context.getImageData(100, 100, 1, 1).data;

        expect(data1.length).toEqual(jasmine.any(Number));
        expect(data2.length).toEqual(jasmine.any(Number));
        expect(data1).not.toEqual(data2);

        expect(midPixel1[0]).toEqual(0);
        expect(midPixel2[0]).toEqual(255);

    });
});