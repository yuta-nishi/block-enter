import { clsx, type ClassValue } from 'clsx';
import type { PlasmoCSConfig } from 'plasmo';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const matchConfig: PlasmoCSConfig = {
  matches: ['https://chat.openai.com/*'],
};

export const updateBadge = (enabled: boolean, tabId: number) => {
  if (enabled) {
    chrome.action.setBadgeText({ text: '', tabId });
  } else {
    chrome.action.setBadgeText({ text: 'off', tabId });
    chrome.action.setBadgeTextColor({ color: 'white', tabId });
    chrome.action.setBadgeBackgroundColor({ color: 'red', tabId });
  }
};
