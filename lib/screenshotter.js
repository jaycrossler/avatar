var page = require("webpage").create();
var site = phantom.args[0],
    output = phantom.args[1];

page.open(site, function (status) {
    if (status !== "success") {
        phantom.exit(1);
    }
    page.render(output + ".png");
    phantom.exit(0);
});