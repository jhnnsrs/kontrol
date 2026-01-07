import { useEffect } from "react"
import { data, useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "./auth"
import { flowToUrl, isPending } from "./hooks/use-next"

export default function Callback() {

    const auth = useAuth()

    const navigate = useNavigate()
    const next = useSearchParams()[0].get("next") || "/home"


    // Parallel queries
    useEffect(() => {
        console.log("Auth mounted", auth)
        if (auth.meta.is_authenticated) {
            navigate(next)
            return
        }
        if (auth.data?.flows?.some(isPending)) {
            navigate(flowToUrl(auth.data.flows.find(isPending)!, next));
            return
        }
    },[auth])

    return (
        <div className="flex flex-1 flex-col gap-8 p-8 max-w-5xl mx-auto w-full">
            Callback

        </div>
    )
}
