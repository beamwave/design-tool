import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropzone from 'react-dropzone'
import {
  startBatchCreateQuestions,
  startCreateNewQuestion
} from '../actions/create'
import { editStoreQuiz } from '../actions/quizzes'

interface IProps {
  history?: any
  username?: string
  quizID?: string
  quizUUID?: string
  quizzes?: any[]
  editFunc?: () => any
  edited?: boolean
  clickedAddQuestion?: boolean
  adding?: (any) => any
  quiz?: any
  page?: 1
  editStoreQuiz?: (any) => any
  startCreateNewQuestion?: (any) => any
  startBatchCreateQuestions?: (any) => any
  enableSaveAllButton?: (any) => any
}
// interface IProps extends RouteComponentProps<any> {
//   startCreateNewQuestion: (any) => any
// }
interface AnswerFormat {
  answer: string
  percentPoints: number
  feedback: string
}

interface QuestionFormat {
  author: string
  title: string
  tags: string
  // image?: string;
  answers: AnswerFormat[]
}

export class AddQuestion extends Component<IProps, any> {
  state = {
    errMsg: '',
    displayPhoto: '',
    newQuestions: [],
    currentQuestion: {
      author: this.props.username,
      title: '',
      tags: '',
      answers: [
        {
          answer: '',
          percentPoints: 0,
          feedback: 'no feedback for this question'
        },
        {
          answer: '',
          percentPoints: 0,
          feedback: 'no feedback for this question'
        }
      ],
      format: 'true-false'
    },
    mainView: {
      display: 'inputDisplay',
      questionToDisplay: {
        title: '',
        tags: '',
        answers: []
      }
    },
    editQuestion: 0,
    page: 1,
    edited: this.props.edited,
    clickedAddQuestion: this.props.clickedAddQuestion
  }

  page1 = () => {
    this.setState(prevState => ({ page: 1 }))
    console.log('after page update!!!!!!')
  }

  page2 = () => this.setState(prevState => ({ page: 2 }))

  private updateTitle = (e: any) => {
    const title = e.target.value
    this.setState({
      currentQuestion: {
        ...this.state.currentQuestion,
        title
      }
    })
    this.props.editFunc()
  }

  updateReducerStore = async () => {
    let sendQuestionList = []
    for (let item of this.state.newQuestions) {
      //splits array, trims spaces, and puts the return array into a new set to get rid of duplicates
      let set = new Set(
        item.tags.split(',').map(string => {
          return string.trim()
        })
      )
      //spreads set to convert it into an array
      let testArr: any[] = [...set]
      sendQuestionList.push({
        ...item,
        tags: testArr
      })
    }
    const data = {
      quizID: this.props.quizID,
      newQuestions: sendQuestionList
    }
    let testvar = await this.props.startBatchCreateQuestions(data)
    console.log('updateReducerStore Test Var', testvar)
    if (Array.isArray(testvar)) {
      this.updateStore(sendQuestionList)
      this.setState({
        ...this.state,
        newQuestions: []
      })
      console.log(window.location.href.split('/')[3])
      if (window.location.href.split('/')[3] === 'add-question') {
        this.props.history.push('/quizzes/created')
      }
    } else {
      this.setState({
        ...this.state,
        errMsg: 'Invalid question format. Please edit and try again.'
      })
    }
  }

  private updateFormat = (e: any) => {
    const format = e.target.value
    if (format === 'true-false') {
      this.setState({
        currentQuestion: {
          ...this.state.currentQuestion,
          format: format,
          answers: [
            {
              answer: '',
              percentPoints: 0,
              feedback: 'no feedback for this question'
            },
            {
              answer: '',
              percentPoints: 0,
              feedback: 'no feedback for this question'
            }
          ]
        }
      })
    } else {
      this.setState({
        currentQuestion: {
          ...this.state.currentQuestion,
          format: format,
          answers: [
            {
              answer: '',
              percentPoints: 0,
              feedback: 'no feedback for this question'
            },
            {
              answer: '',
              percentPoints: 0,
              feedback: 'no feedback for this question'
            },
            {
              answer: '',
              percentPoints: 0,
              feedback: 'no feedback for this question'
            },
            {
              answer: '',
              percentPoints: 0,
              feedback: 'no feedback for this question'
            }
          ]
        }
      })
    }
  }

