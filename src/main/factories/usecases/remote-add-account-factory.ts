import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories'
import { AddAccount } from '@/domain/usecases'
import { RemoteAddAccount } from '@/data/usecases'

export const makeRemoteAddAccount = (): AddAccount => {
  return new RemoteAddAccount(makeApiUrl('/signup'), makeAxiosHttpClient())
}
