import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RxCrossCircled } from "react-icons/rx";
import { BiSolidErrorAlt } from "react-icons/bi";
import { IoWarning, IoLogOut } from "react-icons/io5";
import { SiMyget, SiPostcss } from "react-icons/si";
import { FaMasksTheater, FaCircleCheck } from "react-icons/fa6";
import api_client from '../Utils/ApiClient';
import { useDispatch } from 'react-redux';
import { deleteInfo } from '../Utils/userSlice';
import { wipeIDs } from '../Utils/followingSlice';
import { set, unset } from '../Utils/loginSlice';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation().pathname;
    const dispatch = useDispatch();

    useEffect(() => {
        function checkSession() {  // Check if Session is Valid
            if (!localStorage.getItem('lt')) {
                toast.custom((t) => (
                    <div className={`bg-yellow-900 border-yellow-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 ms-36 flex flex-col items-center justify-between gap-3`}>
                        <IoWarning className='text-yellow-500 text-4xl' />
                        <div className='flex flex-col items-center justify-between'>
                            <h3 className='text-yellow-600 text-lg text-center font-semibold flex items-center gap-3 text-nowrap'>Session Expired</h3>
                            <p className='text-center text-yellow-400 italic'>Redirecting to login page...</p>
                        </div>
                        <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-yellow-700 text-2xl' /></button>
                    </div>
                ));
                setTimeout(() => {
                    dispatch(unset());
                    navigate('/auth');
                }, 2000);
            }
            else if (Date.now() > (Number(localStorage.getItem('lt')) + (60 * 60 * 1000))) {
                toast.custom((t) => (
                    <div className={`bg-yellow-900 border-yellow-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 ms-36 flex flex-col items-center justify-between gap-3`}>
                        <IoWarning className='text-yellow-500 text-4xl' />
                        <div className='flex flex-col items-center justify-between'>
                            <h3 className='text-yellow-600 text-lg text-center font-semibold flex items-center gap-3 text-nowrap'>Session Expired</h3>
                            <p className='text-center text-yellow-400 italic'>Redirecting to login page...</p>
                        </div>
                        <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-yellow-700 text-2xl' /></button>
                    </div>
                ));
                localStorage.removeItem('lt');
                setTimeout(() => {
                    dispatch(unset());
                    navigate('/auth');
                }, 2000);
            }
            else {
                dispatch(set());
            }
        }

        checkSession();

        document.getElementById('menu-top').classList.add('active1');  // Sets initial position of menu
    }, []);

    function handleMenuClick(e) {
        const current = document.getElementsByClassName('menu-clicked')[0];
        current.classList.remove('menu-clicked');
        e.target.classList.add('menu-clicked');
        document.getElementById('bars').children[0].classList.toggle('active');
        document.getElementById('menu-top').classList.toggle('active2');
        document.getElementById('menu-top').classList.toggle('active1');
    }

    async function handleSignOut() {
        api_client.get('/auth/logout')
            .then((res) => {
                switch (res.data.status) {
                    case 200:
                        toast.custom((t) => (
                            <div className='flex justify-between items-center bg-green-900 border-green-600 border-2 rounded-lg py-5 ms-[60%] sm:ms-[75%] px-3 shadow-sm bg-opacity-80 w-[40%] sm:w-[100%]'>
                                <h1 className='text-green-600 font-semibold flex items-center gap-3'><FaCircleCheck className='text-3xl' />Logout Successful!</h1>
                            </div>
                        ));
                        localStorage.removeItem('lt');
                        dispatch(deleteInfo());
                        dispatch(wipeIDs());
                        dispatch(unset());
                        navigate('/auth');
                        break;
                    case 500:
                        toast.custom((t) => (
                            <div className='flex justify-between items-center bg-red-900 border-red-600 border-2 rounded-lg py-5 ms-[20%] sm:ms-0 px-3 shadow-sm bg-opacity-80 w-[80%] sm:w-[100%]'>
                                <h1 className='text-red-600 font-semibold flex items-center gap-3'><BiSolidErrorAlt className='text-3xl' />Encountered an unexpected error. Please try again later!</h1>
                                <button type='button' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-500 text-lg' /></button>
                            </div>
                        ));
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
            });
    }

    return (
        <div className='w-dvw min-h-dvh bg-gray-900'>
            <header className='relative z-50'>
                {/* Mobile view nav (Top)*/}
                <>
                    <nav className='fixed top-0 text-teal-600 py-1 px-2 sm:hidden block shadow-xl w-full'>
                        <div className='flex flex-nowrap items-center justify-between'>
                            <button title='Menu' id='bars' type="button" className='rounded-full' onPointerDown={(e) => {
                                document.getElementById('bars').children[0].classList.toggle('active');
                                document.getElementById('menu-top').classList.toggle('active2');
                                document.getElementById('menu-top').classList.toggle('active1');
                            }}>
                                <div className="bar-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 200 200">
                                        <g strokeWidth="10" strokeLinecap="round">
                                            <path
                                                d="M72 82.286h28.75"
                                                fill="#009100"
                                                fillRule="evenodd"
                                                stroke="#0d9388"
                                            />
                                            <path
                                                d="M100.75 103.714l72.482-.143c.043 39.398-32.284 71.434-72.16 71.434-39.878 0-72.204-32.036-72.204-71.554"
                                                fill="none"
                                                stroke="#0d9388"
                                            />
                                            <path
                                                d="M72 125.143h28.75"
                                                fill="#009100"
                                                fillRule="evenodd"
                                                stroke="#0d9388"
                                            />
                                            <path
                                                d="M100.75 103.714l-71.908-.143c.026-39.638 32.352-71.674 72.23-71.674 39.876 0 72.203 32.036 72.203 71.554"
                                                fill="none"
                                                stroke="#0d9388"
                                            />
                                            <path
                                                d="M100.75 82.286h28.75"
                                                fill="#009100"
                                                fillRule="evenodd"
                                                stroke="#0d9388"
                                            />
                                            <path
                                                d="M100.75 125.143h28.75"
                                                fill="#009100"
                                                fillRule="evenodd"
                                                stroke="#0d9388"
                                            />
                                        </g>
                                    </svg>
                                </div>
                            </button>
                            <figure className='flex items-center cursor-pointer' onClick={() => navigate('/')}>
                                <img src="Logo.jpg" className='w-16 h-16 animate-pulse' draggable="false" alt="" />
                                <h1 className='text-3xl font-bold'>BlogCove</h1>
                            </figure>
                            <button title='Log out' className='py-4 pe-3 ps-5 rounded-full' onClick={(e) => {
                                e.preventDefault();
                                handleSignOut();
                            }}><IoLogOut className='text-3xl text-slate-700' /></button>
                        </div>
                    </nav>
                    <div id="menu-top" className='text-blue-600 hidden sm:hidden sm:mt-0 mt-[15%] fixed top-[5%] sm:absolute font-medium text-sm flex-col items-center justify-start py-2 overflow-hidden w-fit rounded-br-2xl rounded-tr-2xl shadow-md'>
                        <span className={`${location == "/" && "menu-clicked"}`} onClick={(e) => {
                            handleMenuClick(e);
                            navigate('/');
                        }}>Feed</span>
                        <span className={`${location == "/my-blogs" && "menu-clicked"}`} onClick={(e) => {
                            handleMenuClick(e);
                            navigate('/my-blogs');
                        }}>My Blogs</span>
                        <span className={`${location == "/profile" && "menu-clicked"}`} onClick={(e) => {
                            handleMenuClick(e);
                            navigate('/profile');
                        }}>Profile</span>
                    </div>
                </>

                {/* Desktop view nav (Sidebar)*/}
                <nav className='desktop fixed left-0 top-0 bottom-0 hidden sm:flex flex-col items-stretch justify-start h-screen w-20 hover:w-52 px-3 py-6 text-teal-600 overflow-hidden shadow-xl rounded-br-2xl rounded-tr-2xl'>
                    <figure className='flex items-center justify-center cursor-pointer overflow-hidden' onClick={() => navigate('/')}>
                        <img src="Logo.jpg" className='w-12 animate-pulse' draggable="false" alt="" />
                        <h1 className='option-name text-3xl font-bold'>BlogCove</h1>
                    </figure>
                    <aside className='w-full mt-7 flex-grow flex flex-col justify-between items-stretch'>
                        <div className='border-slate-800 border-t-2 border-b-2 w-full flex-grow py-7 mb-7 '>
                            <ul className='flex flex-col items-stretch gap-2'>
                                <li className={`flex items-center justify-start gap-4 ps-3 py-2 cursor-pointer overflow-hidden rounded-md ${location == "/" && "sidebar-clicked"}`} onClick={() => (navigate('/'))}><SiMyget className='text-2xl ps-[2px]' /><span className='option-name font-medium'>Feed</span></li>
                                <li className={`flex items-center justify-start gap-4 ps-3 py-2 cursor-pointer overflow-hidden rounded-md ${location == "/my-blogs" && "sidebar-clicked"}`} onClick={() => (navigate('/my-blogs'))}><SiPostcss className='text-2xl ps-[2px]' /><span className='option-name font-medium text-nowrap'>My Blogs</span></li>
                                <li className={`flex items-center justify-start gap-4 ps-3 py-2 cursor-pointer overflow-hidden rounded-md ${location == "/profile" && "sidebar-clicked"}`} onClick={() => (navigate('/profile'))}><FaMasksTheater className='text-2xl ps-[2px]' /><span className='option-name font-medium'>Profile</span></li>
                            </ul>
                        </div>
                        <button className='btn flex items-center justify-center gap-3 px-3 py-2 w-full text-slate-700 font-medium rounded-md overflow-hidden' onClick={(e) => {
                            e.preventDefault();
                            handleSignOut();
                        }}><IoLogOut className='text-3xl' /><span className='option-name'>Logout</span></button>
                    </aside>
                </nav>
            </header>
            <main className='w-full max-h-[200dvh] min-h-[88dvh] sm:min-h-dvh overflow-y-auto scroll-smooth mt-20 sm:mt-0'>
                <Outlet />
            </main>
            <footer>
            </footer>
        </div>
    )
}

export default Layout