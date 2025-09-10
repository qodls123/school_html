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