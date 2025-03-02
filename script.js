let videos = [];
let currentIndex = 0;

// videos.txt에서 유튜브 링크 가져오기
async function loadVideos() {
    const response = await fetch('videos.txt');
    const data = await response.text();
    videos = data.split('\n').map(line => line.trim()).filter(line => line);

    if (videos.length > 0) {
        currentIndex = 0;
        updateVideo();
    }
}

// 동영상 변경
function changeVideo(direction) {
    currentIndex += direction;

    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= videos.length) {
        currentIndex = videos.length - 1;
    }

    updateVideo();
}

// 처음으로 버튼 클릭 시 첫 영상으로 이동
function restartVideos() {
    currentIndex = 0;
    updateVideo();
}

// iframe 업데이트 및 allow 속성 추가
function updateVideo() {
    const iframe = document.getElementById('videoFrame');
    iframe.src = videos[currentIndex];
    iframe.allow = "autoplay; controls; loop";  // ✅ allow 속성 적용

    document.getElementById('prevBtn').style.display = currentIndex === 0 ? "none" : "inline-block";
    document.getElementById('nextBtn').style.display = currentIndex === videos.length - 1 ? "none" : "inline-block";
    document.getElementById('homeBtn').style.display = currentIndex === videos.length - 1 ? "inline-block" : "none";
}

document.addEventListener('DOMContentLoaded', loadVideos);