  private addToList = (e: any) => {
    let testValidator = this.formatValidator(this.state.currentQuestion)
    console.log(testValidator)
    if (!testValidator) {
      this.setState({
        ...this.state,
        errMsg:
          'Please make sure your question awards ~100 points and all boxes are filled in.'
      })
    }
    // if (this.state.currentQuestion.title)
    else {
      let questionArr = this.state.newQuestions
      questionArr.push(this.state.currentQuestion)
      this.setState(
        {
          ...this.state,
          newQuestions: questionArr,
          errMsg: '',
          currentQuestion: {
            author: this.props.username,
            title: '',
            tags: '',
            answers: [
              {
                answer: '',
                percentPoints: 0,
                feedback: 'no feedback for this question'
              },
              {
                answer: '',
                percentPoints: 0,
                feedback: 'no feedback for this question'
              }
            ],
            format: 'true-false'
          }
        },
        () => {
          console.log('after answer update! Now changing page')
          this.page1()
        }
      )
      // this.props.enableSaveAllButton(this.state.newQuestions.length)
    } // else...
  }

  private updateArr = (e: any, arg1: number, arg2: string) => {
    let newAnswersArr = this.state.currentQuestion.answers
    newAnswersArr[arg1][arg2] = e.target.value
    this.setState({
      currentQuestion: {
        ...this.state.currentQuestion,
        answers: newAnswersArr
      }
    })
  }

  private updateStore = questionList => {
    if (this.props.quizzes !== [] && this.props.quiz) {
      let modQuiz = this.props.quiz
      modQuiz.questions = modQuiz.questions.concat(questionList)

      let quizList = this.props.quizzes
      for (let i = 0; i < quizList.length; i++) {
        if (quizList[i] !== null && quizList[i].uuid === this.props.quizID) {
          quizList.splice(i, 1, modQuiz)
        }
      }
      console.log('this is the quiz passed in props', this.props.quiz)
      console.log('this is the modQuiz', modQuiz)
      console.log('this is the quizID', this.props.quizID)
      console.log('modified quizList', quizList)
      this.props.editStoreQuiz(quizList)
    }
  }

  // private sendOneQuestion = (e: any) => {
  //   this.props.startCreateNewQuestion(this.state.currentQuestion);
  // };

  // @ts-ignore
  // componentWillReceiveProps = (props, nextProps) =>
  //   console.log("props: ", props, "nextProps: ", nextProps);

  private changeView = (
    typeOfView: string,
    questionToView?: {},
    i?: number
  ) => {
    if (typeOfView === 'questionDisplay') {
      this.setState({
        mainView: {
          display: 'questionDisplay',
          questionToDisplay: questionToView
        },
        editQuestion: i
      })
    } else {
      this.setState({
        mainView: {
          display: 'inputDisplay',
          questionToDisplay: {}
        },
        editQuestion: 0
      })
    }
    console.log('changeViewCalled', this.state)
  }

  private formatValidator = (questionToValidate: QuestionFormat) => {
    let validObject = true
    let percentPoints = 0

    if (!questionToValidate.title || !questionToValidate.author) {
      return (validObject = false)
    } else {
      for (let item of questionToValidate.answers) {
        if (!item.answer) {
          return (validObject = false)
        }
        percentPoints = percentPoints + Number(item.percentPoints)
        if (percentPoints > 101) {
          return false
        }
      }
    }
    console.log('Inside Validator Function', percentPoints, validObject)
    return validObject
    // return percentPoints >= 99 ? true : false
  }

