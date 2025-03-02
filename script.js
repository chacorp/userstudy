let referenceVideos = null;  // reference.csv 데이터를 한 번만 로드하도록 설정
let generatedVideos = [];    // videos.csv에서 불러온 데이터 저장
let currentIndex = 0;

// 특정 키워드 목록 (EC, DE, AE, BE, EB 등)
const keywords = ["AE", "BE", "CE", "DE", "EA", "EB", "EC", "ED"];

// CSV 파일을 읽어 JSON으로 변환하는 함수
async function loadCSV(file) {
    const response = await fetch(file);
    const data = await response.text();
    const rows = data.split("\n").map(row => row.trim()).filter(row => row);
    const headers = rows[0].split("\t"); // TSV 형식으로 구분
    return rows.slice(1).map(row => {
        const values = row.split("\t");
        return Object.fromEntries(headers.map((header, i) => [header, values[i] || ""])); // 값이 없을 경우 빈 문자열 할당
    });
}

async function initializeData() {
    if (!referenceVideos) {
        console.log("📌 [INFO] reference.csv 데이터 로드 시작");
        const refData = await loadCSV("reference.csv");

        referenceVideos = {};  // referenceVideos가 비어 있을 때만 로드
        refData.forEach(video => {
            if (video.title && video["Embedded link"]) {
                referenceVideos[video.title.trim()] = video["Embedded link"].trim();
            }
        });

        console.log("[DEBUG] referenceVideos 로드 완료:", Object.keys(referenceVideos));
    }

    console.log("📌 [INFO] videos.csv 데이터 로드 시작");
    const genData = await loadCSV("videos.csv");

    generatedVideos = []; // 기존 데이터 초기화 후 저장
    genData.forEach(video => {
        if (!video.title || !video["Embedded link"]) {
            console.warn("[WARN] videos.csv에서 잘못된 데이터 발견:", video);
            return;
        }

        const title = video.title.trim();
        const embeddedLink = video["Embedded link"].trim();

        let referenceTitle = findReferenceTitle(title);
        let referenceLink = referenceVideos[referenceTitle] || "";

        console.log(`▶ [INFO] 찾은 비디오: ${title}`);
        console.log(`  - 🎥 생성된 비디오 링크: ${embeddedLink}`);
        console.log(`  - 🔗 매칭된 레퍼런스: ${referenceTitle} → ${referenceLink || "없음"}`);

        // 리스트에 추가
        generatedVideos.push({ title, generatedLink: embeddedLink, referenceTitle, referenceLink });
    });

    console.log("[INFO] 총", generatedVideos.length, "개의 비디오 데이터가 로드됨");

    if (generatedVideos.length > 0) {
        currentIndex = 0;
        updateVideo();
    } else {
        console.error("[ERROR] 로드된 비디오가 없습니다!");
    }
}

// title에서 키워드 다음의 단어 찾기
function findReferenceTitle(title) {
    let trimmedTitle = title.trim(); // 앞뒤 공백 제거

    // 🔹 referenceVideos 객체에서 해당 title이 있는지 확인
    if (trimmedTitle in referenceVideos) {
        return trimmedTitle;
    }
    return "";
}


// 동영상 변경
function changeVideo(direction) {
    if (generatedVideos.length === 0) return;

    currentIndex += direction;

    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= generatedVideos.length) {
        currentIndex = generatedVideos.length - 1;
    }

    updateVideo();
}

// 처음으로 버튼 클릭 시 첫 영상으로 이동
function restartVideos() {
    if (generatedVideos.length === 0) return;

    currentIndex = 0;
    updateVideo();
}


function updateVideo() {
    if (generatedVideos.length === 0) {
        console.error("❌ [ERROR] 업데이트할 비디오가 없습니다!");
        return;
    }

    const videoData = generatedVideos[currentIndex];

    // 🔹 생성된 비디오 정보 표시
    document.getElementById("videoTitle").textContent = videoData.title;
    document.getElementById("generatedTitle").textContent = videoData.title;
    document.getElementById("generatedLink").textContent = videoData.generatedLink;
    document.getElementById("generatedVideo").src = videoData.generatedLink;
    document.getElementById("generatedVideo").allow = "autoplay; controls; loop; playsinline"; 
    
    if (videoData.referenceLink) {
        document.getElementById("referenceTitle").textContent = videoData.referenceTitle;
        document.getElementById("referenceLink").textContent = videoData.referenceLink;
        document.getElementById("referenceVideo").src = videoData.referenceLink;
        document.getElementById("referenceVideo").allow = "autoplay; controls; loop; playsinline"; 
        document.getElementById("referenceSection").style.display = "block";
    } else {
        document.getElementById("referenceSection").style.display = "none";
    }

    // 버튼 상태 업데이트
    document.getElementById("prevBtn").style.display = currentIndex === 0 ? "none" : "inline-block";
    document.getElementById("nextBtn").style.display = currentIndex === generatedVideos.length - 1 ? "none" : "inline-block";
    document.getElementById("homeBtn").style.display = currentIndex === generatedVideos.length - 1 ? "inline-block" : "none";
}
document.addEventListener("DOMContentLoaded", initializeData);
