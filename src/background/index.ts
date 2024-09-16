import { Storage } from '@plasmohq/storage';

import { hostnames } from '~/lib/config';
import { updateBadge } from '~/lib/utils';

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      chrome.action.disable(tab.id);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, _changeInfo, tab) => {
  if (!tab.url) {
    chrome.action.disable(tabId);
    return;
  }

  const url = new URL(tab.url);
  if (!hostnames.includes(url.hostname)) {
    chrome.action.disable(tabId);
    return;
  }

  chrome.action.enable(tabId);

  (async () => {
    const storage = new Storage();
    const enabled = await storage.get<boolean>('enabled');
    if (enabled !== undefined) {
      updateBadge(enabled, tabId);
    }
  })();
});
