import * as Helper from './http-mocks'

export const mockEmailInUseErrorError = (): void => Helper.mockEmailInUseError(/signup/)
export const mockUnexpectedError = (): void => Helper.mockUnexpectedError(/signup/, 'POST')
