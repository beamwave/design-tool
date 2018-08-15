import React, { Component } from 'react'
import moment from 'moment'
import numeral from 'numeral'
import ImageGallery from 'react-grid-gallery'
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
  submitQuizAttempt
} from '../actions/quizzes'
import { loadModal } from '../actions/modal'
import {
  SUBMIT_QUIZ_MODAL,
  REPORT_QUESTION_MODAL
} from '../constants/modaltypes'
import Spinner from 'react-spinkit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

interface IProps extends RouteProps {
  username: any
  quiz: any
  questionNumber: any
  multipleSelectAnswer: any
  multipleChoiceAnswer: any
  answerArray: any
  history?: any
  loadModal: (type: string, title?: string, uuid?: string) => void
  changeQuestionNumber: (questionNumber: number) => void
  startAddAnswerToArray: (answerObj: {}) => void
  addMultipleChoiceAnswer: (answerObj: {}) => void
  addMultipleSelectAnswer: (answerObj: {}) => void
  updateMultipleSelectAnswer: (answerArray: any) => void
  updateAnswerArray: (answerArray: any[]) => void
  submitQuizAttempt: (
    quizUUID: string,
    user: string,
    attemptUUID: string,
    answerArray: any[]
  ) => void
}

export class TakeQuizPage extends Component<IProps, any> {
  constructor(props) {
    super(props)
  }
  state = {
    dropdownOpen: false
  }

  params = window.location.href.split('/')
  quizUUID = this.params[4]

  toggleDropdown = () =>
    this.setState((prevState: any) => ({
      dropdownOpen: !prevState.dropdownOpen
    }))

  submitQuizModal = () => this.props.loadModal(SUBMIT_QUIZ_MODAL)

  public reportQuestionModal = questionUUID => e => {
    console.log('reporting question', questionUUID)
    this.props.loadModal(REPORT_QUESTION_MODAL, null, questionUUID)
  }

  // will take you to the previous question and update answer array
  // if a choice is selected
  public previousQuizQuestion = (choices: object) => (e: any) => {
    e.preventDefault()
    if (
      this.props.multipleSelectAnswer.answer.length > 0 ||
      this.props.multipleChoiceAnswer !== null
    ) {
      if (
        choices[this.props.questionNumber].format === 'multiple-choice' ||
        choices[this.props.questionNumber].format === 'true-false'
      ) {
        this.props.startAddAnswerToArray(this.props.multipleChoiceAnswer)
        this.props.changeQuestionNumber(this.props.questionNumber - 1)
      } else if (
        choices[this.props.questionNumber].format === 'multiple-select'
      ) {
        this.props.startAddAnswerToArray(this.props.multipleSelectAnswer)
        this.props.changeQuestionNumber(this.props.questionNumber - 1)
      }
    } else {
      this.props.changeQuestionNumber(this.props.questionNumber - 1)
    }
  }
  // will take you to the next question and update answer array
  // if a choice is selected
  public nextQuizQuestion = (choices: object) => (e: any) => {
    e.preventDefault()
    console.log('here on submit', choices[this.props.questionNumber].format)
    if (
      this.props.multipleSelectAnswer.answer.length > 0 ||
      this.props.multipleChoiceAnswer !== null
    ) {
      if (
        choices[this.props.questionNumber].format === 'multiple-choice' ||
        choices[this.props.questionNumber].format === 'true-false'
      ) {
        this.props.startAddAnswerToArray(this.props.multipleChoiceAnswer)
        this.props.changeQuestionNumber(this.props.questionNumber + 1)
      } else if (
        choices[this.props.questionNumber].format === 'multiple-select'
      ) {
        this.props.startAddAnswerToArray(this.props.multipleSelectAnswer)
        this.props.changeQuestionNumber(this.props.questionNumber + 1)
      }
    } else {
      this.props.changeQuestionNumber(this.props.questionNumber + 1)
    }
  }

