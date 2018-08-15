import React from 'react'
import pathList from '../path-list'

export const startEditQuiz = quiz => dispatch =>
  pathList.quizzes.edit(quiz).then(quiz => dispatch(editQuiz(quiz)))

export const editQuiz = quiz => ({
  type: 'EDIT_QUIZ',
  quiz
})

export const editStoreQuiz = quizzes => dispatch => {
  return dispatch({
    type: 'EDIT_STORE_QUIZ',
    quizzes
  })
}

export const startGetUserQuizzes = author => {
  return async dispatch =>
    // const quizAttempts = await pathList.quizzes.displayQuizAttempts(author)
    await pathList.quizzes.display(author).then(async quizzes => {
      let fetched = await Promise.all(
        quizzes.map(async quiz => {
          const questions = await pathList.questions.display(quiz.uuid)
          const tags = await pathList.questions.displayTags(quiz.uuid)

          // will contain quiz details, its questions, and its tags
          return { ...quiz, questions, tags }
        })
      )
      const all = fetched.filter(quiz => quiz !== null)

      const url = window.location.href.split('/')
      const uuid = url !== undefined ? url[4] : null

      // console.log('UUID of url:', uuid)

      if (localStorage.getItem('secretQuiz')) {
        const award = JSON.parse(localStorage.getItem('secretQuiz'))
        console.log('awarding points', award)
        console.log('typeof', typeof award)
        // pathList.points.setStartingPoints(award, author)
        localStorage.removeItem('secretQuiz')
      }

      const otherQuiz =
        uuid && uuid.length === 36
          ? await pathList.quizzes.getForeignQuiz(uuid)
          : null

      const inPossession =
        otherQuiz !== null &&
        all.some((quiz: any) => quiz.uuid === otherQuiz.uuid)

      const points = await pathList.points.getUserPoints(author)
      const allPoints = await pathList.points.getAllPoints()
      const quizAttempts = await pathList.quizzes.displayQuizAttempts(author)

      // get other users quiz
      dispatch(getUserQuizzes(all))
      !inPossession && dispatch(getSearchedQuiz(otherQuiz))

      // store user data
      // dispatch(getUserQuizzes(all)) // was overwriting
      dispatch(getUserPoints(points))
      dispatch(getAllPoints(allPoints))
      return dispatch(getQuizAttempts(quizAttempts))
    })
}

export const getUserQuizzes = quizzes => ({
  type: 'ALL_QUIZZES',
  quizzes
})

export const getQuizAttempts = quizAttempts => ({
  type: 'ALL_QUIZ_ATTEMPTS',
  quizAttempts
})

export const getUserPoints = points => ({
  type: 'USER_POINTS',
  points
})

export const getAllPoints = points => ({
  type: 'ALL_POINTS',
  points
})

export const startGetSearchedQuiz = uuid => async dispatch => {
  const result = await pathList.quizzes.getForeignQuiz(uuid)
  const tags = await pathList.questions.displayTags(uuid)
  const final = {
    ...result,
    tags
  }
  dispatch(getSearchedQuiz(final))
}

// export const startGetSearchedQuiz = quiz => async dispatch => {
//   // quize = { uuid: "quiz uuid", username: "quiz username" }
//   const result = await pathList.quizzes.getForeignQuiz(quiz)
//   const tags = await pathList.questions.displayTags(quiz.uuid)
//   const final = {
//     ...result,
//     author: quiz.username,
//     uuid: quiz.uuid,
//     tags
//   }
//   console.log('got the quiz!', final)
//   dispatch(getSearchedQuiz(final))
// }

export const getSearchedQuiz = quiz => ({
  type: 'SEARCHED_QUIZ',
  quiz
})

export const startDisplayQuizQuestions = quizUUID => dispatch =>
  pathList.questions
    .display(quizUUID)
    .then(questions => dispatch(displayQuizQuestions(questions)))

export const displayQuizQuestions = questions => ({
  type: 'DISPLAY_QUIZ_QUESTIONS',
  questions
})

export const startDisplayQuizTags = quizUUID => dispatch =>
  pathList.questions
    .displayTags(quizUUID)
    .then(tags => dispatch(displayQuizTags(tags)))

export const displayQuizTags = tags => ({
  type: 'DISPLAY_QUIZ_TAGS',
  tags
})
export const startUpdateQuestionsDisplay = clickedQuestion => dispatch =>
  dispatch(displayQuizTags(clickedQuestion))

export const UpdateQuestionsDisplay = clickedQuestion => ({
  type: 'DISPLAY_CLICKED_QUESTION',
  clickedQuestion
})

export const startAddAnswerToArray = answerObj => async dispatch =>
  await dispatch(addAnswerToArray(answerObj))

