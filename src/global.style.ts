import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100svh;
    font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
  }

  #root {
    min-height: 100svh;
  }
`
