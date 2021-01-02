import { useLogout } from '@/presentation/hooks'
import { AccessDeniedError } from '@/domain/errors'

type CallBackType = (erro: Error) => void
type ResultType = CallBackType

export const useErrorHandler = (callback: CallBackType): ResultType => {
  const logout = useLogout()
  return (error: Error): void => {
    if (error instanceof AccessDeniedError) {
      logout()
    } else {
      callback(error)
    }
  }
}
