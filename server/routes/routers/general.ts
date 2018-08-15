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

  app.get('/get_images', verifyToken, async (req, res) => {
    const { id } = req.query
    // get images with id references
    let query = await Image.find({ owner: id }).lean()

    // object to store all user categories (ie artist, type, medium) and all options
    let categories = {}

    // get the references for each image
    const images = await Promise.all(
      query.map(async image => {
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

        let propertyOverwrites = []

        properties = await Promise.all(
          /* [[ 'artist', '5b7022b3bedf190c3b282c04' ],
            [ 'medium', '5b7022b3bedf190c3b282c05' ],
            [ 'type', '5b7022b3bedf190c3b282c06' ]] */
          Object.entries(properties).map(async prop => {
            const reqDoc = capitalize(prop[0])
            const schemas = {
              Artist: Artist,
              Image: Image,
              Medium: Medium,
              Type: Type
            }

            let doc
            // set "doc" variable = to proper schema
            for (let realDoc in schemas) {
              if (reqDoc === realDoc) doc = schemas[realDoc]
            }

            // query based on doc variable (ie Artist, Medium,or Type)
            const result = await doc.findById(prop[1]).lean()

            // will replace id references in image object
            // { "medium": "web", "_id": "zi1pu5a2izm3ij234z"}
            const identifiers = {
              name: result.name,
              id: result._id
            }

            // add choice to categories list
            if (categories.hasOwnProperty(prop[0])) {
              console.log(
                'checking if ',
                prop[1],
                'exists in ',
                categories[prop[0]]
              )
              console.log('verdict', categories[prop[0]].includes(prop[1]))
              if (!categories[prop[0]].includes(prop[0])) {
                categories[prop[0]] = [...categories[prop[0]], result._id]
              }
            }

            // add property to categories list if it doesnt exist already
            if (!categories.hasOwnProperty(prop[0])) {
              categories[prop[0]] = [result._id]
            }

            const final = {}
            final[prop[0]] = identifiers

            propertyOverwrites.push(final)
          })
        )

        // array of arrays ie [['artist', {id:..., name:...}], ...]
        propertyOverwrites = propertyOverwrites.map(overwrite => {
          const propertyArray = Object.entries(overwrite)
          const arr = [propertyArray[0][0], propertyArray[0][1]]
          return arr
        })

        const imageWithCorrectAttributes = {
          ...image
        }

        // overwrite image properties containing references with actual data
        propertyOverwrites.map(property => {
          imageWithCorrectAttributes[property[0]] = property[1]
        })

        // return image with all data to images array
        return imageWithCorrectAttributes
      })
    )

    // here goes nothing
    console.log('categories', categories)

    // send images to client
    res.status(200).json({ images, categories })
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
        console.log('user found!')
      } catch (err) {
        console.log('id is null with ', err)
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
        res.status(201).json({ images })
      } catch (err) {
        console.log('image save error: ', err)
        res.status(400).json({ errors: { global: err } })
        // console.log('signup error: ', err.errors.email.message)
        // res.status(400).json({ errors: { global: err.errors.email.message } })
      }
    }
  )

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
