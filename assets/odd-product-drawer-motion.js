/* Controls presentation timing; product selection remains in the purchase module. */
(() => {
  'use strict';
  window.OddProductDrawerMotion = (modal) => {
    let timer;
    let frame;
    return {
      open() {
        clearTimeout(timer);
        cancelAnimationFrame(frame);
        modal.hidden = false;
        modal.classList.remove('is-closing');
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => modal.classList.add('is-open'));
        });
      },
      close(onClosed) {
        if (modal.hidden || modal.classList.contains('is-closing')) return;
        cancelAnimationFrame(frame);
        modal.classList.add('is-closing');
        modal.classList.remove('is-open');
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        timer = window.setTimeout(() => {
          modal.hidden = true;
          modal.classList.remove('is-closing');
          onClosed();
        }, reduced ? 0 : 280);
      },
    };
  };
})();
