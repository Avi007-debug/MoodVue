import { Brain, Settings, User, LogOut, UserCog, LineChart, Bell, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocation } from "wouter";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

export default function Header({ 
  userName = "Guest", 
  userAvatar, 
  onProfileClick, 
  onSettingsClick,
  onLogout 
}: HeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 bg-background">
      <button 
        onClick={() => setLocation("/")}
        className="flex items-center gap-2 hover-elevate rounded-lg px-2 py-1 -ml-2"
        data-testid="button-home-logo"
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-xl font-heading font-semibold text-foreground">EmotionSense</h1>
      </button>
      
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 mr-2">
          <div className="w-2 h-2 rounded-full bg-status-online" />
          <span className="text-sm text-muted-foreground">Secure Session</span>
        </div>
        
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="icon" 
              variant="ghost" 
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onSettingsClick}>
                <UserCog className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/insights")}>
                <LineChart className="mr-2 h-4 w-4" />
                <span>Insights</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Key className="mr-2 h-4 w-4" />
                <span>Privacy</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="gap-2 px-2"
              data-testid="button-profile"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
