
// ** React Imports
import { useCallback, useRef } from 'react'

// ** Config
import Request from 'src/configs/axiosRequest';

const useName = () => {
    
    // ** Hooks
    const requestApiData = new Request()

    const handleGetUserName = useCallback(async (params) => {
        return await requestApiData.getUserItem(params)
            .then(async res => {
                return res?.data?.fullName
            })
    }, [])

    return {
        getUserName: handleGetUserName,
    }
}

export default useName