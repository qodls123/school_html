// ✅ 배포 환경에서는 절대 localhost 쓰지 않기
// const API_URL = "http://localhost:10000/api/boards"; ❌
const API_URL = "/api/boards";  // ✅ 상대경로 사용

async function createBoard() {
  const form = document.getElementById("writeForm");
  const formData = new FormData(form);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
      credentials: "include" // ✅ 세션/쿠키 전달 (로그인 유지용)
    });

    if (response.ok) {
      alert("글이 등록되었습니다!");
      window.location.href = "community.html";
    } else {
      const error = await response.text();
      alert("등록 실패: " + error);
    }
  } catch (err) {
    console.error(err);
    alert("에러 발생: " + err.message);
  }
}
