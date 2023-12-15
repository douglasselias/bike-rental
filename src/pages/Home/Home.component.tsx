import Header from 'components/Header'
import BikeList from 'components/BikeList'
import Bike from 'models/Bike'
import { Content } from './Home.styles'
import ConfigErrorMessage from 'components/ConfigErrorMessage'

interface HomeProps {
  bikes: Bike[]
  appIsNotConfigured: boolean
}

const Home = ({ bikes, appIsNotConfigured }: HomeProps) => {
  return (
    <div data-testid='home-page'>
      <Header />

      <Content>
        <BikeList bikes={bikes} />
        {appIsNotConfigured && <ConfigErrorMessage />}
      </Content>
    </div>
  )
}

export default Home
