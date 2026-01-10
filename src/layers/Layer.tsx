import { Link, useParams, useNavigate } from "react-router-dom"
import { useDetailLayerQuery, useDeleteIonscaleLayerMutation } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Layers as LayersIcon, Trash2 } from "lucide-react"
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
} from "@/components/ui/alert-dialog"

export default function Layer() {
  const { orgId, id } = useParams<{ orgId: string; id: string }>()
  const navigate = useNavigate()
  
  const { data, loading, error } = useDetailLayerQuery({
    variables: { 
      id: id! 
    },
    skip: !id,
  })

  const [deleteLayer] = useDeleteIonscaleLayerMutation({
    refetchQueries: ['Layers']
  })

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4">Error: {error.message}</div>
  if (!data?.layer) return <div className="p-4">Layer not found</div>

  const layer = data.layer

  const handleDelete = async () => {
    try {
      await deleteLayer({
        variables: {
          input: {
            id: layer.id
          }
        }
      })
      navigate(`/organization/${orgId}/layers`)
    } catch (e) {
      console.error("Error deleting layer:", e)
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
                {layer.logo?.presignedUrl ? (
                    <img src={layer.logo.presignedUrl} className="h-8 w-8 object-contain" />
                ) : (
                    <LayersIcon className="h-8 w-8" />
                )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl">{layer.name}</CardTitle>
              <CardDescription>
                {layer.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the layer.
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
        <CardContent>
             <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Services</h3>
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {layer.aliases?.map((instance: any) => (
                        <Card key={instance.id} className="p-4">
                            <div className="font-medium">{instance.identifier}</div>
                        </Card>
                    ))}
                    {(!layer.aliases || layer.aliases.length === 0) && (
                        <div className="text-muted-foreground">No services in this layer</div>
                    )}
                 </div>
             </div>
        </CardContent>
      </Card>
    </div>
  )
}
