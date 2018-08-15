import React from 'react'
import { addMultipleChoiceAnswer } from '../actions/quizzes'

interface ITakeQuiz {
  questionNumber: number
  quizAttemptInfoObj: any
  multipleChoiceAnswer: any
  multipleSelectAnswer: any
  answerArray: any[]
  results: any
  done: any
  quizReportResponse: any
}

const initialState: ITakeQuiz = {
  questionNumber: 0,
  quizAttemptInfoObj: null,
  multipleChoiceAnswer: null,
  multipleSelectAnswer: {
    author: '',
    title: '',
    answer: []
  },
  answerArray: [],
  results: null,
  done: false,
  quizReportResponse: null
}

export const takeQuizReducer = (state = initialState, action = {} as any) => {
  switch (action.type) {
    case 'ADD_ANSWER_TO_OBJECT':
      // console.log('answer ', action.answerObj)
      return {
        ...state,
        answerArray: [...state.answerArray, action.answerObj],
        multipleSelectAnswer: {
          author: '',
          title: '',
          answer: []
        },
        multipleChoiceAnswer: null,
        done: action.answerObj.done && action.answerObj.done
      }

    case 'UPDATE_ANSWER_ARRAY':
      // console.log('answer ', action.answerObj)
      return {
        ...state,
        answerArray: action.answerArray,
        multipleSelectAnswer: {
          author: '',
          title: '',
          answer: []
        },
        multipleChoiceAnswer: null,
        done: action.done
      }

    case 'CHANGE_QUESTION_NUMBER':
      return {
        ...state,
        questionNumber: action.questionNumber
      }

    case 'CLEAR_QUIZ_ATTEMPT':
      return {
        ...state,
        questionNumber: action.reset,
        quizAttemptInfoObj: null
      }

    case 'CLEAR_QUIZ_RESULTS':
      return {
        ...state,
        results: null
      }

    case 'ADD_MULTIPLE_SELECT_ANSWER':
      // console.log('multiple select ', action.answerObj.answer)
      return {
        ...state,
        multipleSelectAnswer: {
          author: action.answerObj.author,
          title: action.answerObj.title,
          answer: action.answerObj.answer
        }
      }
    case 'UPDATE_MULTIPLE_SELECT_ANSWER':
      // console.log('multiple select ', action.answerArray)
      return {
        ...state,
        multipleSelectAnswer: {
          ...state.multipleSelectAnswer,
          answer: action.answerArray
        }
      }
    case 'ADD_MULTIPLE_CHOICE_ANSWER':
      // console.log('multiple choice ', action.answerObj)
      return {
        ...state,
        multipleChoiceAnswer: action.answerObj,
        done: action.done
      }

    case 'QUIZ_ATTEMPT_INFO':
      // console.log('questions ', action.quizAttemptInfo)
      return {
        ...state,
        quizAttemptInfoObj: action.quizAttemptInfo,
        questionNumber: action.reset,
        answerArray: []
      }

    case 'SEND_QUIZ_REPORT':
      console.log('quiz Report Response ', action.quizReportResponse)
      return {
        ...state,
        quizReportResponse: action.quizReportResponse
      }

    case 'SUBMIT_QUIZ_ATTEMPT':
      // console.log('answer ', action.answerObj)
      return {
        ...state,
        answerArray: [],
        multipleSelectAnswer: {
          author: '',
          title: '',
          answer: []
        },
        multipleChoiceAnswer: null,
        results: action.quizResults
      }

    default:
      return state
  }
}
