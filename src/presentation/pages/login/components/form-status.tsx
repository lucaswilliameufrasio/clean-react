import { loginState } from './atoms'
import { FormStatusBase } from '@/presentation/components'

import React from 'react'
import { useRecoilValue } from 'recoil'

const FormStatus: React.FC = () => {
  const state = useRecoilValue(loginState)
  return (
    <FormStatusBase state={state} />
  )
}

export default FormStatus
