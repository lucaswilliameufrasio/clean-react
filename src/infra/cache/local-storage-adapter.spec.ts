import { LocalStorageAdapter } from './local-storage-adapter'

import 'jest-localstorage-mock'
import faker from 'faker'

const makeSut = (): LocalStorageAdapter => new LocalStorageAdapter()

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('Should call LocalStorage.setItem with correct values', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = faker.random.objectElement<{}>()

    sut.set(key, value)

    expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value))
  })

  test('Should call LocalStorage.removeItem if value is undefined', () => {
    const sut = makeSut()
    const key = faker.database.column()

    sut.set(key, undefined)

    expect(localStorage.removeItem).toHaveBeenCalledWith(key)
  })

  test('Should call LocalStorage.getItem with correct value', () => {
    const sut = makeSut()
    const key = faker.database.column()
    const value = faker.random.objectElement<{}>()
    const getItemSpy = jest.spyOn(localStorage, 'getItem').mockReturnValueOnce(JSON.stringify(value))

    const object = sut.get(key)

    expect(object).toEqual(value)
    expect(getItemSpy).toHaveBeenCalledWith(key)
  })
})
