import { useParams, Link, useNavigate } from "react-router-dom"
import { useGetServiceInstanceQuery } from "../api/graphql"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Separator } from "../components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Trash2, Plus, Box, ArrowRight } from "lucide-react"
import { useState } from "react"
import ServiceLogo from "@/components/ServiceLogo"
import { useTheme } from "@/providers/ThemeProvider"

export default function ServiceInstance() {
  const params = useParams<{ id: string; instanceId?: string }>()
  const id = params.instanceId || params.id
  const { data, loading, error } = useGetServiceInstanceQuery({
    variables: { id: id! },
    skip: !id,
  })
  
  const { theme } = useTheme()
  const [createAliasOpen, setCreateAliasOpen] = useState(false)
  const [aliasHost, setAliasHost] = useState("")
  const [aliasPort, setAliasPort] = useState("")
  const [aliasPath, setAliasPath] = useState("")
  const [aliasSsl, setAliasSsl] = useState(true)
  const [aliasKind, setAliasKind] = useState("")

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4">Error: {error.message}</div>
  if (!data?.serviceInstance) return <div className="p-4">Instance not found</div>

  const instance = data.serviceInstance

  const handleDelete = () => {
    // TODO: Implement delete mutation
    console.log("Delete instance:", id)
  }

  const handleCreateAlias = () => {
    // TODO: Implement create alias mutation
    console.log("Create alias:", { aliasHost, aliasPort, aliasPath, aliasSsl, aliasKind })
    setCreateAliasOpen(false)
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
         <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
              <div className="flex items-center gap-4">
                  <div className="md:w-16 w-16 h-16 md:h-16 relative flex-shrink-0 bg-muted/10 border border-border/50 rounded overflow-hidden">
                    <div className="absolute inset-0">
                        <ServiceLogo 
                        service={instance.release.service.identifier} 
                        theme={theme} 
                        />
                    </div>
                  </div>
                <div>
                  <CardTitle className="text-2xl">{instance.identifier}</CardTitle>
                  <p className="text-muted-foreground text-sm font-mono text-xs mt-1">{instance.release.service.identifier} v{instance.release.version}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Dialog open={createAliasOpen} onOpenChange={setCreateAliasOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Alias
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Alias</DialogTitle>
                      <DialogDescription>
                        Add a new alias for this service instance.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="kind">Kind</Label>
                        <Input
                          id="kind"
                          value={aliasKind}
                          onChange={(e) => setAliasKind(e.target.value)}
                          placeholder="e.g., primary, backup"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="host">Host</Label>
                        <Input
                          id="host"
                          value={aliasHost}
                          onChange={(e) => setAliasHost(e.target.value)}
                          placeholder="example.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="port">Port (optional)</Label>
                        <Input
                          id="port"
                          type="number"
                          value={aliasPort}
                          onChange={(e) => setAliasPort(e.target.value)}
                          placeholder="8080"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="path">Path (optional)</Label>
                        <Input
                          id="path"
                          value={aliasPath}
                          onChange={(e) => setAliasPath(e.target.value)}
                          placeholder="/api/v1"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="ssl"
                          checked={aliasSsl}
                          onCheckedChange={setAliasSsl}
                        />
                        <Label htmlFor="ssl">Use SSL (HTTPS)</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCreateAliasOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateAlias}>Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Service Instance</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this service instance? This action cannot be undone.
                        All associated aliases and mappings will be removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
        </CardHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
                 <h3 className="font-semibold text-lg">Aliases</h3>
                  {(instance.aliases && instance.aliases.length > 0) ? (
                        <div className="grid gap-2">
                            {instance.aliases.map(alias => (
                                <Link to={`/instance-aliases/${alias.id}`} key={alias.id}>
                                    <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors flex items-center justify-between">
                                          <div className="flex flex-col">
                                                <code className="text-sm">
                                                    {alias.ssl ? 'https://' : 'http://'}
                                                    {alias.host || alias.layer?.name}
                                                    {alias.port ? `:${alias.port}` : ''}
                                                    {alias.path || ''}
                                                </code>
                                          </div>
                                          <Badge variant="outline" className="text-xs">{alias.kind}</Badge>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted-foreground text-sm italic">No aliases configured.</div>
                    )}
            </div>
            
             <div className="space-y-4">
                 <h3 className="font-semibold text-lg">Details</h3>
                 <Card>
                    <CardContent className="pt-6 grid gap-2">
                        <div className="flex justify-between">
                            <span className="font-medium">ID</span>
                            <span className="text-muted-foreground font-mono text-sm">{instance.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Version</span>
                             <Badge variant="secondary" className="font-mono text-xs">{instance.release.version}</Badge>
                        </div>
                         {instance.device && (
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Device</span>
                                <Link to={`/devices/${instance.device.id}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                                    {instance.device.name}
                                    <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                         )}
                         <Separator className="my-2" />
                         <div className="flex justify-between items-center">
                             <span className="font-medium">Service Info</span>
                             <Link to={instance.release.service.id ? `/services/${instance.release.service.id}` : '#'} className="text-sm text-muted-foreground hover:underline">
                                {instance.release.service.name}
                             </Link>
                         </div>
                    </CardContent>
                 </Card>
            </div>
        </div>
    </div>
  )
}
