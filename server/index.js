const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');             // Classic fs
const logger = require('loglevel');
const cors = require('cors');
const AssetService = require('./services/asset-service');
const app = express();
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
}));

var allowedOrigins = ['http://localhost:8080',
    'http://yourapp.com'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

const assetService = new AssetService({ logger });

const uploadPath = path.join(__dirname, 'files/'); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits


app.route('/upload').post((req, res, next) => {

    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, fileObj) => {

        const fileName = fileObj.filename;
        const randomId = assetService.makeId(8);
        const extension = assetService.getExtension(fileName);
        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, `${randomId}.${extension}`));

        // Pipe it trough
        file.pipe(fstream);

        // On finish of the upload
        fstream.on('close', () => {
            console.log(`Upload of '${file}' finished`);
            res.json([{
                id: `${randomId}.${extension}`,
            }]);

        });
    });
});


/**
 * Serve the basic index.html with upload form
 */
app.route('/').get((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="upload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="fileToUpload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});

const server = app.listen(3200, function () {
    console.log(`Listening on port ${server.address().port}`);
});