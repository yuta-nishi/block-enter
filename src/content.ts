import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://chat.openai.com/*'],
};

/**
 * Prevent event dispatch when pressing Enter key alone.
 * @param e
 */
const preventDefaultEnter = (e: KeyboardEvent) => {
  if (
    e.key === 'Enter' &&
    !(e.ctrlKey || e.metaKey) &&
    e.target instanceof HTMLTextAreaElement
  ) {
    e.stopPropagation();
  }
};

/**
 * Dispatch the original Enter key event when pressing Ctrl/Cmd + Enter.
 * @param e
 */
const dispatchCtrlEnter = (e: KeyboardEvent) => {
  if (e.metaKey && e.key === 'Enter' && e.target instanceof HTMLTextAreaElement) {
    const newEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      metaKey: true,
    });
    e.target.dispatchEvent(newEvent);
  }

  if (e.ctrlKey && e.key === 'Enter' && e.target instanceof HTMLTextAreaElement) {
    const newEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      ctrlKey: true,
    });
    e.target.dispatchEvent(newEvent);
  }
};

document.addEventListener(
  'keydown',
  (e: KeyboardEvent) => {
    preventDefaultEnter(e);
    dispatchCtrlEnter(e);
  },
  { capture: true },
);
