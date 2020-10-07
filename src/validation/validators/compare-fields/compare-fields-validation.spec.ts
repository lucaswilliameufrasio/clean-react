import { InvalidFieldError } from '@/validation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'
import faker from 'faker'

const makeSut = (field: string, valueToCompare: string): CompareFieldsValidation => new CompareFieldsValidation(field, valueToCompare)

describe('CompareFieldsValidation', () => {
  test('Should return error if compare is invalid', () => {
    const fieldName = faker.database.column()
    const valueToCompare = faker.random.word()
    const sut = makeSut(fieldName, valueToCompare)
    const error = sut.validate(faker.random.word())

    expect(error).toEqual(new InvalidFieldError(fieldName))
  })

  test('Should return falsy if compare is valid', () => {
    const fieldName = faker.database.column()
    const valueToCompare = faker.random.word()
    const sut = makeSut(fieldName, valueToCompare)
    const error = sut.validate(valueToCompare)

    expect(error).toBeFalsy()
  })
})
