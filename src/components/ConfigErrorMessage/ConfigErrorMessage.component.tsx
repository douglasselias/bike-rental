import { ErrorMessage } from './ConfigErrorMessage.styles'

const ConfigErrorMessage = () => {
  return (
    <ErrorMessage data-testid="configuration-error-message">
      .env file not configured. Please, review the bike rent documentation to see how to integrate
      with the API.
    </ErrorMessage>
  )
}

export default ConfigErrorMessage
