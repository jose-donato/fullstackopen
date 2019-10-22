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
  
  return (
    <Query query={ALL_BOOKS}>
      {(result) => {
        if (result.loading) {
          return <div>loading...</div>
        }
        const genres = []
        result.data.allBooks.map(b => b.genres.map(g => {
          if(!genres.includes(g)) {
            genres.push(g)
          }
        }))
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
                {result.data.allBooks.map(a => {
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
                )}
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

export default Books
