import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useNavigate } from "react-router-dom"
import { Cloud, Database, Lock, Server, Zap } from "lucide-react"

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Server className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              The Nest
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/auth?mode=signup")} className="bg-gradient-hero hover:opacity-90">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Reclaim Your Digital Sovereignty
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            A private cloud platform combining powerful deployment tools with secure file storage.
            Host locally, store encrypted, stay in control.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth?mode=signup")}
              className="bg-gradient-hero hover:opacity-90 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Start Building Free
              <Zap className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 border-2"
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <FeatureCard
            icon={<Server className="w-8 h-8" />}
            title="Mini-Vercel"
            description="Deploy and host your web projects locally with simulated CI/CD pipelines, live previews, and rollback capabilities."
            gradient="from-primary to-primary-glow"
          />
          <FeatureCard
            icon={<Database className="w-8 h-8" />}
            title="Mini-Drive"
            description="Secure file storage with client-side encryption, organized folders, version history, and seamless sharing."
            gradient="from-accent to-primary"
          />
          <FeatureCard
            icon={<Lock className="w-8 h-8" />}
            title="Full Privacy"
            description="Your data stays yours. End-to-end encryption, local hosting, and zero third-party access to your files."
            gradient="from-primary-glow to-accent"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Simple, Powerful, Secure
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard number="1" title="Sign Up" description="Create your account in seconds with email verification" />
            <StepCard number="2" title="Deploy & Store" description="Upload projects to Mini-Vercel or files to Mini-Drive" />
            <StepCard number="3" title="Stay Secure" description="Everything encrypted, everything under your control" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-hero rounded-2xl p-12 text-white">
          <Cloud className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join developers who value privacy, security, and independence.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth?mode=signup")}
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; The Nest, Our Major Project</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all hover:-translate-y-1">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${gradient} text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-hero text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export default Landing
