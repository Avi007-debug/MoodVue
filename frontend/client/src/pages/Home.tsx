import { useLocation } from "wouter";
import { Camera, TrendingUp, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Camera,
      title: "Real-Time Detection",
      description: "Track your emotions in real-time using AI-powered facial recognition. Get instant feedback on your mood and stress levels.",
      action: "Start Session",
      path: "/session",
      color: "from-primary/20 to-primary/5",
    },
    {
      icon: TrendingUp,
      title: "Insights & Trends",
      description: "Visualize your emotional patterns over time. Review daily, weekly, and monthly mood trends to understand your well-being.",
      action: "View Insights",
      path: "/insights",
      color: "from-chart-2/20 to-chart-2/5",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Your data is secure and under your complete control. Manage privacy settings and data anonymization options.",
      action: "Manage Settings",
      path: "/profile",
      color: "from-accent/20 to-accent/5",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-8 py-12 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">
            Welcome to EmotionSense
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered companion for emotional wellness and self-awareness
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`p-8 hover-elevate bg-gradient-to-br ${feature.color} border-2`}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>

                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-heading font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setLocation(feature.path)}
                  data-testid={`button-${feature.path.slice(1)}`}
                >
                  {feature.action}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground">
            Start your journey to better emotional well-being today
          </p>
        </div>
      </div>
    </div>
  );
}
