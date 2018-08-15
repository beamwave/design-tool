import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { QuizAttemptReviewPage } from '../../components/QuizAttemptReviewPage'

/* make mock data for all that */
/* make mock functions for all those */

test('should render QuizAttemptReviewPage component', () => {
  const wrapper = shallow(
    <QuizAttemptReviewPage
      username="limp_hashbrown"
      quiz="placeholder quiz"
      quizAttempt="placeholder attempt"
      questionNumber={4}
      multipleSelectAnswer="placeholder answer"
      quizResults={['array of quizzes']}
      multipleChoiceAnswer={['placeholder array of multiple choice']}
      answerArray={['placeholder array of answers']}
      loadModal={() => `placeholder function`}
      handleSelection={() => `placeholder function`}
      clearQuizAttempt={() => `placeholder function`}
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
