import { Box, Breadcrumbs, Divider, Link, Typography } from '@mui/material'
import BikeImageSelector from 'components/BikeImageSelector'
import BikeSpecs from 'components/BikeSpecs'
import BikeType from 'components/BikeType'
import BookingAddressMap from 'components/BookingAddressMap'
import Header from 'components/Header'
import Bike from 'models/Bike'
import { getServicesFee } from './BikeDetails.utils'
import {
  BookingButton,
  BreadcrumbContainer,
  BreadcrumbHome,
  BreadcrumbSeparator,
  Content,
  DetailsContainer,
  FavoriteIcon,
  InfoIcon,
  LikeButton,
  OverviewContainer,
  PriceRow,
} from './BikeDetails.styles'
import { useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

type RentData = {
  bikeId?: number
  userId: number
  dateFrom: string
  dateTo: string
}

interface BikeDetailsProps {
  bike?: Bike
  rentRequest: (path: string, rentData: RentData) => Promise<{ status: number }>
}

function totalDaysBetweenDates(startDate: string, endDate: string) {
  if (!startDate || !endDate)
    return 1

  const [startYear, startMonth, startDay] = startDate.split('-').map(a => parseInt(a))
  const [endYear, endMonth, endDay] = endDate.split('-').map(a => parseInt(a))

  const startMs = new Date(startYear, startMonth - 1, startDay).getTime()
  const endMs = new Date(endYear, endMonth - 1, endDay).getTime()

  const millisecondsInDay = 86400000
  return 1 + Math.round((endMs - startMs) / millisecondsInDay)
}

const BikeDetails = ({ bike, rentRequest }: BikeDetailsProps) => {
  const rateByDay = bike?.rate || 0
  const rateByWeek = rateByDay * 7
  const servicesFeeByDay = getServicesFee(rateByDay)

  const currentDate = new Date()
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())

  const currentMonthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', { month: 'long' })
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const days = new Array(daysInMonth).fill(0).map((_, i) => i + 1)

  const isPreviousMonthInThePast = currentYear == currentDate.getFullYear() && currentMonth < currentDate.getMonth() + 1

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const totalDaysSelected = totalDaysBetweenDates(startDate, endDate)
  const total = (rateByDay + servicesFeeByDay) * totalDaysSelected

  const [rentSuccessful, setRentSuccessful] = useState(false)

  return (
    <div data-testid='bike-details-page'>
      <Header />

      <BreadcrumbContainer data-testid='bike-details-breadcrumbs'>
        <Breadcrumbs separator={<BreadcrumbSeparator />}>
          <Link underline='hover' display='flex' alignItems='center' color='white' href='/'>
            <BreadcrumbHome />
          </Link>

          <Typography fontWeight={800} letterSpacing={1} color='white'>
            {bike?.name}
          </Typography>
        </Breadcrumbs>
      </BreadcrumbContainer>

      <Content>
        <DetailsContainer variant='outlined' data-testid='bike-details-container'>
          {!!bike?.imageUrls && <BikeImageSelector imageUrls={bike.imageUrls} />}

          <BikeSpecs bodySize={bike?.bodySize} maxLoad={bike?.maxLoad} ratings={bike?.ratings} />

          <Divider />

          <Box marginY={2.25}>
            <Box display='flex' alignItems='center' justifyContent='space-between'>
              <div>
                <Typography
                  variant='h1'
                  fontSize={38}
                  fontWeight={800}
                  marginBottom={0.5}
                  data-testid='bike-name-details'
                >
                  {bike?.name}
                </Typography>

                <BikeType type={bike?.type} />
              </div>

              <LikeButton>
                <FavoriteIcon />
              </LikeButton>
            </Box>

            <Typography marginTop={1.5} fontSize={14}>
              {bike?.description}
            </Typography>
          </Box>

          <Divider />

          <Box marginY={2.25} data-testid='bike-prices-details'>
            <PriceRow>
              <Typography>Day</Typography>
              <Typography fontWeight={800} fontSize={24} letterSpacing={1}>
                {rateByDay} €
              </Typography>
            </PriceRow>

            <PriceRow>
              <Typography>Week</Typography>
              <Typography fontWeight={800} fontSize={24} letterSpacing={1}>
                {rateByWeek} €
              </Typography>
            </PriceRow>
          </Box>

          <Divider />

          <Box marginTop={3.25}>
            <Typography variant='h1' fontSize={24} fontWeight={800}>
              Full adress after booking
            </Typography>

            <BookingAddressMap />
          </Box>
        </DetailsContainer>

        <OverviewContainer variant='outlined' data-testid='bike-overview-container'>
          {rentSuccessful ?
            <div style={{ textAlign: 'center' }}>
              <Typography data-testid='bike-rent-thank-you' variant='h3' fontSize={24} paddingBottom='24px' fontWeight={800} color='#1B1B1B'>
                Thank you!
              </Typography>

              <Typography variant='h4' fontSize={16} paddingBottom='24px' fontWeight={600} color='#1B1B1B'>
                Your bike is booked
              </Typography>

              <img
                src={bike?.imageUrls[0]}
                width='100%'
                alt='Bike Placeholder Image'
              />
              <Typography variant='h4' fontSize={18} paddingTop='16px' paddingBottom='8px' fontWeight={700} color='#1B1B1B'>
                {bike?.name}
              </Typography>

              <BikeType type={bike?.type} />
            </div>
            : (
              <>
                <Typography variant='h2' fontSize={24} marginBottom={1.25} fontWeight={800} color='#1B1B1B'>
                  Select date
                </Typography>

                <div style={{ display: 'grid', placeItems: 'center' }}>
                  <div style={{ backgroundColor: '#1F49D1', borderRadius: '25px', padding: '20px', }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', maxWidth: '300px' }}>
                      <div>
                        <p style={{ fontSize: '24px', color: 'white', fontWeight: 'bold' }}>{currentMonthName}</p>
                        <p style={{ color: '#fff', opacity: 0.5 }}>{currentYear}</p>
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          data-testid='bike-rent-previous-month-button'
                          style={{ display: 'flex', justifyContent: 'center', color: isPreviousMonthInThePast ? '#8fa4e5' : 'white', backgroundColor: '#1e49cc', border: isPreviousMonthInThePast ? '1px solid #8fa4e5' : '1px solid white', padding: '8px', borderRadius: '15px' }}
                          disabled={isPreviousMonthInThePast}
                          onClick={() => {
                            if (currentMonth > 0)
                              setCurrentMonth(m => m - 1)
                            else {
                              setCurrentMonth(11)
                              setCurrentYear(y => y - 1)
                            }
                          }}>
                          <ChevronLeftIcon />
                        </button>
                        <button
                          data-testid='bike-rent-next-month-button'
                          style={{ display: 'flex', justifyContent: 'center', color: 'white', backgroundColor: '#1e49cc', border: '1px solid white', padding: '8px', borderRadius: '15px' }}
                          onClick={() => {
                            if (currentMonth < 11)
                              setCurrentMonth(m => m + 1)
                            else {
                              setCurrentMonth(0)
                              setCurrentYear(y => y + 1)
                            }
                          }}>
                          <ChevronRightIcon />
                        </button>
                      </div>
                    </div>


                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 30px)', backgroundColor: '#1e49cc', color: 'white', paddingTop: '10px', paddingBottom: '10px' }}>
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(name => <div
                        key={name}
                        style={{ color: '#ffffff', opacity: 0.5, display: 'flex', justifyContent: 'center', padding: '11px 10px' }}
                      >{name}</div>)}
                      {days.map(day => {
                        const isDayInThePast = isPreviousMonthInThePast && day < currentDate.getDate()
                        const month = currentMonth + 1
                        const date = `${currentYear}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
                        const isStartDate = date == startDate
                        const isEndDate = date == endDate
                        const isEdge = isStartDate || isEndDate
                        const isBetweenEdges = startDate < date && date < endDate

                        const backgroundColor = isEdge ? 'white' : isBetweenEdges ? '#5071d7' : ''
                        const color = isEdge ? 'blue' : isBetweenEdges ? 'white' : isDayInThePast ? '#8fa4e5' : ''
                        const borderRadius = isBetweenEdges ? '' : '100%'
                        const margin = isBetweenEdges ? ' 0 -7px 0 -7px' : ''
                        const zIndex = isEdge ? '1' : ''
                        const cursor = isDayInThePast ? 'default' : 'pointer'

                        return <div
                          key={day}
                          style={{ cursor, margin, zIndex, backgroundColor, color, borderRadius, display: 'flex', justifyContent: 'center', padding: '5px 10px' }}
                          onClick={() => {
                            if (isDayInThePast)
                              return
                            if (!startDate)
                              setStartDate(date)
                            else if (startDate <= date)
                              setEndDate(date)
                          }}
                        >{day}</div>
                      })}
                    </div>

                    {startDate && <button
                      style={{ backgroundColor: 'transparent', whiteSpace: 'nowrap', maxWidth: 'min-content', color: 'white', border: '1px solid white', padding: '8px', borderRadius: '15px' }}
                      onClick={() => {
                        setStartDate('')
                        setEndDate('')
                      }}>Clear selection</button>}
                  </div>
                </div>


                <Typography variant='h2' fontSize={16} marginBottom={1.25} marginTop={3.25}>
                  Booking Overview
                </Typography>

                <Divider />

                <PriceRow marginTop={1.75} data-testid='bike-overview-single-price'>
                  <Box display='flex' alignItems='center'>
                    <Typography marginRight={1}>Subtotal</Typography>
                    <InfoIcon fontSize='small' />
                  </Box>

                  <Typography>{rateByDay * totalDaysSelected} €</Typography>
                </PriceRow>

                <PriceRow marginTop={1.5} data-testid='bike-overview-single-price'>
                  <Box display='flex' alignItems='center'>
                    <Typography marginRight={1}>Service Fee</Typography>
                    <InfoIcon fontSize='small' />
                  </Box>

                  <Typography>{servicesFeeByDay * totalDaysSelected} €</Typography>
                </PriceRow>

                <PriceRow marginTop={1.75} data-testid='bike-overview-total'>
                  <Typography fontWeight={800} fontSize={16}>
                    Total
                  </Typography>
                  <Typography variant='h2' fontSize={24} letterSpacing={1}>
                    {total} €
                  </Typography>
                </PriceRow>

                <BookingButton
                  fullWidth
                  disableElevation
                  variant='contained'
                  data-testid='bike-booking-button'
                  disabled={!startDate}
                  onClick={async () => {
                    const rentData = {
                      bikeId: bike?.id,
                      userId: 447,
                      dateFrom: startDate,
                      dateTo: endDate || startDate,
                    }
                    const response = await rentRequest('/bikes/rent', rentData)
                    switch (response.status) {
                      case 200: {
                        setRentSuccessful(true)
                        break
                      }
                      case 400: {
                        console.error(response)
                        break
                      }
                      default:
                        console.error('Unknown error')
                    }
                  }}
                >
                  Add to booking
                </BookingButton>
              </>
            )}


        </OverviewContainer>
      </Content>
    </div>
  )
}

export default BikeDetails
