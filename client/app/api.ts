import axios from 'axios'
import { axiosGuard } from './interceptors/axiosGuard'

export default {
  user: {
    login: credentials =>
      axios.post('/login', { credentials }).then(res => res.data.user),

    signup: user => axios.post('/signup', { user }).then(res => res.data.user),

    refresh: user => axios.post('/refresh', { user }).then(res => res.data.user)
  },

  image: {
    getAll: id =>
      axiosGuard.get('/get_images', { params: { id } }).then(res => res.data),

    upload: image =>
      axiosGuard.post('/create_image', image).then(res => res.data.images),

    addTag: data =>
      axiosGuard.post('/add_tag_to_image', data).then(res => res.data.images)
  }
}
