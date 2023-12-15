import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { mockedBikesArray } from 'mocks/Bike'
import Home from './Home.component'

describe('Home page', () => {

  it('should has a header', () => {
    render(
      <BrowserRouter>
        <Home appIsNotConfigured={false} bikes={mockedBikesArray} />
      </BrowserRouter>,
    )
    const headerElement = screen.getByTestId('header')
    expect(headerElement).toBeInTheDocument()
  })

  it('should has a bikes list', () => {
    render(
      <BrowserRouter>
        <Home appIsNotConfigured={false} bikes={mockedBikesArray} />
      </BrowserRouter>,
    )
    const listElement = screen.getByTestId('bikes-list')
    expect(listElement).toBeInTheDocument()
  })

  it('should display an error message', () => {
    render(
      <BrowserRouter>
        <Home appIsNotConfigured bikes={[]} />
      </BrowserRouter>,
    )
    const listElement = screen.getByTestId('configuration-error-message')
    expect(listElement).toBeInTheDocument()
  })
})
