import {
  FilesetResolver,
  HandLandmarker,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const puntero = document.getElementById("puntero-mano");

let video = document.getElementById("webcam");
let canvas = document.getElementById("hand-canvas");
let ctx = canvas.getContext("2d");
let handLandmarker;

let dragging = false;
let grabbedElement = null;

(async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 1,
  });

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  video.onloadeddata = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.style.width = `${video.videoWidth}px`;
    canvas.style.height = `${video.videoHeight}px`;
    loop();
  };
})();

let pointerX = 0;
let pointerY = 0;

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = performance.now();
  const results = handLandmarker.detectForVideo(video, now);

  if (results.landmarks.length > 0) {
    document.getElementById("mano-status").textContent = "🟢 Hand detected";

    const index = results.landmarks[0][8];
    const thumb = results.landmarks[0][4];

    // Calculamos posición objetivo del puntero
    const targetX = (1 - index.x) * window.innerWidth;
    const targetY = index.y * window.innerHeight;

    // Interpolación: suavizar el movimiento
    pointerX += (targetX - pointerX) * 0.2;
    pointerY += (targetY - pointerY) * 0.2;

    drawCursor(pointerX, pointerY);

    puntero.style.display = "block";
    puntero.style.left = `${pointerX - 10}px`;
    puntero.style.top = `${pointerY - 10}px`;

    const pinch = getDistance(index, thumb) < 0.05;
    if (pinch) {
      puntero.classList.add("pinching");
    } else {
      puntero.classList.remove("pinching");
    }

    if (pinch && !dragging) {
      const element = document.elementFromPoint(pointerX, pointerY);
      if (element && element.classList.contains("draggable-word")) {
        grabbedElement = element;
        dragging = true;
      }
    }

    if (!pinch && dragging) {
      const dropTarget = findClosestDropZone(pointerX, pointerY);
      if (dropTarget) {
        const current = dropTarget.querySelector(".draggable-word");
        if (current) {
          document.querySelector(".word-bank").appendChild(current);
        }
        dropTarget.appendChild(grabbedElement);
      } else {
        document.querySelector(".word-bank").appendChild(grabbedElement);
      }

      resetGrabbed();
    }

    if (dragging && grabbedElement) {
      grabbedElement.style.position = "absolute";
      grabbedElement.style.left = `${pointerX - grabbedElement.offsetWidth / 2}px`;
      grabbedElement.style.top = `${pointerY - grabbedElement.offsetHeight / 2}px`;
      grabbedElement.style.zIndex = 9999;
    }
  } else {
    document.getElementById("mano-status").textContent = "🔴 Hand not detected!";
    puntero.style.display = "none";
    resetGrabbed();
  }

  requestAnimationFrame(loop);
}

function findClosestDropZone(x, y) {
  const dropZones = document.querySelectorAll('.drop-zone');
  let closest = null;
  let minDist = 50; // radio de tolerancia

  dropZones.forEach(zone => {
    const rect = zone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

    if (dist < minDist) {
      minDist = dist;
      closest = zone;
    }
  });

  return closest;
}



function resetGrabbed() {
  if (grabbedElement) {
    grabbedElement.style.position = "relative";
    grabbedElement.style.left = "";
    grabbedElement.style.top = "";
    grabbedElement.style.zIndex = "";
  }
  grabbedElement = null;
  dragging = false;
}

function drawCursor(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(0, 150, 255, 0.5)";
  ctx.fill();
  ctx.strokeStyle = "#0077ff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function getDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
