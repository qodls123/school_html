//gsap
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // 초기 상태
  gsap.set('.invite-title p', { opacity: 0.15 });
  // CSS에서 .vertical-line { --fill: 33.3%; } 또는 0%로 시작해두세요.

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.invite',
      start: 'top top',
      end: '+=150%',   // ✅ 핀 유지 거리 늘려서 전체적으로 여유 있게
      pin: true,
      scrub: 1.0,      // ✅ 스무딩(값이 클수록 부드럽고 약간 더디게 체감)
      anticipatePin: 1,
      // markers: true
    }
  });

  // 0% ~ 35% : AI 서서히 진해짐
  tl.to('.invite-title p:nth-child(1)', {
      opacity: 1,
      duration: 0.35,
      ease: 'none'
    }, 0.00)

    // 35% ~ 70% : ENGINEERING 서서히 진해짐
    .to('.invite-title p:nth-child(2)', {
      opacity: 1,
      duration: 0.35,
      ease: 'none'
    }, 0.35)

    // 70% ~ 92% : 세로 라인 채우기
    .to('.vertical-line', {
      '--fill': '100%',
      duration: 0.22,
      ease: 'none'
    }, 0.70)

    // 92% ~ 100% : ✅ 시각적 변화 없는 '홀드 구간' (잠깐 멈추는 느낌)
    // 내용 읽을 텀을 주기 위해 더미 트윈을 넣어 핀 상태를 조금 더 유지
    .to({}, { duration: 0.08 }); // 값은 취향(0.08~0.15 권장)
});



//취업처 로고 애니메이션
  // 최종 좌표 (섹션 width 1600, height 800 기준)
  const TARGETS = {
    1:  { x: 150,  y: 100 },
    2:  { x: 800,  y:  80 },
    3:  { x: 1400, y: 110 },
    4:  { x: 520,  y: 230 },
    5:  { x: 1100, y: 230 },
    6:  { x: 360,  y: 380 },
    7:  { x: 1240, y: 380 },
    8:  { x: 520,  y: 560 },
    9:  { x: 1100, y: 560 },
    10: { x: 150,  y: 700 },
    11: { x: 800,  y: 700 },
    12: { x: 1400, y: 700 }
  };

  // 각 행별 지그재그 오프셋(px)
  const ROW_SHIFT = {
    top:   -10,   // 1,2,3
    midUp: -6,    // 4,5
    mid:    0,    // 6,7,8,9
    bot:    8     // 10,11,12
  };

  function setupVectors(sectionEl) {
    const sec = sectionEl.getBoundingClientRect();
    const cx = sec.left + sec.width / 2;
    const cy = sec.top + sec.height / 2;

    const margin = 70;
    const xRange = sec.width / 2 - margin;
    const yRange = sec.height / 2 - margin;

    const rand = (a, b) => Math.random() * (b - a) + a;

    sectionEl.querySelectorAll('.logo').forEach((el, i) => {
      const key = el.dataset.key;
      const tgt = TARGETS[key];
      if (!tgt) return;

      // 최종 좌표를 CSS 변수로
      el.style.setProperty('--x', tgt.x + 'px');
      el.style.setProperty('--y', tgt.y + 'px');

      // 중앙 → 최종 벡터
      const finalX = sec.left + tgt.x;
      const finalY = sec.top + tgt.y;
      el.style.setProperty('--fromX', (cx - finalX).toFixed(1) + 'px');
      el.style.setProperty('--fromY', (cy - finalY).toFixed(1) + 'px');

      // 섹션 범위 내 랜덤 퍼짐
      el.style.setProperty('--sx', rand(-xRange, xRange).toFixed(1) + 'px');
      el.style.setProperty('--sy', rand(-yRange, yRange).toFixed(1) + 'px');
      el.style.setProperty('--rot', rand(-20, 20).toFixed(1) + 'deg');

      // 스태거 딜레이
      el.style.setProperty('--delay', (0.06 * i).toFixed(2) + 's');

      // 지그재그
      const rShift =
        (key <= 3) ? ROW_SHIFT.top :
        (key == 4 || key == 5) ? ROW_SHIFT.midUp :
        (key >= 6 && key <= 9) ? ROW_SHIFT.mid :
                                 ROW_SHIFT.bot;
      el.style.setProperty('--rowShift', rShift + 'px');
    });
  }

  // IntersectionObserver → 발동
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const section = entry.target;
      setupVectors(section);

      const DUR = 2200; // CSS --dur 과 동일 (ms)

      section.querySelectorAll('.logo').forEach((el) => {
        const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) * 1000 || 0;

        // 1) 폭발 시작
        el.classList.add('boom');

        // 2) 애니메이션 중간쯤에 headline 위로 올라오게
        setTimeout(() => {
          el.classList.add('above');
        }, delay + DUR * 0.6);

        // 3) 끝나면 지그재그 정착
        setTimeout(() => {
          el.classList.add('settled');
        }, delay + DUR);
      });

      obs.unobserve(section); // 한 번만 발동 (여러 번 하고 싶으면 제거)
    });
  }, { threshold: 0.25 });

  document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.job');
    if (!section) return;
    io.observe(section);

    // 리사이즈 시 벡터 재계산
    window.addEventListener('resize', () => setupVectors(section));
  });


// 질문 화살표 부분

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-question').forEach(q => {
    const arrow  = q.querySelector('.faq-arrow');
    const answer = q.nextElementSibling;                  // .faq-answer
    const inner  = answer.querySelector('.faq-answer-inner');

    // 초기: 닫힘 상태로 강제
    answer.style.height = '0px';

    arrow.addEventListener('click', () => {
      const isOpen = answer.classList.toggle('is-open');

      if (isOpen) {
        // 열 때: 컨텐츠 실제 높이로 애니메이션
        const target = inner.scrollHeight;
        answer.style.height = target + 'px';
        arrow.classList.add('rotate');

        // 애니메이션이 끝나면 height:auto로 바꿔 반응형 대응
        const onEnd = () => {
          answer.style.height = 'auto';
          answer.removeEventListener('transitionend', onEnd);
        };
        answer.addEventListener('transitionend', onEnd);
      } else {
        // 닫을 때: 현재 auto면 픽셀값으로 고정 후 0으로
        const current = answer.scrollHeight;
        answer.style.height = current + 'px';
        // 강제 리플로우로 트랜지션 인식
        answer.offsetHeight; 
        answer.style.height = '0px';
        arrow.classList.remove('rotate');
      }
    });
  });

  // 창 크기 변경 시 열려있는 항목 높이 재계산
  window.addEventListener('resize', () => {
    document.querySelectorAll('.faq-answer.is-open').forEach(answer => {
      const inner = answer.querySelector('.faq-answer-inner');
      answer.style.height = 'auto'; // auto로 두면 자연스럽게 적응
    });
  });
});

