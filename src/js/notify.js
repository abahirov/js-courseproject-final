import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../css/notify.css';
const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'top' },
  dismissible: true,
  ripple: false,
  types: [
    {
      type: 'success',
      icon: {
        className: 'notyf__icon--success',
        tagName: 'i',
      },
    },
    {
      type: 'error',
      icon: {
        className: 'notyf__icon--error',
        tagName: 'i',
      },
    },
  ],
});
function promoteToTopLayer() {
  const notyfContainer = document.querySelector('.notyf');
  if (!notyfContainer) return;
  if (!notyfContainer.hasAttribute('popover')) {
    notyfContainer.setAttribute('popover', 'manual');
  }
  try {
    if (notyfContainer.matches(':popover-open')) {
      notyfContainer.hidePopover();
    }
    notyfContainer.showPopover();
  } catch {
  }
}
export const notify = {
  success(message) {
    notyf.success(message);
    promoteToTopLayer();
  },
  error(message) {
    notyf.error(message);
    promoteToTopLayer();
  },
  warning(message) {
    notyf.open({
      type: 'warning',
      message,
    });
    promoteToTopLayer();
  },
  info(message) {
    notyf.open({
      type: 'info',
      message,
    });
    promoteToTopLayer();
  },
};
