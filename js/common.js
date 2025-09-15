// common.js (수정 후)

// 1. 헤더 동적 삽입
async function loadHeader() {
  const header = document.querySelector("header");
  if (!header) return;

  try {
    const res = await fetch("/components/header.html");
    const html = await res.text();
    header.innerHTML = html;
    checkLoginStatus(); // 헤더가 로드된 후 로그인 상태 체크
  } catch (e) {
    console.error("헤더 불러오기 실패", e);
  }
}

// 2. 로그인 상태 확인 (이 부분은 기존 코드와 거의 동일합니다)
async function checkLoginStatus() {
  const userMenu = document.getElementById("user-menu");
  if (!userMenu) return;

  try {
    const res = await fetch("/api/users/me"); // credentials 옵션 생략 가능

    if (res.ok) {
      const user = await res.json();
      userMenu.innerHTML = `
        <span style="color:white;">${user.nickname}님</span>
        <button onclick="logout()" style="margin-left:10px;">로그아웃</button>
      `;
    } else {
      userMenu.innerHTML = `
        <a href="login.html">Login</a> / <a href="signup.html">Sign Up</a>
      `;
    }
  } catch (e) {
    console.error("로그인 상태 확인 실패", e);
  }
}

// 3. 로그아웃 처리
async function logout() {
  try {
    // ⛔️ 수정 전: /api/users/logout
    // await fetch("/api/users/logout", {

    // ✅ 수정 후: /api/logout (SecurityConfig에 정의된 경로)
    await fetch("/api/logout", {
      method: "POST"
    });
    alert("로그아웃 되었습니다");
    location.reload();
  } catch (e) {
    alert("로그아웃 실패");
  }
}

// 4. 글쓰기 권한 확인 (이 부분은 기존 코드와 동일합니다)
async function checkWritePermission() {
  try {
    const res = await fetch("/api/users/me");
    if (res.ok) {
      const writeBtn = document.getElementById("write-btn");
      if (writeBtn) writeBtn.style.display = "inline-block";
    }
  } catch (e) {
    console.error("글쓰기 권한 확인 실패", e);
  }
}

// --- 이벤트 리스너 ---
window.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  // community.html 또는 글쓰기 버튼이 있는 페이지에서만 실행되도록 조건 추가 가능
  if (document.getElementById("write-btn")) {
      checkWritePermission();
  }
});