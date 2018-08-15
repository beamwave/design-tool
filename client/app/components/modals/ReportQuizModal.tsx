import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RouteProps, withRouter } from 'react-router'
import Modal from '../Modal'
import { hideModal } from '../../actions/modal'
import { FontAwesomeIcon } from '../../../../node_modules/@fortawesome/react-fontawesome'
import { startSendQuizReport } from '../../actions/quizzes'

interface IProps {
  hideModal: () => any
  startSendQuizReport: (quizReport: object) => any
}

export class ReportQuizModal extends Component<IProps> {
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

  params = window.location.href.split('/')
  quizUUID = this.params[4]

  sendQuizReport = () => {
    this.state.report.length > 0 &&
      this.props.startSendQuizReport({
        uuid: this.quizUUID,
        type: 'quiz',
        message: this.state.report
      })
    this.onClose()
  }

  //@ts-ignore
  render = () => {
    return (
      <Modal onClose={this.onClose}>
        {console.log()}
        <div className="report-quiz-modal">
          <div className="close" onClick={this.onClose}>
            <FontAwesomeIcon icon="times" />
          </div>
          <p className="title">What is wrong with this quiz?</p>
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
            <button className="submit" onClick={this.sendQuizReport}>
              Report
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  username: state.auth.username
})

export default connect(
  mapStateToProps,
  { hideModal, startSendQuizReport }
)(ReportQuizModal)

// export default withRouter(
//   connect(
//     mapStateToProps,
//     { hideModal }
//   )(ReportQuestionModal)
// )
