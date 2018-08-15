export const loadModal = (modalType, quizTitle, questionUUID) => ({
  type: 'SHOW_MODAL',
  modalType,
  quizTitle,
  questionUUID
})

// set modalType to null in redux store
export const hideModal = () => ({
  type: 'HIDE_MODAL'
})
