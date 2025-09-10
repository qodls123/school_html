// 1. 헤더 동적 삽입
async function loadHeader() {
  const header = document.querySelector("header");
  if (!header) return;

  try {
    const res = await fetch("/components/header.html"); // 루트 기준 경로
    const html = await res.text();
    header.innerHTML = html;

    checkLoginStatus(); // 로그인 상태 체크는 헤더 삽입 후 실행
  } catch (e) {
    console.error("헤더 불러오기 실패", e);
  }
}

// 2. 로그인 상태 확인
async function checkLoginStatus() {
  const userMenu = document.getElementById("user-menu");
  if (!userMenu) return;

  try {
    // ✅ localhost → 상대 경로
    const res = await fetch("/api/users/me", {
      credentials: "include"
    });

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
    // ✅ localhost → 상대 경로
    await fetch("/api/users/logout", {
      method: "POST",
      credentials: "include"
    });
    alert("로그아웃 되었습니다");
    location.reload();
  } catch (e) {
    alert("로그아웃 실패");
  }
}

window.addEventListener("DOMContentLoaded", loadHeader);

// 비로그인 사용자 제한
async function checkWritePermission() {
  try {
    // ✅ localhost → 상대 경로
    const res = await fetch("/api/users/me", {
      credentials: "include"
    });

    if (res.ok) {
      // 로그인 상태면 글쓰기 버튼 보여줌
      const writeBtn = document.getElementById("write-btn");
      if (writeBtn) writeBtn.style.display = "inline-block";
    }
  } catch (e) {
    console.error("글쓰기 권한 확인 실패", e);
  }
}

// community.html에서 실행
window.addEventListener("DOMContentLoaded", () => {
  checkWritePermission();
});
