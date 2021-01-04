import { makeApiUrl, makeAuthorizeHttpClientDecorator } from '@/main/factories'
import { SaveSurveyResult } from '@/domain/usecases'
import { RemoteSaveSurveyResult } from '@/data/usecases'

export const makeRemoteSaveSurveyResult = (id: string): SaveSurveyResult => new RemoteSaveSurveyResult(makeApiUrl(`/surveys/${id}/results`), makeAuthorizeHttpClientDecorator())
