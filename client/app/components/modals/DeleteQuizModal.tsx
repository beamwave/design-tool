import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '../Modal'
import { hideModal } from '../../actions/modal'
import { deleteQuiz } from '../../actions/quizzes'
import { RouteProps, withRouter } from 'react-router'

interface IProps {
  username: string
  title: string
  hideModal: () => any
  deleteQuiz: (author: string, title) => any
}

export class SubmitQuizModal extends Component<IProps> {
  onClose = () => this.props.hideModal()

  deleteQuiz = (author: string, title: string) => (e: any) => {
    this.props.deleteQuiz(author, title)
    console.log(`in delete function author: ${author} and title ${title}`)
    console.log('deleting quiz...')
    this.onClose()
  }

  // @ts-ignore
  render = () => {
    const { username, title } = this.props
    console.log('checking title', title)
    return (
      <Modal onClose={this.onClose}>
        <div className="delete-quiz-modal">
          <div className="close" onClick={this.onClose}>
            <FontAwesomeIcon icon="times" />
          </div>
          <p className="title">Are you sure you want to delete this quiz?</p>
          <p className="subhead">
            This action is permanent and cannot be undone.
          </p>

          <div className="button-group">
            <button onClick={this.onClose} className="cancel">
              Cancel
            </button>
            <button
              onClick={this.deleteQuiz(username, title)}
              className="submit"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = (state, props) => ({
  username: state.auth.username,
  title: state.modal.quizTitle
})

export default withRouter(
  connect(
    mapStateToProps,
    { hideModal, deleteQuiz }
  )(SubmitQuizModal)
)
