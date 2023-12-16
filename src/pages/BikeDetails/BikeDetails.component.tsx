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

interface BikeDetailsProps {
  bike?: Bike
}

const BikeDetails = ({ bike }: BikeDetailsProps) => {
  const rateByDay = bike?.rate || 0
  const rateByWeek = rateByDay * 7

  const servicesFee = getServicesFee(rateByDay)
  const total = rateByDay + servicesFee

  const currentDate = new Date()
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())

  const currentMonthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', { month: 'long' })
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const days = new Array(daysInMonth).fill(0).map((_, i) => i + 1)

  const isPreviousMonthInThePast = currentYear == currentDate.getFullYear() && currentMonth < currentDate.getMonth() + 1

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

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
          <Typography variant='h2' fontSize={16} marginBottom={1.25}>
            Booking Overview
          </Typography>

          <div style={{ backgroundColor: '#1e49cc', borderRadius: '25px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
              <div>
                <p style={{ fontSize: '24px', color: 'white', fontWeight: 'bold' }}>{currentMonthName}</p>
                <p style={{ color: '#8fa4e5' }}>{currentYear}</p>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
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


            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 30px)', backgroundColor: '#1e49cc', color: 'white' }}>
              {days.map(day => {
                const isDayInThePast = isPreviousMonthInThePast && day < currentDate.getDate()
                const month = currentMonth + 1
                const date = `${currentYear}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
                const isStartDate = date == startDate
                const isEndDate = date == endDate
                const isEdge = isStartDate || isEndDate
                const isBetweenEdges = startDate < date && date < endDate

                const backgroundColor = isEdge ? 'white' : isBetweenEdges ? '#5071d7' : ''
                const color = isEdge ? 'blue' : isBetweenEdges ? 'white' : isDayInThePast ? '#8fa4e5': ''
                const borderRadius = isBetweenEdges ? '' : '100%'
                const margin = isBetweenEdges ? ' 0 -7px 0 -7px' : ''
                const zIndex = isEdge ? '1' : ''

                return <div
                  key={day}
                  style={{ margin, zIndex,  backgroundColor, color, borderRadius, display: 'flex', justifyContent: 'center', padding: '4px 8px' }}
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
          </div>

          <p>
            {startDate} {endDate && '-'} {endDate}
          </p>
          <button onClick={() => {
            setStartDate('')
            setEndDate('')
          }}>CLEAR</button>

          <Divider />

          <PriceRow marginTop={1.75} data-testid='bike-overview-single-price'>
            <Box display='flex' alignItems='center'>
              <Typography marginRight={1}>Subtotal</Typography>
              <InfoIcon fontSize='small' />
            </Box>

            <Typography>{rateByDay} €</Typography>
          </PriceRow>

          <PriceRow marginTop={1.5} data-testid='bike-overview-single-price'>
            <Box display='flex' alignItems='center'>
              <Typography marginRight={1}>Service Fee</Typography>
              <InfoIcon fontSize='small' />
            </Box>

            <Typography>{servicesFee} €</Typography>
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
          >
            Add to booking
          </BookingButton>
        </OverviewContainer>
      </Content>
    </div>
  )
}

export default BikeDetails
