import React, { Component, createRef } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { startAddTag } from '../actions/images'

interface IProps {
  id?: string
  image: any
  editMode: boolean
  history?: any
  startAddTag?: any
}

interface IState {
  tagDropdownOpen: boolean
  tag: string
}

export class ImagePage extends Component<IProps, IState> {
  state = {
    image: this.props.image,
    tagDropdownOpen: false,
    tag: ''
  }

  private tagContainerWidth = createRef<HTMLDivElement>()
  private tagContentWidth = createRef<HTMLDivElement>()

  private toggleTagDropdown = () =>
    this.setState(prevState => ({
      tagDropdownOpen: !prevState.tagDropdownOpen
    }))

  private handleTextValidation = async e => {
    const {
      target: { value: input }
    } = e

    const regex = /^[a-zA-Z\d\#]+$/

    if ((!input || input.match(regex)) && input.length < 18) {
      this.setState(() => ({ tag: input }))
    }
  }

  private handleSubmit = async e => {
    e.preventDefault()

    const { tag } = this.state
    const { id, image, startAddTag } = this.props
    const data = { userId: id, image: image._id, tag }

    await startAddTag(data)
    this.toggleTagDropdown()
  }

  private formatImageDates = () => {
    const { image } = this.state
    if (image !== false) {
      let formattedImage = image

      if (
        moment(formattedImage.createdAt).isValid() ||
        moment(formattedImage.updatedAt).isValid()
      ) {
        // prettier-ignore
        formattedImage.createdAt = moment(Date.parse(image.createdAt)).format(
          "MMMM Do, YYYY"
        )

        // prettier-ignore
        formattedImage.updatedAt = moment(Date.parse(image.updatedAt)).format(
          "MMMM Do, YYYY"
        )
        this.setState({ image: formattedImage } as any)
      }
    }
  }

  private checkTagListOverflow = () => {
    const tagContainer = this.tagContainerWidth.current
    const tagContent = this.tagContentWidth.current

    // client width, scroll width, offset width
    if (tagContainer.clientWidth > tagContent.scrollWidth) {
    }
  }

  public componentDidMount = () => {
    this.formatImageDates()
    this.checkTagListOverflow()
  }

  public render = () => {
    const { editMode } = this.props
    const { tag, image, tagDropdownOpen } = this.state
    const extraneous = [
      '_id',
      'url',
      'owner',
      'height',
      'width',
      'comments', // deactivate later
      'trainingWheels',
      'imageAttributes',
      'deleted',
      // 'createdAt',
      // 'updatedAt',
      '__v'
    ]
    const artDefaults = ['device', 'palette']
    const commentDefaults = ['device', 'palette']
    const clothDefaults = ['gender', 'palette']
    const peopleDefaults = ['gender', 'palette']

    return (
      <div className="image-page">
        <header>
          <h1>{image.name}</h1>
          <div className="locksmith">
            {image.trainingWheels ? (
              <FontAwesomeIcon icon="lock" className="icon" />
            ) : (
              <FontAwesomeIcon icon="unlock" className="icon" />
            )}
          </div>
        </header>
        <main>
          <img src={image.url} height="350" width="500" />
          <div className="caption">
            <div className="tags">
              <Dropdown
                isOpen={this.state.tagDropdownOpen}
                toggle={this.toggleTagDropdown}
                direction="up"
                className="dropdown-root"
              >
                <DropdownToggle className="dropdown-toggle">
                  <FontAwesomeIcon icon="plus" className="icon" />
                </DropdownToggle>
                <DropdownMenu
                  className="dropdown-menu"
                  style={{
                    display: tagDropdownOpen === false ? 'none' : 'block'
                  }}
                >
                  <form className="tag-form" onSubmit={this.handleSubmit}>
                    <input
                      type="text"
                      value={tag}
                      placeholder={'New tag...'}
                      onChange={this.handleTextValidation}
                    />
                  </form>
                </DropdownMenu>
              </Dropdown>
              <div className="tag-list" ref={this.tagContainerWidth}>
                <div className="content" ref={this.tagContentWidth}>
                  {image.tags !== undefined &&
                    image.tags.map(tag => (
                      <p key={tag.id} data-id={tag.id}>
                        {tag.name}
                      </p>
                    ))}
                </div>
              </div>
            </div>
            <div className="dimensions">
              <p>
                {image.height} x {image.width}
              </p>
            </div>
          </div>
        </main>
        <aside>
          <div className="properties">
            {Object.entries(image)
              .sort(
                (a, b) =>
                  // sort by length, if equal then // sort by dictionary order
                  a[0].length - b[0].length || a[0].localeCompare(b[0])
              )
              .map(
                (property: any) =>
                  extraneous.every(spec => property[0] !== spec) && (
                    <p key={property[0]}>{property[0]} :</p>
                  )
              )}
          </div>
          <div className="values">
            {!editMode &&
              Object.entries(image)
                .sort(
                  (a, b) =>
                    // sort by length, if equal then // sort by dictionary order
                    a[0].length - b[0].length || a[0].localeCompare(b[0])
                )
                .map(
                  (property: any) =>
                    extraneous.every(spec => property[0] !== spec) && (
                      <p key={property[0]}>
                        {typeof property[1] === 'string' && (
                          <span>{property[1]}</span>
                        )}
                        {typeof property[1] === 'object' && (
                          <span>{property[1].name}</span>
                        )}
                      </p>
                    )
                )}
            {editMode &&
              Object.entries(image)
                .sort(
                  (a, b) =>
                    // sort by length, if equal then // sort by dictionary order
                    a[0].length - b[0].length || a[0].localeCompare(b[0])
                )
                .map(
                  (property: any) =>
                    extraneous.every(spec => property[0] !== spec) && (
                      <input
                        key={property[0]}
                        value={
                          typeof property[1] === 'string'
                            ? property[1]
                            : property[1].name
                        }
                      />
                    )
                )}
          </div>
        </aside>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  id: state.auth.id,
  image:
    state.images.all !== undefined &&
    state.images.all.find(image => image._id === props.match.params._id),
  editMode: state.app.editMode
})

export default connect(
  mapStateToProps,
  { startAddTag }
)(ImagePage)
