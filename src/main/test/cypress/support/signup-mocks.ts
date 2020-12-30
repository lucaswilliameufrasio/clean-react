import * as Helper from './http-mocks'
import faker from 'faker'

export const mockEmailInUseErrorError = (): void => Helper.mockEmailInUseError(/signup/)
export const mockUnexpectedError = (): void => Helper.mockUnexpectedError(/signup/, 'POST')
export const mockInvalidData = (): void => Helper.mockOk(/signup/, 'POST', { invalid: faker.random.uuid(), name: faker.name.findName() })
export const mockOk = (): void => Helper.mockOk(/signup/, 'POST', { accessToken: faker.random.uuid() })
