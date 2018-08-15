import axios from 'axios'
import { axiosGuard } from './interceptors/axiosGuard'
// const authAxios = axios.create();
// authAxios.interceptors.request.use(config => {
//   config.headers.Authorization = localStorage.idTokenKey;
//   return config;
// });

const baseUrl = 'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/'

const addQuestionUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/question'

const batchAddQuestionsUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/question/batch'

const editQuestionUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/question/edit'

const addQuizUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz'

const addJunctionUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz'

const displayQuizzesURL =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz/author/'

const displayQuizAttemptsURL =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quizAttempt/user/'

const displayQuizQuestionsURL =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz/'

const displayQuizTagsURL =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz/uuid/'

const editQuizUrl = ''

const searchByAuthorUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz/author/'

const searchByTagUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz/tag/'

const searchByUuidUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz/'

const getQuizAttempt =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz/'

const sendQuizAttempt =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz/'

const deleteQuestionUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/question/author'

const deleteQuizUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz/author/'

// const deleteJunctionUrl = // this is done automatically in deleteQuestion
//   "https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz";

const addTagsToQuestionsUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/question/batch/tag'

const addTagsToSingleQuestionUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/question/tag/batch'

const addTagsToQuizUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/quiz/tag/batch'

const sendQuizReport =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/ticket'

const getUserPointsUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/user/'

const getAllPointsUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/user/all/points'

/* GET USER POINTS */
// '/user/{username}' to get points
const setStartingPointsUrl =
  'https://eyc3l7k6w1.execute-api.us-east-2.amazonaws.com/dev/user/'

// 'updatePoints/post

// '/user/all/points'

/*
{
  username,
  token (encrypted points)
}
*/

export default {
  create: {
    addQuestion: newQuestion =>
      axiosGuard.post(addQuestionUrl, newQuestion).then(res => res.data),

    addQuiz: newQuiz =>
      axiosGuard.post(addQuizUrl, newQuiz).then(res => res.data),

    batchAddQuestion: newQuestions =>
      axiosGuard.post(batchAddQuestionsUrl, newQuestions).then(res => res.data),

    addJunction: (quizID, questionIDs) =>
      axiosGuard
        .post(`${addJunctionUrl}/${quizID}/batch`, questionIDs)
        .then(res => res.data),

    addTagsToQuestions: arrOfPairs =>
      axiosGuard.post(addTagsToQuestionsUrl, arrOfPairs).then(res => res.data),

    addTagsToQuiz: (quizID, tags) =>
      axiosGuard
        .post(addTagsToQuizUrl, { quizUUID: quizID, tags: tags })
        .then(res => res.data)
  },

  quizzes: {
    edit: quiz => axiosGuard.post(editQuizUrl, quiz).then(res => res.data),

    delete: quiz => axiosGuard.post(deleteQuizUrl, quiz).then(res => res.data),

    display: author =>
      axiosGuard.get(displayQuizzesURL + author).then(res => res.data),

    displayQuizAttempts: user =>
      axiosGuard.get(displayQuizAttemptsURL + user).then(res => res.data),

    searchByAuthor: author =>
      axiosGuard.get(searchByAuthorUrl + author).then(res => res.data),

    searchByTag: tag =>
      axiosGuard.get(searchByTagUrl + tag).then(res => res.data),

    searchByUuid: uuid =>
      axiosGuard.get(searchByUuidUrl + uuid).then(res => res.data),

    // /quiz/get/{uuid}
    getForeignQuiz: uuid =>
      axiosGuard.get(`${baseUrl}quiz/get/${uuid}`).then(res => res.data),

    // getForeignQuiz: quiz =>
    //   axiosGuard
    //     .get(`${baseUrl}quiz/${quiz.uuid}/user/${quiz.username}`)
    //     .then(res => res.data),

    startQuizAttempt: (quizUUID, username) =>
      axiosGuard
        .get(`${getQuizAttempt}${quizUUID}/user/${username}`)
        .then(res => res.data),

    sendQuizReport: quizReport =>
      axiosGuard.post(sendQuizReport, quizReport).then(res => res.data),

    submitQuizAttempt: (quizUUID, user, attemptUUID, answerArray) =>
      axiosGuard
        .post(
          `${sendQuizAttempt}${quizUUID}/user/${user}/attempt/${attemptUUID}`,
          answerArray
        )
        .then(res => res.data),

    deleteQuiz: (author, title) =>
      axiosGuard
        .delete(`${deleteQuizUrl}${author}/title/${title}`)
        .then(res => res.data)
  },

  questions: {
    addNewTags: tags =>
      axiosGuard.post(addTagsToSingleQuestionUrl, tags).then(res => res.data),

    edit: question =>
      axiosGuard.post(editQuestionUrl, question).then(res => res.data),

    display: quizUUID =>
      axiosGuard.get(displayQuizQuestionsURL + quizUUID).then(res => res.data),

    displayTags: quizUUID =>
      axiosGuard.get(displayQuizTagsURL + quizUUID).then(res => res.data),

    deleteQuestion: (author, title) =>
      axiosGuard
        .delete(`${deleteQuestionUrl}/${author}/title`, { data: { title } })
        .then(res => res.data),

    sendQuestionReport: questionReport =>
      axiosGuard.post(sendQuizReport, questionReport).then(res => res.data)

    // deleteJunction: (quizUUID, questionUUID) =>
    //   axios
    //     .delete(`${deleteJunctionUrl}/${quizUUID}/question/${questionUUID}`)
    //     .then(res => res.data)
  },

  points: {
    getUserPoints: username =>
      axiosGuard.get(getUserPointsUrl + username).then(res => res.data),

    getAllPoints: () => axiosGuard.get(getAllPointsUrl).then(res => res.data),

    setStartingPoints: (username, points) =>
      axiosGuard
        .post(setStartingPointsUrl + username, { points })
        .then(res => res.data)
  }
}
