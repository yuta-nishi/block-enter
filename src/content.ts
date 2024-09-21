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
  const isOnlyEnter = e.key === 'Enter' && !(e.ctrlKey || e.metaKey);
  const isTargetPage =
    (e.target as HTMLDivElement).role === 'textbox' || // gemini.google.com
    (e.target as HTMLTextAreaElement).tagName === 'TEXTAREA'; // www.perplexity.ai

  if (isOnlyEnter && isTargetPage) {
    e.stopPropagation();
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
