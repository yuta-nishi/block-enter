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
    'https://claude.ai/*',
  ],
  run_at: 'document_start', // Run as soon as possible. Required especially for claude.
};

const preventDefaultEnter = (e: KeyboardEvent) => {
  const currUrl = window.location.href;
  const isOnlyEnter = e.key === 'Enter' && !e.shiftKey && !(e.ctrlKey || e.metaKey);

  const isChatApp =
    (currUrl.includes('gemini.google.com') &&
      (e.target as HTMLDivElement).role === 'textbox') ||
    (currUrl.includes('www.perplexity.ai') &&
      (e.target as HTMLTextAreaElement).tagName === 'TEXTAREA');

  if (isOnlyEnter && isChatApp) {
    e.stopPropagation();
  }

  // Prevent the keydown event to disable the send function of
  // the text area when using a rich editor (e.g. ProseMirror)
  const isChatGPT =
    currUrl.includes('chatgpt.com') &&
    (e.target as HTMLDivElement).id === 'prompt-textarea';

  if (isOnlyEnter && isChatGPT) {
    e.preventDefault();

    const newEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    (e.target as HTMLDivElement).dispatchEvent(newEvent);
  }

  const isClaude = currUrl.includes('claude.ai') && e.target instanceof HTMLDivElement;

  if (isOnlyEnter && isClaude) {
    e.stopImmediatePropagation();
  }
};

const addKeyDownListener = () => {
  document.addEventListener('keydown', preventDefaultEnter, {
    capture: true,
  });
};

const removeKeyDownListener = () => {
  document.removeEventListener('keydown', preventDefaultEnter, {
    capture: true,
  });
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
