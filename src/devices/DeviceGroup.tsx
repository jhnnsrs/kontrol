import { useParams, Link } from "react-router-dom"
import { useGetDeviceGroupQuery, useDeleteDeviceGroupMutation } from "../api/graphql"
import { CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Folder, Trash2 } from "lucide-react"
import { DeviceGroupFlow } from "./DeviceGroupFlow"
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
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function DeviceGroup() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const { data, loading, error } = useGetDeviceGroupQuery({
    variables: { id: groupId! },
    skip: !groupId,
  })
  const [deleteDeviceGroup] = useDeleteDeviceGroupMutation()

  const handleDelete = async () => {
    try {
      setDeleteError(null)
      await deleteDeviceGroup({
        variables: { 
          input: { 
            id: groupId!
          }
        },
        refetchQueries: ['ListDeviceGroups']
      })
      // Navigate back to device groups page after deletion
      navigate(-1)
    } catch (err) {
      console.error("Failed to delete device group:", err)
      setDeleteError(err instanceof Error ? err.message : "Failed to delete device group")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data?.deviceGroup) return <div>Device group not found</div>

  const deviceGroup = data.deviceGroup
  const devices = deviceGroup.devices.flat()

  return (
    <div className="container mx-auto py-10 relative min-h-screen">
        {/* Background Flow */}
        <div className="fixed top-0 right-0 h-screen w-[50vw] z-0 pointer-events-none">
             <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10 w-10" />
             <DeviceGroupFlow deviceGroup={deviceGroup} />
        </div>

        <div className="relative z-10 max-w-[35vw] space-y-6">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 flex items-center justify-center bg-purple-500/10 rounded-full border border-purple-500/20">
                  <Folder className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{deviceGroup.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {devices.length} device{devices.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete "{deviceGroup.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The devices in this group will not be deleted, only the group itself.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                  {deleteError && (
                    <div className="text-sm text-red-500 bg-red-50 p-2 rounded mt-4">
                      {deleteError}
                    </div>
                  )}
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Devices</h3>
                    <div className="grid gap-2">
                        {devices.map(device => (
                            <Link key={device.id} to={`/devices/${device.id}`}>
                                <div className="p-2 border rounded-md hover:bg-muted/50 transition-colors flex items-center gap-2">
                                    <div className="flex-1">
                                        <div className="font-medium">{device.name || 'Unnamed Device'}</div>
                                        <div className="text-xs text-muted-foreground font-mono">{device.nodeId}</div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        Device
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                        {devices.length === 0 && (
                            <div className="text-sm text-muted-foreground">No devices in this group</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </div>
    </div>
  )
}