  private printQuestionsArr = () => {
    return (
      <div>
        {this.state.newQuestions.map((item, i) => {
          return (
            <div
              key={'questions' + i}
              onClick={event => {
                this.changeView('questionDisplay', item, i)
                this.page2()
              }}
              className="tab"
            >
              {/* Question {i + 1} */}
            </div>
          )
        })}
      </div>
    )
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
          currentQuestion: {
            ...this.state.currentQuestion,
            image: codeString[1]
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

  private editQuestionElements = (e: any, propertyName) => {
    const index = this.state.editQuestion
    let updatedQuestions = this.state.newQuestions
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [propertyName]: e.target.value
    }
    console.log('propertyname', propertyName)
    this.setState({
      newQuestions: updatedQuestions,
      mainView: {
        ...this.state.mainView,
        questionToDisplay: updatedQuestions[index]
      }
    })
  }

  private editQuizAnswers = (e: any, propertyName, i: number) => {
    const index = this.state.editQuestion
    let updatedQuestions = this.state.newQuestions
    updatedQuestions[index].answers[i] = {
      ...updatedQuestions[index].answers[i],
      [propertyName]: e.target.value
    }
    this.setState({
      newQuestions: updatedQuestions,
      mainView: {
        ...this.state.mainView,
        questionToDisplay: updatedQuestions[index]
      }
    })
  }

  private editTagElement = (e: any) => {
    this.setState({
      currentQuestion: {
        ...this.state.currentQuestion,
        tags: e.target.value
      }
    })
  }

  private renderMainDisplayElement = () => {
    switch (this.state.mainView.display) {
      case 'questionDisplay':
        return (
          <div className="details">
            <div className="group">
              <label htmlFor="editQuestionTitle">Title:</label>
              <input
                type="text"
                id="editQuestionTitle"
                value={this.state.mainView.questionToDisplay.title}
                onChange={e => {
                  this.editQuestionElements(e, 'title')
                }}
              />
            </div>
            <div className="group">
              <label htmlFor="editQuestionTag">Tags:</label>
              <input
                type="text"
                id="editQuestionTag"
                value={this.state.mainView.questionToDisplay.tags}
                onChange={e => {
                  this.editQuestionElements(e, 'tags')
                }}
              />
            </div>
            {this.state.mainView.questionToDisplay.answers.map((item, i) => {
              return (
                <div className="question-fields">
                  <div>
                    <div className="group">
                      <label htmlFor="true-false-answer">Answer</label>
                      <input
                        type="text"
                        id="true-false-answer"
                        value={item.answer}
                        onChange={e => {
                          this.editQuizAnswers(e, 'answer', i)
                        }}
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="true-false-percent-points">Score</label>
                      <input
                        type="text"
                        id="true-false-percent-points"
                        value={item.percentPoints}
                        onChange={e => {
                          this.editQuizAnswers(e, 'percentPoints', i)
                        }}
                      />
                    </div>
                    {/* <div className="group">
                    <label htmlFor="true-false-feed-back">feed Back</label>
                    <input
                      type="text"
                      id="true-false-feed-back"
                      value={item.feedback}
                      onChange={e => {
                        this.editQuizAnswers(e, 'feedback', i)
                      }}
                    />
                  </div> */}
                  </div>
                </div>
              )
            })}
            <button
              onClick={() => {
                this.changeView('inputDisplay')
                this.page1()
              }}
              className="back-to-create-question"
            >
              <FontAwesomeIcon icon="arrow-left" className="icon" />
              {/* Create New Question */}
            </button>
          </div>
        )
      default:
        return <div className="question-fields">{this.createQuestions()}</div>
    }
  }

  private createQuestions = () => {
    switch (this.state.currentQuestion.format) {
      case 'true-false':
        return (
          <div>
            <div className="group">
              <label htmlFor="true-false-answer">Answer 1</label>
              <input
                type="text"
                id="true-false-answer"
                value={this.state.currentQuestion.answers[0].answer}
                onChange={(e: any) => {
                  this.updateArr(e, 0, 'answer')
                }}
              />
            </div>
            <div className="group">
              <label htmlFor="true-false-percent-points">Score</label>
              <input
                type="text"
                id="true-false-percent-points"
                value={this.state.currentQuestion.answers[0].percentPoints}
                onChange={(e: any) => {
                  this.updateArr(e, 0, 'percentPoints')
                }}
              />
            </div>
            {/* <div className="group">
              <label htmlFor="true-false-feed-back">feed Back</label>
              <input
                type="text"
                id="true-false-feed-back"
                value={this.state.currentQuestion.answers[0].feedback}
                onChange={(e: any) => {
                  this.updateArr(e, 0, 'feedback')
                }}
              /> 
            </div> */}
            <div className="group">
              <label htmlFor="true-false-answer">Answer 2</label>
              <input
                type="text"
                id="true-false-answer"
                value={this.state.currentQuestion.answers[1].answer}
                onChange={(e: any) => {
                  this.updateArr(e, 1, 'answer')
                }}
              />
            </div>
            <div className="group">
              <label htmlFor="true-false-percent-points">Score</label>
              <input
                type="text"
                id="true-false-percent-points"
                value={this.state.currentQuestion.answers[1].percentPoints}
                onChange={(e: any) => {
                  this.updateArr(e, 1, 'percentPoints')
                }}
              />
            </div>
            {/* <div className="group">
              <label htmlFor="true-false-feed-back">feed Back</label>
              <input
                type="text"
                id="true-false-feed-back"
                value={this.state.currentQuestion.answers[1].feedback}
                onChange={(e: any) => {
                  this.updateArr(e, 1, 'feedback')
                }}
              />
            </div> */}

            {/* <button type="button" onClick={this.addToList}>
              Add Question
            </button> */}
          </div>
        )
      default:
        return (
          <div>
            <div className="group">
              <label htmlFor="true-false-answer">Answer</label>
              <input
                type="text"
                id="true-false-answer"
                value={this.state.currentQuestion.answers[0].answer}
                onChange={(e: any) => {
                  this.updateArr(e, 0, 'answer')
                }}
              />
            </div>
            <div className="group">
              <label htmlFor="true-false-percent-points">Score</label>
              <input
                type="text"
                id="true-false-percent-points"
                value={this.state.currentQuestion.answers[0].percentPoints}
                onChange={(e: any) => {
                  this.updateArr(e, 0, 'percentPoints')
                }}
              />
            </div>
            {/* <div className="group">
              <label htmlFor="true-false-feed-back">feed Back</label>
              <input
                type="text"
                id="true-false-feed-back"
                value={this.state.currentQuestion.answers[0].feedback}
                onChange={(e: any) => {
                  this.updateArr(e, 0, 'feedback')
                }}
              />
            </div> */}
            <div className="group">
              <label htmlFor="true-false-answer">Answer</label>
              <input
                type="text"
                id="true-false-answer"
                value={this.state.currentQuestion.answers[1].answer}
                onChange={(e: any) => {
                  this.updateArr(e, 1, 'answer')
                }}
              />
            </div>
            <div className="group">
              <label htmlFor="true-false-percent-points">Score</label>
              <input
                type="text"
                id="true-false-percent-points"
                value={this.state.currentQuestion.answers[1].percentPoints}
                onChange={(e: any) => {
                  this.updateArr(e, 1, 'percentPoints')
                }}
              />
            </div>
            {/* <div className="group">
              <label htmlFor="true-false-feed-back">feed Back</label>
              <input
                type="text"
                id="true-false-feed-back"
                value={this.state.currentQuestion.answers[1].feedback}
                onChange={(e: any) => {
                  this.updateArr(e, 1, 'feedback')
                }}
              />
            </div> */}
            <div className="group">
              <label htmlFor="true-false-answer">Answer 1</label>
              <input
                type="text"
                id="true-false-answer"
                value={this.state.currentQuestion.answers[2].answer}
                onChange={(e: any) => {
                  this.updateArr(e, 2, 'answer')
                }}
              />
            </div>
            <div className="group">
              <label htmlFor="true-false-percent-points">Score</label>
              <input
                type="text"
                id="true-false-percent-points"
                value={this.state.currentQuestion.answers[2].percentPoints}
                onChange={(e: any) => {
                  this.updateArr(e, 2, 'percentPoints')
                }}
              />
            </div>
            {/* <div className="group">
              <label htmlFor="true-false-feed-back">feed Back</label>
              <input
                type="text"
                id="true-false-feed-back"
                value={this.state.currentQuestion.answers[2].feedback}
                onChange={(e: any) => {
                  this.updateArr(e, 2, 'feedback')
                }}
              />
            </div> */}
            <div className="group">
              <label htmlFor="true-false-answer">Answer 2</label>
              <input
                type="text"
                id="true-false-answer"
                value={this.state.currentQuestion.answers[3].answer}
                onChange={(e: any) => {
                  this.updateArr(e, 3, 'answer')
                }}
              />
            </div>
            <div className="group">
              <label htmlFor="true-false-percent-points">Score</label>
              <input
                type="text"
                id="true-false-percent-points"
                value={this.state.currentQuestion.answers[3].percentPoints}
                onChange={(e: any) => {
                  this.updateArr(e, 3, 'percentPoints')
                }}
              />
            </div>
            {/* <div className="group">
               <label htmlFor="true-false-feed-back">feed Back</label>
               <input
                 type="text"
                 id="true-false-feed-back"
                 value={this.state.currentQuestion.answers[3].feedback}
                 onChange={(e: any) => {
                   this.updateArr(e, 3, 'feedback')
                 }}
               />
             </div> */}
            {/* <button type="button" onClick={this.addToList}>
              Add Question
            </button> */}
          </div>
        )
    }
  }

  // @ts-ignore
  render = () => {
    const { startCreateNewQuestion } = this.props
    const { page, displayPhoto } = this.state
    // const {
    //   currentQuestion: { format },
    //   mainView: { display }
    // } = this.state
    // /user/updatePoints
    // post
    return (
      <div className="add-question-container">
        <p className="title">Add Question</p>
        <div className="close" onClick={this.props.adding}>
          <FontAwesomeIcon icon="times" />
        </div>
        <div className="que-question-button" onClick={this.addToList}>
          <FontAwesomeIcon icon="plus" />
        </div>
        {page === 1 && (
          <div className="details">
            <div className="group">
              <label htmlFor="title">Question</label>
              <textarea
                id="title"
                value={this.state.currentQuestion.title}
                onChange={this.updateTitle}
                rows={3}
                data-enable-grammarly="false"
              />
            </div>
            <div className="split-group">
              <div className="group">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  value={this.state.currentQuestion.tags}
                  onChange={this.editTagElement}
                />
              </div>
              <div className="group">
                <label htmlFor="type">Type</label>
                <FontAwesomeIcon className="icon" icon="angle-down" />
                <select
                  name="type"
                  id="question-options-dropdown"
                  value={this.state.currentQuestion.format}
                  onChange={this.updateFormat}
                >
                  <option value="true-false">True-or-False</option>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="multiple-select">Multiple Select</option>
                </select>
              </div>
            </div>
            <div className="group">
              <label>Image</label>
              <Dropzone
                onDrop={this.onDrop}
                className={displayPhoto ? 'dropzone' : 'dropzone with-dots'}
              >
                <p className={displayPhoto ? 'white-text' : ''}>+ Upload</p>
                {displayPhoto && <img src={displayPhoto} alt="img" />}
              </Dropzone>
            </div>
          </div>
        )}
        {page === 2 && this.renderMainDisplayElement()}
        {this.state.errMsg && this.state.errMsg}
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
            disabled={
              !this.props.edited || this.state.newQuestions.length === 0
                ? true
                : false
            }
            onClick={this.updateReducerStore}
            className="save-question"
          >
            Save all questions
          </button>
        )}
        <div className="tabs">{this.printQuestionsArr()}</div>
      </div>
    )
  }
}

const mapStateToProps = (state, parentProps) => ({
  username: state.auth.username,
  quizID: parentProps.quizID || state.create.quizID,
  quizzes: state.quizzes.all,
  quiz:
    state.quizzes.all !== [] &&
    state.quizzes.all.find(
      quiz =>
        quiz.uuid === parentProps.quizID || quiz.uuid === state.create.quizID
    )
})

export default connect<any, IProps>(
  mapStateToProps,
  { startBatchCreateQuestions, startCreateNewQuestion, editStoreQuiz }
)(AddQuestion)
