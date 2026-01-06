import { useConfig } from '../auth'
import { redirectToProvider, Client, settings, type AuthProcessType } from '../lib/allauth'
import Button from '../components/Button'
import GoogleOneTap from './GoogleOneTap'
import ProviderIcon from '@/components/ProviderIcon'

export default function ProviderList ({callbackURL = "/", process}: { callbackURL?: string, process: AuthProcessType }) {
  const config = useConfig()
  const providers = config?.data.socialaccount.providers
  if (!providers?.length) {
    return null
  }
  return (
    <div className="space-y-4 flex flex-col items-center">
      {settings.client === Client.BROWSER && <>
        {providers.map(provider => {
          return (
            <div key={provider.id} className='flex flex-row'>
              <Button onClick={() => redirectToProvider(provider.id, callbackURL, process)}><ProviderIcon providerId={provider.id} /> Login with {provider.name}</Button>
            </div>
          )
        })}
      </>}
    </div>
  )
}
