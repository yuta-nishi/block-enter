import type { PlasmoMessaging } from '@plasmohq/messaging';
import { updateBadge } from '~/lib/utils';

const handler: PlasmoMessaging.MessageHandler = (req, _res) => {
  const { enabled } = req.body;

  const tabId = req.sender?.tab?.id;
  if (!tabId) {
    console.error('No tabId found');
    return;
  }

  updateBadge(enabled, tabId);
};

export default handler;
