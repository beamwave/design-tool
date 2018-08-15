import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '../Modal'
import { hideModal } from '../../actions/modal'
import { submitQuizAttempt, clearQuizAttempt } from '../../actions/quizzes'
import { RouteProps, withRouter } from 'react-router'

interface IProps extends RouteProps {
  hideModal: () => any
  quiz: any
  history: any
  username: any
  answerArray: any
  questionNumber: any
  clearQuizAttempt: (reset: number) => void
  submitQuizAttempt: (
    quizUUID: string,
    user: string,
    attemptUUID: string,
    answerArray: any[]
  ) => void
}

export class SubmitQuizModal extends Component<IProps> {
  constructor(props) {
    super(props)
  }

  params = window.location.href.split('/')
  quizUUID = this.params[4]

  onClose = () => this.props.hideModal()

  public submit = (e: any) => {
    e.preventDefault()
    console.log('in submit modal')
    console.log(
      this.quizUUID,
      this.props.username,
      this.props.quiz.attemptUUID,
      this.props.answerArray
    )

    //PROMISE THAT STOPS ASYNCH ISSUE OF SUBMITTING QUIZ AND THEN ONCE SUBMITTED, THEN CLEARS QUIZ INFO
    let parameterSubmit = e => {
      let waitSubmit = new Promise((resolve, reject) => {
        e.props.submitQuizAttempt(
          e.quizUUID,
          e.props.username,
          e.props.quiz.attemptUUID,
          e.props.answerArray
        )
        resolve('Successfully submitted quiz')
      })

      let isSubmit = function() {
        waitSubmit.then(fulfilled => {
          console.log(fulfilled)
          e.props.clearQuizAttempt(0)
        })
      }

      isSubmit()
    }

    parameterSubmit(this)

    this.onClose()
    this.props.history.push(`/quiz-results/${this.quizUUID}`)
  }

  // @ts-ignore
  render = () => {
    return (
      <Modal onClose={this.onClose}>
        <div className="submit-quiz-modal">
          <div className="close" onClick={this.onClose}>
            <FontAwesomeIcon icon="times" />
          </div>
          <p className="title">Submit quiz?</p>
          {this.props.answerArray.length ===
          this.props.quiz.questions.length ? (
            <p className="subhead">Cross your fingers and hope for the best!</p>
          ) : (
            <p className="subhead">
              You must answer all questions before submitting!
            </p>
          )}

          <div className="button-group">
            <button onClick={this.onClose} className="cancel">
              Cancel
            </button>
            {this.props.answerArray.length ===
              this.props.quiz.questions.length && (
              <button onClick={this.submit} className="submit">
                Submit
              </button>
            )}
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state, props) => ({
  username: state.auth.username,
  quizzes: state.quizzes.quizAttemptInfoObj,
  questionNumber: state.takeQuiz.questionNumber,
  quiz:
    state.takeQuiz.quizAttemptInfoObj !== null &&
    state.takeQuiz.quizAttemptInfoObj,
  answerArray: state.takeQuiz.answerArray
})

export default withRouter(
  connect(
    mapStateToProps,
    { hideModal, submitQuizAttempt, clearQuizAttempt }
  )(SubmitQuizModal)
)
