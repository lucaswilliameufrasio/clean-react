import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from './min-length-validation'
import faker from 'faker'

const fieldName = faker.database.column()
const makeSut = (): MinLengthValidation => new MinLengthValidation(fieldName, 5)

describe('MinLengthValidation', () => {
  test('Should return error if value length is lesser the specified', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(4))

    expect(error).toEqual(new InvalidFieldError(fieldName))
  })

  test('Should return falsy if value length is greater the specified', () => {
    const sut = makeSut()
    const error = sut.validate(faker.random.alphaNumeric(5))

    expect(error).toBeFalsy()
  })
})
