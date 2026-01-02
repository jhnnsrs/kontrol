import { Link } from "react-router-dom"
import { useListServicesQuery } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

export default function Services() {
  const { data, loading, error } = useListServicesQuery({})

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4">Error: {error.message}</div>

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Services</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data?.services.map((service) => (
          <Link key={service.id} to={`/services/${service.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {service.name}
                </CardTitle>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={service.logo?.presignedUrl || undefined} />
                    <AvatarFallback>{service.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-2">
                  {service.identifier}
                </div>
                <CardDescription className="line-clamp-2">
                    {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
