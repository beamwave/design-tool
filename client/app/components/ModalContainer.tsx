import React from 'react'
import { connect } from 'react-redux'

// import all modal components
import SubmitQuizModal from './modals/SubmitQuizModal'
import DeleteQuizModal from './modals/DeleteQuizModal'
import ReportQuizModal from './modals/ReportQuizModal'
import ReportQuestionModal from './modals/ReportQuestionModal'
import AddImageModal from './modals/AddImageModal'

// import modal type constants
import {
  SUBMIT_QUIZ_MODAL,
  REPORT_QUIZ_MODAL,
  DELETE_QUIZ_MODAL,
  REPORT_QUESTION_MODAL,
  ADD_IMAGE_MODAL
} from '../constants/modaltypes'

// modal directory based on props.modalType
const MODAL_COMPONENTS = {
  SUBMIT_QUIZ_MODAL: SubmitQuizModal,
  DELETE_QUIZ_MODAL: DeleteQuizModal,
  REPORT_QUIZ_MODAL: ReportQuizModal,
  REPORT_QUESTION_MODAL: ReportQuestionModal,
  ADD_IMAGE_MODAL: AddImageModal
}

export const ModalContainer = props => {
  // if no modal set in store, do not render one
  if (!props.modalType) {
    return null
  }

  // object lookup
  const SpecificModal = MODAL_COMPONENTS[props.modalType]

  return <SpecificModal />
}

const mapStateToProps = state => ({
  modalType: state.modal.modalType
})

export default connect(mapStateToProps)(ModalContainer)
