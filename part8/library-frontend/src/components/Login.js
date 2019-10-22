import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(
      username: $username,
      password: $password
    ) {
      value
    }
  }
`


const Login = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    if (!props.show) {
        return null
    }

    return (
        <div>
            <Mutation mutation={LOGIN}>
                {(login) =>
                    <form onSubmit={async (e) => {
                        e.preventDefault()
                        const result = await login({ variables: {username, password} })
                        if (result) {
                            const token = result.data.login.value
                            props.setToken(token)
                            localStorage.setItem('small-library-user-token', token)
                        }
                    }}>
                        <div>
                            username
                            <input
                                value={username}
                                onChange={({ target }) => setUsername(target.value)}
                            />
                        </div>
                        <div>
                            password
                            <input
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                            />
                        </div>
                        <button type='submit'>login</button>
                    </form>
                }
            </Mutation>
        </div>
    )
}

export default Login