import { ProfileSidebar } from "../sidebars/ProfileSidebar"
import { DetailLayout } from "./DetailLayout"

export function ProfileLayout() {
    return <DetailLayout sidebar={<ProfileSidebar />} />
}
