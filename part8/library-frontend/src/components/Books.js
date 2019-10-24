import React, {useState} from 'react'

import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

const ALL_BOOKS = gql`
{
  allBooks  {
    title
    author {
      name
      born
      bookCount
    }
    published
  }
}
`

const Books = (props) => {
  const [genre, setGenre] = useState('')
  if (!props.show) {
    return null
  }

  if (props.type === 'recommend') {
    return <Query query={ALL_BOOKS}>
      {(result) => {
        if (result.loading) {
          return <div>loading...</div>
        }
        return (
          <div>
            <h2>recommendations</h2>
            <h4>books in your favorite genre {props.favGenre}</h4>
            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>
                    author
                  </th>
                  <th>
                    published
                  </th>
                </tr>
                { result.data ?
                  result.data.allBooks.map(a => {
                  if (genre === props.favGenre) {
                    return (
                      <tr key={a.title}>
                        <td>{a.title}</td>
                        <td>{a.author.name}</td>
                        <td>{a.published}</td>
                      </tr>
                    )
                  }
                }
                )
                : <p>no books on db</p>
                }
              </tbody>
            </table>
          </div>
        )
      }}
    </Query>
  }
  if (props.type === 'books') {
    return (
      <Query query={ALL_BOOKS}>
        {(result) => {
          if (result.loading) {
            return <div>loading...</div>
          }
          const genres = []

          if (result.data) { 
            result.data.allBooks.map(b => b.genres.map(g => {
              if(!genres.includes(g)) {
                genres.push(g)
              }
            }))
          }
          const buttons = (list) => (
            <div>
              {list.map(l =>
                <button key={l} onClick={() => setGenre(l)}>
                  {l}
                </button>
              )}
              <button onClick={() => setGenre('')}>{'all genres'}</button>
            </div>
            
          )
          return (
            <div>
              <h2>books</h2>
              <table>
                <tbody>
                  <tr>
                    <th></th>
                    <th>
                      author
                    </th>
                    <th>
                      published
                    </th>
                  </tr>
                  {
                    result.data ? 
                    result.data.allBooks.map(a => {
                    if(genre === '' || a.genres.include(genre)){
                      return (
                        <tr key={a.title}>
                          <td>{a.title}</td>
                          <td>{a.author.name}</td>
                          <td>{a.published}</td>
                          <td>
                            <ul>
                              {a.genres.map(g => <li key={g}>{g}</li>)}
                            </ul>
                          </td>
                        </tr>
                      )
                    }
                  }
                  )
                  : <p>no books on db</p>
                  }
                </tbody>
              </table>
              <p>filter by genres:</p>
              {buttons(genres)}
            </div>
          )
        }}
      </Query>
    )
  }
}

export default Books
