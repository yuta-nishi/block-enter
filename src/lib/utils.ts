import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
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
