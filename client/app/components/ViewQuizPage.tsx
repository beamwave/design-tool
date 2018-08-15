import React, { Component } from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ArrowIcon from '../../public/icons/arrow-icon.svg'
import Spinner from 'react-spinkit'
import {
  startGetSearchedQuiz,
  startQuizAttempt,
  clearResults
} from '../actions/quizzes'
import { loadModal } from '../actions/modal'
import { REPORT_QUIZ_MODAL } from '../constants/modaltypes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

interface IProps {
  history?: any
  match?: any
  username: any
  quizzes: any
  results: any
  quiz: any
  randomGradient: string
  toggle: any
  gradientColor: string
  clearResults?: () => any
  startQuizAttempt: (quizUUID: any, username: any, reset: number) => void
  startGetSearchedQuiz: (uuid: any) => any
  loadModal: (string) => any
}

export class ViewQuizPage extends Component<IProps> {
  state = {
    clickedQuestion: [],
    questionNumber: 0,
    index: Math.floor(Math.random() * 5),
    dropdownOpen: false
  }

  toggleDropdown = () =>
    this.setState((prevState: any) => ({
      dropdownOpen: !prevState.dropdownOpen
    }))

  params = window.location.href.split('/')
  quizUUID = this.params[4]

  reportQuizModal = () => this.props.loadModal(REPORT_QUIZ_MODAL)

  public showQuizQuestion = (question: any, count: number, e: any) => {
    e.preventDefault()
    this.setState({
      ...this.state,
      questionNumber: count,
      clickedQuestion: [question]
    })
  }
  public startQuizAttempt = (e: any) => {
    this.props.results !== null && this.props.clearResults()
    this.props.startQuizAttempt(this.quizUUID, this.props.username, 0)
  }

  goBack = () => this.props.history.goBack()

  randomGradient = [
    'red-orange',
    'red-blue',
    'blue-light-teal',
    'midnight-violet',
    'midnight-orange'
  ]

  // @ts-ignore
  render = () => {
    const { quiz } = this.props
    const { index } = this.state

    const otherCount = quiz !== undefined && quiz.count && quiz.count > 0

    const myCount =
      quiz !== undefined &&
      quiz.questions !== undefined &&
      quiz.questions.length > 0
    // {quiz.count ? (
    //   quiz.count > 0
    // ) : quiz.questions.length > 0 ?
    return (
      <div className="view-quiz-page">
        {(quiz === undefined ||
          (quiz.count === undefined || quiz.questions === undefined)) && (
          <Spinner className="loading-indicator" name="ball-spin-fade-loader" />
        )}
        {quiz !== undefined &&
          (quiz.count !== undefined || quiz.questions !== undefined) && (
            <div className="main">
              <main className={this.randomGradient[index]}>
                <div className="scroll-wrapper">
                  <ArrowIcon className="back" onClick={this.goBack} />
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
                        right
                        className="dropdown-menu"
                        style={{
                          display: this.state.dropdownOpen ? 'block' : 'none'
                        }}
                      >
                        <DropdownItem
                          className="dropdown-item"
                          onClick={this.reportQuizModal}
                        >
                          Report quiz
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <p className="author">By: {quiz.author}</p>
                  <h1 className="title">{quiz.title}</h1>
                  <h2 className="total">
                    {quiz.count
                      ? quiz.count
                      : quiz.questions !== undefined &&
                        quiz.questions.length > 0
                        ? quiz.questions.length
                        : 0}{' '}
                    questions
                  </h2>
                  <p className="description">{quiz.description}</p>
                </div>
              </main>
              <footer>
                {quiz.author === this.props.username && (
                  <Link to={`/edit-quiz/${quiz.uuid}`} className="link">
                    <p className="edit-button">Edit quiz</p>
                  </Link>
                )}
                {otherCount || myCount ? (
                  <Link
                    to={`/take-quiz/${quiz.uuid}`}
                    onClick={this.startQuizAttempt}
                    className="link"
                  >
                    <button className="take-button">Take quiz</button>
                  </Link>
                ) : (
                  <div className="link">
                    <button className="take-button" disabled={true}>
                      Take quiz
                    </button>
                  </div>
                )}
              </footer>
            </div>
          )}
      </div>
    )
  }
}
const mapStateToProps = (state, props) => ({
  username: state.auth.username,
  results: state.takeQuiz.results,
  quiz:
    state.quizzes.all !== undefined &&
    state.quizzes.all
      .filter(quiz => quiz !== null)
      .find(quiz => quiz.uuid === props.match.params.uuid),
  quizzes:
    state.quizzes.all !== undefined &&
    state.quizzes.all.filter(quiz => quiz !== null)
})
export default connect<any, any>(
  mapStateToProps,
  { startGetSearchedQuiz, startQuizAttempt, loadModal, clearResults }
)(ViewQuizPage)
