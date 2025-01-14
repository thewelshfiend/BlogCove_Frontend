import React, { useEffect, useState } from 'react'
import SignIn from '../Components/SignIn'
import SignUp from '../Components/SignUp'
import Banner from '../assets/Banner.jpg'
import BlackLogo from '../assets/Black.jpg'

const Auth = () => {
    const [page, setPage] = useState('login');

    useEffect(() => {
        setPage('login');
    }, [])

    return (
        <div id='auth-container' className='relative flex justify-around items-center py-7 min-h-screen sm:min-h-[100%] w-[100%] min-w-[370px] md:w-[80%] md:h-[85%] lg:w-[70%] lg:h-[70%] overflow-hidden mx-auto bg-gradient-to-br from-blue-700 to-teal-800 md:rounded-3xl'>
            <div className={`flex absolute ${(page == 'register') ? 'sm:right-0' : 'sm:left-0' /* 'sm:right-0' if sign-up */} px-5 rounded-2xl sm:rounded-none border-black border-2 h-[70%] w-[90%] opacity-20 sm:opacity-100 sm:h-[100%] sm:w-[50%] bg-black z-1`}>
                <img draggable="false" className='sm:flex hidden object-contain sm:opacity-80 animate-pulse' src={(page == 'register') ? BlackLogo : Banner /* 'Black' if sign-up */} />
                <img draggable="false" className='flex sm:hidden object-cover animate-pulse' src="Logo.jpg" />
            </div>
            <SignUp page={page} setPage={setPage} />
            <SignIn page={page} setPage={setPage} />
        </div>
    )
}

export default Auth