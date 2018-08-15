import React, { Component } from 'react'
import { shallow } from 'enzyme'
import { EditQuizPage } from '../../components/EditQuizPage'

/* add mock data for quiz and quizzes */
/* add mock function for startEditQuestion, startDeleteQuestion, editStoreQuiz */

test('should render EditQuizPage component', () => {
  const wrapper = shallow(
    <EditQuizPage
      username="PinkMonkeyBird"
      quiz="quiz object placeholder"
      quizzes={['quizzes array placeholder']}
      startEditQuestion={() => `function placeholder`}
      startDeleteQuestion={() => `function placeholder`}
      editStoreQuiz={() => `function placeholder`}
    />
  )
  expect(wrapper).toMatchSnapshot()
})
