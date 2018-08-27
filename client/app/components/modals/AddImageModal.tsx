import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Modal from '../Modal'
import { hideModal } from '../../actions/modal'
import { startUpload } from '../../actions/images'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropzone from 'react-dropzone'

interface IProps {
  id: string
  username: string
  startUpload: (any) => any
  hideModal: () => any
}

export class AddImageModal extends Component<IProps> {
  state = {
    name: '',
    type: '',
    medium: '',
    artist: '',
    image: '',
    file: '',
    height: '0',
    width: '0'
  }

  onClose = () => this.props.hideModal()

  onDrop = (files: any) => {
    const file = files[0]
  }
  handleFileSelect = async files => {
    const file = files[0]
    const { username } = this.props

    // const url = 'http://vocab-app-pics.s3.amazonaws.com/' + username + '/' + file.name

    await this.setState({
      file,
      image: file.preview,
      name: file.name
      // url
    })
  }

  handleFieldChange = async ({ target }) => {
    await this.setState({
      [target.name]: target.value
    })
  }

  handleLoad = async ({ target }) => {
    const width = target.naturalWidth.toString() || target.width.toString()
    const height = target.naturalHeight.toString() || target.height.toString()

    await this.setState({
      height,
      width
    })
  }

  submit = async () => {
    const { name, type, medium, artist, height, width, file } = this.state
    const { id, startUpload } = this.props

    // const data = { name, type, medium, artist, file }

    let formData = new FormData()
    formData.append('id', id)
    formData.append('name', name)
    formData.append('type', type)
    formData.append('medium', medium)
    formData.append('artist', artist)
    formData.append('height', height)
    formData.append('width', width)
    formData.append('trainingWheels', '0')
    formData.append('file', file)

    // try {
    //   // send file to bucket
    //   const s3upload = await axios.put(url, file)
    //   // send data to db
    //   startUpload(data)
    //   this.onClose()
    // } catch (err) {
    //   console.log('error uploading to bucket', err)
    // }

    const data = {
      formData,
      id
    }

    startUpload(data)
    this.onClose()
  }

  //@ts-ignore
  render = () => {
    const { name, type, medium, artist, image, file } = this.state
    return (
      <Modal onClose={this.onClose}>
        {console.log()}
        <div className="add-image-modal">
          <div className="close" onClick={this.onClose}>
            <FontAwesomeIcon icon="times" />
          </div>
          <form className="data">
            <div className="column-1">
              <div className="input-group name">
                <label className="text">name</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleFieldChange}
                />
              </div>
              <Dropzone className="dropzone" onDrop={this.handleFileSelect}>
                {file.length === 0 ? (
                  <p>Upload image</p>
                ) : (
                  <img
                    src={image}
                    alt="image preview"
                    onLoad={this.handleLoad}
                  />
                )}
              </Dropzone>
            </div>
            <div className="column-2">
              <div className="input-group type">
                <label className="text">type</label>
                <input
                  type="text"
                  name="type"
                  value={type}
                  onChange={this.handleFieldChange}
                />
              </div>
              <div className="input-group medium">
                <label className="text">medium</label>
                <input
                  type="text"
                  name="medium"
                  value={medium}
                  onChange={this.handleFieldChange}
                />
              </div>
              <div className="input-group artist">
                <label className="text">artist</label>
                <input
                  type="text"
                  name="artist"
                  value={artist}
                  onChange={this.handleFieldChange}
                />
              </div>
            </div>
          </form>

          <div className="button-group">
            <button onClick={this.onClose} className="cancel">
              Cancel
            </button>
            <button className="submit" onClick={this.submit}>
              Upload
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  id: state.auth.id
})

export default connect(
  mapStateToProps,
  { startUpload, hideModal }
)(AddImageModal)

// export default withRouter(
//   connect(
//     mapStateToProps,
//     { hideModal }
//   )(ReportQuestionModal)
// )
