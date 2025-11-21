import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginSuccess = () => {

    useEffect(() => {
    
        
        const token = new URLSearchParams(window.location.search).get('token');
        const name=new URLSearchParams(window.location.search).get('name');
        const email=new URLSearchParams(window.location.search).get('email');
        const role=new URLSearchParams(window.location.search).get('role');
        const roll=new URLSearchParams(window.location.search).get('roll');
        if (token) {
            localStorage.setItem('token', token);
            const userProfile = { name, email, role, roll };
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
        
    
            window.location.href = '/student';
        } else {
            window.location.href = '/';
        }

    }, [])

  return (
    <div>LoginSuccess</div>
  )
}

export default LoginSuccess