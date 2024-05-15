function updatePlayhead() {
    const progress = (mainVideo.currentTime / mainVideo.duration) * timeline.offsetWidth;
    playhead.style.left = `${progress}px`;
    if (!mainVideo.paused) {
        requestAnimationFrame(updatePlayhead);
    }
}

const timeline = document.getElementById('timeline');
const playhead = document.getElementById('playhead');
const mainVideo = document.getElementById('mainVideo');
const startTimeElement = document.getElementById('startTime');
const endTimeElement = document.getElementById('endTime');
const sliderTime = document.getElementById('sliderTime');
const sliderZoom = document.getElementById('sliderZoom');
const thumbnailsContainer = document.getElementById('thumbnails');

function getTimeString(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
}

function updateTimes() {
    startTimeElement.innerText = getTimeString(mainVideo.currentTime);
    endTimeElement.innerText = getTimeString(mainVideo.duration);
    sliderTime.max = Math.floor(mainVideo.duration);
}

function play() {
    mainVideo.play();
    requestAnimationFrame(updatePlayhead);
}

function pause() {
    mainVideo.pause();
}

function stop() {
    mainVideo.pause();
    mainVideo.currentTime = 0;
    updatePlayhead();
}

function generateThumbnails() {
    const interval = 1; // Capture a frame every 5 seconds
    for (let i = 0; i < mainVideo.duration; i += interval) {
        createThumbnail(i);
    }
}

function createThumbnail(timeInSeconds) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 50;
    canvas.height = 50;
    const thumbnail = document.createElement('div');
    thumbnail.classList.add('thumbnail');
    thumbnail.appendChild(canvas);
    thumbnail.onclick = () => {
        mainVideo.currentTime = timeInSeconds;
        updatePlayhead();
    };
    thumbnailsContainer.appendChild(thumbnail);

    const currentVideoTime = mainVideo.currentTime;
    mainVideo.currentTime = timeInSeconds;
    mainVideo.addEventListener('seeked', function captureFrame() {
        ctx.drawImage(mainVideo, 0, 0, canvas.width, canvas.height);
        mainVideo.currentTime = currentVideoTime;
        mainVideo.removeEventListener('seeked', captureFrame);
    }, { once: true });
}

mainVideo.addEventListener('loadedmetadata', () => {
    updateTimes();
    generateThumbnails();
});

mainVideo.addEventListener('timeupdate', updateTimes);

sliderTime.addEventListener('input', () => {
    mainVideo.currentTime = sliderTime.value;
    updatePlayhead();
});

sliderZoom.addEventListener('input', () => {
    const zoomLevel = sliderZoom.value;
    timeline.style.width = `${zoomLevel}%`;
});