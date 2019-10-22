import React, { useState } from 'react'

import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'
import Select from 'react-select'

const ALL_AUTHORS = gql`
{
  allAuthors  {
    name
    born
    bookCount
  }
}
`

const UPDATE_AUTHOR = gql`
  mutation editAuthor($name: String!, $newBirthday: Int!) {
    editAuthor(
      name: $name,
      newBirthday: $newBirthday
    ) {
      name
      born
      bookCount
    }
  }
`

const authorsForSelect = (authors) => {
  let newArr = []
  authors.map(a => newArr.push({value: a.name, label: a.name}))
  return newArr
}
const Authors = (props) => {
  const [name, setName] = useState('')
  const [newBirthday, setNewBirthday] = useState('')
  if (!props.show) {
    return null
  }
  return (
    <Query query={ALL_AUTHORS}>
      {(result) => {
        if (result.loading) {
          return <div>loading...</div>
        }
        return (
          <div>
            <h2>authors</h2>
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>
                    born
                  </th>
                  <th>
                    books
                  </th>
                </tr>
                {result.data.allAuthors.map(a =>
                  <tr key={a.name}>
                    <td>{a.name}</td>
                    <td>{a.born}</td>
                    <td>{a.bookCount}</td>
                  </tr>
                )}
              </tbody>
            </table>
            {props.token ?
              <div>
              <h3>Set birthyear</h3>
                <Mutation mutation={UPDATE_AUTHOR}>
                  {(editAuthor) =>
                    <form onSubmit={() => editAuthor({
                      variables: { name, newBirthday: parseInt(newBirthday) }
                    })}>
                      <div>
                        <Select
                          placeholder={name}
                          label="name"
                          options={authorsForSelect(result.data.allAuthors)}
                          value={name}
                          onChange={(e) => setName(e.value)}
                        />
                      </div>
                      <div>
                        newBirthday
                        <input
                          value={newBirthday}
                          onChange={({ target }) => setNewBirthday(target.value)}
                        />
                      </div>
                      <button type='submit'>update author</button>
                    </form>
                  }
                </Mutation> 
              </div> 
            : null}
            
          </div>
        )
      }}       
    </Query>
  )
}

export default Authors