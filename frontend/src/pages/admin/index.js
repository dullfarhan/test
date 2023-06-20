import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Grid,
  Input,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import AdminHeader from '../adminheader'
import { HiSquares2X2 } from 'react-icons/hi2'
import { MdEmail, MdSettings } from 'react-icons/md'
import { styled } from '@mui/material/styles'
import { TfiMenuAlt } from 'react-icons/tfi'
import moment from 'moment'
import Request from 'src/configs/axiosRequest'
import Error401 from '../401'
import { toast } from 'react-hot-toast'
import Subscription from '../subscription'
import { useRouter } from 'next/router'
import Admin1 from './main'
import Basic from '../basic'
import { useAuth } from 'src/hooks/useAuth'

var jwt = require('jsonwebtoken');

const StyledButton = styled(Button)`
  &:hover {
    background: #4169e1;
  }
`

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius
    }
  }
}))

const Admin = () => {
  const requestApiData = new Request()

  const userName = JSON.parse(localStorage.getItem('userData'))

  const [teb, setTeb] = useState('1')
  const [project, setProject] = useState([])
  const [orgId, setOrgId] = useState('')
  const [org, setOrg] = useState([])
  const [sub, setSub] = useState({})
  const [companyAddress, setCompanyAddress] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [cardDetails, setCardDetails  ] = useState({})

  const handleDevices = (event, newDevices) => {
    setTeb(newDevices)
  }

  function greeting() {
    const hour = moment().hour()
    if (hour > 16) {
      return 'Good Evening'
    }
    if (hour > 11) {
      return 'Good Afternoon'
    }

    return 'Good Morning'
  }

  const router = useRouter()

  const token = window.localStorage.getItem('token');
  const decodedToken = jwt.decode(token);
  const currentDate = new Date();

  const auth = useAuth()
  
  // JWT exp is in seconds
  if (decodedToken?.exp * 1000 < currentDate.getTime()) {
      toast.error("Token expired.");
      localStorage.clear()
      auth.logout()
      router.push('/login')
  }

  useEffect(() => {
    const createdBy = JSON.parse(window.localStorage.getItem('userData'))
    requestApiData.getUser().then(res => {
      if (res?.status === 200) {
        res.data &&
          res.data?.filter(item => item._id === createdBy.id).map(filteredItem => {
              setOrgId(filteredItem)
            })
      }
    }).catch(err => {

      if (err.response?.data?.status === 401) {
        toast.error(err.response?.data?.statusText)
        console.log(err)
      } else {
        console.log(err)
      }
    })
  }, [])
  
  const getOrganization = () => {
    requestApiData.getOrganization().then(res => {
      setOrg(res.data)
    }).catch(err => console.log(err))
  }

  // const allProject = () => {
  //   requestApiData
  //     .getProject()
  //     .then(res => {
  //       if (res?.status === 200) {
  //         setProject(res?.data)
  //       }
  //     })

  //     .catch(err => {

  //       if (err.response?.data?.status === 401) {
  //         toast.error(err.response?.data?.statusText)
  //         console.log(err)
  //       } else {
  //         console.log(err)
  //       }
  //     })
  // }

  useEffect(() => {
  getOrganization()
  }, [orgId.organizationId])

  // const projectData = project?.filter((e) => e.organizationId === orgId.organizationId)
  const findOrgStatus = org.length> 0 && org?.find(item => item._id === orgId.organizationId)

  const HandelChange = e => {
    const name = e.target.value
    requestApiData
      .searchProject(name)
      .then(res => {
        if (res?.status === 200) {
          setProject(res?.data)
        }
      })
      .catch(err => {
        if (err.response?.data?.status === 401) {
          toast.error(err.response?.data?.statusText)
          console.log(err)
        } else {
          console.log(err)
        }
      })
  }

  const subscriptionOrder = () => {
    const payload = {
      organizationId: findOrgStatus?._id
    }

    requestApiData.getSubscriptionOrder(payload).then(res => {
      
      // const data = res.data.filter(item => item.organizationId === findOrgStatus?._id)
      setSub(res?.data[0])
     
      setCompanyAddress( res?.data[0]?.companyAddress ? res?.data[0]?.companyAddress : ''  )
      setBillingAddress( res?.data[0]?.billingAddress ? res?.data[0]?.billingAddress : ''  )
      setCardDetails(res?.data[0]?.cardDetails ? res?.data[0]?.cardDetails : '')
    }).catch(err => {
      if (err.response?.data?.status === 401) {
        toast.error(err.response?.data?.statusText)
        console.log(err)
      } else {
        console.log(err)
      }
    })
  }

  useEffect(() => {
    if(findOrgStatus && findOrgStatus._id && companyAddress === '' &&  billingAddress === ''){
      subscriptionOrder();
    }
  }, [findOrgStatus?._id]);
  


  

  return (
    <Box>
      {findOrgStatus?.subStatus === 'Deactive' 
       ? <Basic /> :
       companyAddress === '' &&  billingAddress === '' ? '' : Object.keys(companyAddress)?.length === 0 && Object.keys(billingAddress)?.length === 0 ? <Subscription /> : <Admin1 />}
    </Box>
  )
}
Admin.getLayout = page => <BlankLayout>{page}</BlankLayout>

Admin.acl = {
  subject: 'both'
}

export default Admin
