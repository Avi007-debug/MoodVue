import { Shield, Bell, Eye, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SettingsPanelProps {
  settings: {
    videoStorage: boolean;
    dataAnonymization: boolean;
    notifications: boolean;
    insightSharing: boolean;
  };
  onChange: (key: string, value: boolean) => void;
}

export default function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const privacySettings = [
    {
      id: "videoStorage",
      label: "Video Storage",
      description: "Store video recordings of your sessions",
      icon: Eye,
      value: settings.videoStorage,
    },
    {
      id: "dataAnonymization",
      label: "Data Anonymization",
      description: "Anonymize facial data for extra privacy",
      icon: Shield,
      value: settings.dataAnonymization,
    },
  ];

  const notificationSettings = [
    {
      id: "notifications",
      label: "Session Reminders",
      description: "Get gentle reminders for daily check-ins",
      icon: Bell,
      value: settings.notifications,
    },
    {
      id: "insightSharing",
      label: "Insight Notifications",
      description: "Receive notifications about mood insights",
      icon: Database,
      value: settings.insightSharing,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-heading font-semibold mb-4">Privacy & Data</h3>
        <div className="space-y-4">
          {privacySettings.map((setting, index) => (
            <div key={setting.id}>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                    <setting.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={setting.id} className="text-base font-medium cursor-pointer">
                      {setting.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  id={setting.id}
                  checked={setting.value}
                  onCheckedChange={(checked) => onChange(setting.id, checked)}
                  data-testid={`switch-${setting.id}`}
                />
              </div>
              {index < privacySettings.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-heading font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          {notificationSettings.map((setting, index) => (
            <div key={setting.id}>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                    <setting.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={setting.id} className="text-base font-medium cursor-pointer">
                      {setting.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  id={setting.id}
                  checked={setting.value}
                  onCheckedChange={(checked) => onChange(setting.id, checked)}
                  data-testid={`switch-${setting.id}`}
                />
              </div>
              {index < notificationSettings.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
