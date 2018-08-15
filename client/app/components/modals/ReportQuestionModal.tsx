import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RouteProps, withRouter } from 'react-router'
import Modal from '../Modal'
import { hideModal } from '../../actions/modal'
import { FontAwesomeIcon } from '../../../../node_modules/@fortawesome/react-fontawesome'
import { startSendQuestionReport } from '../../actions/quizzes'

interface IProps {
  questionUUID: any
  hideModal: () => any
  // report: string
  startSendQuestionReport: (questionReport: object) => any
}

export class ReportQuestionModal extends Component<IProps, any> {
  onClose = () => this.props.hideModal()

  state = {
    report: ''
  }

  handleReport = e => {
    console.log(e.target.value)
    const message = e.target.value
    this.setState(prevState => ({
      report: message
    }))
  }

  sendQuestionReport = () => {
    this.state.report.length > 0 &&
      this.props.startSendQuestionReport({
        uuid: this.props.questionUUID,
        type: 'question',
        message: this.state.report
      })
    this.onClose()
  }

  //@ts-ignore
  render = () => {
    return (
      <Modal onClose={this.onClose}>
        <div className="report-question-modal">
          <div className="close" onClick={this.onClose}>
            <FontAwesomeIcon icon="times" />
          </div>
          <p className="title">What is wrong with this question?</p>
          <form onChange={this.handleReport}>
            <label className="container">
              <input type="radio" name="radio" value="Incorrect" />
              <p className="reason">Incorrect</p>
              <span className="checkmark" />
            </label>

            <label className="container">
              <input type="radio" name="radio" value="Badly Worded" />
              <p className="reason">Badly worded</p>
              <span className="checkmark" />
            </label>

            <label className="container">
              <input type="radio" name="radio" value="No valid answer" />
              <p className="reason">No valid answer</p>
              <span className="checkmark" />
            </label>

            <label className="container">
              <input type="radio" name="radio" value="Other" />
              <p className="reason">Other</p>
              <span className="checkmark" />
            </label>
          </form>

          <div className="button-group">
            <button onClick={this.onClose} className="cancel">
              Cancel
            </button>
            <button className="submit" onClick={this.sendQuestionReport}>
              Report
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  username: state.auth.username,
  questionUUID: state.modal.questionUUID
})

export default connect(
  mapStateToProps,
  { hideModal, startSendQuestionReport }
)(ReportQuestionModal)

// export default withRouter(
//   connect(
//     mapStateToProps,
//     { hideModal }
//   )(ReportQuestionModal)
// )
