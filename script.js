// async function loadVideo() {
//     const response = await fetch('videos.txt');
//     const data = await response.text();
//     const videos = data.split('\n').map(line => line.trim()).filter(line => line);

//     // 현재 페이지 번호 가져오기
//     const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
//     const videoIndex = parseInt(currentPage.replace('video', '')) - 1;

//     // 동영상 설정
//     if (videos[videoIndex]) {
//         document.getElementById('videoFrame').src = videos[videoIndex];

//         // 다음 페이지 버튼 설정
//         if (videoIndex < videos.length - 1) {
//             document.getElementById('nextBtn').href = `video${videoIndex + 2}.html`;
//         } else {
//             document.getElementById('nextBtn').style.display = "none"; // 마지막 페이지에서는 버튼 숨김
//         }
//     }
// }

// document.addEventListener('DOMContentLoaded', loadVideo);


async function loadVideo() {
    const response = await fetch('videos.txt');
    const data = await response.text();
    const videos = data.split('\n').map(line => line.trim()).filter(line => line);

    // 현재 페이지 번호 가져오기
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    const videoIndex = parseInt(currentPage.replace('video', '')) - 1;

    // 동영상 설정
    if (videos[videoIndex]) {
        document.getElementById('videoFrame').src = videos[videoIndex];

        // 버튼 설정
        const nextBtn = document.getElementById('nextBtn');
        const homeBtn = document.getElementById('homeBtn');

        if (videoIndex < videos.length - 1) {
            nextBtn.href = `video${videoIndex + 2}.html`;
            homeBtn.style.display = "none"; // 마지막 전까지는 "처음으로" 버튼 숨김
        } else {
            nextBtn.style.display = "none"; // 마지막 페이지에서는 "다음 영상" 버튼 숨김
            homeBtn.style.display = "inline-block"; // "처음으로" 버튼 표시
        }
    }
}

document.addEventListener('DOMContentLoaded', loadVideo);
