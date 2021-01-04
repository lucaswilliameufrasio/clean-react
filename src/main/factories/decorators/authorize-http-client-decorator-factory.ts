import { makeLocalStorageAdapter, makeAxiosHttpClient } from '@/main/factories'
import { AuthorizeHttpClientDecorator } from '@/main/decorators'
import { HttpClient } from '@/data/protocols/http'

export const makeAuthorizeHttpClientDecorator = (): HttpClient => new AuthorizeHttpClientDecorator(makeLocalStorageAdapter(), makeAxiosHttpClient())
