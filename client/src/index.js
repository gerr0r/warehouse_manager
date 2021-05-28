import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client'

const APOLLO_SERVER_URL = process.env.REACT_APP_APOLLO_SERVER_HOST || 'http://localhost:4000'

const client = new ApolloClient({
  uri: APOLLO_SERVER_URL,
  cache: new InMemoryCache({
    typePolicies: {
      Product: {
        keyFields: ["product_id"]
      },
      WarehouseStock: {
        keyFields: ["product_id"]
      },
      MovementHistory: {
        keyFields: ["movement_id"]
      }
    }
  })
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
