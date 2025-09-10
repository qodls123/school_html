document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".professor-card").forEach((card) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",           // 카드 윗부분이 뷰포트 85% 지점에 왔을 때
          toggleActions: "play none none none", // 한번만 재생
          // markers: true,            // 디버그용
        }
      });
    });
  });