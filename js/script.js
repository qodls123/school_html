const skillBoxes = document.querySelectorAll('.skill-box');

skillBoxes.forEach(box => {
  box.addEventListener('click', () => {
    // 모든 box에서 active 제거
    skillBoxes.forEach(b => b.classList.remove('active'));

    // 클릭한 box만 active
    box.classList.add('active');
  });
});

gsap.registerPlugin(ScrollTrigger);


// 타임라인 방식: 줄마다 구간을 명확히 확보
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".main-video",   // 비디오+텍스트 섹션 전체를 기준
    start: "top top",
    end: "+=2600",            // ✅ 스크롤 구간 길게 → 느려짐 (필요시 3000~4000까지도)
    scrub: 1.8,               // ✅ 스크롤-애니메이션 연동을 부드럽게(저지연 스무딩)
    pin: true,
    anticipatePin: 1,
    // markers: true
  },
  defaults: { duration: 1.8, ease: "none" } // ✅ scrub일 땐 보통 ease 없거나 "none" 추천
});

// ✅ 변화가 눈에 띄도록 초기값(불투명도/크기/위치) 차이를 크게
tl.from(".video-text p:nth-child(1)", { opacity: 0.1})
  .to(".video-text p:nth-child(1)",   { opacity: 0.9, ease:"power2.out"}, "+=0.2")
  .from(".video-text p:nth-child(2)", { opacity: 0.2}, "+=0.6")
  .to(".video-text p:nth-child(2)",   { opacity: 0.9, ease:"power3.out"}, "+=0.2")
  .from(".video-text p:nth-child(3)", { opacity: 0.25}, "+=0.6")
  .to(".video-text p:nth-child(3)",   { opacity: 0.9, ease:"power4.out"}, "+=0.2");



// 헬퍼 함수: 특정 섹션의 요소를 스크롤시 아래에서 위로 등장시키기
function revealSection(sectionSelector, infoSelector, itemSelector, config = {}) {
  const { infoStagger = 0.3, itemStagger = 0.3 } = config;

  if (infoSelector) {
    gsap.from(`${sectionSelector} ${infoSelector}`, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      stagger: infoStagger,
      scrollTrigger: {
        trigger: sectionSelector,   // ✅ 부모 섹션 기준
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  }

  if (itemSelector) {
    gsap.fromTo(`${sectionSelector} ${itemSelector}`,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, stagger: itemStagger, duration: 1.2, ease: "power3.out" ,
        scrollTrigger: {
          trigger: sectionSelector,   // ✅ 부모 섹션 기준
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }
}



// WHY 섹션
revealSection(".why", ".why-wrap > p", ".why-info", {
  infoStagger: 0.4,
  itemStagger: 0.3
});

// ACH 섹션
revealSection(".ach", ".ach-wrap-info p", ".ach-wrap-skill .skill-box", ".ach-wrap-info a" ,{
  infoStagger: 0.4,
  itemStagger: 0.2
});

// SPECIALITY 섹션
revealSection(".speciality", ".speciality-title p", ".speciality-common div", {
  infoStagger: 0.3,
  itemStagger: 0.2
});
revealSection(".speciality", null, ".speciality-diff div", {
  itemStagger: 0.2
});

// CONTACT 섹션
revealSection(".contact", ".contact-title p", ".button button", {
  infoStagger: 0.3,
  itemStagger: 0.2
});



gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.querySelector(".up_down").addEventListener("click", () => {
  gsap.to(window, {
    duration: 1.2, 
    scrollTo: ".main-video", // 👈 이동할 섹션 선택자
    ease: "power2.inOut"
  });
});

const CtBtn=document.querySelectorAll(".contact-wrap .button button");

CtBtn.forEach(btn => {
  btn.addEventListener("mouseenter", function(){
    CtBtn.forEach( e => e.classList.remove("act"))

    btn.classList.add("act")
  })
})
CtBtn.forEach(btn => {
  btn.addEventListener("mouseout", function(){
    CtBtn.forEach( e => e.classList.remove("act"))

    btn.classList.remove("act")
  })
})


// 로그인 상태 표시
  async function checkLoginStatus() {
    const userMenu = document.getElementById("user-menu");

    try {
      const res = await fetch("http://localhost:10000/api/users/me", {
        method: "GET",
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
    } catch (err) {
      console.error("로그인 상태 확인 실패", err);
    }
  }

  async function logout() {
    try {
      await fetch("http://localhost:10000/api/users/logout", {
        method: "POST",
        credentials: "include"
      });
      alert("로그아웃 되었습니다");
      location.reload();
    } catch (err) {
      alert("로그아웃 실패");
    }
  }

  checkLoginStatus();

