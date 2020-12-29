import * as Helper from './http-mocks'

export const mockEmailInUseErrorError = (): void => Helper.mockEmailInUseError(/signup/)
