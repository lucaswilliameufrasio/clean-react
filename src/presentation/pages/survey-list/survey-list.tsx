import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import Styles from './survey-list-styles.scss'
import { SurveyListItems, surveyListState } from './components'
import { Footer, Header, Error } from '@/presentation/components'
import { useErrorHandler } from '@/presentation/hooks'
import { LoadSurveyList } from '@/domain/usecases'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const [state, setState] = useRecoilState(surveyListState)

  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, error: error.message }))
  })

  const reload = (): void => setState(old => ({ surveys: [], error: '', reload: !old.reload }))

  useEffect(() => {
    loadSurveyList.loadAll()
      .then(surveys => setState(old => ({ ...old, surveys })))
      .catch(handleError)
  }, [state.reload])

  return (
    <div className={Styles.surveyListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Enquetes</h2>
        {state.error
          ? <Error error={state.error} reload={reload} />
          : <SurveyListItems surveys={state.surveys} />
        }
      </div>
      <Footer />
    </div>
  )
}

export default SurveyList
