import { generateUuid } from "./../helpers/helpers";
import React from "react";
import pathlist from "../path-list";

// export const createNewQuestion = newQuestion => ({
//   type: 'CREATE_NEW_QUESTION',
//   newQuestion
// })

// export const startCreateNewQuestion = newQuestion =>
//   // dispatch(createNewQuestion(newQuestion))

// export const createNewQuiz = newQuiz => ({
//   type: 'CREATE_NEW_QUIZ',
//   newQuiz
// })

// export const startCreateNewQuiz = newQuiz => dispatch => {
//   dispatch(createNewQuiz(newQuiz))
// }

export const editQuestion = question => ({
  type: "EDIT_QUESTION",
  question
});

// export const startEditQuestion = question => dispatch => {
//   pathlist.questions
//     .edit(question)
//     .then(question => dispatch(editQuestion(question)));
// };

export const startEditQuestion = incoming => async dispatch => {
  try {
    let response = {
      response: {
        status: 200
      }
    };
    await pathlist.questions.edit(incoming.question);
    dispatch(editQuestion(incoming.question));
    // .then(question => dispatch(editQuestion(incoming.question)))
    // .catch(err => (response = err));

    try {
      const tagObj = {
        questionUUID: incoming.question.uuid,
        tags: incoming.question.tags
      };
      const addTheTags = pathlist.questions.addNewTags(tagObj);
      const addForQuiz = pathlist.create.addTagsToQuiz(
        incoming.quizID,
        incoming.question.tags
      );
    } catch (error) {}
    return response;
  } catch (error) {
    console.log("the error was caught by this block", error);
    return error;
  }
};

export const deleteQuestion = question => ({
  type: "DELETE_QUESTION",
  question
});

export const startDeleteQuestion = (author, title) => dispatch => {
  pathlist.questions
    .deleteQuestion(author, title)
    .then(question => dispatch(deleteQuestion(question)));
};

// export const deleteJunction = question => ({
//   type: "DELETE_JUNCTION",
//   question
// });

// export const startDeleteJunction = (quizUUID, questionUUID) => dispatch => {
//   pathlist.questions
//     .deleteJunction(quizUUID, questionUUID)
//     .then(question => dispatch(deleteJunction(question)));
// };
