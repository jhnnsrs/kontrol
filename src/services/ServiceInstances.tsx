import { Link, useParams } from "react-router-dom"
import { useListServiceInstancesQuery } from "../api/graphql"
import { ServiceInstanceCard } from "../components/ServiceInstanceCard"

export default function ServiceInstances() {
  const { orgId } = useParams<{ orgId: string }>()
  
  const { data, loading, error } = useListServiceInstancesQuery({
      variables: {
          filters: {
              organization: orgId || undefined
          }
      }
  })

  if (loading) return <div className="p-4">Loading...</div>
  
  if (error) return <div className="p-4">Error: {error.message}</div>

  const instances = data?.serviceInstances || []

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Service Instances</h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {instances.map((instance) => (
             <ServiceInstanceCard key={instance.id} instance={instance} />
        ))}
        {instances.length === 0 && (
             <div className="col-span-full text-center text-muted-foreground">
                 No service instances found.
             </div>
        )}
      </div>
    </div>
  )
}
