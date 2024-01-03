import { sendToBackground } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://chat.openai.com/*', 'https://bard.google.com/*'],
};

const preventDefaultEnter = (e: KeyboardEvent) => {
  if (
    e.key === 'Enter' &&
    !(e.ctrlKey || e.metaKey) &&
    ((e.target as HTMLTextAreaElement).id === 'prompt-textarea' ||
      (e.target as HTMLDivElement).role === 'textbox')
  ) {
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
