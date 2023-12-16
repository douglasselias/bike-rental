import { act, render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { mockedBike } from 'mocks/Bike'
import { SERVICE_FEE_PERCENTAGE } from './BikeDetails.contants'
import { getServicesFee } from './BikeDetails.utils'
import BikeDetails from './BikeDetails.component'

Date.constructor = jest.fn(() => new Date(2023, 11, 16)) as any

describe('BikeDetails page', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <BikeDetails bike={mockedBike} rentRequest={jest.fn(async () => ({ status: 200 }))} />
      </BrowserRouter>,
    )
  })

  it('should has a header', () => {
    const headerElement = screen.getByTestId('header')
    expect(headerElement).toBeInTheDocument()
  })

  it('should has breadcrumbs', () => {
    const breadcrumbsElement = screen.getByTestId('bike-details-breadcrumbs')
    expect(breadcrumbsElement).toBeInTheDocument()
  })

  it('should has the details container with the image selector, bike name, prices and a map', () => {
    const detailsContainerElement = screen.getByTestId('bike-details-container')
    expect(detailsContainerElement).toBeInTheDocument()

    const imageSelectorElement = screen.getByTestId('bike-image-selector')
    expect(imageSelectorElement).toBeInTheDocument()

    const nameElement = screen.getByTestId('bike-name-details')
    expect(nameElement).toBeInTheDocument()

    const pricesElement = screen.getByTestId('bike-prices-details')
    expect(pricesElement).toBeInTheDocument()

    const mapElement = screen.getByTestId('booking-address-map')
    expect(mapElement).toBeInTheDocument()
  })

  it('should has the overview container with the prices, total and booking button', () => {
    const overviewContainerElement = screen.getByTestId('bike-overview-container')
    expect(overviewContainerElement).toBeInTheDocument()

    const pricesElements = screen.getAllByTestId('bike-overview-single-price')
    expect(pricesElements).not.toBeNull()
    expect(pricesElements.length).toBe(2)

    const totalElement = screen.getByTestId('bike-overview-total')
    expect(totalElement).toBeInTheDocument()

    const bookingButtonElement = screen.getByTestId('bike-booking-button')
    expect(bookingButtonElement).toBeInTheDocument()
  })

  describe('BikeDetails page - calendar', () => {
    it('should not select day in the past', () => {
      const day = screen.getByText('15')
      act(() => {
        day.click()
      })
      expect(day).toHaveStyle('background-color: ')
    })

    it('should select one day', () => {
      const day = screen.getByText('16')
      act(() => {
        day.click()
      })
      expect(day).toHaveStyle('background-color: white')
    })

    it('should select multiple days in the same week/row', () => {
      const startDay = screen.getByText('16')
      const endDay = screen.getByText('21')
      act(() => {
        startDay.click()
      })
      expect(startDay).toHaveStyle('background-color: white')
      act(() => {
        endDay.click()
      })
      expect(endDay).toHaveStyle('background-color: white')
      for (let i = 17; i < 21; i++) {
        const day = screen.getByText(String(i))
        expect(day).toHaveStyle('background-color: rgb(80, 113, 215)')
      }
    })

    it('should select multiple days in different weeks/rows', () => {
      const startDay = screen.getByText('28')
      const endDay = screen.getByText('31')
      act(() => {
        startDay.click()
      })
      expect(startDay).toHaveStyle('background-color: white')
      act(() => {
        endDay.click()
      })
      expect(endDay).toHaveStyle('background-color: white')
      for (let i = 29; i < 31; i++) {
        const day = screen.getByText(String(i))
        expect(day).toHaveStyle('background-color: rgb(80, 113, 215)')
      }
    })

    it('should select multiple days in different months', () => {
      const startDay = screen.getByText('30')
      act(() => {
        startDay.click()
      })
      expect(startDay).toHaveStyle('background-color: white')

      const nextMonth = screen.getByTestId('bike-rent-next-month-button')
      act(() => {
        nextMonth.click()
      })
      const endDay = screen.getByText('3')
      act(() => {
        endDay.click()
      })
      expect(endDay).toHaveStyle('background-color: white')
      for (let i = 1; i < 3; i++) {
        const day = screen.getByText(String(i))
        expect(day).toHaveStyle('background-color: rgb(80, 113, 215)')
      }
    })

    it('should show rent button disabled by default', () => {
      const rentButton = screen.getByTestId('bike-booking-button')
      expect(rentButton).toBeDisabled()
    })

    it('should show a "thank you" message', () => {
      const day = screen.getByText('16')
      act(() => {
        day.click()
      })
      const rentButton = screen.getByTestId('bike-booking-button')
      act(() => {
        rentButton.click()
      })
      waitFor(() => {
        const thankYou = screen.getByTestId('bike-rent-thank-you')
        expect(thankYou).toBeInTheDocument()
      })
    })
  })
})

describe('BikeDetails utils', () => {
  it('should gets the services fee properly', () => {
    const amount = 100
    const expectedAmount = amount * SERVICE_FEE_PERCENTAGE

    const result = getServicesFee(amount)
    expect(result).toEqual(expectedAmount)
  })
})
