import React, { use } from 'react'
import { useEffect } from 'react'

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("userProfile")
        window.location.href = "/"
    }, [])
    return (
    <div>Logout</div>
  )
}

export default Logout