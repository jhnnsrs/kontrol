import { useParams, Link } from "react-router-dom"
import { useGetDeviceQuery } from "../api/graphql"
import { CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Laptop } from "lucide-react"
import { AddToGroupDialog } from "./AddToGroupDialog"
import { DeviceClientFlow } from "./DeviceClientFlow"

export default function Device() {
  const { id } = useParams<{ id: string }>()
  const { data, loading, error, refetch } = useGetDeviceQuery({
    variables: { id: id! },
    skip: !id,
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data?.device) return <div>Device not found</div>

  const device = data.device

  return (
    <div className="container mx-auto py-10 relative min-h-screen">
        {/* Background Flow */}
        <div className="fixed top-0 right-0 h-screen w-[50vw] z-0 pointer-events-none">
             <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10 w-10" />
             <DeviceClientFlow device={device} />
        </div>

        <div className="relative z-10 max-w-[35vw] space-y-6">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-full">
                  <Laptop className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{device.name}</CardTitle>
                  <p className="text-muted-foreground text-sm font-mono">{device.nodeId}</p>
                </div>
              </div>
              <AddToGroupDialog deviceId={device.id} currentGroups={device.deviceGroups} onSuccess={() => refetch()} />
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Clients</h3>
                    <div className="grid gap-2">
                        {device.clients.map(client => (
                            <Link key={client.id} to={`/clients/${client.id}`}>
                                <div className="p-2 border rounded-md hover:bg-muted/50 transition-colors flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={client.logo?.presignedUrl || undefined} />
                                        <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="font-medium">{client.name}</div>
                                        <div className="text-xs text-muted-foreground">{client.kind}</div>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {client.usedAliases?.length || 0} aliases
                                    </Badge>
                                </div>
                            </Link>
                        ))}
                        {device.clients.length === 0 && (
                            <div className="text-sm text-muted-foreground">No clients found</div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Device Groups</h3>
                    <div className="grid gap-2">
                        {device.deviceGroups.map(group => (
                            <div key={group.id} className="p-2 border rounded-md flex items-center gap-2">
                                <div className="flex-1 font-medium">{group.name}</div>
                            </div>
                        ))}
                        {device.deviceGroups.length === 0 && (
                            <div className="text-sm text-muted-foreground">No device groups found</div>
                        )}
                    </div>
                </div>
            </CardContent>
        </div>
    </div>
  )
}
