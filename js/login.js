// ✅ localhost 대신 상대경로 사용
// const API_URL = "http://localhost:10000/api/users"; ❌
const API_URL = "/api/users";  // ✅ 이렇게 수정

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password }),
      credentials: "include" // ✅ 세션 유지
    });

    if (res.ok) {
      alert("로그인 성공!");
      location.href = "community.html"; // ✅ 로그인 후 이동할 페이지
    } else {
      const error = await res.text();
      alert("로그인 실패: " + error);
    }
  } catch (err) {
    console.error(err);
    alert("에러 발생: " + err.message);
  }
});
