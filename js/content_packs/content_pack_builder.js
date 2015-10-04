//----------------
var saved_box;
var saved_points=[];
var startX,startY;
//----------------

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function loadImageToCanvas(canvas, pack) {
    var img = new Image();

    img.onload = function () {

        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);//img.width, img.height);

        context.lineWidth = 3;

        _.each(pack.data.frames, function(frame){

            _.each(frame.zones, function(zone){
                context.strokeStyle="rgba(255,255,0,0.3)";
                context.fillStyle="rgba(255,0,0,0.3)";
                var x = zone.x;
                var y = zone.y;
                var w = zone.width;
                var h = zone.height;
                if (zone.all) {
                    x = frame.x;
                    y = frame.y;
                    w = frame.width;
                    h = frame.height;
                }
                context.beginPath();
                context.fillRect(x, y, w, h);
                context.strokeRect(x, y, w, h);
                context.closePath();
            });

            _.each(frame.coordinates, function(coord){
                context.strokeStyle="#ffffff";
                context.fillStyle="#0000ff";
                context.beginPath();
                context.arc(coord.x,coord.y,6,0,2*Math.PI);
                context.fill();
                context.stroke();
            });

            context.strokeStyle="rgba(255,0,0,1)";
            context.strokeRect(frame.x, frame.y, frame.width, frame.height);


        });

    };
    img.src = '../' + pack.data.image;
}

var stylePaddingLeft;
var stylePaddingTop;
var styleBorderLeft;
var styleBorderTop;
// Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
// They will mess up mouse coordinates and this fixes that
var html = document.body.parentNode;
var htmlTop = html.offsetTop;
var htmlLeft = html.offsetLeft;


function initDraw(canvas) {
    var element = null;

    function getMousePos (canvas, e) {
      var element = canvas, offsetX = 0, offsetY = 0, mx, my;

      // Compute the total offset. It's possible to cache this if you want
      if (element.offsetParent !== undefined) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
      }

      // Add padding and border style widths to offset
      // Also add the <html> offsets in case there's a position:fixed bar (like the stumbleupon bar)
      // This part is not strictly necessary, it depends on your styling
      offsetX += stylePaddingLeft + styleBorderLeft + htmlLeft;
      offsetY += stylePaddingTop + styleBorderTop + htmlTop;

      mx = e.pageX - offsetX;
      my = e.pageY - offsetY;

      // We return a simple javascript object with x and y defined
      return {x: mx, y: my};
    }


    canvas.onmousemove = function (e) {
//        setMousePosition();
        var mouseX = getMousePos(canvas,e).x;//parseInt(e.clientX - offsetX);
        var mouseY = getMousePos(canvas,e).y;//parseInt(e.clientY - offsetY);
        if (element !== null) {
            element.style.width = parseInt(mouseX - startX) + 'px';
            element.style.height = parseInt(mouseY - startY) + 'px';
            element.style.left = startX + 'px';
            element.style.top = startY + 'px';
        }
    };

    canvas.onclick = function (e) {
        if (element !== null ) {
            console.log("shouldn't get here...")
        } else {
            if (saved_box) {
//                saved_points.push({x:mouse.x, y:mouse.y});
//                $("#new_frame").text(buildText());

            } else {
                console.log("box begun.");
                startX = getMousePos(canvas,e).x;
                startY = getMousePos(canvas,e).y;
                element = document.createElement('div');
                element.className = 'rectangle';
                element.style.left = startX + 'px';
                element.style.top = startY + 'px';
                element.onclick = function (e) {
                    var mouseX = getMousePos(canvas,e).x;
                    var mouseY = getMousePos(canvas,e).y;

                    if (saved_box) {
                        saved_points.push({x: mouseX, y: mouseY});
                        $("#new_frame").text(buildText());
                    } else {
                        canvas.style.cursor = "default";
                        console.log("box finsihed.");
                        var x = parseInt(element.style.left);
                        var y = parseInt(element.style.top);
                        var w = parseInt(element.style.width);
                        var h = parseInt(element.style.height);
                        saved_box = {x: x, y: y, w: w, h: h};
                        $("#new_frame").text(buildText());
                        element = null;
                    }
                };

                canvas.parentElement.appendChild(element);
                canvas.style.cursor = "crosshair";
            }
        }
    };
}
function copyToClipboard($element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($element.text()).select();
    document.execCommand("copy");
    $temp.remove();
}

var pack_render_type;
var point_names = {
    mouth: ['left mouth wedge', 'right mouth wedge', 'mouth bottom middle', "{ all: true, color: 'lip_color'}"],
    eyes: ['left eye center', 'right eye center', 'eyebrow midpoint', ''],
    glasses: ['left eye center', 'right eye center', 'eyebrow midpoint', '']
};

function buildText(){
    var text = "Click to build a rectangle, then click three points on key places";
    if (saved_box) {
        var x = saved_box.x;
        var y = saved_box.y;
        var w = saved_box.w;
        var h = saved_box.h;

        var text_pre = "{name: 'item', x: " + x + ", y: " + y + ", width: " + w + ", height: " + h + ", filter: {}, \n" +
            " coordinates: [\n";

        var text_mid = "";
        var names = point_names[pack_render_type];

        if (saved_points.length>0 && names) {
            text_mid += "     {point: '"+names[0]+"', x: "+saved_points[0].x+", y: "+saved_points[0].y+"},\n";
        }
        if (saved_points.length>1 && names) {
            text_mid += "     {point: '"+names[1]+"', x: "+saved_points[1].x+", y: "+saved_points[1].y+"},\n"
        }
        if (saved_points.length>2 && names) {
            text_mid += "     {point: '"+names[2]+"', x: "+saved_points[2].x+", y: "+saved_points[2].y+"}\n"
        }

        var zone_info = '';
        if (names && names.length>3) {
            zone_info = names[3];
        }
        var text_post = " ], zones: [" + zone_info + "]\n" +
            "},";
        text = text_pre + text_mid + text_post;
    }
    return text;
}

$(document).ready(function () {
    var $canvas = $("<canvas>")
        .attr({width: 2000, height: 2000, id: 'pack_canvas'})
        .appendTo($('#pack_image_holder'));
    var canvas = $canvas[0];
    stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;



    var $pack_name = $("#pack_name");
    var $content_title = $('#content_title');
    var $new_frame = $("#new_frame")
        .text(buildText());

    $new_frame.on('click',function(){
//        copyToClipboard($new_frame)
        $new_frame[0].select();
    });


    function draw(e) {
        var pos = getMousePos(canvas, e);
        $content_title.text("x=" + pos.x + " : y=" + pos.y);
    }

    canvas.addEventListener('mousemove', draw, false);
    var av = new Avatar();

    $pack_name
        .on('change', function () {
            var val = $(this).val();
            var pack = av.content_packs[val];
            loadImageToCanvas(canvas, pack);

            pack_render_type = pack.replace_features[0];
        });

    var packs = av.content_packs;
    var last;
    for (key in packs) {
        last = key;
        $('<option>')
            .val(key)
            .text(key)
            .appendTo($pack_name);
    }

    //Set it to the last item
    $pack_name.val(last);
    loadImageToCanvas(canvas, av.content_packs[last]);
    pack_render_type = av.content_packs[last].replace_features[0];

    initDraw(canvas);


});