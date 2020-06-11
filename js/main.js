/* Constant */
const FRAME_WIDTH = 900;
const FRAME_HEIGHT = 500;

/* Elements */
const audios = document.querySelectorAll(".audio");
const animations = document.querySelectorAll(".animation");
const video = document.querySelector("#video");
const background = document.querySelector("#video-background");

/* WebCam data */
navigator.mediaDevices
  .getUserMedia({
    video: { width: FRAME_WIDTH, height: FRAME_HEIGHT },
    audio: false,
  })
  .then((stream) => {
    video.srcObject = stream;
    background.srcObject = stream;
  })
  .catch((err) => {});

/* Face Tracking */
var objects = new tracking.ObjectTracker("face");
objects.setInitialScale(4);
objects.setStepSize(2);
objects.setEdgesDensity(0.1);

objects.on("track", function (event) {
  event.data.forEach(function (rect) {
    let x = rect.x + rect.width / 2;
    let y = rect.y + rect.height / 2;
    let id = find_group(x, y);
    console.log(id);
    handle_music(id);
  });
});

tracking.track("#video", objects);

/* Helper Functions */
const find_group = (x, y) => {
  if (x >= 0 && x <= FRAME_WIDTH / 2 && y >= 0 && y <= FRAME_HEIGHT / 2)
    return 0;
  if (
    x >= FRAME_WIDTH / 2 &&
    x <= FRAME_WIDTH &&
    y >= 0 &&
    y <= FRAME_HEIGHT / 2
  )
    return 1;
  if (
    x >= 0 &&
    x <= FRAME_WIDTH / 2 &&
    y >= FRAME_HEIGHT / 2 &&
    y <= FRAME_HEIGHT
  )
    return 2;
  if (
    x >= FRAME_WIDTH / 2 &&
    x <= FRAME_WIDTH &&
    y >= FRAME_HEIGHT / 2 &&
    y <= FRAME_HEIGHT
  )
    return 3;
};

const handle_music = (id) => {
  if (!audios[id].paused || !animations[id].paused) {
    return;
  }

  for (let x = 0; x < 4; x++) {
    audios[x].pause();
    animations[x].pause();
  }
  audios[id].play();
  animations[id].play();
};
