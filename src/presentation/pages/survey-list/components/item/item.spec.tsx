import { SurveyItem } from '@/presentation/pages/survey-list/components'
import { IconName } from '@/presentation/components'
import { mockSurveyModel } from '@/domain/test'

import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, render, screen } from '@testing-library/react'

type SutTypes = {
  history: MemoryHistory
}

const makeSut = (survey = mockSurveyModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  render(
    <Router history={history}>
      <SurveyItem survey={survey}/>
    </Router>
  )
  return {
    history
  }
}

describe('SurveyItem Component', () => {
  test('Should render with correct values', () => {
    const survey = {
      ...mockSurveyModel(),
      didAnswer: true,
      date: new Date('2021-07-10T00:00:00')
    }
    makeSut(survey)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('jul')
    expect(screen.getByTestId('year')).toHaveTextContent('2021')
  })

  test('Should render with correct values', () => {
    const survey = {
      ...mockSurveyModel(),
      didAnswer: false,
      date: new Date('2017-05-07T00:00:00')
    }
    makeSut(survey)
    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbDown)
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question)
    expect(screen.getByTestId('day')).toHaveTextContent('07')
    expect(screen.getByTestId('month')).toHaveTextContent('mai')
    expect(screen.getByTestId('year')).toHaveTextContent('2017')
  })

  test('Should go to SurveyResult', () => {
    const survey = mockSurveyModel()
    const { history } = makeSut(survey)
    fireEvent.click(screen.getByTestId('link'))
    expect(history.location.pathname).toEqual(`/surveys/${survey.id}`)
  })
})
