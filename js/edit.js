const API_URL = "http://localhost:10000/api/boards";

// 쿼리스트링에서 id 가져오기
const urlParams = new URLSearchParams(window.location.search);
const boardId = urlParams.get("id");

// 페이지 로딩 시 기존 글 불러오기
document.addEventListener("DOMContentLoaded", loadBoard);

async function loadBoard() {
  if (!boardId) {
    alert("잘못된 접근입니다.");
    location.href = "community.html";
    return;
  }

  const response = await fetch(`${API_URL}/${boardId}`);
  if (response.ok) {
    const board = await response.json();

    // 작성자(author)는 더 이상 프론트에서 수정하지 않음
    document.querySelector("#title").value = board.title;
    document.querySelector("#content").value = board.content;

  } else {
    alert("글을 불러오지 못했습니다.");
    location.href = "community.html";
  }
}

// 수정 요청
async function updateBoard() {
  const form = document.getElementById("editForm");
  const formData = new FormData(form);

  try {
    const response = await fetch(`${API_URL}/${boardId}`, {
      method: "PUT",
      body: formData,
      credentials: "include" // ✅ 세션 쿠키 포함 (중요!)
    });

    if (response.ok) {
      alert("수정 완료!");
      location.href = `detail.html?id=${boardId}`;
    } else {
      const error = await response.text();
      alert("수정 실패: " + error);
    }
  } catch (err) {
    console.error(err);
    alert("에러 발생: " + err.message);
  }
}
