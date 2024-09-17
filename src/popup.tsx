import { Storage } from '@plasmohq/storage';
import { useEffect, useState } from 'react';

import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import '~/style.css';

const IndexPopup = (): JSX.Element => {
  const [enabled, setEnabled] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const fetchEnabled = async () => {
      const storage = new Storage();
      const storedEnabled = await storage.get<boolean>('enabled');
      setEnabled(storedEnabled ?? true);
    };

    fetchEnabled();
  }, []);

  const handleEnabled = async () => {
    const storage = new Storage();
    await storage.set('enabled', !enabled);
    setEnabled(!enabled);
  };

  return (
    <div className="flex h-16 w-52 items-center justify-center space-x-3">
      <Switch id="enabled" checked={enabled} onCheckedChange={handleEnabled} />
      <Label htmlFor="enabled">on/off</Label>
    </div>
  );
};

export default IndexPopup;
