import { renderWithHistory } from '@/presentation/test'
import { SurveyResult } from '@/presentation/pages'
import { LoadSurveyResultSpy, mockSurveyResultModel, SaveSurveyResultSpy } from '@/domain/test'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'

import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, screen, waitFor } from '@testing-library/react'

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
  saveSurveyResultSpy: SaveSurveyResultSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

type SutParams = {
  loadSurveyResultSpy?: LoadSurveyResultSpy
  saveSurveyResultSpy?: SaveSurveyResultSpy
}

const makeSut = ({ loadSurveyResultSpy = new LoadSurveyResultSpy(), saveSurveyResultSpy = new SaveSurveyResultSpy() }: SutParams = {}): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/', '/surveys/any_id'], initialIndex: 1 })
  const { setCurrentAccountMock } = renderWithHistory({
    history,
    Page: () => SurveyResult({ loadSurveyResult: loadSurveyResultSpy, saveSurveyResult: saveSurveyResultSpy })
  })
  return {
    loadSurveyResultSpy,
    saveSurveyResultSpy,
    history,
    setCurrentAccountMock
  }
}

describe('SurveyResult Component', () => {
  test('Should present correct initial state', async () => {
    makeSut()
    const surveyResult = screen.getByTestId('survey-result')

    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    await waitFor(() => surveyResult)
  })

  test('Should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))

    expect(loadSurveyResultSpy.callsCount).toBe(1)
  })

  test('Should present SurveyResult data on success', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const surveyResult = {
      ...mockSurveyResultModel(),
      date: new Date('2021-07-10T00:00:00')
    }
    loadSurveyResultSpy.surveyResult = surveyResult
    makeSut({ loadSurveyResultSpy })
    await waitFor(() => screen.getByTestId('survey-result'))

    expect(screen.getByTestId('day')).toHaveTextContent('10')
    expect(screen.getByTestId('month')).toHaveTextContent('jul')
    expect(screen.getByTestId('year')).toHaveTextContent('2021')
    expect(screen.getByTestId('question')).toHaveTextContent(surveyResult.question)
    expect(screen.getByTestId('answers').childElementCount).toBe(2)
    const answerWrap = screen.queryAllByTestId('answer-wrap')
    expect(answerWrap[0]).toHaveClass('active')
    expect(answerWrap[1]).not.toHaveClass('active')
    const images = screen.queryAllByTestId('image')
    expect(images[0]).toHaveAttribute('src', surveyResult.answers[0].image)
    expect(images[0]).toHaveAttribute('alt', surveyResult.answers[0].answer)
    expect(images[1]).toBeFalsy()
    const answers = screen.queryAllByTestId('answer')
    expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer)
    expect(answers[1]).toHaveTextContent(surveyResult.answers[1].answer)
    const percentages = screen.queryAllByTestId('percent')
    expect(percentages[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`)
    expect(percentages[1]).toHaveTextContent(`${surveyResult.answers[1].percent}%`)
  })

  test('Should render error on UnexpectedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(error)
    makeSut({ loadSurveyResultSpy })
    await waitFor(() => screen.getByTestId('survey-result'))

    expect(screen.queryByTestId('question')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should logout on AccessDeniedError', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(new AccessDeniedError())
    const { history, setCurrentAccountMock } = makeSut({ loadSurveyResultSpy })
    await waitFor(() => screen.getByTestId('survey-result'))

    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  test('Should call LoadSurveyResult on reload', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    jest.spyOn(loadSurveyResultSpy, 'load').mockRejectedValueOnce(new UnexpectedError())
    makeSut({ loadSurveyResultSpy })
    await waitFor(() => screen.getByTestId('survey-result'))

    fireEvent.click(screen.getByTestId('reload'))

    expect(loadSurveyResultSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByTestId('survey-result'))
  })

  test('Should go to SurveyList on back button click', async () => {
    const { history } = makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))

    fireEvent.click(screen.getByTestId('back-button'))

    expect(history.location.pathname).toBe('/')
  })

  test('Should not present loading on active answer click', async () => {
    makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')

    fireEvent.click(answerWrap[0])

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should call SaveSurveyResult on inactive answer click', async () => {
    const { saveSurveyResultSpy, loadSurveyResultSpy } = makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')

    fireEvent.click(answerWrap[1])

    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    expect(saveSurveyResultSpy.params).toEqual({
      answer: loadSurveyResultSpy.surveyResult.answers[1].answer
    })
    await waitFor(() => screen.getByTestId('survey-result'))
  })

  test('Should render error on UnexpectedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const error = new UnexpectedError()
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(error)
    makeSut({ saveSurveyResultSpy })
    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')

    fireEvent.click(answerWrap[1])

    await waitFor(() => screen.getByTestId('survey-result'))
    expect(screen.queryByTestId('question')).not.toBeInTheDocument()
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should logout on AccessDeniedError', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    jest.spyOn(saveSurveyResultSpy, 'save').mockRejectedValueOnce(new AccessDeniedError())
    const { history, setCurrentAccountMock } = makeSut({ saveSurveyResultSpy })
    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')

    fireEvent.click(answerWrap[1])

    await waitFor(() => screen.getByTestId('survey-result'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })

  test('Should present SurveyResult data on SaveSurveyResult success', async () => {
    const saveSurveyResultSpy = new SaveSurveyResultSpy()
    const surveyResult = {
      ...mockSurveyResultModel(),
      date: new Date('2021-12-21T00:00:00')
    }
    saveSurveyResultSpy.surveyResult = surveyResult
    makeSut({ saveSurveyResultSpy })
    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')

    fireEvent.click(answerWrap[1])

    await waitFor(() => screen.getByTestId('survey-result'))
    expect(screen.getByTestId('day')).toHaveTextContent('21')
    expect(screen.getByTestId('month')).toHaveTextContent('dez')
    expect(screen.getByTestId('year')).toHaveTextContent('2021')
    expect(screen.getByTestId('question')).toHaveTextContent(surveyResult.question)
    expect(screen.getByTestId('answers').childElementCount).toBe(2)
    expect(answerWrap[0]).toHaveClass('active')
    expect(answerWrap[1]).not.toHaveClass('active')
    const images = screen.queryAllByTestId('image')
    expect(images[0]).toHaveAttribute('src', surveyResult.answers[0].image)
    expect(images[0]).toHaveAttribute('alt', surveyResult.answers[0].answer)
    expect(images[1]).toBeFalsy()
    const answers = screen.queryAllByTestId('answer')
    expect(answers[0]).toHaveTextContent(surveyResult.answers[0].answer)
    expect(answers[1]).toHaveTextContent(surveyResult.answers[1].answer)
    const percentages = screen.queryAllByTestId('percent')
    expect(percentages[0]).toHaveTextContent(`${surveyResult.answers[0].percent}%`)
    expect(percentages[1]).toHaveTextContent(`${surveyResult.answers[1].percent}%`)
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  test('Should prevent multiple answer click', async () => {
    const { saveSurveyResultSpy } = makeSut()
    await waitFor(() => screen.getByTestId('survey-result'))
    const answerWrap = screen.queryAllByTestId('answer-wrap')

    fireEvent.click(answerWrap[1])
    fireEvent.click(answerWrap[0])

    await waitFor(() => screen.getByTestId('survey-result'))
    expect(saveSurveyResultSpy.callsCount).toBe(1)
  })
})
