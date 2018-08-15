import React, { Component } from 'react'
import moment from 'moment'
import ImageGallery from 'react-grid-gallery'
import numeral from 'numeral'
import { connect } from 'react-redux'
import { RouteProps } from 'react-router'
import { Link } from 'react-router-dom'
import {
  startAddAnswerToArray,
  changeQuestionNumber,
  addMultipleSelectAnswer,
  addMultipleChoiceAnswer,
  updateMultipleSelectAnswer,
  updateAnswerArray,
  submitQuizAttempt,
  clearQuizAttempt
} from '../actions/quizzes'
import { loadModal } from '../actions/modal'
import {
  SUBMIT_QUIZ_MODAL,
  REPORT_QUESTION_MODAL
} from '../constants/modaltypes'
import Spinner from 'react-spinkit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// interface IProps {
interface IProps extends RouteProps {
  username: any
  quiz: any
  quizAttempt: any
  questionNumber: any
  multipleSelectAnswer: any
  multipleChoiceAnswer: any[]
  answerArray: any
  history?: any
  quizResults: any
  clearQuizAttempt: (reset: number) => void
  loadModal: (any) => any
  changeQuestionNumber: (questionNumber: number) => void
  startAddAnswerToArray: (answerObj: {}) => void
  addMultipleChoiceAnswer: (answerObj: {}) => void
  addMultipleSelectAnswer: (answerObj: {}) => void
  updateMultipleSelectAnswer: (answerArray: any) => void
  handleSelection: (choice?: any, title?: any) => any
  updateAnswerArray: (answerArray: any[]) => void
  submitQuizAttempt: (
    quizUUID: string,
    user: string,
    attemptUUID: string,
    answerArray: any[]
  ) => void
}

const questionStyle = {
  cursor: 'pointer'
}

export class QuizAttemptReviewPage extends Component<IProps, any> {
  constructor(props) {
    super(props)
  }

  params = window.location.href.split('/')
  retakeIndex = this.params[5] || 0
  quizUUID = this.params[4]

  submitQuizModal = () => this.props.loadModal(SUBMIT_QUIZ_MODAL)

  reportQuestionModal = () => this.props.loadModal(REPORT_QUESTION_MODAL)

  // will take you to the previous question and update answer array
  // if a choice is selected
  public previousQuizQuestion = (e: any) => {
    e.preventDefault()
    this.props.changeQuestionNumber(this.props.questionNumber - 1)
  }

  // will take you to the next question and update answer array
  // if a choice is selected
  public nextQuizQuestion = (e: any) => {
    e.preventDefault()
    this.props.changeQuestionNumber(this.props.questionNumber + 1)
  }

  // choice === current 1 in 4 option
  handleSelection = (choice, title) => {
    const { quizResults } = this.props

    const quizTitles = quizResults.map(question => question.title)

    const quizQuestion = quizResults.find(question => question.title === title)

    console.log('on question ', quizQuestion)
    console.log('choice ', choice)

    const rightAnswer = quizQuestion.answers.some(
      answer =>
        answer.answer === choice &&
        parseInt(answer.percentPoints) > 0 &&
        answer.selected
    )

    if (rightAnswer) return 'choice selected-and-correct'

    const wrongAnswer = quizQuestion.answers.some(
      answer =>
        answer.answer === choice &&
        parseInt(answer.percentPoints) === 0 &&
        answer.selected
    )

    if (wrongAnswer) return 'choice selected-and-incorrect'

    const theAnswer = quizQuestion.answers.some(
      answer =>
        answer.answer === choice &&
        parseInt(answer.percentPoints) > 0 &&
        !answer.selected
    )
    if (theAnswer) return 'choice correct'

    if (!theAnswer && !rightAnswer && !wrongAnswer) return 'choice'
  }

  // const final = quizQuestion.answers.map(answer => {
  //   if (
  //     answer.answer === choice &&
  //     parseInt(answer.percentPoints) > 0 &&
  //     answer.selected
  //   )
  //     return 'choice selected-and-correct'

  //   if (
  //     answer.answer === choice &&
  //     parseInt(answer.percentPoints) === 0 &&
  //     answer.selected
  //   )
  //     return 'choice selected-and-incorrect'

