import * as Http from './http-mocks'
import faker from 'faker'

export const mockEmailInUseErrorError = (): void => Http.mockForbiddenError(/signup/, 'POST')
export const mockUnexpectedError = (): void => Http.mockServerError(/signup/, 'POST')
export const mockOk = (): void => Http.mockOk(/signup/, 'POST', { accessToken: faker.random.uuid() })
