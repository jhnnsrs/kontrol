import { OrganizationSidebar } from "../sidebars/OrganizationSidebar"
import { DetailLayout } from "./DetailLayout"

export function OrganizationLayout() {
    return <DetailLayout sidebar={<OrganizationSidebar />} />
}