export const addAnswerToArray = answerObj => ({
  type: 'ADD_ANSWER_TO_OBJECT',
  answerObj
})

export const startSendQuizReport = (quizReport: object) => dispatch =>
  pathList.quizzes
    .sendQuizReport(quizReport)
    .then(quizReportResponse => dispatch(sendQuizReport(quizReportResponse)))

export const sendQuizReport = quizReportResponse => ({
  type: 'SEND_QUIZ_REPORT',
  quizReportResponse
})

export const startSendQuestionReport = (questionReport: object) => dispatch =>
  pathList.questions
    .sendQuestionReport(questionReport)
    .then(questionReportResponse =>
      dispatch(sendQuestionReport(questionReportResponse))
    )

export const sendQuestionReport = questionReportResponse => ({
  type: 'SEND_QUESTION_REPORT',
  questionReportResponse
})

export const addMultipleSelectAnswer = answerObj => dispatch =>
  dispatch(startAddMultipleSelectAnswer(answerObj))

export const startAddMultipleSelectAnswer = answerObj => ({
  type: 'ADD_MULTIPLE_SELECT_ANSWER',
  answerObj
})
export const updateMultipleSelectAnswer = answerArray => dispatch =>
  dispatch(startUpdateMultipleSelectAnswer(answerArray))

export const startUpdateMultipleSelectAnswer = answerArray => ({
  type: 'UPDATE_MULTIPLE_SELECT_ANSWER',
  answerArray
})

export const addMultipleChoiceAnswer = answerObj => dispatch =>
  dispatch(startAddMultipleChoiceAnswer(answerObj))

export const startAddMultipleChoiceAnswer = answerObj => ({
  type: 'ADD_MULTIPLE_CHOICE_ANSWER',
  answerObj
})

export const updateAnswerArray = answerArray => dispatch =>
  dispatch(startupdateAnswerArray(answerArray))

export const startupdateAnswerArray = answer => ({
  type: 'UPDATE_ANSWER_ARRAY',
  answerArray: answer.answerArray
})

export const changeQuestionNumber = questionNumber => dispatch =>
  dispatch(startChangeQuestionNumber(questionNumber))

export const startChangeQuestionNumber = questionNumber => ({
  type: 'CHANGE_QUESTION_NUMBER',
  questionNumber
})
export const startQuizAttempt = (
  quizUUID: any,
  username: string,
  reset: number
) => dispatch =>
  pathList.quizzes
    .startQuizAttempt(quizUUID, username)
    .then(quizAttemptInfo => dispatch(beginQuizAttempt(quizAttemptInfo, reset)))

export const beginQuizAttempt = (quizAttemptInfo, reset) => ({
  type: 'QUIZ_ATTEMPT_INFO',
  quizAttemptInfo,
  reset
})
export const submitQuizAttempt = (
  quizUUID: string,
  user: string,
  attemptUUID: string,
  answerArray: any[]
) => {
  return async dispatch => {
    const quizResults = await pathList.quizzes.submitQuizAttempt(
      quizUUID,
      user,
      attemptUUID,
      answerArray
    )
    dispatch(startSubmitQuizAttempt(quizResults))
    dispatch(startGetUserQuizzes(user))
  }
}

// export const submitQuizAttempt = (
//   quizUUID: string,
//   user: string,
//   attemptUUID: string,
//   answerArray: any[]
// ) => dispatch =>
//   pathList.quizzes
//     .submitQuizAttempt(quizUUID, user, attemptUUID, answerArray)
//     .then(quizResults => dispatch(startSubmitQuizAttempt(quizResults)))

export const startSubmitQuizAttempt = quizResults => ({
  type: 'SUBMIT_QUIZ_ATTEMPT',
  quizResults
})

export const clearQuizAttempt = reset => dispatch =>
  dispatch(startclearQuizAttempt(reset))

export const startclearQuizAttempt = reset => ({
  type: 'CLEAR_QUIZ_ATTEMPT',
  reset
})
export const clearResults = () => dispatch => dispatch(startclearResults())

export const startclearResults = () => ({
  type: 'CLEAR_QUIZ_RESULTS'
})

export const deleteQuiz = (author, title) => {
  return async dispatch => {
    const quizResults = await pathList.quizzes.deleteQuiz(author, title)

    dispatch(startSubmitQuizAttempt(quizResults))
    dispatch(startGetUserQuizzes(author))
  }
}

// export const deleteQuiz = (author, title) => dispatch =>
//   pathList.quizzes
//     .deleteQuiz(author, title)
//     .then(quizResults => dispatch(startSubmitQuizAttempt(quizResults)))

export const startDeleteQuiz = () => ({
  type: 'DELETE_QUIZ_ATTEMPT'
})