  // adds an answer to the answer array if the question has not already
  // been answered if it has the answer will be updated
  public addAnswerToObject = (choices: object, answer: any) => {
    let index
    let newArrayAnswers
    let newArray
    switch (choices[this.props.questionNumber].format) {
      case 'multiple-choice':
        console.log(this.props.answerArray)
        if (
          this.props.answerArray.some((obj, i) => {
            if (obj.title === choices[this.props.questionNumber].title) {
              console.log('checking answerArray')
              console.log(obj.title)
              index = i
              return true
            }
          })
        ) {
          let newArray = this.props.answerArray
          newArray.splice(index, 1)
          console.log(newArray)
          updateAnswerArray({
            newArray
          })
        }
        this.props.addMultipleChoiceAnswer({
          author: choices[this.props.questionNumber].author,
          title: choices[this.props.questionNumber].title,
          answer: answer.answer.answer,
          selected: true
        })
        break
      case 'multiple-select':
        if (
          this.props.answerArray.some((obj, i) => {
            if (obj.title === choices[this.props.questionNumber].title) {
              console.log('checking answerArray')
              console.log(obj.title)
              index = i
              return true
            }
          })
        ) {
          newArrayAnswers = this.props.answerArray[index].answer
          this.props.addMultipleSelectAnswer({
            author: choices[this.props.questionNumber].author,
            title: choices[this.props.questionNumber].title,
            answer: newArrayAnswers
          })
          console.log(newArrayAnswers)
          // CLEARS ANSWERARRAY
          let newArray = this.props.answerArray
          newArray.splice(index, 1)
          updateAnswerArray({
            newArray
          })
        }

        if (
          this.props.multipleSelectAnswer.answer.includes(
            answer.answer.answer
          ) ||
          (newArrayAnswers !== undefined &&
            newArrayAnswers.includes(answer.answer.answer))
        ) {
          console.log('found a match, now remove it', answer.answer.answer)
          if (newArrayAnswers !== undefined) {
            const index = newArrayAnswers.indexOf(answer.answer.answer)
            newArray = newArrayAnswers
            newArray.splice(index, 1)
            this.props.addMultipleSelectAnswer({
              author: choices[this.props.questionNumber].author,
              title: choices[this.props.questionNumber].title,
              answer: newArray
            })
          } else {
            const index = this.props.multipleSelectAnswer.answer.indexOf(
              answer.answer.answer
            )
            newArray = this.props.multipleSelectAnswer.answer
            console.log(newArray)
            newArray.splice(index, 1)
            this.props.addMultipleSelectAnswer({
              author: choices[this.props.questionNumber].author,
              title: choices[this.props.questionNumber].title,
              answer: newArray
            })
          }
        } else {
          newArray = this.props.multipleSelectAnswer.answer
          console.log(newArray)
          newArrayAnswers !== undefined &&
            newArrayAnswers.push(answer.answer.answer)
          console.log(newArrayAnswers)
          newArray.push(answer.answer.answer)
          this.props.addMultipleSelectAnswer({
            author: choices[this.props.questionNumber].author,
            title: choices[this.props.questionNumber].title,
            answer: newArrayAnswers !== undefined ? newArrayAnswers : newArray
          })
        }
        break

      case 'true-false':
        console.log(this.props.answerArray)
        if (
          this.props.answerArray.some((obj, i) => {
            if (obj.title === choices[this.props.questionNumber].title) {
              console.log('checking answerArray')
              console.log(obj.title)
              index = i
              return true
            }
          })
        ) {
          let newArray = this.props.answerArray
          newArray.splice(index, 1)
          console.log(newArray)
          updateAnswerArray({
            newArray
          })
        }
        this.props.addMultipleChoiceAnswer({
          author: choices[this.props.questionNumber].author,
          title: choices[this.props.questionNumber].title,
          answer: answer.answer.answer,
          selected: true
        })
        break
    }
  }

