(function() {
    "use strict";

    var http = require('http'),
        url = require('url'),
        fsExtra = require('fs-extra'),
        util = require('util'),
        formidable = require('formidable'),
        uuid = require('node-uuid'),
        port = 1234;

    http.createServer(function (request, response) {
        var parsedUrl = url.parse(request.url, true);

        // download
        if (parsedUrl.pathname == '/download') {
            var guid = parsedUrl.query.file,
                dir = __dirname + '/uploads/' + guid + '/';

            console.log(dir);
            try {
                if (fsExtra.statSync(dir)) {
                    var files = fsExtra.readdirSync(dir),
                        file;

                    for (var i in files) {
                        file = files[i];
                        break;
                    }

                    response.writeHead(200, {
                        'Content-disposition': 'attachment; filename=' + file,
                        'content-type': 'text/html'
                    });
                    response.write(file, 'binary');
                    response.end();
                }
            } catch(e) {
                console.error('No such file exists');
            }
        }

        // upload
        if (parsedUrl.path == '/upload' && request.method.toLowerCase() == 'post') {
            // parse a file upload
            var form = new formidable.IncomingForm(),
                guid = uuid.v1();

            form.parse(request, function(err, fields, files) {
                response.writeHead(200, {'content-type': 'text/html'});
                response.write('<h4>Upload received!</h4>');
                response.write('<div><h4 style="display: inline; margin-right: 5px">Project GUID:</h4>' +
                    '<h2 style="display: inline">' + guid + '</h2></div>');
                response.end('<a href="/">Go back</a>');
            });
            form.on('end', function(fields, files) {
                var temp_path = this.openedFiles[0].path;
                var file_name = this.openedFiles[0].name;
                var new_location = __dirname + '/uploads/' + guid + '/';
                fsExtra.copy(temp_path, new_location + file_name, function(err) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("success!")
                    }
                });
            });
            return;

            return;
        }

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(
            '<div style="background: #E5E5E5">' +
            '<h1>Download file</h1>' +
            '<input type="text" id="guidId" placeholder="Enter valid GUID" style="width: 350px; padding: 10px">' +
            '<button id="downloadBtn" style="padding:10px">Download</button>' +
            '</div>' +
            '' +
            '<div style="background: #E5E5E5; margin-top: 10px">' +
            '<h1>Upload file</h1>' +
            '<form action="/upload" method="post" enctype="multipart/form-data">' +
                '<input type="file" name="upload" multiple="multiple">' +
                '<input type="submit" value="Upload" style="padding: 10px">' +
            '</form>' +
            '</div>' +
            '' +
            '<script>' +
                'var downloadBtn = document.getElementById("downloadBtn");'+
                'downloadBtn.addEventListener("click", function () { ' +
                    'var guid = document.getElementById("guidId").value;' +
                    'window.location = "/download?file=" + guid' +
            '})' +
            '</script>'
        );
        response.end();

    }).listen(port);

    console.log('Server is running on port %s', port);
}());