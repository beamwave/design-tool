import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MenuIcon from '../../public/icons/menu-icon.svg'
import AddQuizIcon from '../../public/icons/add-quiz-icon.svg'
import ViewQuizzesIcon from '../../public/icons/view-quizzes-icon.svg'
import AchievementsIcon from '../../public/icons/achievements-icon.svg'
import CartIcon from '../../public/icons/cart-icon.svg'
import SettingsIcon from '../../public/icons/settings-icon.svg'

import { generateUuid } from '../helpers/helpers'
import { loadModal } from '../actions/modal'
import { changeQuestionNumber } from '../actions/quizzes'

// interface IProps {
interface IProps extends RouteComponentProps<any> {
  username?: string
  questions?: any
  startAddTopic?: (nextTopic: any) => any
  changeQuestionNumber?: (questionNumber: number) => any
  loadModal?: (string) => void
}

interface IState {
  takingQuiz: boolean
  isEditing: boolean
}

export class SidebarContent extends Component<IProps, IState> {
  state = {
    takingQuiz: false,
    isEditing: false,
    topic: ''
  }

  handleQuestionChange = e => {
    const questionNumber = parseInt(e.target.dataset.questionnumber)
    this.props.changeQuestionNumber(questionNumber)
  }

  onFieldChange = e => {
    let { name, value }: { name: keyof IState; value: string } = e.target
    this.setState({
      [name]: value
    } as any)
  }

  handleSubmit = e => {
    e.preventDefault()
    let topic = this.state.topic
    let id = generateUuid()
    let username = this.props.username
    let nextTopic = {
      uid: id,
      owner: username,
      topic: topic
    }
    this.props.startAddTopic(nextTopic)
  }

  // spawnWordModal = () => this.props.loadModal(NEW_WORD_MODAL)

  toggle = e => {
    this.setState({ isEditing: !this.state.isEditing })
  }

  // @ts-ignore
  componentWillReceiveProps = props => {
    const quizInProgress = props.location.pathname.includes('take-quiz')

    this.setState({ takingQuiz: quizInProgress ? true : false })
  }

  // @ts-ignore
  render = () => {
    const { topic, takingQuiz } = this.state
    const { questions } = this.props
    return (
      <div className="content">
        <div className="cover" />
        {!takingQuiz && (
          <div className="container link-container">
            <Link to="/dashboard" className="link">
              <MenuIcon className="svg menu" />
              <p className="hint">Home</p>
            </Link>
            <Link to="/create-quiz" className="link">
              <AddQuizIcon className="svg add-quiz" />
              <p className="hint">Create quiz</p>
            </Link>
            <Link to="/quizzes/created" className="link">
              <ViewQuizzesIcon className="svg view-quizzes" />
              <p className="hint">Quiz history</p>
            </Link>
            <Link to="/achievements" className="link">
              <AchievementsIcon className="svg achievements" />
              <p className="hint">Trophies</p>
            </Link>
            <Link to="/store" className="link">
              <CartIcon className="svg store" />
              <p className="hint">Store</p>
            </Link>
            <Link to="/settings" className="link">
              <SettingsIcon className="svg settings" />
              <p className="hint">Settings</p>
            </Link>
          </div>
        )}
        {takingQuiz && (
          <div className="container question-container">
            <Link to="/dashboard" className="link">
              <MenuIcon className="svg menu" />
            </Link>
            <div className="scroll-container">
              <div className="questions">
                {questions.length > 0 &&
                  questions.map((question, number) => (
                    <p
                      key={number}
                      data-questionnumber={number}
                      className="question-number"
                      onClick={this.handleQuestionChange}
                    >
                      {number + 1}
                    </p>
                  ))}
              </div>
            </div>
            <div className="scroll-down">
              <FontAwesomeIcon
                icon="angle-down"
                className="icon fa-angle-down"
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

/* // @ts-ignore
  render = () => {
    const { topic, takingQuiz } = this.state
    return (
      <div className="content">
        <div className="cover" />
        <Link to="/dashboard" className="link">
          <MenuIcon className="svg menu" />
        </Link>
        <Link to="/add-quiz" className="link">
          <AddQuizIcon className="svg add-quiz" />
        </Link>
        <Link to="/quizzes/created" className="link">
          <ViewQuizzesIcon className="svg view-quizzes" />
        </Link>
        <Link to="/achievements" className="link">
          <AchievementsIcon className="svg achievements" />
        </Link>
        <Link to="/store" className="link">
          <CartIcon className="svg store" />
        </Link>
        <Link to="/settings" className="link">
          <SettingsIcon className="svg settings" />
        </Link>
      </div>
    )
  }
}
*/

const mapStateToProps = (state, props) => ({
  username: state.auth.username,
  questions:
    state.takeQuiz.quizAttemptInfoObj !== null &&
    state.takeQuiz.quizAttemptInfoObj.questions
})
export default withRouter(
  connect<any, any>(
    mapStateToProps,
    { loadModal, changeQuestionNumber },
    undefined,
    { pure: false }
  )(SidebarContent)
)
