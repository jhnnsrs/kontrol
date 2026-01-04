import { Link } from "react-router-dom"
import { useListDevicesQuery } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Laptop, Smartphone, Tablet, ArrowRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel"
import { Button } from "../components/ui/button"

export default function Devices() {
  const { data, loading, error } = useListDevicesQuery({})

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4">Error: {error.message}</div>

  const devices = data?.devices || []
  const newestDevices = [...devices].slice(0, 5) // Take first 5 as "newest"

  // Helper function to get device icon
  const getDeviceIcon = (name: string | undefined) => {
    const lowerName = name?.toLowerCase() || ""
    if (lowerName.includes("phone") || lowerName.includes("mobile")) {
      return <Smartphone className="h-8 w-8" />
    } else if (lowerName.includes("tablet") || lowerName.includes("ipad")) {
      return <Tablet className="h-8 w-8" />
    }
    return <Laptop className="h-8 w-8" />
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor your connected devices
        </p>
      </div>

      {/* Carousel for newest devices */}
      {newestDevices.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Featured Devices</h2>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {newestDevices.map((device) => (
                <CarouselItem key={device.id} className="md:basis-1/2 lg:basis-1/3">
                  <Link to={`/devices/${device.id}`} className="h-full">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary/50">
                      <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{device.name}</CardTitle>
                            <CardDescription className="font-mono text-xs mt-1">
                              {device.nodeId}
                            </CardDescription>
                          </div>
                          <div className="text-primary">
                            {getDeviceIcon(device.name)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-primary/5">
                            Active
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            {newestDevices.length > 3 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* All devices grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Devices</h2>
          <Badge variant="secondary">{devices.length} total</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {devices.map((device) => (
            <Link key={device.id} to={`/devices/${device.id}`}>
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer h-full hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{device.name}</CardTitle>
                      <CardDescription className="font-mono text-xs mt-1 truncate">
                        {device.nodeId}
                      </CardDescription>
                    </div>
                    <div className="text-muted-foreground flex-shrink-0">
                      {getDeviceIcon(device.name)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    Active
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {devices.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Laptop className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                No devices found. Create your first device to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