  //   if (
  //     answer.answer === choice &&
  //     parseInt(answer.percentPoints) &&
  //     !answer.selected
  //   )
  //     return 'choice'
  // })

  // console.log('final ', final)
  // return final
  // const classes = quizResults.map(
  //   (question, i) => {
  //     // question.title === title &&

  //     console.log('checking answer of: ', i, question.answer)
  //     // if (!answer.selected) return 'choice'

  //     if (parseInt(answer.percentPoints) > 0 && !answer.selected)
  //       return 'choice correct'

  //     if (parseInt(answer.percentPoints) > 0 && answer.selected)
  //     return 'choice selected-and-correct'

  //     if (parseInt(answer.percentPoints) === 0 && answer.selected)
  //       return (classNames = 'choice selected-and-incorrect')
  //   }
  // )
  // console.log('classes array', classes)
  // return classes
  // if (classNames.includes('choice selected-and-correct'))
  //   return 'choice selected-and-correct'

  // if (classNames.includes('choice correct')) return 'choice correct'

  // if (classNames.includes('choice selected-and-incorrect'))
  //   return 'choice selected-and-incorrect'

  // if (
  //   !classNames.includes('choice selected-and-incorrect') &&
  //   !classNames.includes('choice selected-and-correct') &&
  //   !classNames.includes('choice correct')
  // )
  //   return 'choice'
  // }
  // handleSelection = (choice, title) => {
  //   const { quizResults } = this.props

  //   // state.takeQuiz.results.questions
  //   const quizTitles = quizResults.map(question => question.title)

  //   /* check previous answers */
  //   const aarr = quizTitles.some(ans => quizTitles.includes(title))

  //   let classNames = 'choice'
  //   const classes = quizResults.map(
  //     question =>
  //       question.title === title &&
  //       question.answers.map(answer => {
  //         // if (question.format === 'true-false') {
  //         // console.log('now in true false')
  //         // console.log('titles', question.title, title)
  //         console.log('current answer', question.answer)
  //         if (!answer.selected) return 'choice'

  //         if (parseInt(answer.percentPoints) > 0 && !answer.selected)
  //           return 'choice correct'

  //         if (parseInt(answer.percentPoints) > 0 && answer.selected)
  //           return (classNames = 'choice selected-and-correct')

  //         if (parseInt(answer.percentPoints) === 0 && answer.selected)
  //           return (classNames = 'choice selected-and-incorrect')
  //       })
  //   )
  //   console.log('classes array', classes)
  //   // return classes
  //   if (classNames.includes('choice selected-and-correct'))
  //     return 'choice selected-and-correct'

  //   if (classNames.includes('choice correct')) return 'choice correct'

  //   if (classNames.includes('choice selected-and-incorrect'))
  //     return 'choice selected-and-incorrect'

  //   if (
  //     !classNames.includes('choice selected-and-incorrect') &&
  //     !classNames.includes('choice selected-and-correct') &&
  //     !classNames.includes('choice correct')
  //   )
  //     return 'choice'
  // }

  //   if (question.format === 'multiple-choice') {
  //     console.log('in multiple choice')

  //     return (classNames =
  //       // const multArr =
  //       question.title === title &&
  //       question.answers.map(answer => {
  //         if (!answer.selected) return (classNames = 'choice')

  //         if (parseInt(answer.percentPoints) > 0 && answer.selected)
  //           return (classNames = 'choice selected-and-correct')

  //         if (parseInt(answer.percentPoints) === 0 && answer.selected)
  //           return (classNames = 'choice selected-and-incorrect')

  //         if (parseInt(answer.percentPoints) > 0 && !answer.selected)
  //           return (classNames = 'choice correct')

  //         console.log('class name is now:', classNames)
  //       }))
  //     // console.log('multArr', multArr)
  //   }

  //   if (question.format === 'multiple-select') {
  //     console.log('now in multi select')
  //     return (classNames =
  //       question.title === title &&
  //       question.answers.map(answer => {
  //         if (!answer.selected) return (classNames = ' choice')

