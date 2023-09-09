import { Storage } from '@plasmohq/storage';
import { useEffect, useState } from 'react';

import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import '~/style.css';

const IndexPopup = (): JSX.Element => {
  const storage = new Storage();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const fetchEnabled = async () => {
      const enabled = await storage.get<boolean>('enabled');
      setEnabled(enabled);
    };

    fetchEnabled();
  }, []);

  const handleEnabled = async () => {
    await storage.set('enabled', !enabled);
    setEnabled(!enabled);
  };

  return (
    <div className="flex h-16 w-52 items-center justify-center space-x-2">
      <Switch id="enabled" checked={enabled} onCheckedChange={handleEnabled} />
      <Label htmlFor="enabled">enabled</Label>
    </div>
  );
};

export default IndexPopup;
