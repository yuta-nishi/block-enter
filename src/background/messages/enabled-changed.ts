import type { PlasmoMessaging } from '@plasmohq/messaging';
import { updateBadge } from '~/lib/utils';

const handler: PlasmoMessaging.MessageHandler = async (req, _res) => {
  const { enabled } = req.body;

  const tabId = req.sender?.tab?.id;
  if (!tabId) {
    return;
  }

  updateBadge(enabled, tabId);
};

export default handler;
