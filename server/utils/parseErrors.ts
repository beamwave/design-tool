import _ from 'lodash'

export default function(errors) {
  const result = {}

  _.forEach(errors, (val, key) => {
    result[key] = val.message
  })

  return result
}

/*
This utility function parses complex error message sent to client by mongoose-unique-validator when an email already exists in the database.

it constructs result object with the error messages.
*/