  //         if (parseInt(answer.percentPoints) > 0 && answer.selected)
  //           return (classNames = 'choice selected-and-correct')

  //         if (parseInt(answer.percentPoints) === 0 && answer.selected)
  //           return (classNames = 'choice selected-and-incorrect')

  //         console.log('class names is now', classNames)
  //       }))
  //   }
  // })
  // console.log('classNames array', classNames)
  // // return classNames

  // if (classNames.includes('choice selected-and-correct'))
  //   return 'choice selected-and-correct'

  // if (classNames.includes('choice correct')) return 'choice correct'

  // if (classNames.includes('choice selected-and-incorrect'))
  //   return 'choice selected-and-incorrect'

  // if (
  //   !classNames.includes('choice selected-and-incorrect') &&
  //   !classNames.includes('choice selected-and-correct') &&
  //   !classNames.includes('choice correct')
  // )
  // return 'choice'
  // })
  // handleSelection = (choice, title) => {
  //   const { quizResults } = this.props

  //   // state.takeQuiz.results.questions
  //   const quizTitles = quizResults.map(question => question.title)

  //   /* check previous answers */
  //   const aarr = quizTitles.some(ans => quizTitles.includes(title))

  //   let classNames = 'choice'
  //   const classes = quizResults.map(question => {
  //     if (question.format === 'true-false') {
  //       console.log('now in true false')
  //       console.log('titles', question.title, title)
  //       question.title === title &&
  //         question.answers.map(answer => {
  //           if (!answer.selected) {
  //             classNames = ' choice'
  //           }

  //           if (parseInt(answer.percentPoints) > 0 && !answer.selected) {
  //             classNames = 'choice correct'
  //           }

  //           if (answer.percentPoints > 0 && answer.selected) {
  //             classNames = 'choice selected-and-correct'
  //           }

  //           if (parseInt(answer.percentPoints) === 0 && answer.selected) {
  //             classNames = 'choice selected-and-incorrect'
  //           }

  //           console.log('classnames aftermap', classNames)
  //         })
  //     }

  //     if (question.format === 'multiple-choice') {
  //       console.log('in multiple choice')

  //       return (classNames =
  //         // const multArr =
  //         question.title === title &&
  //         question.answers.map(answer => {
  //           if (!answer.selected) return (classNames = 'choice')

  //           if (parseInt(answer.percentPoints) > 0 && answer.selected)
  //             return (classNames = 'choice selected-and-correct')

  //           if (parseInt(answer.percentPoints) === 0 && answer.selected)
  //             return (classNames = 'choice selected-and-incorrect')

  //           if (parseInt(answer.percentPoints) > 0 && !answer.selected)
  //             return (classNames = 'choice correct')

  //           console.log('class name is now:', classNames)
  //         }))
  //       // console.log('multArr', multArr)
  //     }

  //     if (question.format === 'multiple-select') {
  //       console.log('now in multi select')
  //       return (classNames =
  //         question.title === title &&
  //         question.answers.map(answer => {
  //           if (!answer.selected) return (classNames = ' choice')

  //           if (parseInt(answer.percentPoints) > 0 && answer.selected)
  //             return (classNames = 'choice selected-and-correct')

  //           if (parseInt(answer.percentPoints) === 0 && answer.selected)
  //             return (classNames = 'choice selected-and-incorrect')

  //           console.log('class names is now', classNames)
  //         }))
  //     }
  //   })
  //   console.log('classNames array', classNames)
  //   // return classNames

  //   if (classNames.includes('choice selected-and-correct'))
  //     return 'choice selected-and-correct'

  //   if (classNames.includes('choice correct')) return 'choice correct'

  //   if (classNames.includes('choice selected-and-incorrect'))
  //     return 'choice selected-and-incorrect'

  //   if (
  //     !classNames.includes('choice selected-and-incorrect') &&
  //     !classNames.includes('choice selected-and-correct') &&
  //     !classNames.includes('choice correct')
  //   )
  //     return 'choice'
  // }

