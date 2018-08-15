import React, { Component } from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { clearResults, clearQuizAttempt } from '../actions/quizzes'
import { loadModal } from '../actions/modal'
import { DELETE_QUIZ_MODAL } from '../constants/modaltypes'
import Pagination from './Pagination'

interface IProps {
  username: string
  quizzes: any[]
  type: string
  quizAttempts: any[]
  clearResults?: () => any
  clearQuizAttempt?: (reset: number) => void
  loadModal?: (type: string, title: string, uuid: any) => any
}

const colors = [
  '#f26161',
  '#cc5252',
  '#e573b1',
  '#ff9d66',
  '#2ddbbc',
  '#42a6a6',
  '#2d9cdb',
  '#3f388c',
  '#4775b2',
  '#b866cc',
  '#333ea6',
  '#f2c94c'
]

export class MyQuizzesPage extends Component<IProps, any> {
  constructor(props) {
    super(props)
    this.state = {
      quizItems: this.props.quizzes,
      attemptItems: this.props.quizAttempts,
      pageOfItems: []
    }
  }
  params = window.location.href.split('/')
  pageType = this.params[4]

  onChangePage = pageOfItems => {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems })
  }

  clearResults = (e: any) => {
    this.props.clearResults()
    this.props.clearQuizAttempt(0)
    console.log('clearing results')
  }

  deleteQuizModal = data => (e: any) =>
    this.props.loadModal(DELETE_QUIZ_MODAL, data, null)

  deleteQuestion = e => console.log('quiz uuid: ', e.target.dataset.uuid)

  //@ts-ignore
  render = () => {
    const { quizzes, type, quizAttempts, username } = this.props
    const { pageOfItems, quizItems, attemptItems } = this.state
    return (
      <div className="my-quizzes-page">
        {type === 'created' && (
          <p className="links">
            <Link to="/quizzes/created" className="quiz-type">
              created
            </Link>&nbsp;/&nbsp;<Link
              to="/quizzes/taken"
              onClick={this.clearResults}
            >
              taken
            </Link>
          </p>
        )}
        {type === 'taken' && (
          <p className="links">
            <Link to="/quizzes/created">created</Link>&nbsp;/&nbsp;<Link
              to="/quizzes/taken"
              className="quiz-type"
              onClick={this.clearResults}
            >
              taken
            </Link>
          </p>
        )}
        {this.state.pageOfItems.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
        <div className="blocks">
          {this.pageType === 'created' &&
            quizzes !== undefined &&
            quizzes.map((quiz: any) => {
              // pageOfItems.map((quiz: any) => {
              if (quiz !== null && quiz.author === username)
                return (
                  <div key={quiz.uuid} className="block">
                    <div
                      className="delete-quiz"
                      data-uuid={quiz.uuid}
                      onClick={this.deleteQuizModal(quiz.title)}
                    >
                      <FontAwesomeIcon icon="trash" />
                      <p className="hint">Permanently delete this quiz</p>
                    </div>
                    <Link className="quiz-link" to={`/view-quiz/${quiz.uuid}`}>
                      <h1 className="name">{quiz.title}</h1>
                      <p className="amount">
                        {quiz.questions.length} questions
                      </p>
                      <div className="tags">
                        {quiz.tags.length === 0 && (
                          <p className="tag-null-set">No tags</p>
                        )}
                        {quiz.tags.length > 0 && quiz.tags.length > 3
                          ? quiz.tags.slice(0, 3).map(tag => (
                              <div key={tag.allLowerCase} className="tag">
                                <div
                                  className="tag-dot"
                                  style={{
                                    height: 8,
                                    width: 8,
                                    borderRadius: 50,
                                    backgroundColor:
                                      colors[
                                        Math.floor(
                                          Math.random() * colors.length
                                        )
                                      ]
                                  }}
                                />
                                <p className="tag-text shorten">
                                  {tag.allLowerCase}
                                </p>
                              </div>
                            ))
                          : quiz.tags.map(tag => (
                              <div key={tag.allLowerCase} className="tag">
                                <div
                                  className="tag-dot"
                                  style={{
                                    height: 8,
                                    width: 8,
                                    borderRadius: 50,
                                    backgroundColor:
                                      colors[
                                        Math.floor(
                                          Math.random() * colors.length
                                        )
                                      ]
                                  }}
                                />
                                <p className="tag-text full">
                                  {tag.allLowerCase}
                                </p>
                              </div>
                            ))}
                        {quiz.tags.length > 3 && (
                          <p className="extra-tags">+{quiz.tags.length - 3}</p>
                        )}
                      </div>
                      <div className="fill-block"></div>
                      {/* {quiz.tags.map(tag => (
                    <div key={tag.allLowerCase} className="tag">
                      {tag.allLowerCase}
                    </div>
                  ))} */}
                    </Link>
                  </div>
                )
            })}
          {this.pageType === 'taken' &&
            quizAttempts !== undefined &&
            quizAttempts.length > 0 &&
            // quizAttempts.length > 0 &&
            quizAttempts.map(
              (quizAttempt: any, index) =>
                quizAttempt.timings.finished !== undefined && (
                  <Link
                    to={`/review-quiz/${quizAttempt.quizUUID}/${index}`}
                    key={index}
                  >
                    <div className="block">
                      <h1 className="name">{quizAttempt.title}</h1>
                      {quizAttempt.questions !== undefined && (
                        <p className="amount">
                          {quizAttempt.questions.length} questions
                        </p>
                      )}
                      <p className="score">Your Score: {quizAttempt.score}</p>
                    </div>
                  </Link>
                )
            )}
          {this.pageType === 'taken' &&
            quizAttempts !== undefined &&
            (quizAttempts.every(
              quizAttempt => quizAttempt.timings.finished === undefined
            ) ||
              quizAttempts.length === 0) && (
              <p className="no-taken-quizzes">
                You have not taken any quizzes yet.
              </p>
            )}
        </div>
        <div>
          {/* {this.pageType === 'created' &&
            quizzes !== undefined &&
            quizzes.length > 6 &&
            quizzes.map((quiz, i) => {
              return <p className="page-number">{Math.ceil(i / 6)}</p>
            })} */}
          <Pagination
            items={type === 'taken' ? quizItems : attemptItems}
            onChangePage={this.onChangePage}
            initialPage={1}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  username: state.auth.username,
  quizzes: state.quizzes.all,
  quizAttempts: state.quizzes.allAttempts,
  type: props.match.params.type
})

export default connect(
  mapStateToProps,
  {
    clearResults,
    loadModal,
    clearQuizAttempt
  }
)(MyQuizzesPage)
