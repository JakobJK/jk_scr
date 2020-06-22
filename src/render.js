const { desktopCapturer, remote } = require('electron');
const { writeFile } = require('fs');

const { Menu } = remote;

// Global state
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

// Buttons
const videoElement = document.querySelector('video');
const recordBtn = document.getElementById('recordBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');

recordBtn.onclick = e => {
  if (mediaRecorder.state === 'inactive'){
    mediaRecorder.start();
    recordBtn.innerText = 'Recording...';
  } else {
  mediaRecorder.stop();
  recordBtn.innerText = 'Record A New Video';
  }
};

videoSelectBtn.onclick = getVideoSources;

// Get the available video sources
async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['screen']
  });

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      };
    })
  );
  videoOptionsMenu.popup();
}

// Change the videoSource window to record
async function selectSource(source) {

  videoSelectBtn.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id
      }
    }
  };

  // Create a Stream
  const stream = await navigator.mediaDevices
    .getUserMedia(constraints);

  // Preview the source in a video element
  videoElement.srcObject = stream;
  videoElement.play();

  // Create the Media Recorder
  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(stream, options);

  // Register Event Handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;

  // Updates the UI
}

// Captures all recorded chunks
function handleDataAvailable(e) {
  console.log('video data available');
  recordedChunks.push(e.data);
}




// Saves the video file on stop
async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });

  const buffer = Buffer.from(await blob.arrayBuffer());
  const destination = path.resolve(contentFolder + `/vid-${Date.now()}.webm`);

    writeFile(destination, buffer, () => console.log('video saved successfully!'));
    setFiles();
  }


