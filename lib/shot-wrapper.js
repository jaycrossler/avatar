//Node.js wrapper, with thanks from http://alistapart.com/blog/post/driving-phantom-from-grunt
var path = require( "path" );
var execFile = require( "child_process" ).execFile;
var phantomPath = require( "phantomjs" ).path;
var phantomscript = path.resolve( path.join( __dirname, "screenshotter.js" ) );

exports.takeShot = function( url, output, cb ){
    execFile( phantomPath, [
            phantomscript,
            url,
            output
    ],
    function( err, stdout, stderr ){
        if( err ){
            throw err;
        }

        if( stderr ){
            console.error( stderr );
        }

        if( stdout ){
            console.log( stdout );
        }
        if( cb ){
            cb();
        }
    });
};