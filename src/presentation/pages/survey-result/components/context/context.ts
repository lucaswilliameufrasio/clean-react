import { createContext } from 'react'

type Props = {
  onAnswer: (answer: String) => void
}

export default createContext<Props>(null)