  // handleSelection = (choice, title) => {
  //   const {
  //     multipleChoiceAnswer: multCh,
  //     multipleSelectAnswer: multSe,
  //     answerArray: ansArr,
  //     questionNumber: curr,
  //     quiz
  //   } = this.props

  //   const quizTitles = quiz.questions.map(question => question.title)

  //   /*birth check*/
  //   const mca = multCh !== null && multCh !== undefined

  //   const msa =
  //     multCh === null && multSe !== undefined && multSe.answer.length > 0

  //   /* check previous answers */
  //   const aarr =
  //     !mca &&
  //     multSe !== undefined &&
  //     multSe.answer.length === 0 &&
  //     ansArr.length > 0 &&
  //     ansArr.some(ans => quizTitles.includes(title))
  //   // ansArr.length >= curr
  //   // ansArr[curr] !== undefined

  //   /* display defaults */
  //   const choose =
  //     !mca &&
  //     multSe !== undefined &&
  //     multSe.answer.length === 0 &&
  //     ansArr.every(ans => !quizTitles.includes(title))

  //   // check multiple choice object
  //   if (mca) {
  //     console.log('checking multiple choice...')
  //     return multCh.answer === choice ? 'choice selected' : 'choice'
  //   }

  //   // check multiple select object
  //   if (msa) {
  //     // if (msa && multSe.answers !== undefined) {
  //     console.log(
  //       'checking multiple select...',
  //       multSe.answer.some(answer => answer === choice)
  //     )
  //     return multSe.answer.some(answer => answer === choice)
  //       ? multSe.answer
  //           .map(answer => {
  //             if (answer === choice) return 'choice selected'
  //           })
  //           .join('')
  //       : 'choice'
  //   }

  //   // check answer array
  //   if (aarr) {
  //     // console.log('here is answers array', ansArr)
  //     const arr = ansArr.map(answer => {
  //       // let finalClass = ansArr.map(answer => {
  //       console.log('logging tritle? ', answer.title)
  //       let className = ''
  //       if (!Array.isArray(answer)) {
  //         if (answer.answer === choice && answer.title === title) {
  //           className = 'choice selected'
  //           console.log('not an array, className: ', className)
  //         }
  //         if (answer.answer !== choice) {
  //           className = 'choice'
  //           console.log('not an array, className: ', className)
  //         }
  //       }
  //       if (Array.isArray(answer.answer) && answer.title === title) {
  //         answer.answer.includes(choice)
  //           ? (className = 'choice selected')
  //           : (className = 'choice')
  //         console.log('is an array, className is now: ', className)
  //       }
  //       console.log('before submission, className is', className)
  //       return className
  //     })

  //     return arr.includes('choice selected') ? 'choice selected' : 'choice'
  //   }

  //   if (choose) {
  //     return 'choice'
  //   }
  // }

