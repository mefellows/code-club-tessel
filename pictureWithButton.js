var tessel = require('tessel'),
  camera = require('camera-vc0706').use(tessel.port['A']),
  appLed = tessel.led[3],
  cameraLed = tessel.led[1],
  enableConfigButton = function(){
    // Allow clicking pictures with the Config button in the tessel
    tessel.button.on('release', function(time){
      shoot();
    });
  },
  shoot = function(){
    cameraLed.high();
    camera.takePicture(function(err, image){
      cameraLed.low();
      if(err){
        console.log('takepicture: error in taking picture!', err);
        return;
      }
      var imageName = 'picture-' + Date.now() + '.jpg';
      process.sendfile(imageName, image);
    });
  };

camera.on('ready', function(){
  appLed.high();
  enableConfigButton();
});

camera.on('error', function(err){
  console.log('Error:', err);
});