  public submit = (choices: object) => (e: any) => {
    console.log('in submit function')
    if (
      this.props.multipleSelectAnswer.answer.length > 0 ||
      this.props.multipleChoiceAnswer !== null
    ) {
      if (
        choices[this.props.questionNumber].format === 'multiple-choice' ||
        choices[this.props.questionNumber].format === 'true-false'
      ) {
        this.props.startAddAnswerToArray(this.props.multipleChoiceAnswer)
      } else if (
        choices[this.props.questionNumber].format === 'multiple-select'
      ) {
        this.props.startAddAnswerToArray(this.props.multipleSelectAnswer)
      }
    }
    this.submitQuizModal()
  }

  handleSelection = (choice, title) => {
    const {
      multipleChoiceAnswer: multCh,
      multipleSelectAnswer: multSe,
      answerArray: ansArr,
      questionNumber: curr,
      quiz
    } = this.props

    const quizTitles = quiz.questions.map(question => question.title)

    /*birth check*/
    const mca = multCh !== null && multCh !== undefined

    const msa =
      multCh === null && multSe !== undefined && multSe.answer.length > 0

    /* check previous answers */
    const aarr =
      !mca &&
      multSe !== undefined &&
      multSe.answer.length === 0 &&
      ansArr.length > 0 &&
      ansArr.some(ans => quizTitles.includes(title))
    // ansArr.length >= curr
    // ansArr[curr] !== undefined

    /* display defaults */
    const choose =
      !mca &&
      multSe !== undefined &&
      multSe.answer.length === 0 &&
      ansArr.every(ans => !quizTitles.includes(title))

    // console.log('choice', choice)
    // console.log('title', title)
    // console.log('quiz titles', quizTitles)

    // console.log(
    //   'quiz titles does include the title',
    //   ansArr.some(ans => quizTitles.includes(title))
    // )

    // console.log(
    //   'quiz titles does not include the title',
    //   ansArr.every(ans => !quizTitles.includes(title))
    // )
    // ansArr.length < curr
    // ansArr[curr] === undefined
    // const aarr =
    //   multCh === null &&
    //   (multSe.answer.length === 0 || multSe !== undefined) &&
    //   ansArr.length > 0

    // console.log('msa', msa)
    // console.log('multSe', multSe)

    /*answer comparison*/

    // check multiple choice object
    if (mca) {
      console.log('checking multiple choice...')
      return multCh.answer === choice ? 'choice selected' : 'choice'
    }

    // check multiple select object
    if (msa) {
      // if (msa && multSe.answers !== undefined) {
      console.log(
        'checking multiple select...',
        multSe.answer.some(answer => answer === choice)
      )
      return multSe.answer.some(answer => answer === choice)
        ? multSe.answer
            .map(answer => {
              if (answer === choice) return 'choice selected'
            })
            .join('')
        : 'choice'
    }

    // check answer array
    if (aarr) {
      // console.log('here is answers array', ansArr)
      const arr = ansArr.map(answer => {
        // let finalClass = ansArr.map(answer => {
        console.log('logging tritle? ', answer.title)
        let className = ''
        if (!Array.isArray(answer.answer)) {
          if (answer.answer === choice && answer.title === title) {
            className = 'choice selected'
            console.log('not an array, className: ', className)
          }
          if (answer.answer !== choice) {
            className = 'choice'
            console.log('not an array, className: ', className)
          }
        }
        if (Array.isArray(answer.answer) && answer.title === title) {
          answer.answer.includes(choice)
            ? (className = 'choice selected')
            : (className = 'choice')
          console.log('is an array, className is now: ', className)
        }
        console.log('before submission, className is', className)
        return className
      })

      return arr.includes('choice selected') ? 'choice selected' : 'choice'
    }

    if (choose) {
      return 'choice'
    }
  }

