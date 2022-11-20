var status = "";
var objects = [];

function preload() { }

function setup() {
    canvas = createCanvas(480, 400);
    canvas.position(450, 300);
    video = createCapture(VIDEO);
    video.size(480, 400);
    video.hide();
}
var SpeechRecognition = window.webkitSpeechRecognition;
var Content;
var recognition = new SpeechRecognition();
function draw() {
    image(video, 0, 0, 480, 400);
    if(status != "") {
        objectDetector.detect(video, gotResults);
        for(i = 0; i < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status: Object Detected";
            fill('#0000FF');
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            stroke('#0000FF');
            noFill();
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            if(objectName == objects[i].label) {
                video.stop();
                objectDetector.detect(gotResults);
                document.getElementById("verify").innerHTML = objectName + " is found.";
                var synth = window.speechSynthesis;
                speak_data = objectName + " is found.";
                var utterThis = new SpeechSynthesisUtterance(speak_data);
                synth.speak(utterThis);
            }
            else {
                video.stop();
                objectDetector.detect(gotResults);
                document.getElementById("verify").innerHTML = objectName + " is not found.";
                var synth = window.speechSynthesis;
                speak_data = objectName + " is not found.";
                var utterThis = new SpeechSynthesisUtterance(speak_data);
                synth.speak(utterThis);
            }
        }
    }
}

function start() {
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Objects";
    objectName = document.getElementById("object_name").value;
    recognition.start();
}

function modelLoaded() {
    console.log("CoCoSSD model is loaded.");
    status = true;
}

function gotResults(error, results) {
    if(error) {
        console.error(error);
    }
    console.log(results);
    objects = results;
}