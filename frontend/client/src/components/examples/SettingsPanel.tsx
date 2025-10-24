import { useState } from 'react';
import SettingsPanel from '../SettingsPanel';

export default function SettingsPanelExample() {
  const [settings, setSettings] = useState({
    videoStorage: false,
    dataAnonymization: true,
    notifications: true,
    insightSharing: false,
  });

  const handleChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    console.log(`${key} changed to:`, value);
  };

  return (
    <div className="p-6 max-w-2xl">
      <SettingsPanel 
        settings={settings}
        onChange={handleChange}
      />
    </div>
  );
}
