import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import '~/style.css';

const IndexPopup = () => {
  return (
    <div className="flex h-16 w-52 items-center justify-center space-x-2">
      <Switch id="enabled" />
      <Label htmlFor="enabled">enabled</Label>
    </div>
  );
};

export default IndexPopup;
