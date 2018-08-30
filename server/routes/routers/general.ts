import { Request, Response, NextFunction } from 'express'
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'

import crypto from 'crypto'
import mime from 'mime'
import Artist from '../../models/Artist'
import Image from '../../models/Image'
import Medium from '../../models/Medium'
import Type from '../../models/Type'
import Tag from '../../models/Tag'
import User from '../../models/User'

import { verifyToken } from '../../utils/verifyToken'

const S3_BUCKET = process.env.S3_BUCKET
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
aws.config.region = 'us-east-1'

const s3 = new aws.S3({
  params: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
})

const capitalize = word => word.replace(/^\w/, c => c.toUpperCase())

module.exports = app => {
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: S3_BUCKET,
      key: async (req: Request, file, cb) => {
        console.log('req.body', req.body)

        const { id, type } = req.body

        const raw = await crypto.pseudoRandomBytes(16)
        const filename = `${raw.toString(
          'hex'
        )}${Date.now()}.${mime.getExtension(file.mimetype)}`

        const host = `https://s3.amazonaws.com/${S3_BUCKET}`
        const path = `users/${id}/${type.toLowerCase()}`
        const url = `${host}/${path}/${filename}`

        req['url'] = url

        cb(null, `${path}/${filename}`)
      }
    })
  })

  /**
   * retrieval steps:
   * iterate each image
   *
   */

  app.get('/get_images', verifyToken, async (req, res) => {
    // where req.params is stored from axios
    const { id } = req.query

    // get images with id references
    let allImages = await Image.find({ owner: id }).lean()

    if (allImages.length > 0) {
      // object to store all user categories (ie artist, type, medium) and all options
      let tags = []
      let categories = {}

      // (images = first var)
      // get the references for each image
      const images = await Promise.all(
        allImages.map(async image => {
          // omit these fields
          let {
            __v,
            _id,
            comments, // add back later
            createdAt,
            updatedAt,
            name,
            url,
            owner,
            height,
            width,
            trainingWheels,
            deleted,
            ...properties
          } = image

          let propertyOverwrites = [],
            imageAttributes = []

          // console.log('properties', properties)

          properties = await Promise.all(
            // properties array =
            /* [[ 'artist', '5b7022b3bedf190c3b282c04' ],
            [ 'medium', '5b7022b3bedf190c3b282c05' ],
            [ 'type', '5b7022b3bedf190c3b282c06' ]] */
            Object.entries(properties).map(
              async (prop: [string, string | string[]]) => {
                // converts each property to "Artist", "Medium", "Type", "Tags"
                const reqDoc = capitalize(prop[0])

                const schemas = {
                  Artist: Artist,
                  Image: Image,
                  Medium: Medium,
                  Type: Type,
                  Tags: Tag
                }

                // START
                let doc

                /* assign "doc" variable to proper schema within properties loop of single image */
                for (let realDoc in schemas) {
                  if (reqDoc === realDoc) doc = schemas[realDoc]
                }

                // add current attributes to growing array. Will overwrite current id reference properties on image
                // imageAttributes = ['artist', 'image', 'medium', ...]
                imageAttributes = [...imageAttributes, prop[0]]

                // case 1: object
                // case 2: array
                let result

                if (typeof prop[1] === 'string') {
                  // query based on doc variable (ie Artist, Medium, or Type) if prop[1] is a string (the id)
                  result = await doc.findById(prop[1]).lean()
                }

                // will either be comments or tags
                if (Array.isArray(prop[1])) {
                  // else perform iterative query based on array type doc (ie Tag, Comment)
                  if (prop[1].length > 0) {
                    // union type defined in function means map must be a function of string type and array type
                    // <string[]> is a type assertion, which tells typescript prop[1] in this case is an array
                    result = await Promise.all(
                      (<string[]>prop[1]).map(async id => {
                        // tag id or comment id
                        return await doc.findById(id).lean()
                      })
                    )
                  }
                }

                let identifier

                // if result is an array (of tags or comment results)...
                if (Array.isArray(result) && result !== undefined) {
                  // then identifier will be an array of name/id objects for each tag
                  identifier = result.map(obj => ({
                    name: obj.name,
                    id: obj._id
                  }))

                  // START 2nd variable (tags): -------------------------------------
                  if (prop[0].toLowerCase() === 'tags') {
                    tags = [...tags, ...result]
                  }
                  // END 2nd variable (tags): -------------------------------------
                }

                // else if result is an object of a single identifier...
                if (!Array.isArray(result) && result !== undefined) {
                  // data that will replace id references in image object
                  /* "medium": { 
                      "name": "web", 
                      "id": "zi1pu5a2izm3ij234z"
                    }, */
                  identifier = {
                    name: result.name,
                    id: result._id
                  }
                }

                // START 3rd variable (categories): -------------------------------------
                // each category contains each unique type and id (ie medium: {web, photo})
                // if categories object has property...
                if (categories.hasOwnProperty(prop[0])) {
                  // and if prop[1] is a string
                  if (typeof prop[1] === 'string') {
                    // check if array of properties (ie artist:{name:'',id:''})) doesnt already have identifier
                    const existence = categories[prop[0]].some(
                      stack =>
                        stack.name === identifier.name ||
                        stack.id === identifier.id
                    )

                    // if it doesnt, add indentifier to it
                    if (!existence)
                      categories[prop[0]] = [...categories[prop[0]], identifier]
                  }
                }

                // if categories object doesn't have property, add it
                if (!categories.hasOwnProperty(prop[0])) {
                  categories[prop[0]] = [identifier]
                }
                // END 3nd variable (categories): -------------------------------------

                /* 
              artist: {
                name: "unknown",
                id: "abc123"
              } or...
              tags: [{
                name: "face",
                id: "def456"
              }, ...]
            */
                const final = {}
                final[prop[0]] = identifier

                // propertyOverwrites will convert property id references to identifier objects ie [{name:"",id:""}, ...]
                propertyOverwrites.push(final)
              }
            )
          )

          // add array of property names to image object
          image['imageAttributes'] = imageAttributes

          // propertyOverwrites, an array of arrays, now contains properties with correct values:
          // [['artist', {id:..., name:...}], ['type', {id:..., name:...}], ['medium', {id:..., name:...}]]
          propertyOverwrites = propertyOverwrites.map(overwrite => {
            const propertyArray = Object.entries(overwrite)
            const arr = [propertyArray[0][0], propertyArray[0][1]]
            return arr
          })

          // in the end, we get the original image with its original id reference properties...
          const imageWithCorrectAttributes = {
            ...image
          }

          // and we overwrite those id reference properties with the correct identifier data...
          propertyOverwrites.map(property => {
            imageWithCorrectAttributes[property[0]] = property[1]
          })

          // and return the image object with the correct data back to the images array
          return imageWithCorrectAttributes

          // END
        })
      )

      // converts array with duplicate objects into unique array
      tags = Object.values(
        tags.reduce((acc, cur) => Object.assign(acc, { [cur._id]: cur }), {})
      )

      // send images to client
      res.status(200).json({ images, tags, categories })
    }

    if (allImages.length === 0) {
      res.status(200).json({
        images: [],
        categories: [],
        tags: []
      })
    }
  })

  app.get('/query_images', verifyToken, async (req, res) => {
    const { id, tags, filters } = req.query
    console.log('query', req.query)
  })

  app.post(
    '/create_image',
    verifyToken,
    upload.array('file'),
    async (req, res) => {
      console.log('image uploaded with url', req.url)

      const {
        id,
        artist,
        name,
        medium,
        type,
        height,
        width,
        trainingWheels
      } = req.body
      const { url } = req

      let user

      // get user for id
      try {
        user = await User.findById(id)
      } catch (err) {
        res.status(401).json({ errors: { global: 'id is null' } })
      }

      console.log('height', height)
      console.log('width', width)

      const Idata = {
        name,
        url,
        owner: id,
        height: parseInt(height),
        width: parseInt(width),
        trainingWheels: parseInt(trainingWheels) ? true : false,
        deleted: false
      }

      // create and save new image
      const newImage = new Image(Idata)
      const savedImage = await newImage.save()
      const image = await Image.findById(savedImage.id)

      // find or create and save artist
      const a = await Artist.findOne({ name: artist })
      if (a) {
        image.artist = a.id
      }
      if (!a) {
        const Adata = {
          name: artist,
          owner: user.id,
          deleted: false
        }
        const newArtist = new Artist(Adata)
        const savedArtist = await newArtist.save()

        // image to artist reference
        image.artist = savedArtist.id
      }

      // find or create and save medium
      const m = await Medium.findOne({ name: medium })
      if (m) {
        image.medium = m.id
      }
      if (!m) {
        const Mdata = {
          name: medium,
          owner: user.id,
          deleted: false
        }
        const newMedium = new Medium(Mdata)
        const savedMedium = await newMedium.save()

        // image to medium reference
        image.medium = savedMedium.id
      }

      // find or create and save type
      const t = await Type.findOne({ name: type })
      if (t) {
        image.type = t.id
      }
      if (!t) {
        const Tdata = {
          name: type,
          owner: user.id,
          deleted: false
        }
        const newType = new Type(Tdata)
        const savedType = await newType.save()

        // image to type reference
        image.type = savedType.id
      }

      // resave image with artist, medium, and type references
      try {
        await image.save()
        const images = await Image.find({ owner: user.id })
        res.status(201).json()
        // res.status(201).json({ images })
      } catch (err) {
        console.log('image save error: ', err)
        res.status(400).json({ errors: { global: err } })
        // console.log('signup error: ', err.errors.email.message)
        // res.status(400).json({ errors: { global: err.errors.email.message } })
      }
    }
  )

  app.post('/add_tag_to_image', verifyToken, async (req, res) => {
    const { userId, image: id, name } = req.body

    const image = await Image.findById(id)
    if (image) {
      console.log('id', id, 'tag', name)

      const tag = await Tag.findOne({ name })

      if (tag) {
        console.log('found tag, now saving to image', tag)

        // TODO: make sure image does not already have tag!

        // append existing tag to image
        image.tags = [...image.tags, tag._id]
        tag.attachedTo = [...tag.attachedTo, image._id]

        await image.save()
        await tag.save()
        res.sendStatus(201).json()
      }

      if (!tag) {
        console.log('tag not found, creating a new one', tag)
        // create new tag
        const newTag = new Tag({
          name,
          user: userId,
          attachedTo: image._id,
          deleted: false
        })

        // save tag and create unique id
        await newTag.save()

        const savedTag = await Tag.findOne({ name })

        // append new tag reference to image
        image.tags = [...image.tags, savedTag._id]

        await image.save()

        res.status(201).json()
      }
    }

    res.status(404).json({ error: 'image not found' })
  })

  // app.post('/api/divvy', verifyToken, (req, res) => {
  //   User.findOne({ email: req.body.email }).then(user => {
  //     const input = req.body.income
  //     user.wants.forEach(want => {
  //       if (!want.completed) {
  //         const multiplier = want.percent / 100
  //         const haul = input * multiplier
  //         const revenue = want.progress + haul
  //         // console.log(
  //         //   `
  //         //   ------------------------------------------------------------
  //         //   stats:
  //         //   name : ${want.name}
  //         //   input (req.body.income): ${req.body.income}
  //         //   multiplier (want.percent / 100): ${multiplier}
  //         //   want.goal: ${want.goal}
  //         //   want.progress: ${want.progress}
  //         //   haul (input * multiplier): ${haul}
  //         //   revenue (want.progress + haul): ${revenue}
  //         //   `
  //         // )
  //         // console.log('\nis revenue > want.goal? ', revenue > want.goal)
  //         if (revenue > want.goal) {
  //           // add this accounts points to global
  //           user.points += want.percent
  //           // remove completed goals points
  //           want.percent = 0
  //           // store excess cash
  //           const leftover = revenue - want.goal
  //           // console.log(
  //           //   `leftover (revenue (${revenue}) - want.goal (${
  //           //     want.goal
  //           //   })):  ${leftover}`
  //           // )
  //           // add excess cash to global
  //           user.undistributedCash += leftover
  //           // set progress exactly equal to goal
  //           want.progress += haul - leftover
  //           // console.log(
  //           //   `want.progress += (haul - leftover):
  //           //   want.progress: ${want.progress} +=
  //           //   haul: ${haul} -
  //           //   leftover: ${leftover}`
  //           // )
  //           // set want as finished
  //           want.completed = true
  //           // store date completed
  //           want.dateCompleted = moment()
  //         } else {
  //           // add cash to account
  //           want.progress += haul
  //         }
  //       }
  //     })
  //     let rearrange = []
  //     const incomplete = user.wants.filter(want => {
  //       if (want.completed) {
  //         rearrange.push(want)
  //       }
  //       return !want.completed
  //     })
  //     rearrange.forEach(want => {
  //       incomplete.push(want)
  //     })
  //     user.wants = incomplete
  //     // console.log('rearrange: ', rearrange)
  //     // console.log('incomplete: ', incomplete)
  //     user.needs.forEach(need => {
  //       const multiplier = need.percent / 100
  //       const haul = input * multiplier
  //       // console.log('need haul: ', haul)
  //       need.total += haul
  //     })
  //     user.save().then(user => res.json(user))
  //   })
  // })
  // app.post('/api/purchase', verifyToken, (req, res) => {
  //   const { email } = req.body
  //   User.findOne({ email }).then(user => {
  //     console.log('user found.')
  //   })
  // })
  // // delete a single want or need
  // app.post('/api/delete', verifyToken, (req, res) => {
  //   console.log('delete route hit.')
  //   const { email, _id, type } = req.body
  //   console.log(email, _id, type)
  //   User.findOne({ email }).then(user => {
  //     const percent =
  //       type === 'want'
  //         ? user.wants.id(_id).percent
  //         : user.needs.id(_id).percent
  //     const progress =
  //       type === 'want'
  //         ? user.wants.id(_id).progress
  //         : user.needs.id(_id).progress
  //     user.wants =
  //       type === 'want'
  //         ? user.wants.filter((want, i) => want.id !== _id)
  //         : user.wants
  //     user.needs =
  //       type === 'want'
  //         ? user.needs.filter((need, i) => need.id !== _id)
  //         : user.needs
  //     user.undistributedCash += progress
  //     user.points += percent
  //     user.save().then(user => res.json(user))
  //   })
  // })
  // // erase all cash
  // app.post('/api/wipe', verifyToken, (req, res) => {
  //   User.findOne({ email: req.body.email }).then(user => {
  //     user.wants.forEach(want => (want.progress = 0))
  //     user.needs.forEach(need => (need.total = 0))
  //     user.undistributedCash = 0
  //     user.save().then(user => res.json(user))
  //   })
  // })
  // // destroy all accounts
  // app.post('/api/nuke', verifyToken, (req, res) => {
  //   User.findOne({ email: req.body.email }).then(user => {
  //     user.wants = []
  //     user.needs = []
  //     user.undistributedCash = 0
  //     user.points = 100
  //     // delete all images from users cloudinary folder
  //     cloudinary.v2.api.delete_resources_by_prefix(`${user.id}/wants`, result =>
  //       cloudinary.v2.api.delete_resources_by_prefix(
  //         `${user.id}/needs`,
  //         result => user.save().then(user => res.json(user))
  //       )
  //     )
  //   })
  // })
}
