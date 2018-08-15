import React, { Component } from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  startAddAnswerToArray,
  changeQuestionNumber,
  addMultipleSelectAnswer,
  addMultipleChoiceAnswer,
  updateMultipleSelectAnswer,
  updateAnswerArray
} from '../actions/quizzes'
import Spinner from 'react-spinkit'
import CoinIcon from '../../public/icons/coin-icon.svg'

interface IProps {
  quiz: any
  history?: any
}

export class QuizResultsPage extends Component<IProps, any> {
  params = window.location.href.split('/')
  quizUUID = this.params[4]

  determineResponse = () => {
    const score = this.props.quiz.score
    if (score < 20) return 'What was that?!'
    if (score > 19 && score < 60) return 'Were you even trying?'
    if (score > 59 && score < 71)
      return 'Failure is simply the opportunity to begin again, this time more intelligently.'
    if (score > 70 && score < 81)
      return 'A bit more studying and you will have it for sure!'
    if (score > 80 && score < 91) return 'Not bad!'
    if (score > 90 && score < 100) return 'Great job!'
    if (score === 100) return 'Perfect score!'
  }

  determineColor = () => {
    const score = this.props.quiz.score
    if (score < 70) return 'red-dark-red'
    if (score > 69 && score < 91) return 'yellow-orange'
    if (score > 90 && score < 100) return 'yellow-green'
    if (score === 100) return 'green-dark-green'
  }

  // @ts-ignore
  componentWillUnmount = () => {
    if (this.props.history.action === 'POP') {
      console.log('user has left page')
      this.props.history.push('/quizzes/taken')
    }
  }

  // @ts-ignore
  render = () => {
    const { quiz } = this.props
    return (
      <div className="quiz-results-page">
        {quiz === null && (
          <div>
            <Spinner
              className="loading-indicator"
              name="ball-spin-fade-loader"
            />
            <p className="grading">Grading quiz...</p>
          </div>
        )}
        {quiz !== null && (
          <div className="quiz-results-page">
            <div className="main">
              <main className={this.determineColor()}>
                <h1 className="title">{this.determineResponse()}</h1>
                <p className="score">{Math.round(this.props.quiz.score)}%</p>
                <div className="points-container">
                  <p className="points">
                    +{Math.round(parseInt(quiz.score) / 10)}&nbsp;
                  </p>
                  <CoinIcon className="coin-icon" />
                </div>
              </main>
              <footer>
                <Link to={`/view-quiz/${this.quizUUID}`} className="link">
                  <p className="retake-button">Retake quiz</p>
                </Link>
                <Link to={`/review-quiz/${this.quizUUID}`} className="link">
                  <p className="results-button">Review Quiz</p>
                </Link>
              </footer>
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  username: state.auth.username,
  quiz: state.takeQuiz.results
  // quiz: state.takeQuiz.results !== null && state.takeQuiz.results
})

export default connect(
  mapStateToProps,
  {
    startAddAnswerToArray,
    changeQuestionNumber,
    addMultipleChoiceAnswer,
    addMultipleSelectAnswer,
    updateMultipleSelectAnswer,
    updateAnswerArray
  }
)(QuizResultsPage)
