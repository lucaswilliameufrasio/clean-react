import { InvalidFieldError } from '@/validation/errors'
import { EmailValidation } from './email-validation'
import faker from 'faker'

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const fieldName = faker.database.column()
    const sut = new EmailValidation(fieldName)
    const error = sut.validate(faker.random.word())

    expect(error).toEqual(new InvalidFieldError(fieldName))
  })

  test('Should return falsy if email is valid', () => {
    const sut = new EmailValidation(faker.database.column())
    const error = sut.validate(faker.internet.email())

    expect(error).toBeFalsy()
  })
})