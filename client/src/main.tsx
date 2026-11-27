import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from "@apollo/client/link/context"
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter } from 'react-router';

// Empty in production: the API is served from the same origin (Caddy proxies /graphql)
const apiBase = import.meta.env.VITE_API_URL ?? "";

const httpLink = new HttpLink({
  uri: `${apiBase}/graphql`
});

const authLink = new SetContextLink(({ headers }) => {
  const token = localStorage.getItem('housemate-bearer');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
)