  // @ts-ignore
  render = () => {
    const { quiz, questionNumber, quizAttempt } = this.props
    return (
      <div className="review-quiz-page">
        {quiz !== null && quiz === undefined
          ? quiz.questions === undefined && (
              <Spinner
                className="loading-indicator"
                name="ball-spin-fade-loader"
              />
            )
          : quizAttempt === undefined && (
              <Spinner
                className="loading-indicator"
                name="ball-spin-fade-loader"
              />
            )}
        {quiz !== null
          ? quiz.questions !== undefined && (
              <div className="main">
                <header>
                  <div className="meta">
                    <div className="container">
                      <p className="current">Question {questionNumber + 1}</p>
                      <div className="icon" onClick={this.reportQuestionModal}>
                        <FontAwesomeIcon icon="ellipsis-h" className="menu" />
                      </div>
                    </div>
                    <p className="title">{quiz.title}</p>
                    <p className="progress">
                      Question {questionNumber + 1}/{quiz.questions.length}
                    </p>
                  </div>
                  <p className="question">
                    {quiz.questions[questionNumber].title}
                  </p>
                </header>
                {/* DISPLAYS THE CHOICES */}
                <main>
                  <div className="choices">
                    {quiz.questions[questionNumber].answers.map(
                      (answers, i) => (
                        <div
                          key={i}
                          // key={answers.answer.answer}

                          className={this.handleSelection(
                            answers.answer,
                            quiz.questions[questionNumber].title
                          )}
                          // className="choice"
                        >
                          <p>{answers.answer}</p>
                        </div>
                      )
                    )}
                  </div>
                  <div className="image-gallery-div">
                    {quiz.questions[questionNumber].image !== undefined && (
                      <ImageGallery
                        items={[
                          {
                            original: quiz.questions[questionNumber].image,
                            thumbnail: quiz.questions[questionNumber].image
                          }
                        ]}
                        showThumbnails={false}
                        showPlayButton={false}
                        showImageFullScreenButton
                        alt="question image"
                      />
                    )}
                  </div>
                  <div className="buttons">
                    {questionNumber !== 0 && (
                      <button
                        onClick={this.previousQuizQuestion}
                        className="previous-button"
                      >
                        previous
                      </button>
                    )}
                    {questionNumber + 1 !== quiz.questions.length ? (
                      <button
                        onClick={this.nextQuizQuestion}
                        className="next-button"
                      >
                        next
                      </button>
                    ) : (
                      <Link to={`/view-quiz/${this.quizUUID}`} className="link">
                        <p className="retake-button">Retake quiz</p>
                      </Link>
                    )}
                  </div>
                </main>
              </div>
            )
          : quizAttempt !== undefined &&
            quizAttempt[this.retakeIndex].questions !== undefined && (
              <div className="main">
                <header>
                  <div className="meta">
                    <div className="container">
                      <p className="current">Question {questionNumber + 1}</p>
                      <div className="icon" onClick={this.reportQuestionModal}>
                        <FontAwesomeIcon icon="ellipsis-h" className="menu" />
                      </div>
                    </div>
                    <p className="title">
                      {quizAttempt[this.retakeIndex].title}
                    </p>
                    <p className="progress">
                      Question {questionNumber + 1}/
                      {quizAttempt[this.retakeIndex].questions.length}
                    </p>
                  </div>
                  <p className="question">
                    {
                      quizAttempt[this.retakeIndex].questions[questionNumber]
                        .title
                    }
                  </p>
                </header>
                {/* DISPLAYS THE CHOICES */}
                <main>
                  <div className="choices">
                    {/*map quiz Attempts here*/}
                    {quizAttempt[this.retakeIndex].questions[
                      questionNumber
                    ].answers.map((answers, i) => (
                      <div
                        key={i}
                        // key={answers.answer.answer}
                        className="choice"
                      >
                        <p>{answers.answer}</p>
                      </div>
                    ))}
                  </div>
                  <div className="buttons">
                    {questionNumber !== 0 && (
                      <button
                        onClick={this.previousQuizQuestion}
                        className="previous-button"
                      >
                        previous
                      </button>
                    )}
                    {questionNumber + 1 !==
                    quizAttempt[this.retakeIndex].questions.length ? (
                      <button
                        onClick={this.nextQuizQuestion}
                        className="next-button"
                      >
                        next
                      </button>
                    ) : (
                      <Link to={`/view-quiz/${this.quizUUID}`} className="link">
                        <p className="retake-button">Retake quiz</p>
                      </Link>
                    )}
                  </div>
                </main>
              </div>
            )}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  username: state.auth.username,
  quiz: state.takeQuiz.results,
  quizAttempt: state.quizzes.allAttempts,
  quizResults:
    state.takeQuiz.results !== null && state.takeQuiz.results.questions,
  answers: state.takeQuiz.answers,
  answerArray: state.takeQuiz.answerArray,
  questionNumber: state.takeQuiz.questionNumber,
  multipleSelectAnswer: state.takeQuiz.multipleSelectAnswer,
  multipleChoiceAnswer: state.takeQuiz.multipleChoiceAnswer,
  done: state.takeQuiz.done
})

export default connect(
  mapStateToProps,
  {
    startAddAnswerToArray,
    changeQuestionNumber,
    addMultipleChoiceAnswer,
    addMultipleSelectAnswer,
    updateMultipleSelectAnswer,
    updateAnswerArray,
    submitQuizAttempt,
    loadModal,
    clearQuizAttempt
  }
)(QuizAttemptReviewPage)
