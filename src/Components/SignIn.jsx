import React, { useEffect, useState } from 'react'
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { BiSolidErrorAlt } from "react-icons/bi";
import { FaCircleCheck } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api_client from '../Utils/ApiClient';
import { useDispatch } from 'react-redux';
import { addInfo } from '../Utils/userSlice';

const SignIn = ({ page, setPage }) => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [seePass, setSeePass] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {  // Redirect to home if already logged in
        if (Date.now() < (Number(localStorage.getItem('lt')) + (60 * 60 * 1000))) {
            setTimeout(() => {
                navigate('/');
            }, 1000);
        }
    }, []);

    useEffect(() => {  // Data Validation
        if (!loginId || !password) {
            setError("User data missing");
        }
        else {
            setError("");
        }
    }, [loginId, password]);

    async function handleSignIn() {
        api_client.post('/auth/login', { loginId, password })
            .then((res) => {
                switch (res.data.status) {
                    case 200:
                        localStorage.setItem('lt', res.data.loginTime);  // Store session id on frontend
                        dispatch(addInfo(res.data.data));
                        toast.custom((t) => (
                            <div className='flex justify-between items-center bg-green-900 border-green-600 border-2 rounded-lg py-5 ms-[60%] sm:ms-[60%] px-3 shadow-sm bg-opacity-80 w-[40%] sm:w-[130%]'>
                                <h1 className='text-green-600 font-semibold flex items-center gap-3'><FaCircleCheck className='text-3xl' />Login Successful!</h1>
                            </div>
                        ));
                        setTimeout(() => {
                            navigate('/');
                        }, 2000);
                        break;
                    case 400:
                        toast.custom((t) => (
                            <div className='flex justify-between items-center bg-red-900 border-red-600 border-2 rounded-lg py-5 ms-[35%] sm:ms-[30%] px-3 shadow-sm bg-opacity-80 w-[65%] sm:w-[130%]'>
                                <h1 className='text-red-600 font-semibold flex items-center gap-3'><BiSolidErrorAlt className='text-3xl' />{res.data.message}</h1>
                                <button type='button' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-500 text-lg' /></button>
                            </div>
                        ));
                        break;
                    case 500:
                        if (res.data.message == "Internal server error") {
                            toast.custom((t) => (
                                <div className={`bg-red-900 border-red-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 flex flex-col items-center justify-between gap-3`}>
                                    <BiSolidErrorAlt className='text-red-500 text-4xl' />
                                    <h3 className='text-red-600 text-lg text-center font-semibold flex items-center gap-3'>Encountered an unexpected error!</h3>
                                    <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-700 text-2xl' /></button>
                                </div>
                            ));
                        }
                        else {
                            toast.custom((t) => (
                                <div className='flex justify-between items-center bg-red-900 border-red-600 border-2 rounded-lg py-5 ms-[35%] sm:ms-[30%] px-3 shadow-sm bg-opacity-80 w-[65%] sm:w-[130%]'>
                                    <h1 className='text-red-600 font-semibold flex items-center gap-3'><BiSolidErrorAlt className='text-3xl' />{res.data.message}</h1>
                                    <button type='button' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-500 text-lg' /></button>
                                </div>
                            ));
                        }
                }
            })
            .catch((err) => {
                console.log(err);
                toast.custom((t) => (
                    <div className='flex justify-between items-center bg-red-900 border-red-600 border-2 rounded-lg py-5 ms-[45%] sm:ms-[65%] px-3 shadow-sm bg-opacity-80 w-[55%] sm:w-[130%]'>
                        <h1 className='text-red-600 font-semibold flex items-center gap-3'><BiSolidErrorAlt className='text-2xl' />{err.message}</h1>
                        <button type='button' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-500 text-lg' /></button>
                    </div>
                ));
            })
    }

    return (
        <div className={`auth-card ${(page == 'login') ? 'flex' : 'sm:flex hidden' /* 'sm:flex hidden' if sign-up */} flex-col items-center justify-between p-5 h-[70dvh] w-[90%] sm:w-[45%] overflow-y-auto ${(page == 'login') ? 'z-0' : 'z-2' /* 'z-2' if sign-up */}`}>

            <h1 className='text-5xl text-teal-400 font-light'>Login</h1>
            <form className='h-[80%] w-11/12 flex flex-col justify-between py-7'>
                <div className='flex flex-col gap-2 px-2'>
                    <input className='auth-input1 bg-black text-slate-500 sm:text-black sm:bg-transparent outline-none border-4 rounded-3xl px-3 py-2' id='loginId' name='loginId' type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder='' required />
                    <label className={`auth-label1 ${(page == 'register') && 'hidden'}`} htmlFor="loginId">Login Id</label>
                    <div className='flex flex-col gap-2'>
                        <div className='auth-input2 bg-black sm:bg-transparent flex items-center justify-between border-4 rounded-3xl overflow-hidden ps-3 h-full w-full'>
                            <input className='outline-none border-none text-slate-500 sm:text-black bg-transparent py-2 w-11/12' id='password1' name='password' type={`${seePass ? 'text' : 'password'}`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='' required />
                            <button className='p-2 text-2xl text-slate-400' type='button' onPointerUp={(e) => {
                                setSeePass(!seePass);
                            }} onPointerDown={(e) => {
                                setSeePass(!seePass);
                            }}>{seePass ? <RiEyeLine /> : <RiEyeCloseLine />}</button>
                        </div>
                        <label className={`auth-label2 w-3/5 ${(page == 'register') && 'hidden'}`} htmlFor="password1">Password</label>
                    </div>
                </div>
                <div className={`flex flex-col-reverse ${(page == 'register') && 'hidden'} sm:flex-row items-center justify-around gap-2`}>
                    <button className='auth-button2 border-blue-600 border-4 rounded-md h-10 w-4/6 sm:w-36 text-xl text-blue-600 font-semibold' type='button' onClick={() => {
                        setPage('register');
                        setLoginId('');
                        setPassword('');
                    }}>Register</button>
                    <span className='block sm:hidden font-medium'>------or------</span>
                    <button className='auth-button1 bg-teal-600 rounded-md h-10 w-4/6 sm:w-36 text-xl font-semibold' onClick={(e) => {
                        e.preventDefault();
                        if (error == '') {
                            handleSignIn();
                        }
                        else {
                            toast.custom((t) => (
                                <div className='flex justify-between items-center bg-red-900 border-red-600 border-2 rounded-lg py-5 ms-[35%] sm:ms-[50%] px-3 shadow-sm bg-opacity-80 w-[65%] sm:w-[130%]'>
                                    <h1 className='text-red-600 font-semibold flex items-center gap-3'><BiSolidErrorAlt className='text-2xl' />{error}</h1>
                                    <button type='button' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-500 text-lg' /></button>
                                </div>
                            ));
                        }
                    }}>Sign In</button>
                </div>
            </form>
        </div>
    )
}

export default SignIn