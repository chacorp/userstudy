async function loadVideo() {
    const response = await fetch('videos.txt');
    const data = await response.text();
    const videos = data.split('\n').map(line => line.trim()).filter(line => line);
    
    const videoElement = document.querySelector('video source');
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const videoIndex = parseInt(currentPage.replace('video', '')) - 1;

    if (videos[videoIndex]) {
        videoElement.src = videos[videoIndex];
        videoElement.parentElement.load(); // 비디오 로드
    }
}

document.addEventListener('DOMContentLoaded', loadVideo);
