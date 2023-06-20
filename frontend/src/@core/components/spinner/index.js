
// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Image from 'next/image'
import logo from '../../../assest/carspice/logo.png'

const FallbackSpinner = ({ sx }) => {
  
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Image src={logo} alt='' />
      <CircularProgress disableShrink sx={{ mt: 6, color: "#4169E1" }} size={25} />
    </Box>
  )
}

export default FallbackSpinner
