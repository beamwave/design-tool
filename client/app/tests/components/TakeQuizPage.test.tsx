import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { TakeQuizPage } from '../../components/TakeQuizPage'

test('should render TakeQuizPage component', () => {
  const wrapper = shallow(
    <TakeQuizPage
      username="Dilbert"
      quiz="placeholder quiz"
      questionNumber={18}
      multipleSelectAnswer="placeholder answer"
      multipleChoiceAnswer={['placeholder array of multiple choice']}
      answerArray={['placeholder array of answers']}
      loadModal={() => `placeholder function`}
      changeQuestionNumber={() => `placeholder function`}
      startAddAnswerToArray={() => `placeholder function`}
      addMultipleChoiceAnswer={() => `placeholder function`}
      addMultipleSelectAnswer={() => `placeholder function`}
      updateMultipleSelectAnswer={() => `placeholder function`}
      updateAnswerArray={() => `placeholder function`}
      submitQuizAttempt={() => `placeholder function`}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
