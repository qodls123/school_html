document.addEventListener("DOMContentLoaded", () => {
  // 탭 전환
  const tabs = document.querySelectorAll(".tab-btn");
  const cards = document.querySelectorAll(".ai-card");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.target;
      cards.forEach(card => {
        card.classList.toggle("hidden", card.id !== target);
      });
    });
  });

  // 🌧️ Rain Prediction
  document.getElementById("rain-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const humidity = document.getElementById("humidity").value;
    const cloud = document.getElementById("cloud").value;
    const sunshine = document.getElementById("sunshine").value;
    const windspeed = document.getElementById("windspeed").value;

    try {
      const res = await fetch("http://127.0.0.1:4999/RainFall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ humidity, cloud, sunshine, windspeed }),
      });
      const data = await res.json();

      if (data.error) {
        document.getElementById("rain-result").innerHTML =
          `<p style="color:red;">에러: ${data.error}</p>`;
      } else {
        document.getElementById("rain-result").innerHTML =
          `<p>비 올 확률: ${(data.percent * 100).toFixed(2)}%</p>
           <p>결과: ${data.result === 1 ? "☔ 비가 올 가능성 높음" : "🌤️ 비 안 올 가능성 높음"}</p>`;
      }
    } catch (err) {
      document.getElementById("rain-result").innerHTML =
        `<p style="color:red;">서버 연결 실패 😢</p>`;
    }
  });

  // 🕵️ Deepfake Detection (파일 업로드)
  document.getElementById("deepfake-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("deepfake-file");
    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const res = await fetch("http://127.0.0.1:4999/APITest", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.error) {
        document.getElementById("deepfake-result").innerHTML =
          `<p style="color:red;">에러: ${data.error}</p>`;
      } else {
        document.getElementById("deepfake-result").innerHTML =
          `<p>분석 결과: ${data.result}</p>
           <p>신뢰도: ${data.probability}</p>`;
      }
    } catch (err) {
      document.getElementById("deepfake-result").innerHTML =
        `<p style="color:red;">서버 연결 실패 😢</p>`;
    }
  });

  // RAG Chatbot
document.getElementById("rag-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = document.getElementById("rag-question").value.trim();
  const resultDiv = document.getElementById("rag-result");
  resultDiv.textContent = "⏳ 답변을 불러오는 중...";

  try {
    const res = await fetch("http://localhost:4999/ChatRAG", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    });

    if (!res.ok) throw new Error("서버 오류 " + res.status);
    const data = await res.json();
    resultDiv.innerHTML = `
      <p><strong>답변:</strong> ${data.answer}</p>
      <p><em>출처:</em> ${data.sources.map(s => `[${s.id}] ${s.source}`).join(", ")}</p>
    `;
  } catch (err) {
    resultDiv.textContent = "❌ 오류: " + err.message;
  }
});

});
