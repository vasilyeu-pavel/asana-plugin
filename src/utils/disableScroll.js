const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];

const preventDefault = (e) => {
  e = e || window.event;
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.returnValue = false;
};

const keydown = (e) => {
  for (let i = keys.length; i--;) {
    if (e.keyCode === keys[i]) {
      preventDefault(e);
      return;
    }
  }
};

const wheel = e => preventDefault(e);

// MOBILE
const disableScrollMobile = () => {
  document.addEventListener('touchmove', preventDefault, false);
};

const enableScrollMobile = () => {
  document.removeEventListener('touchmove', preventDefault, false);
};

export const disableScroll = () => {
  if (window.addEventListener) {
    window.addEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = wheel;
  document.onkeydown = keydown;
  disableScrollMobile();
};

export const enableScroll = () => {
  if (window.removeEventListener) {
    window.removeEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = document.onkeydown = null;
  enableScrollMobile();
};