  // @ts-ignore
  render = () => {
    const {
      quiz,
      questionNumber,
      multipleChoiceAnswer,
      multipleSelectAnswer,
      answerArray
    } = this.props
    return (
      <div className="take-quiz-page">
        {quiz.questions === undefined && (
          <Spinner className="loading-indicator" name="ball-spin-fade-loader" />
        )}
        {quiz.questions !== undefined && (
          <div className="main">
            <header>
              <div className="meta">
                <div className="container">
                  <p className="current">Question {questionNumber + 1}</p>
                  <div className="icon">
                    <Dropdown
                      isOpen={this.state.dropdownOpen}
                      toggle={this.toggleDropdown}
                      className="app-dropdown-root"
                    >
                      <DropdownToggle className="dropdown-toggle">
                        <FontAwesomeIcon icon="ellipsis-h" className="menu" />
                      </DropdownToggle>
                      <DropdownMenu
                        left="true"
                        className="dropdown-menu"
                        style={{
                          display: this.state.dropdownOpen ? 'block' : 'none'
                        }}
                      >
                        <DropdownItem
                          className="dropdown-item"
                          onClick={this.reportQuestionModal(
                            this.props.quiz.questions[questionNumber].uuid
                          )}
                        >
                          Report question
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
                <p className="title">{quiz.title}</p>
                <p className="progress">
                  Question {questionNumber + 1}/{quiz.questions.length}
                </p>
                <p className="format">
                  {quiz !== undefined &&
                    quiz.questions[questionNumber] !== undefined &&
                    quiz.questions[questionNumber].format}
                </p>
                {/* <p className="progress">
                  Question {questionNumber + 1}/{quiz.questions.length}
                </p> */}
              </div>
              <p className="question">{quiz.questions[questionNumber].title}</p>
            </header>
            {/* DISPLAYS THE CHOICES */}
            <main>
              <div className="choices">
                {quiz.questions[questionNumber].answers.map((answers, i) => (
                  <div
                    key={i}
                    className={this.handleSelection(
                      answers.answer.answer,
                      quiz.questions[questionNumber].title
                    )}
                    onClick={this.addAnswerToObject.bind(
                      this,
                      quiz.questions,
                      answers
                    )}
                  >
                    <p>
                      {answers.answer.answer}
                      {/* prints classnames of selected answer <span>
                        &nbsp;&nbsp;{this.handleSelection(
                          answers.answer.answer,
                          quiz.questions[questionNumber].title
                        )}
                      </span> */}
                    </p>

                    {/* <svg
                      height="100%"
                      width="100%"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g>
                        <rect
                          className="rect-border"
                          height="100%"
                          width="100%"
                          fill="none"
                        />
                        <text x="20%" y="50" className="text">
                          {answers.answer.answer}
                        </text>
                      </g>
                    </svg> */}
                  </div>
                ))}
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
                    alt="question image"
                  />
                )}
              </div>
              <div className="buttons">
                {questionNumber !== 0 && (
                  <button
                    onClick={this.previousQuizQuestion(quiz.questions)}
                    className="previous-button"
                  >
                    previous
                  </button>
                )}
                {questionNumber + 1 !== quiz.questions.length ? (
                  <button
                    onClick={this.nextQuizQuestion(quiz.questions)}
                    className="next-button"
                  >
                    next
                  </button>
                ) : (
                  <button
                    onClick={this.submit(quiz.questions)}
                    className="submit-button"
                  >
                    Done
                  </button>
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
  quiz:
    state.takeQuiz.quizAttemptInfoObj !== null &&
    state.takeQuiz.quizAttemptInfoObj,
  answers: state.takeQuiz.answers,
  answerArray: state.takeQuiz.answerArray,
  questionNumber: state.takeQuiz.questionNumber,
  multipleSelectAnswer: state.takeQuiz.multipleSelectAnswer,
  multipleChoiceAnswer: state.takeQuiz.multipleChoiceAnswer
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
    loadModal
  }
)(TakeQuizPage)
