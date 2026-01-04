import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useListDeviceGroupsQuery, useCreateDeviceGroupMutation, useDeleteDeviceGroupMutation } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Folder, Plus, Trash2 } from "lucide-react"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

export default function DeviceGroups() {
  const { id: orgId } = useParams<{ id: string }>()
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  
  const { data, loading, error } = useListDeviceGroupsQuery({})
  const [createDeviceGroup] = useCreateDeviceGroupMutation()
  const [deleteDeviceGroup] = useDeleteDeviceGroupMutation()

  const deviceGroups = data?.deviceGroups || []

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !orgId) return

    setIsCreating(true)
    setCreateError(null)
    try {
      await createDeviceGroup({
        variables: { 
          input: { 
            name: groupName,
            organization: orgId
          }
        },
        refetchQueries: ['ListDeviceGroups']
      })
      setGroupName("")
      setCreateDialogOpen(false)
    } catch (err) {
      console.error("Failed to create device group:", err)
      setCreateError(err instanceof Error ? err.message : "Failed to create device group")
      setIsCreating(false)
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    try {
      setDeleteError(null)
      await deleteDeviceGroup({
        variables: { 
          input: { 
            id: groupId
          }
        },
        refetchQueries: ['ListDeviceGroups']
      })
    } catch (err) {
      console.error("Failed to delete device group:", err)
      setDeleteError(err instanceof Error ? err.message : "Failed to delete device group")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!orgId) return <div>Organization not found</div>

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Groups</h1>
          <p className="text-muted-foreground mt-1">
            Organize devices into groups for easier management
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Device Group</DialogTitle>
              <DialogDescription>
                Create a new device group to organize your devices.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  placeholder="e.g., Production Devices, Testing"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && groupName.trim()) {
                      handleCreateGroup()
                    }
                  }}
                />
              </div>
              {createError && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                  {createError}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {deviceGroups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              No device groups yet. Create your first group to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deviceGroups.map(group => (
            <Card key={group.id} className="hover:shadow-md transition-all">
              <Link to={`/organization/${orgId}/devices/groups/${group.id}`} className="no-underline">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg hover:text-primary transition-colors">{group.name}</CardTitle>
                    </div>
                    <div className="text-muted-foreground flex-shrink-0">
                      <Folder className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
              </Link>
              <CardContent className="space-y-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Group
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{group.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The devices in this group will not be deleted, only the group itself.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteGroup(group.id)}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
