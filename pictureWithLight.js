// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This ambient module example console.logs
ambient light and sound levels and whenever a
specified light or sound level trigger is met.
*********************************************/

var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var camera = require('camera-vc0706').use(tessel.port['D']);
var notificationLED = tessel.led[3]; // Set up an LED to notify when we're taking a picture
var ambient = ambientlib.use(tessel.port['C']);
var THRESHOLD = 0.03;

ambient.on('ready', function () {

  ambient.setLightTrigger(THRESHOLD);

  // Set a light level trigger
  // The trigger is a float between 0 and 1
  ambient.on('light-trigger', function(data) {
    console.log("Someone is trying to break in!!!!:", data);
    notificationLED.high();

    setInterval( function () {
      // Take the picture
      camera.takePicture(function(err, image) {
        if (err) {
          console.log('error taking image', err);
        } else {
          notificationLED.low();
          // Name the image
          var name = 'thief-' + Math.floor(Date.now()*1000) + '.jpg';
          // Save the image
          console.log('Picture saving as', name, '...');
          process.sendfile(name, image);
          console.log('done.');
          // Turn the camera off to end the script
          camera.disable();
        }
      });

    }, 250); // The readings will happen every .5 seconds unless the trigger is hit
    
    // Clear the trigger so it stops firing
    ambient.clearLightTrigger();

    //After 1.5 seconds reset light trigger
    setTimeout(function () {

        ambient.setLightTrigger(0.5);

    },1500);
  });

  // Set a sound level trigger
  // The trigger is a float between 0 and 1
  ambient.setSoundTrigger(0.05);

  ambient.on('sound-trigger', function(data) {
    console.log("Someone is trying to steal my stuff!!!: ", data);

    // Take the picture
    camera.takePicture(function(err, image) {
      if (err) {
        console.log('error taking image', err);
      } else {
        notificationLED.low();
        // Name the image
        var name = 'thief-' + Math.floor(Date.now()*1000) + '.jpg';
        // Save the image
        console.log('Picture saving as', name, '...');
        process.sendfile(name, image);
        console.log('done.');
        // Turn the camera off to end the script
        camera.disable();
      }
    });

    // Clear it
    ambient.clearSoundTrigger();

    //After 1.5 seconds reset sound trigger
    setTimeout(function () {

        ambient.setSoundTrigger(0.1);

    },1500);

  });
});

camera.on('error', function(err) {
  console.error(err);
});

ambient.on('error', function (err) {
  console.log(err)
});