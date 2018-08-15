import React, { Component } from 'react'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Spinner from 'react-spinkit'
import Dropzone from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { startDeleteQuestion, startEditQuestion } from '../actions/questions'
import { editStoreQuiz, startUpdateQuestionsDisplay } from '../actions/quizzes'
import AddQuestion from './AddQuestion'
import { loadModal } from '../actions/modal'
import { DELETE_QUIZ_MODAL } from '../constants/modaltypes'

interface IProps {
  history?: any
  username: any
  quiz: any
  quizzes: any[]
  editStoreQuiz: (any) => any
  adding?: (any) => any
  editFunc?: (any) => any
  startEditQuestion: (any) => any
  startDeleteQuestion: (author: string, title: any) => any
  enableSaveAllButton?: (any) => any
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

export class EditQuizPage extends Component<IProps> {
  state = {
    errMsg: '',
    displayPhoto: '',
    page: 1,
    clickedQuestion: {
      author: '',
      title: '',
      uuid: '',
      format: '',
      answers: [
        {
          answer: '',
          percentPoints: 0,
          feedback: ''
        }
      ]
    },
    questionNumber: 0,
    updatedQuestions: [],
    clickedAddQuestion: false,
    edited: false,
    answerQue: ''
  }

  params = window.location.href.split('/')
  quizUUID = this.params[4]

  page1 = () => this.setState({ page: 1 })

  page2 = () => this.setState({ page: 2 })

  deleteQuizModal = title => (e: any) => {
    this.props.loadModal(DELETE_QUIZ_MODAL, title, null)
    this.props.history.push('/quizzes/created')
  }

  private updateArr = (e: any, arg1: number, arg2: string) => {
    let newAnswersArr = this.state.clickedQuestion.answers
    newAnswersArr[arg1][arg2] = e.target.value
    this.setState({
      edited: true,
      currentQuestion: {
        ...this.state.clickedQuestion,
        answers: newAnswersArr
      }
    })
  }

  public editFunc = () => this.setState({ edited: true })
  public adding = () => this.setState({ clickedAddQuestion: false })

  // public enableSaveAllButton = answerQue => this.setState({ answerQue })

  private updateQuiz = async (e: any) => {
    let sendQuestionList = []
    for (let item of this.state.updatedQuestions) {
      if (item.tags) {
        let set = new Set(
          item.tags.split(',').map(string => {
            return string.trim()
          })
        )

        let testArr: any[] = [...set]
        sendQuestionList.push({
          ...item,
          tags: testArr
        })
      } else {
        sendQuestionList.push({
          ...item
        })
      }
    }
    for (let item of sendQuestionList) {
      console.log('here')
      const data = {
        quizID: window.location.href.split('/')[4],
        question: item
      }

      let testvar = await this.props.startEditQuestion(data)
      console.log(testvar['response']['status'])

      let errorHandling = () => {
        if (testvar['response']['status'] === 400) {
          this.setState({
            ...this.state,
            errMsg:
              'Please make sure all boxes have been filled in and re-submit.'
          })
        } else if (testvar['response']['status'] === 502) {
          this.setState({
            ...this.state,
            errMsg:
              'Your selected image is too large. Please upload a smaller image.'
          })
        } else if (testvar['response']['status'] === 200) {
          this.props.history.push('/quizzes/created')
        }
      }

      errorHandling()
    }
  }

  private saveChangeToState = (e: any) => {
    let newQArr = this.state.updatedQuestions
    newQArr.push(this.state.clickedQuestion)
    this.setState({
      ...this.state,
      updatedQuestions: newQArr,
      errMsg: '',
      edited: false
    })
    this.page1()
    // this.updateStore(this.state.clickedQuestion);
  }

  private deleteQuestion = (e: any) => {
    this.deleteFromStore()
    this.props.startDeleteQuestion(
      this.state.clickedQuestion.author,
      this.state.clickedQuestion.title
    )
  }

  private deleteFromStore = () => {
    let modQuiz = this.props.quiz
    for (let i = 0; i < modQuiz.questions.length; i++) {
      if (modQuiz.questions[i].uuid === this.state.clickedQuestion.uuid) {
        modQuiz.questions.splice(i, 1)
        //here is where we delete a question
      }
    }
    let quizList = this.props.quizzes
    for (let i = 0; i < quizList.length; i++) {
      if (quizList[i].uuid === this.props.quiz.uuid) {
        quizList.splice(i, 1, modQuiz)
      }
    }
    this.props.editStoreQuiz(quizList)
  }

