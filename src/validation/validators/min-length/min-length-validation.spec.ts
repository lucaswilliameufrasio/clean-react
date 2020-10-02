import { InvalidFieldError } from '@/validation/errors'
import { MinLengthValidation } from './min-length-validation'

describe('MinLengthValidation', () => {
  test('Should return error if value length is lesser the specified', () => {
    const sut = new MinLengthValidation('field', 5)
    const error = sut.validate('123')

    expect(error).toEqual(new InvalidFieldError('field'))
  })

  test('Should return falsy if value length is greater the specified', () => {
    const sut = new MinLengthValidation('field', 5)
    const error = sut.validate('12345')

    expect(error).toBeFalsy()
  })
})
