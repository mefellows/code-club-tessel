var tessel = require('tessel');
var http = require('http');
var url = require('url');
var camera = require('camera-vc0706').use(tessel.port['D']);
var cameraOn = tessel.led[3];


camera.on('ready', function() {

    var server = http.createServer(function (req, res) {
      var urlObj = url.parse(req.url, true);

      if (urlObj.pathname === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(homepage(), 'utf8');
        res.end();

      } else if (urlObj.pathname === '/photo.jpg') {
        cameraOn.high();
        camera.takePicture(function (err, image) {
          cameraOn.low();
          res.writeHead(200, {'Content-Type': 'images/jpeg',
            'Content-Disposition': 'attachment; filename=photo.jpg'});
          res.write(image);
          res.end();
        });

      } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write(errorpage(), 'utf8');
        res.end();

      }
  });
  server.listen(80);
});

camera.on('error', function(err) {
  console.error(err);
});



/* html generators */
function style() {
  return "<style> img, h1, a { display: block; margin: 10px } </style>";
}
function head() {
  return "<title>Sneaky Tessel</title>" + style();
}
function body(content) {
  return "<!DOCTYPE html>\n<html language='en'><head>" + head() + "</head>\n" +
    "<html>" + content + "</html>\n\n";

}
function homepage() {
  return body("<h1>What are you looking at?</h1><img src='./photo.jpg?dl=1' alt='sneaky'><a href='./'>Reload</a>");
}
function errorpage() {
  return body("<p>These are not the droids you are looking for</p>")
}

