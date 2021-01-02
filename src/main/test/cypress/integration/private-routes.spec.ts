import * as Helper from '../support/helpers'

describe('PrivateRoutes', () => {
  it('Should logout if surveyList has no token', () => {
    cy.visit('')
    Helper.testUrl('/login')
  })
})