  private updateStore = clickedQuestion => {
    if (this.props.quizzes !== [] && this.props.quiz) {
      let modQuiz = this.props.quiz
      for (let i = 0; i < modQuiz.questions.length; i++) {
        if (modQuiz.questions[i].uuid === this.state.clickedQuestion.uuid) {
          modQuiz.questions = modQuiz.questions.concat(clickedQuestion)
        }
      }

      let quizList = this.props.quizzes
      for (let i = 0; i < quizList.length; i++) {
        if (quizList[i].uuid === this.props.quiz.uuid) {
          quizList.splice(i, 1, modQuiz)
        }
      }
      this.props.editStoreQuiz(quizList)
    }
  }

  public showQuizQuestion = (question: any, count: number, e: any) => {
    e.preventDefault()

    this.setState({
      ...this.state,
      questionNumber: count,
      clickedQuestion: question,
      clickedAddQuestion: false,
      displayPhoto: question.image || ''
    })
  }

  private setAddQuestion = (e: any) => {
    this.setState({
      // we may not need this because if the component reloads this will be cleared anyway
      ...this.state,
      clickedQuestion: {
        author: '',
        title: '',
        uuid: '',
        format: '',
        answers: [
          {
            answer: '',
            percentPoints: 0,
            feedback: ''
          }
        ]
      },
      clickedAddQuestion: true
    })
  }

  private photoUpload: HTMLInputElement

  fileSelectedHandler = e => this.setState({ selectedFile: e.target.files[0] })

  private updateTags = (e: any) => {
    const tags = e.target.value
    this.setState({
      clickedQuestion: {
        ...this.state.clickedQuestion,
        tags: tags
      }
    })
  }

  private onDrop = (files: any) => {
    const file = files[0]
    const getBase64 = async file => {
      var reader = new FileReader()
      reader.readAsDataURL(file)
      let codeString
      reader.onload = function() {
        codeString = reader.result
        codeString = codeString.split(',', 2)
        this.setState({
          ...this.state,
          clickedQuestion: {
            ...this.state.clickedQuestion,
            image: codeString[1],
            newImage: 'yes'
          },
          displayPhoto: codeString.join(',')
        })
      }.bind(this)
      reader.onerror = function(error) {
        console.log('Error: ', error)
      }
      return codeString
    }
    getBase64(file)
  }

