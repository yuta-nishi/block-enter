import { sendToBackground } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';
import type { PlasmoCSConfig } from 'plasmo';

// Hardcoding is required because defining variables externally does not correctly
// propagate to manifest.json.
export const config: PlasmoCSConfig = {
  matches: [
    'https://chatgpt.com/*',
    'https://gemini.google.com/*',
    'https://www.perplexity.ai/*',
  ],
};

const preventDefaultEnter = (e: KeyboardEvent) => {
  const isOnlyEnter = e.key === 'Enter' && !e.shiftKey && !(e.ctrlKey || e.metaKey);

  const isChatApp =
    (e.target as HTMLDivElement).role === 'textbox' || // gemini.google.com
    (e.target as HTMLTextAreaElement).tagName === 'TEXTAREA'; // www.perplexity.ai

  if (isOnlyEnter && isChatApp) {
    e.stopPropagation();
  }

  // Prevent the keydown event to disable the send function of
  // the text area when using a rich editor (e.g. ProseMirror)
  const isChatAppExtra = (e.target as HTMLDivElement).id === 'prompt-textarea'; // chatgpt.com

  if (isOnlyEnter && isChatAppExtra) {
    e.preventDefault();

    const newEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    (e.target as HTMLDivElement).dispatchEvent(newEvent);
  }
};

const addKeyDownListener = () => {
  document.addEventListener('keydown', preventDefaultEnter, { capture: true });
};

const removeKeyDownListener = () => {
  document.removeEventListener('keydown', preventDefaultEnter, { capture: true });
};

const storage = new Storage();

(async () => {
  const enabled = await storage.get<boolean>('enabled');
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

    sendToBackground({
      name: 'enabled-changed',
      body: {
        enabled: c.newValue,
      },
    });
  },
});
