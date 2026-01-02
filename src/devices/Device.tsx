import { useParams, Link } from "react-router-dom"
import { useGetDeviceQuery } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Laptop } from "lucide-react"

export default function Device() {
  const { id } = useParams<{ id: string }>()
  const { data, loading, error } = useGetDeviceQuery({
    variables: { id: id! },
    skip: !id,
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data?.device) return <div>Device not found</div>

  const device = data.device

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="h-16 w-16 flex items-center justify-center bg-muted rounded-full">
            <Laptop className="h-8 w-8" />
          </div>
          <div>
            <CardTitle className="text-2xl">{device.name}</CardTitle>
            <p className="text-muted-foreground">{device.nodeId}</p>
          </div>
        </CardHeader>
        <CardContent>
            <h3 className="font-semibold mb-2">Clients</h3>
            <div className="grid gap-2 mb-6">
                {device.clients.map(client => (
                    <Link key={client.id} to={`/clients/${client.id}`}>
                        <div className="p-2 border rounded-md hover:bg-muted/50 transition-colors flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={client.logo?.presignedUrl || undefined} />
                                <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-xs text-muted-foreground">{client.kind}</div>
                            </div>
                        </div>
                    </Link>
                ))}
                {device.clients.length === 0 && (
                    <div className="text-sm text-muted-foreground">No clients found</div>
                )}
            </div>

            <h3 className="font-semibold mb-2">Device Groups</h3>
            <div className="grid gap-2">
                {device.deviceGroups.map(group => (
                    <div key={group.id} className="p-2 border rounded-md">
                        <div className="font-medium">{group.name}</div>
                    </div>
                ))}
                {device.deviceGroups.length === 0 && (
                    <div className="text-sm text-muted-foreground">No device groups found</div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
