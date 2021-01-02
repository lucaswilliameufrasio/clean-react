import { makeLocalStorageAdapter } from '@/main/factories/cache/local-storage-adapter-factory'
import { AccountModel } from '@/domain/models'

export const setCurrentAccountAdapter = (account: AccountModel): void => {
  makeLocalStorageAdapter().set('account', account)
}

export const getCurrentAccountAdapter = (): any => {
  return makeLocalStorageAdapter().get('account')
}
