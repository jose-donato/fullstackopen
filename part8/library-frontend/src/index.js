import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { ApolloProvider } from 'react-apollo'
import App from './App'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'



const webSocketLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: { reconnect: true }
})


const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('small-library-user-token')
    return {
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : null,
        }
    }
})

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    webSocketLink,
    authLink.concat(httpLink)
)

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
})
ReactDOM.render(
    <ApolloProvider client={client} >
        <App />
    </ApolloProvider>,  
    document.getElementById('root')
)