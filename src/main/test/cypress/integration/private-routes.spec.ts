import * as Helper from '../utils/helpers'

describe('PrivateRoutes', () => {
  it('Should logout if surveyList has no token', () => {
    cy.visit('')
    Helper.testUrl('/login')
  })

  it('Should logout if surveyResult has no token', () => {
    cy.visit('/surveys/any_id')
    Helper.testUrl('/login')
  })
})
