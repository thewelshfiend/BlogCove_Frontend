import React, { useEffect, useState } from 'react'
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { BiSolidErrorAlt } from "react-icons/bi";
import { FaCircleCheck } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { toast } from 'sonner';
import api_client from '../Utils/ApiClient';

const SignUp = ({ page, setPage }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [seePass, setSeePass] = useState(false);
    const [error, setError] = useState('');

    function emailValidator(email) {
        return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase()));
    }
    function passwordValidator(password) {
        return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-])[A-Za-z\d#?!@$%^&*-]{8,}$/.test(password));
    }

    useEffect(() => {  // Data Validation
        if (!email || !username || !password) {
            setError("User data missing");
            return;
        }

        if (typeof name != "string") {
            setError("Name has to be text");
            return;
        }
        else if (typeof email != "string") {
            setError("Email has to be text");
            return;
        }
        else if (typeof username != "string") {
            setError("Username has to be text");
            return;
        }
        else if (typeof password != "string") {
            setError("Password has to be text");
            return;
        }

        if (!emailValidator(email)) {
            setError("Email is not valid");
            return;
        }
        else if (username.length < 3 || username.length > 50) {
            setError("Username should be between 3 and 50 characters");
            return;
        }
        else if (username.includes(' ')) {
            setError("Username can't contain spaces"); // >25
            return;
        }
        else if (emailValidator(username)) {
            setError("Username can't be an email"); // >25
            return;
        }
        else if (!passwordValidator(password)) {
            setError("Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character");
        }
        else {
            setError("");
        }
    }, [name, email, username, password]);

    function moveToLogin() {
        setPage('login');
        setName('');
        setEmail('');
        setUsername('');
        setPassword('');
    }

    async function handleSignUp() {
        api_client.post('/auth/register', { name, email, username, password })
            .then((res) => {
                switch (res.data.status) {
                    case 201:
                        toast.custom((t) => (
                            <div className={`bg-green-900 border-green-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 ms-36 flex flex-col items-center justify-between gap-3`}>
                                <FaCircleCheck className='text-green-500 text-4xl' />
                                <div className='flex flex-col items-center justify-between'>
                                    <h3 className='text-green-600 text-lg text-center font-semibold flex items-center gap-3 text-nowrap'>Registration Successful!</h3>
                                    <p className='text-center text-green-400 italic'>Redirecting to login page...</p>
                                </div>
                                <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-green-700 text-2xl' /></button>
                            </div>
                        ));
                        setTimeout(() => {
                            moveToLogin();
                        }, 2000);
                        break;
                    case 400:
                        const msg = res.data.error;
                        let margin;
                        if (msg == "Email already exists") {
                            margin = "ms-32";
                        }
                        else if (msg == "Username already exists") {
                            margin = "ms-28";
                        }
                        else if (msg == "Email and Username already exist") {
                            margin = "ms-10";
                        }
                        toast.custom((t) => (
                            <div className={`bg-red-900 border-red-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 ${margin} flex flex-col items-center justify-between gap-3`}>
                                <BiSolidErrorAlt className='text-red-500 text-4xl' />
                                <div className='flex flex-col items-center justify-between'>
                                    <h3 className='text-red-600 text-lg text-center font-semibold flex items-center gap-3'>{res.data.message}</h3>
                                    <p className='text-center text-red-400 font-semibold text-nowrap'>ERROR:<code> </code><span className='font-normal italic'>{res.data.error}</span></p>
                                </div>
                                <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-700 text-2xl' /></button>
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
                                <div className={`bg-red-900 border-red-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 flex flex-col items-center justify-between gap-3`}>
                                    <BiSolidErrorAlt className='text-red-500 text-4xl' />
                                    <h3 className='text-red-600 text-lg text-center font-semibold flex items-center gap-3'>{res.data.message}</h3>
                                    <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-700 text-2xl' /></button>
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
        <div className={`auth-card ${(page == 'register') ? 'flex' : 'sm:flex hidden' /* 'flex' if sign-up */} flex-col items-center justify-between py-3 px-5 h-[70dvh] w-[90%] sm:w-[45%] overflow-y-auto ${(page == 'register') ? 'z-0' : 'z-2' /* 'z-0' if sign-up */}`}>
            <h1 className='text-4xl text-blue-400 font-normal'>Register</h1>
            <form className='h-[90%] pt-5 w-11/12 flex flex-col justify-between'>
                <div className='flex flex-col px-2'>
                    <input className='auth-input1 bg-black text-slate-500 sm:text-black sm:bg-transparent outline-none border-4 rounded-3xl px-3 py-2' id='name' name='name' type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='' />
                    <label className={`auth-label3 ${(page == 'login') && 'hidden'}`} htmlFor="name">Name</label>
                    <input className='auth-input1 bg-black text-slate-500 sm:text-black sm:bg-transparent outline-none border-4 rounded-3xl px-3 py-2' id='email' name='email' type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='' required />
                    <label className={`auth-label3 ${(page == 'login') && 'hidden'}`} htmlFor="email">Email</label>
                    <input className='auth-input1 bg-black text-slate-500 sm:text-black sm:bg-transparent outline-none border-4 rounded-3xl px-3 py-2' id='username' name='username' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='' required />
                    <label className={`auth-label3 ${(page == 'login') && 'hidden'}`} htmlFor="username">Username</label>
                    <div className='flex flex-col'>
                        <div className='auth-input2 bg-black sm:bg-transparent flex items-center justify-between border-4 rounded-3xl overflow-hidden ps-3 h-full w-full'>
                            <input className='outline-none border-none text-slate-500 sm:text-black bg-transparent py-2 w-11/12' id='password2' name='password' type={`${seePass ? 'text' : 'password'}`} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='' required />
                            <button className='p-2 text-2xl text-slate-400' type='button' onPointerUp={(e) => {
                                setSeePass(!seePass);
                            }} onPointerDown={(e) => {
                                setSeePass(!seePass);
                            }}>{seePass ? <RiEyeLine /> : <RiEyeCloseLine />}</button>
                        </div>
                        <label className={`auth-label4 w-3/5 ${(page == 'login') && 'hidden'}`} htmlFor="password2">Password</label>
                    </div>
                </div>
                <div className={`flex flex-col pb-2 ${(page == 'login') && 'hidden'} sm:flex-row items-center justify-around gap-2`}>
                    <button className='auth-button1 bg-blue-600 rounded-md h-10 w-4/6 sm:w-36 text-xl font-semibold' onClick={(e) => {
                        e.preventDefault();
                        if (error == '') {
                            handleSignUp();
                        }
                        else {
                            const length = error.length;
                            const marginLeftD = length < 40 ? 'sm:ms-40' : 'sm:ms-0';
                            toast.custom((t) => (
                                <div className={`bg-red-900 border-red-600 border-2 rounded-lg relative min-h-20 max-w-md ${marginLeftD} p-3 flex flex-col items-center justify-between gap-3`}>
                                    <BiSolidErrorAlt className='text-red-500 text-4xl' />
                                    <h3 className='text-red-600 text-lg text-center font-semibold flex items-center gap-3'>{error}</h3>
                                    <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-700 text-2xl' /></button>
                                </div>
                            ));
                        }
                    }}>Sign Up</button>
                    <span className='block sm:hidden font-medium'>------or------</span>
                    <button className='auth-button2 border-teal-600 border-4 rounded-md h-10 w-4/6 sm:w-36 text-xl text-teal-600 font-semibold' type='button' onClick={() => {
                        moveToLogin();
                    }}>Login</button>
                </div>
            </form>
        </div>
    )
}

export default SignUp