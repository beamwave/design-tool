import React, { Component } from 'react'
import { editQuiz } from '../../actions/quizzes'

test('should test editQuiz action', () => {

  // setup data to pass to action
  const quiz = {
    quizID: '2341241242124124',
    question: 'quiz-question'
  }

  // call action with data
  const action = editQuiz(quiz)

  // expect action to include type
  expect(action).toEqual({
    type: 'EDIT_QUIZ',
    quiz
  })
})
