import { Storage } from '@plasmohq/storage';
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://chat.openai.com/*'],
};

/**
 * Prevent event dispatch when pressing Enter key alone.
 *
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
 *
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

/**
 * Handle preventDefaultEnter and dispatchCtrlEnter.
 *
 * @param e
 * @see preventDefaultEnter
 * @see dispatchCtrlEnter
 */
const handleKeyDown = (e: KeyboardEvent) => {
  preventDefaultEnter(e);
  dispatchCtrlEnter(e);
};

/**
 * Add preventDefaultEnter and dispatchCtrlEnter.
 *
 * @see preventDefaultEnter
 * @see dispatchCtrlEnter
 */
const addKeyDownListener = () => {
  document.addEventListener('keydown', handleKeyDown, { capture: true });
};

/**
 * Remove preventDefaultEnter and dispatchCtrlEnter.
 *
 * @see preventDefaultEnter
 * @see dispatchCtrlEnter
 */
const removeKeyDownListener = () => {
  document.removeEventListener('keydown', handleKeyDown, { capture: true });
};

const storage = new Storage();

(async () => {
  const enabled = await storage.get('enabled');
  if (enabled) {
    addKeyDownListener();
  }
})();

storage.watch({
  enabled: (c) => {
    if (c.newValue) {
      addKeyDownListener();
    } else {
      removeKeyDownListener();
    }
  },
});
