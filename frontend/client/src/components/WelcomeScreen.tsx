import { Brain, Camera, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import welcomeImage from "@assets/generated_images/Emotional_wellness_onboarding_illustration_b224a229.png";

interface WelcomeScreenProps {
  onGetStarted?: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const features = [
    {
      icon: Camera,
      title: "Real-Time Detection",
      description: "AI-powered emotion tracking using your device camera"
    },
    {
      icon: TrendingUp,
      title: "Insights & Trends",
      description: "Visualize your emotional patterns over time"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is secure and under your control"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-12 py-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
              <Brain className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold">EmotionSense</h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track and manage your emotional well-being with AI-powered insights
          </p>
        </div>

        <div className="flex justify-center">
          <img 
            src={welcomeImage} 
            alt="Emotional wellness"
            className="max-w-md w-full h-auto rounded-2xl"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover-elevate">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            onClick={onGetStarted}
            data-testid="button-get-started"
            className="px-8"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
