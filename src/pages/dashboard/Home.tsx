import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Server, Database, Zap, Shield, TrendingUp, Files } from "lucide-react"

const DashboardHome = () => {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome to The Nest</h2>
        <p className="text-muted-foreground">Your private cloud platform dashboard</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Projects"
          value="0"
          icon={<Server className="h-5 w-5" />}
          description="Deployed projects"
          trend="+0%"
        />
        <StatCard
          title="Files"
          value="0"
          icon={<Files className="h-5 w-5" />}
          description="Stored files"
          trend="+0%"
        />
        <StatCard
          title="Storage"
          value="0 MB"
          icon={<Database className="h-5 w-5" />}
          description="Total usage"
          trend="+0%"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-white">
                <Server className="h-6 w-6" />
              </div>
              <CardTitle>Mini-Vercel</CardTitle>
            </div>
            <CardDescription>
              Deploy and manage your web projects with local hosting simulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/dashboard/vercel")}
              className="w-full bg-gradient-hero hover:opacity-90"
            >
              <Zap className="mr-2 h-4 w-4" />
              Deploy Project
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent to-primary text-white">
                <Database className="h-6 w-6" />
              </div>
              <CardTitle>Mini-Drive</CardTitle>
            </div>
            <CardDescription>
              Securely store and manage your files with client-side encryption
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/dashboard/drive")}
              className="w-full bg-gradient-hero hover:opacity-90"
            >
              <Shield className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Platform Features</CardTitle>
          <CardDescription>Everything you need for secure cloud management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <FeatureItem 
              title="Local Deployment"
              description="Simulate CI/CD pipelines and host projects locally"
            />
            <FeatureItem 
              title="Encrypted Storage"
              description="Client-side encryption for all your files"
            />
            <FeatureItem 
              title="Version Control"
              description="Track file versions and rollback when needed"
            />
            <FeatureItem 
              title="Secure Sharing"
              description="Generate temporary links for file sharing"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend 
}: { 
  title: string
  value: string
  icon: React.ReactNode
  description: string
  trend: string
}) {
  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {icon}
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{description}</span>
          <span className="text-accent flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="w-2 h-2 rounded-full bg-gradient-hero mt-2"></div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default DashboardHome
