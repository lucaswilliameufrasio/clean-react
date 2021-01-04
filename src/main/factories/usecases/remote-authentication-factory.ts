import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories'
import { RemoteAuthentication } from '@/data/usecases'
import { Authentication } from '@/domain/usecases'

export const makeRemoteAuthentication = (): Authentication => new RemoteAuthentication(makeApiUrl('/login'), makeAxiosHttpClient())
