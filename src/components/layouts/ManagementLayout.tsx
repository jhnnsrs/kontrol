import { ManagementSidebar } from "../sidebars/ManagementSidebar"
import { DetailLayout } from "./DetailLayout"

export function ManagementLayout() {
    return <DetailLayout sidebar={<ManagementSidebar />} />
}
