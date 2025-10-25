import { useState, useEffect } from "react";
import { Camera, Mail, User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import SettingsPanel from "@/components/SettingsPanel";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [settings, setSettings] = useState({
    videoStorage: false,
    dataAnonymization: true,
    notifications: true,
    insightSharing: false,
  });

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setEmail(profile.email || "");
      setSettings(profile.settings || {
        videoStorage: false,
        dataAnonymization: true,
        notifications: true,
        insightSharing: false,
      });
    }
  }, [profile]);

  const updateProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: name,
          settings: settings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = async (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          settings: newSettings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold mb-2">Profile & Settings</h2>
          <p className="text-muted-foreground">Manage your account and privacy preferences</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="default" 
                className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                data-testid="button-edit-avatar"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Name
              </Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
              />
            </div>

            <Button 
              className="w-full"
              onClick={updateProfile}
              disabled={isLoading}
              data-testid="button-save-profile"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>

        <SettingsPanel settings={settings} onChange={handleSettingChange} />
      </div>
    </div>
  );
}
