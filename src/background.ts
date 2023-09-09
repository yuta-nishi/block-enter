chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab.url) {
    chrome.action.disable(tabId);
    return;
  }

  const url = new URL(tab.url);

  if (url.hostname === 'chat.openai.com') {
    chrome.action.enable(tabId);
  } else {
    chrome.action.disable(tabId);
  }
});
