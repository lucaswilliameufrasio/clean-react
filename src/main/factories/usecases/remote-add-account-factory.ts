import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories'
import { AddAccount } from '@/domain/usecases'
import { RemoteAddAccount } from '@/data/usecases'

export const makeRemoteAddAccount = (): AddAccount => new RemoteAddAccount(makeApiUrl('/signup'), makeAxiosHttpClient())
