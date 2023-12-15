import { Box, styled } from '@mui/material'

export const ErrorMessage = styled(Box)(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: 140,
  textAlign: 'center',
  maxWidth: 500,
  marginLeft: 'auto',
  marginRight: 'auto',
}));
