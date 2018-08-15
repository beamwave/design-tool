import axios from 'axios'
import { axiosGuard } from './interceptors/axiosGuard'

export default {
  user: {
    login: credentials =>
      axios.post('/login', { credentials }).then(res => res.data.user),

    signup: user => axios.post('/signup', { user }).then(res => res.data.user)

    // confirm: token =>
    //   fetch('/verification', JSON.stringify({ token })).then(
    //     res => res.data.user
    //   )

    //   updateGeneral: file =>
    //     axios
    //       .post('/general_settings', file, { headers: getToken() })
    //       .then(res => res.data),

    //   updatePassword: file =>
    //     axios
    //       .post('/password_settings', file, { headers: getToken() })
    //       .then(res => res.data)
  },

  image: {
    getAll: id =>
      axiosGuard
        .get('/get_images', { params: { id } })
        .then(res => res.data.images),

    upload: image =>
      axiosGuard.post('/create_image', image).then(res => res.data.images)
  }
}
