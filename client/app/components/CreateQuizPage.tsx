import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { startCreateNewQuiz } from '../actions/create'

interface IProps {
  history?: any
  username?: any
  quizzes?: any
  startCreateNewQuiz: (quiz: any, any) => any
}

export class CreateQuizPage extends Component<IProps, any> {
  state = {
    quiz: {
      author: this.props.username,
      title: '',
      description: '',
      isPrivate: true,
      type: 'quiz'
    },
    quizzes: this.props.quizzes
  }

  private updateQuiz = (e: any, arg1: string) => {
    switch (arg1) {
      case 'title':
        this.setState({
          quiz: {
            ...this.state.quiz,
            title: e.target.value
          }
        })
        break
      case 'description':
        this.setState({
          quiz: {
            ...this.state.quiz,
            description: e.target.value
          }
        })
      default:
        break
    }
    // console.log(this.state)
  }

  private updatePrivate = (e: any) => {
    switch (e.target.value) {
      case 'private':
        this.setState({
          quiz: {
            ...this.state.quiz,
            isPrivate: true
          }
        })
        break

      default:
        this.setState({
          quiz: {
            ...this.state.quiz,
            isPrivate: false
          }
        })
        break
    }
  }

  private submitQuiz = async (e: any) => {
    e.preventDefault()
    const { startCreateNewQuiz, username } = this.props
    const { quiz } = this.state

    // save quiz to db and update quizzes
    const createAction = await startCreateNewQuiz(quiz, this.props.history)

    // this.props.history.push('/quizzes/created')
    // this.props.history.push('/edit-quiz/' + uuid)
    // .then(res => {
    //   console.log('add quiz props')
    //   console.log(this.props)
    //   this.props.history.push('/add-question')
    // })
    // .catch(err =>
    //   console.log(
    //     'make sure the user knows that the quiz did not make it through'
    //   )
    // )
  }

  // @ts-ignore
  render = () => {
    const {
      quiz: { title }
    } = this.state
    return (
      <div className="create-quiz-page">
        <main>
          <div
            className={
              title.length > 0
                ? 'create-quiz-container valid'
                : 'create-quiz-container invalid'
            }
          >
            <p className="title">Create a quiz</p>
            <form className="details">
              <div className="group">
                <label htmlFor="create-quiz-title">Title</label>
                <input
                  type="text"
                  id="create-quiz-title"
                  value={this.state.quiz.title}
                  onChange={(e: any) => {
                    this.updateQuiz(e, 'title')
                  }}
                />
              </div>
              <div className="group">
                <label htmlFor="create-quiz-description">Description</label>
                <textarea
                  id="create-quiz-description"
                  value={this.state.quiz.description}
                  rows={3}
                  onChange={(e: any) => {
                    this.updateQuiz(e, 'description')
                  }}
                />
              </div>
              <div className="group">
                <label htmlFor="owner">Owner</label>
                <FontAwesomeIcon className="icon" icon="angle-down" />
                <select
                  name="owner"
                  id="question-options-dropdown"
                  onChange={this.updatePrivate}
                >
                  <option value="choose" hidden>
                    select
                  </option>
                  <option value="private">private</option>
                  <option value="public">public</option>
                </select>
              </div>
              <button
                type="button"
                className="save-quiz"
                onClick={this.submitQuiz}
                disabled={title.length > 0 ? false : true}
              >
                Create
              </button>
            </form>
          </div>
        </main>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  username: state.auth.username,
  quizzes: state.quizzes.all
})

export default connect<any, IProps>(
  mapStateToProps,
  { startCreateNewQuiz }
)(CreateQuizPage)
