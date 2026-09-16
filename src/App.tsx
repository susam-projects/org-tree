import styled from 'styled-components'
import { GlobalStyle } from '@/global.style'
import { OrgTree } from '@/orgTree/components/OrgTree/OrgTree'

const Screen = styled.main`
  display: flex;
  min-height: 100svh;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 32px 16px;
`

const Title = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 600;
`

const Subtitle = styled.p`
  margin: 0 0 12px;
  color: #6b7280;
`

function App() {
  return (
    <>
      <GlobalStyle />
      <Screen>
        <Title>Org Tree</Title>
        <Subtitle>Дашборд мониторинга орг-структуры компании</Subtitle>
        <OrgTree />
      </Screen>
    </>
  )
}

export default App