  // @ts-ignore
  render = () => {
    const { username, quizzes } = this.props
    let quiz

    if (quizzes) {
      for (let testQuiz of quizzes) {
        if (
          testQuiz !== null &&
          testQuiz.uuid === window.location.href.split('/')[4]
        ) {
          console.log('inside quiz assignment')
          quiz = testQuiz
        }
      }
    }
    console.log('this is the quiz being passed', quiz)
    const {
      page,
      clickedQuestion,
      questionNumber,
      clickedAddQuestion,
      displayPhoto
    } = this.state
    let count = 0
    return (
      <div className="edit-quiz-page">
        {(quiz === undefined || quiz.tags === undefined) && (
          <Spinner className="loading-indicator" name="ball-spin-fade-loader" />
        )}
        {quiz !== undefined &&
          quiz.tags !== undefined && (
            <main>
              <div className="quiz-container">
                <h1 className="title">{quiz.title}</h1>
                <div
                  className="close"
                  onClick={this.deleteQuizModal(this.props.quiz.title)}
                >
                  <FontAwesomeIcon icon="trash" />
                  <p className="hint">Permanently delete this quiz</p>
                </div>
                <div className="tags">
                  {quiz.tags.length === 0 && (
                    <p className="tag-null-set">No tags</p>
                  )}
                  {quiz.tags.length > 0 &&
                    quiz.tags.slice(0, 3).map(tag => (
                      <div key={tag.allLowerCase} className="tag">
                        <div
                          className="tag-dot"
                          style={{
                            height: 8,
                            width: 8,
                            borderRadius: 50,
                            backgroundColor:
                              colors[Math.floor(Math.random() * colors.length)]
                          }}
                        />
                        <p className="tag-text">{tag.allLowerCase}</p>
                      </div>
                    ))}
                  {quiz.tags.length > 3 && (
                    <p className="extra-tags">+{quiz.tags.length - 3}</p>
                  )}
                </div>
                {/* <p className="add-tag">+ tag</p> */}
                <div className="questions">
                  {quiz.questions !== undefined &&
                    quiz.questions.map((question, i) => {
                      if (question !== null && question.author === username)
                        return (
                          <div key={'question' + i}>
                            <p
                              className="question"
                              onClick={this.showQuizQuestion.bind(
                                this,
                                quiz.questions[count],
                                count + 1
                              )}
                            >
                              Question {(count += 1)}
                            </p>
                          </div>
                        )
                    })}
                </div>
                <p
                  onClick={e => this.setAddQuestion(e)}
                  className="add-question"
                >
                  + question
                </p>
                {this.state.errMsg && this.state.errMsg}
                <button onClick={this.updateQuiz} className="save-quiz">
                  Save Quiz
                </button>

                {/* <Link
                to={`/take-quiz/${quiz.uuid}`}
                className="unset-anchor nav-link"
              >
                <div style={quizButzest Quiz</div>
              </Link> */}
              </div>

              {clickedQuestion.title && (
                <div key={clickedQuestion.uuid} className="question-container">
                  <p className="title">Edit question</p>
                  <div className="close" onClick={this.deleteQuestion}>
                    <FontAwesomeIcon icon="trash" />
                    <p className="hint">Permanently delete this question</p>
                  </div>
                  {page === 1 && (
                    <form className="details">
                      <div className="group">
                        <label>Question {questionNumber}</label>
                        <p className="question-text">{clickedQuestion.title}</p>
                      </div>
                      <div className="group">
                        <label>Tags</label>
                        <input
                          onChange={this.updateTags}
                          placeholder="Add tags"
                          // placeholder={
                          //   clickedQuestion.tags.length > 0
                          //     ? clickedQuestion.tags.map(
                          //         tag => `${tag.enteredAs}`
                          //       )
                          //     : 'Assign tags to this question'
                          // }
                        />
                      </div>
                      <div
                        className="group photo-container"
                        onClick={() => this.photoUpload.click()}
                        // This is not a thing
                      >
                        <div className="group">
                          <label>Image</label>
                          <Dropzone
                            onDrop={this.onDrop}
                            className={
                              displayPhoto ? 'dropzone' : 'dropzone with-dots'
                            }
                          >
                            <p className={displayPhoto ? 'white-text' : ''}>
                              + Upload
                            </p>
                            {displayPhoto && (
                              <img src={displayPhoto} alt="img" />
                            )}
                          </Dropzone>
                          <input
                            className="file-upload"
                            style={{ display: 'none' }}
                            name="file"
                            type="file"
                            onChange={this.fileSelectedHandler}
                            ref={photoUpload =>
                              (this.photoUpload = photoUpload)
                            }
                          />
                        </div>
                      </div>
                    </form>
                  )}
                  {page === 2 && (
                    <form className="options">
                      <div className="question-fields">
                        {clickedQuestion.answers.map((ans, index) => (
                          <div key={'ans' + index}>
                            <div className="group">
                              <label
                                htmlFor="true-false-answer"
                                className="label"
                              >
                                Choice
                              </label>
                              <textarea
                                id="true-false-answer"
                                value={ans.answer}
                                className="input"
                                onChange={(e: any) => {
                                  this.updateArr(e, index, 'answer')
                                }}
                                data-enable-grammarly="false"
                              />
                            </div>
                            <div className="group">
                              <label
                                htmlFor="true-false-percent-points"
                                className="input"
                              >
                                Score
                              </label>
                              <input
                                id="true-false-percent-points"
                                value={ans.percentPoints}
                                onChange={(e: any) => {
                                  this.updateArr(e, index, 'percentPoints')
                                }}
                                data-enable-grammarly="false"
                              />
                            </div>
                            {/* <div className="group">
                            <label htmlFor="true-false-feed-back">
                              Feedback
                            </label>
                            <textarea
                              id="true-false-feed-back"
                              value={ans.feedback}
                              className="input"
                              onChange={(e: any) => {
                                this.updateArr(e, index, 'feedback')
                              }}
                              data-enable-grammarly="false"
                            />
                          </div> */}
                          </div>
                        ))}
                      </div>
                    </form>
                  )}
                  <div className="page-navigation">
                    <p
                      className={page === 1 ? 'page-1 active' : 'page-1'}
                      onClick={this.page1}
                    >
                      1
                    </p>
                    <p
                      className={page === 2 ? 'page-2 active' : 'page-2'}
                      onClick={this.page2}
                    >
                      2
                    </p>
                  </div>
                  {page === 2 && (
                    <button
                      disabled={this.state.edited ? false : true}
                      onClick={this.saveChangeToState}
                      className="save-question"
                    >
                      Update question
                    </button>
                  )}
                </div>
              )}

              {clickedAddQuestion && (
                <AddQuestion
                  adding={this.adding}
                  edited={this.state.edited}
                  clickedAddQuestion={this.state.clickedAddQuestion}
                  editFunc={this.editFunc}
                  quizID={this.props.quiz.uuid}
                />
              )}
            </main>
          )}
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  username: state.auth.username,
  quiz:
    state.quizzes.all !== undefined &&
    state.quizzes.all.find(
      quiz =>
        (quiz !== null && quiz.uuid === props.match.params.uuid) ||
        (quiz !== null && quiz.uuid === window.location.href.split('/')[4])
    ),
  quizzes: state.quizzes.all
})

export default connect(
  mapStateToProps,
  {
    editStoreQuiz,
    startDeleteQuestion,
    startEditQuestion,
    loadModal
  }
)(EditQuizPage)
