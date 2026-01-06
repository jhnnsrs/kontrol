import { Link, useParams } from "react-router-dom"
import { useListServiceInstancesQuery, Ordering } from "../api/graphql"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel"

export default function ServiceInstances() {
  const { orgId } = useParams<{ orgId: string }>()
  
  const { data: recentData } = useListServiceInstancesQuery({
    variables: {
      order: { updatedAt: Ordering.Desc },
      filters: {
        organization: orgId || undefined
      },
      pagination: { limit: 5 }
    }
  })

  // Main data query - filter also applied here
  const { data, loading, error } = useListServiceInstancesQuery({
      variables: {
          filters: {
              organization: orgId || undefined
          }
      }
  })

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4">Error: {error.message}</div>

  const instances = data?.serviceInstances
  const recentInstances = recentData?.serviceInstances

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Service Instances</h2>
          <p className="text-muted-foreground">Configured instances of services</p>
        </div>
      </div>

    {recentInstances && recentInstances.length > 0 && (
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-4">Recently Updated</h3>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-full"
          >
            <CarouselContent>
              {recentInstances.map((instance) => (
                <CarouselItem key={instance.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1">
                    <Link to={orgId ? `/organization/${orgId}/service-instances/${instance.id}` : `/service-instances/${instance.id}`}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center gap-4 pb-3">
                            <Avatar className="h-12 w-12">
                            <AvatarImage src={instance.release.service?.logo?.presignedUrl || undefined} />
                            <AvatarFallback>{instance.identifier.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                            <CardTitle className="text-base">{instance.identifier}</CardTitle>
                            <CardDescription className="text-xs font-mono">{instance.identifier}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{instance.id}</Badge>
                            </div>
                        </CardContent>
                        </Card>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {instances?.map((instance) => (
          <Link key={instance.id} to={orgId ? `/organization/${orgId}/service-instances/${instance.id}` : `/service-instances/${instance.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={instance.release.service?.logo?.presignedUrl || undefined} />
                  <AvatarFallback>{instance.identifier.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-base">{instance.identifier}</CardTitle>
                  <CardDescription className="text-xs font-mono">{instance.identifier}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{instance.id}</Badge>
                  
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
