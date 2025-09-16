// ✅ localhost 대신 상대경로 사용
const API_URL = "/api/boards";
const BASE_URL = "";  // 파일 경로는 도메인이 자동으로 붙으므로 빈 값 처리

const urlParams = new URLSearchParams(window.location.search);
const boardId = urlParams.get("id");

document.addEventListener("DOMContentLoaded", () => {
  loadBoard();
  loadComments();
});

/* ---------- 게시글 로딩 ---------- */
async function loadBoard() {
  if (!boardId) {
    alert("잘못된 접근입니다.");
    location.href = "community.html";
    return;
  }

  const response = await fetch(`${API_URL}/${boardId}`, { credentials: "include" });
  if (!response.ok) {
    alert("글을 불러오지 못했습니다.");
    location.href = "community.html";
    return;
  }

  const board = await response.json();

  document.querySelector("#title").textContent = board.title;
  document.querySelector("#author").textContent = board.author;
  document.querySelector("#createdAt").textContent = board.createdAt
    ? board.createdAt.substring(0, 10)
    : "";
  document.querySelector("#content").textContent = board.content;

  if (board.filePath) {
    const fileArea = document.querySelector("#file-area");
    fileArea.innerHTML = `
      <img src="${board.filePath}" 
           alt="첨부 이미지" 
           style="max-width:600px; margin-top:15px;">
    `;
  }

  // ✅ 본인만 수정/삭제 버튼 보이기
  try {
    const userRes = await fetch("/api/users/me", {
      credentials: "include"
    });

    if (userRes.ok) {
      const user = await userRes.json();
      if (user.nickname === board.author) {
        document.getElementById("edit-btn").style.display = "inline-block";
        document.getElementById("delete-btn").style.display = "inline-block";
      }
    }
  } catch (e) {
    console.error("로그인 정보 확인 실패", e);
  }
}

/* ---------- 수정 ---------- */
function goEdit() {
  location.href = `edit.html?id=${boardId}`;
}

/* ---------- 삭제 ---------- */
async function deleteBoard() {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  const res = await fetch(`${API_URL}/${boardId}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (res.ok) {
    alert("삭제 완료");
    location.href = "community.html";
  } else {
    alert("삭제 실패");
  }
}

/* ================================ */
/*           댓글 기능              */
/* ================================ */

/* ---------- 댓글 불러오기 ---------- */
async function loadComments() {
  const response = await fetch(`${API_URL}/${boardId}/comments`, { credentials: "include" });
  const comments = await response.json();

  const userRes = await fetch("/api/users/me", {
    credentials: "include"
  });
  const currentUser = userRes.ok ? await userRes.json() : null;

  const list = document.querySelector("#comment-list");
  list.innerHTML = "";

  comments.forEach(comment => {
    const li = document.createElement("li");
    li.className = "comment-item";
    li.innerHTML = `
      <p><strong>${comment.author}</strong> (${comment.createdAt?.substring(0, 10) || ""})</p>
      <p>${comment.content}</p>
    `;

    // 수정/삭제 버튼
    if (currentUser && currentUser.nickname === comment.author) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "수정";
      editBtn.classList.add("comment-edit-btn");
      editBtn.onclick = () => editComment(comment.id, comment.content);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "삭제";
      deleteBtn.classList.add("comment-delete-btn");
      deleteBtn.onclick = () => deleteComment(comment.id);

      const btnWrapper = document.createElement("div");
      btnWrapper.classList.add("comment-btn-group");
      btnWrapper.appendChild(editBtn);
      btnWrapper.appendChild(deleteBtn);

      li.appendChild(btnWrapper);
    }

    list.appendChild(li);
  });
}

/* ---------- 댓글 등록 ---------- */
async function addComment() {
  const content = document.querySelector("#comment-content").value.trim();

  if (!content) {
    alert("내용을 입력하세요!");
    return;
  }

  try {
    // 사용자 정보 확인만 하면 됨 (닉네임은 백엔드에서 자동 주입)
    const res = await fetch("/api/users/me", { credentials: "include" });

    if (!res.ok) {
      alert("로그인 후 댓글 작성이 가능합니다.");
      return;
    }

    // ✅ author는 보내지 말고 content만 전달
    const response = await fetch(`${API_URL}/${boardId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content })   // 👈 수정
    });

    if (response.ok) {
      alert("댓글이 등록되었습니다.");
      document.querySelector("#comment-content").value = "";
      loadComments();
    } else {
      const err = await response.text();
      alert("댓글 등록 실패: " + err);
    }
  } catch (e) {
    console.error("댓글 작성 실패", e);
  }
}


/* ---------- 댓글 삭제 ---------- */
async function deleteComment(id) {
  if (!confirm("댓글을 삭제하시겠습니까?")) return;

  const response = await fetch(`${API_URL}/${boardId}/comments/${id}`, {
    method: "DELETE",
    credentials: "include" // ✅ 세션 포함
  });

  if (response.ok) {
    loadComments();
  } else {
    const err = await response.text();
    alert("댓글 삭제 실패: " + err);
  }
}

/* ---------- 댓글 수정 ---------- */
async function editComment(id, content) {
  document.querySelector("#comment-content").value = content;

  const btn = document.querySelector(".comment-form button");
  btn.textContent = "수정 완료";
  btn.onclick = async () => {
    const newContent = document.querySelector("#comment-content").value;

    const response = await fetch(`${API_URL}/${boardId}/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ 세션 포함
      body: JSON.stringify({ content: newContent })
    });

    if (response.ok) {
      alert("댓글이 수정되었습니다.");
      loadComments();

      btn.textContent = "등록";
      btn.onclick = addComment;
      document.querySelector("#comment-content").value = "";
    } else {
      const err = await response.text();
      alert("댓글 수정 실패: " + err);
    }
  };
}
