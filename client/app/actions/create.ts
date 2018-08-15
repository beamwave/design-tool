import React from 'react'
import api from '../path-list'
import { startGetUserQuizzes } from './quizzes'

export const createNewQuestion = newQuestion => ({
  type: 'CREATE_NEW_QUESTION',
  newQuestion
})

export const startCreateNewQuestion = newQuestion => dispatch => {
  api.create
    .addQuestion(newQuestion)
    .then(data => console.log(data)) // add uid to the lambda dispatch(createNewQuestion(data)))
    .catch(err => console.log(err))
}

export const createNewQuiz = quizID => ({
  type: 'CREATE_NEW_QUIZ',
  quizID
})

export const updateStoreQuizID = quizID => dispatch => {
  return dispatch({
    type: 'UPDATE_STORE_QUIZ_ID',
    quizID
  })
}

export const startCreateNewQuiz = (newQuiz, history) => {
  return async (dispatch, getState) => {
    const uuid = await api.create.addQuiz(newQuiz)
    dispatch(createNewQuiz(uuid))
    dispatch(startGetUserQuizzes(getState().auth.username))
    history.push('/edit-quiz/' + uuid)
  }
}

// export const startCreateNewQuiz = newQuiz => dispatch =>
//   new Promise(function(resolve, reject) {
//     api.create
//       .addQuiz(newQuiz)
//       .then(data => {
//         dispatch(createNewQuiz(data))
//         console.log(data)
//         resolve(data)
//       })
//       .catch(err => {
//         reject(err)
//       })
//   })

export const batchCreateQuestions = questions => ({
  type: 'BATCH_CREATE_QUESTIONS',
  questions
})

export const startBatchCreateQuestions = incoming => async dispatch => {
  try {
    const data = await api.create.batchAddQuestion(incoming.newQuestions)
    const arrOfUuids = data.map(question => question.uuid)
    const arrOfTags = data.map(question => question.tags)

    let arrOfPairs = []
    data.map(question =>
      arrOfPairs.push({ uuid: question.uuid, tags: question.tags })
    )
    const quizID = incoming.quizID
    const shouldBeStoredInJunctionTable = await api.create.addJunction(
      quizID,
      arrOfUuids
    )
    try {
      const addTheTags = await api.create.addTagsToQuestions(arrOfPairs)
      let arrTags = arrOfTags.reduce((accumulator, currentValue) => {
        return accumulator.concat(currentValue)
      })
      let addTheTagsSet = new Set(arrTags)
      arrTags = [...addTheTagsSet]

      const addForQuiz = await api.create.addTagsToQuiz(quizID, arrTags)
    } catch (error) {}
    return data
  } catch (error) {
    return error
  }
}

// original action
// export const startBatchCreateQuestions = newQuestions => dispatch =>
//   new Promise(function(resolve, reject) {
//     api.create
//       .batchAddQuestion(newQuestions)
//       .then(data => {
//         dispatch(batchCreateQuestions(data));
//         console.log(data);
//         setTimeout(() => resolve(data), 3000);
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });

// export const addJunctionItem = (quizID, questionIDs) => ({
//   type: "ADD_JUNCTION",
//   quizID,
//   questionIDs
// });

// export const startaddJunctionItem = (quizID, questionIDs) => dispatch =>
//   new Promise(function(resolve, reject) {
//     api.create
//       .addJunction(quizID, questionIDs)
//       .then(data => {
//         dispatch(addJunctionItem(quizID, questionIDs));
//         resolve(data);
//       })
//       .catch(err => {
//         reject(err);
//       });
//   });
