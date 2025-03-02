let generatedVideos = [];  // videos.csv 데이터
let referenceVideos = {};  // reference.csv 데이터 (title → Embedded link 매핑)
let currentIndex = 0;

// 특정 키워드 목록 (EC, DE, AE, BE, EB 등)
const keywords = ["AE", "BE", "CE", "DE", "EA", "EB", "EC", "ED"];

// CSV 파일을 읽어와 JSON으로 변환하는 함수
async function loadCSV(file) {
    const response = await fetch(file);
    const data = await response.text();
    const rows = data.split("\n").map(row => row.trim()).filter(row => row);
    const headers = rows[0].split("\t"); // TSV 형식으로 구분
    return rows.slice(1).map(row => {
        const values = row.split("\t");
        return Object.fromEntries(headers.map((header, i) => [header, values[i]]));
    });
}

// videos.csv + reference.csv 로드
async function loadVideos() {
    const refData = await loadCSV("reference.csv");
    const genData = await loadCSV("videos.csv");

    // reference.csv에서 title → Embedded link 매핑
    refData.forEach(video => {
        referenceVideos[video.title.trim()] = video["Embedded link"].trim();
    });

    // videos.csv에서 title, Embedded link 저장
    genData.forEach(video => {
        const title = video.title.trim();
        const embeddedLink = video["Embedded link"].trim();
        
        // 레퍼런스 비디오 찾기 (title에서 특정 키워드 다음의 텍스트 추출)
        let referenceTitle = findReferenceTitle(title);
        let referenceLink = referenceVideos[referenceTitle] || "";

        // 리스트에 추가
        generatedVideos.push({ title, generatedLink: embeddedLink, referenceLink });
    });

    if (generatedVideos.length > 0) {
        currentIndex = 0;
        updateVideo();
    }
}

// title에서 키워드 다음의 비디오 코드 찾기
function findReferenceTitle(title) {
    let words = title.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (keywords.includes(words[i])) {
            // 키워드 다음의 단어들을 조합하여 레퍼런스 title 찾기
            return words.slice(i + 1, i + 4).join(" ").trim(); // 보통 3개 단어 조합 (예: "057 SEN 01")
        }
    }
    return "";
}

// 동영상 변경
function changeVideo(direction) {
    currentIndex += direction;

    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= generatedVideos.length) {
        currentIndex = generatedVideos.length - 1;
    }

    updateVideo();
}

// 처음으로 버튼 클릭 시 첫 영상으로 이동
function restartVideos() {
    currentIndex = 0;
    updateVideo();
}

// iframe 업데이트 및 버튼 상태 변경
function updateVideo() {
    const videoData = generatedVideos[currentIndex];

    document.getElementById("videoTitle").textContent = videoData.title;
    document.getElementById("referenceVideo").src = videoData.referenceLink || "";
    document.getElementById("referenceVideo").allow = "autoplay; controls; loop; playsinline"; 
    
    document.getElementById("generatedVideo").src = videoData.generatedLink;
    document.getElementById("generatedVideo").allow = "autoplay; controls; loop; playsinline"; 

    document.getElementById("prevBtn").style.display = currentIndex === 0 ? "none" : "inline-block";
    document.getElementById("nextBtn").style.display = currentIndex === generatedVideos.length - 1 ? "none" : "inline-block";
    document.getElementById("homeBtn").style.display = currentIndex === generatedVideos.length - 1 ? "inline-block" : "none";
}

document.addEventListener("DOMContentLoaded", loadVideos);
