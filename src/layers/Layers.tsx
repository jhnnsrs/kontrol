import { Link, useParams } from "react-router-dom"
import { useLayersQuery, useCreateIonscaleLayerMutation } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Layers as LayersIcon, Plus } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Layers() {
  const { orgId } = useParams<{ orgId: string }>()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newLayerName, setNewLayerName] = useState("")
  
  const { data, loading, error } = useLayersQuery({
    variables: {
      filters: {
        organization: orgId || undefined
      }
    },
    skip: !orgId
  })

  const [createLayer, { loading: creating }] = useCreateIonscaleLayerMutation({
    refetchQueries: ['Layers']
  })

  const handleCreate = async () => {
    if (!newLayerName.trim() || !orgId) return

    try {
      await createLayer({
        variables: {
          input: {
            name: newLayerName.trim(),
            organizationId: orgId
          }
        }
      })
      setCreateDialogOpen(false)
      setNewLayerName("")
    } catch (e) {
      console.error("Error creating layer:", e)
    }
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4">Error: {error.message}</div>

  const layers = data?.layers || []

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Layers</h2>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Layer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Layer</DialogTitle>
              <DialogDescription>
                Create a new layer to organize your services.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newLayerName}
                  onChange={(e) => setNewLayerName(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. Production, Staging"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={creating || !newLayerName.trim()}>
                {creating ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {layers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <LayersIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No layers found</p>
            <p className="text-sm text-muted-foreground">
              Layers help organize your services.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {layers.map((layer) => (
            <Link key={layer.id} to={`/organization/${orgId}/layers/${layer.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    {layer.logo?.presignedUrl ? (
                         <img src={layer.logo.presignedUrl} className="h-4 w-4 object-contain" />
                    ) : ( 
                        <LayersIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <CardTitle className="text-sm font-medium">
                      {layer.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">{layer.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
