import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Upload, GitBranch, PlayCircle, Eye, History, TrendingUp } from "lucide-react"

const MiniVercel = () => {
  const [projects, setProjects] = useState<any[]>([])
  const [deploying, setDeploying] = useState(false)

  const handleDeploy = () => {
    setDeploying(true)
    toast.info("Starting deployment...")
    
    setTimeout(() => {
      toast.success("Building project...")
      setTimeout(() => {
        toast.success("Project deployed successfully!")
        setProjects([
          {
            id: 1,
            name: "My Awesome Project",
            status: "Deployed",
            url: "localhost:3000/my-project",
            lastDeploy: new Date().toLocaleString()
          },
          ...projects
        ])
        setDeploying(false)
      }, 2000)
    }, 1000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Mini-Vercel</h2>
          <p className="text-muted-foreground">Deploy and manage your web projects locally</p>
        </div>
        <Button className="bg-gradient-hero hover:opacity-90">
          <Upload className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Deploy Form */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Deploy New Project</CardTitle>
          <CardDescription>Upload your code or connect a Git repository</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" placeholder="my-awesome-project" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="git-url">Git URL (Optional)</Label>
              <Input id="git-url" placeholder="https://github.com/user/repo" />
            </div>
          </div>
          
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your build files or click to browse
            </p>
            <Button variant="outline" size="sm">
              Choose Files
            </Button>
          </div>

          <Button 
            onClick={handleDeploy} 
            disabled={deploying}
            className="w-full bg-gradient-hero hover:opacity-90"
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            {deploying ? "Deploying..." : "Deploy Now"}
          </Button>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Your Projects</h3>
        {projects.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No projects yet. Deploy your first project above!</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold mb-1">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">Last deployed: {project.lastDeploy}</p>
                  </div>
                  <Badge className="bg-gradient-hero text-white">
                    {project.status}
                  </Badge>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <History className="mr-2 h-4 w-4" />
                    Logs
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default MiniVercel
