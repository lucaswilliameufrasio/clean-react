import { makeLocalStorageAdapter, makeAxiosHttpClient } from '@/main/factories'
import { AuthorizeHttpGetClientDecorator } from '@/main/decorators'
import { HttpGetClient } from '@/data/protocols/http'

export const makeAuthorizeHttpGetClientDecorator = (): HttpGetClient => {
  return new AuthorizeHttpGetClientDecorator(makeLocalStorageAdapter(), makeAxiosHttpClient())
}
