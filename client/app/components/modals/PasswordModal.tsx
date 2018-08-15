import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RouteProps, withRouter } from 'react-router'
import Modal from '../Modal'
import { hideModal } from '../../actions/modal'
import { FontAwesomeIcon } from '../../../../node_modules/@fortawesome/react-fontawesome'
import { SettingsPage } from '../SettingsPage';

interface IProps {
  hideModal: () => any
}

export class PasswordModal extends Component<IProps> {
  onClose = () => this.props.hideModal()

  //@ts-ignore
  render = () => {
    return (
     <Modal onClose={this.onClose}>
        <div className="report-question-modal">
          <div className="close">
            <FontAwesomeIcon icon="times" />
          </div>
          <p className="title">Enter your password</p>
          <form>
            <label className="container">
              <input type="password" id="password" />
              <p className="confirm">Password</p>
              <span className="checkmark" />
            </label>
          </form>
          <div className="button-group">
            <button onClick={this.onClose} type="button" className="cancel">
              Cancel
            </button>
            <button className="submit">Report</button>
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
  { hideModal }
)(PasswordModal)

// export default withRouter(
//   connect(
//     mapStateToProps,
//     { hideModal }
//   )(ReportQuestionModal)
// )
