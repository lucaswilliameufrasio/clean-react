import { makeLoginValidation, makeRemoteAuthentication } from '@/main/factories'
import { Login } from '@/presentation/pages'

import React from 'react'

export const makeLogin: React.FC = () => {
  return (
    <Login
      authentication={makeRemoteAuthentication()}
      validation={makeLoginValidation()}
    />
  )
}
