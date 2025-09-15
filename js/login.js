// login.js (수정 후)

// ❗ Spring Security의 로그인 처리 경로는 /api/login 입니다.
const LOGIN_API_URL = "/api/login";

document.getElementById("loginBtn").addEventListener("click", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // ❗ Spring Security는 form-data 형식을 사용하므로, URLSearchParams로 데이터를 만듭니다.
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  try {
    const res = await fetch(LOGIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData,
      credentials: "include"
    });

    if (res.ok) {
      alert("로그인 성공!");
      location.href = "community.html"; // 로그인 성공 후 커뮤니티 페이지로 이동
    } else if (res.status === 401) {
      // SecurityConfig에서 설정한 실패 핸들러가 401 코드를 반환합니다.
      alert("로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.");
    } else {
      // 그 외 404, 500 등 다른 서버 에러
      const errorText = await res.text();
      alert("로그인 중 문제가 발생했습니다: " + errorText);
    }
  } catch (err) {
    // "Failed to fetch"와 같은 네트워크 레벨 에러
    alert("서버와 통신 중 에러가 발생했습니다: " + err.message);
  }
});