const API_URL = "http://localhost:10000/api/users";

document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;
  const realName = document.getElementById("realName").value;
  const email = document.getElementById("email").value;
  const nickname = document.getElementById("nickname").value;

  if (password !== passwordConfirm) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        realName,
        email,
        nickname
      })
    });

    if (res.ok) {
      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      location.href = "login.html";
    } else {
      const error = await res.text();
      alert("회원가입 실패: " + error);
    }
  } catch (err) {
    alert("에러 발생: " + err.message);
  }
});
