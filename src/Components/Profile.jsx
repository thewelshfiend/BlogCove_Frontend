import React, { useEffect, useState } from 'react'
import { PiUserCircleFill } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux';
import { unset } from '../Utils/loginSlice';
import api_client from '../Utils/ApiClient';
import { toast } from 'sonner';
import { BiSolidErrorAlt } from "react-icons/bi";
import { RxCrossCircled } from "react-icons/rx";
import { IoWarning } from "react-icons/io5";
import FollowList from './FollowList';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [blogCount, setBlogCount] = useState(0);
    const [followCount, setFollowCount] = useState({});
    const [toggle, setToggle] = useState('following');
    const [skip, setSkip] = useState(0);
    const [page, setPage] = useState(1);

    const { name, email, username } = useSelector((store) => (store.userInfo));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        async function getUserBlogCount() {
            api_client.get('/blog/blog-count')
                .then((res) => {
                    switch (res.data.status) {
                        case 200:
                            setBlogCount(res.data.data);
                            break;
                        case 401:
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
                            break;
                        case 500:
                            console.log(res.data.message);
                            toast.custom((t) => (
                                <div className={`bg-red-900 border-red-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 flex flex-col items-center justify-between gap-3`}>
                                    <BiSolidErrorAlt className='text-red-500 text-4xl' />
                                    <h3 className='text-red-600 text-lg text-center font-semibold flex items-center gap-3'>Encountered an unexpected error!</h3>
                                    <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-700 text-2xl' /></button>
                                </div>
                            ));
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        async function getFollowCount() {
            api_client.get('/follow/follow-count')
                .then((res) => {
                    switch (res.data.status) {
                        case 200:
                            setFollowCount(res.data.data);  // {followers, following}
                            break;
                        case 401:
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
                            break;
                        case 500:
                            console.log(res.data.message);
                            toast.custom((t) => (
                                <div className={`bg-red-900 border-red-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 flex flex-col items-center justify-between gap-3`}>
                                    <BiSolidErrorAlt className='text-red-500 text-4xl' />
                                    <h3 className='text-red-600 text-lg text-center font-semibold flex items-center gap-3'>Encountered an unexpected error!</h3>
                                    <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-700 text-2xl' /></button>
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

        getUserBlogCount();
        getFollowCount();
    }, []);

    return (
        <div className='h-dvh overflow-y-auto px-4 md:px-3 py-7 flex md:flex-row flex-col gap-3 md:gap-6 justify-center items-stretch'>
            <section id='panel1' className='panel bg-purple-900 bg-opacity-50 backdrop-blur-xl rounded-xl md:p-4 md:h-full min-h-[30%] w-full md:w-7/12 lg:w-5/12 overflow-hidden flex md:flex-col items-center min-w-64'>
                <article id='pfp' className='md:w-fit w-[55%] px-2  h-[80%] md:h-[65%] border-r-2 md:border-r-0 border-b-0 md:border-b-2 border-teal-500'>
                    <PiUserCircleFill className='object-cover text-slate-300 h-full w-full' />
                </article>
                <article className='w-full md:py-10 md:px-10 ps-10 pe-2 text-sm md:text-lg flex-grow flex flex-col md:items-center'>
                    <h2 className='text-2xl font-semibold text-sky-500 pb-3'>User Details</h2>
                    <div className='md:text-center'><span className='font-semibold'>Name:</span> <span>{name}</span></div>
                    <div className='md:text-center'><span className='font-semibold'>E-mail:</span> <a className='italic' href={`mailto:${email}`}>{email}</a></div>
                    <div className='md:text-center'><span className='font-semibold'>Username:</span> <span>{username}</span></div>
                </article>
            </section>
            <section id='panel2' className='panel bg-purple-900 bg-opacity-50 backdrop-blur-xl rounded-xl p-3 flex-grow overflow-hidden flex flex-col items-center min-w-fit'>
                <article id='post-stats' className='w-fit md:px-32 px-10 min-h-[12%] border-4 border-blue-900 rounded-sm grid place-items-center text-purple-400 font-medium text-2xl overflow-x-hidden'>
                    <div className='flex items-center gap-2 text-nowrap overflow-x-auto'><h2 id='post-caption'>Posts created:</h2><span className='animate-bounce'>{blogCount}</span></div>
                </article>
                <article id='follow-container' className='relative flex-grow mt-5 rounded-3xl w-full md:w-4/5 px-6 py-5 overflow-y-hidden flex flex-col justify-start'>
                    <div id="firstFilter" className="filter-switch mb-5 min-h-[50px]">
                        <input defaultChecked id="option1" name="options" type="radio" onClick={() => {
                            setToggle('following');
                            setSkip(0);
                            setPage(1);
                        }} />
                        <label className="option" htmlFor="option1">Following{` (${followCount.following != undefined ? followCount.following : 0})`}</label>
                        <input id="option2" name="options" type="radio" onClick={() => {
                            setToggle('followers');
                            setSkip(0);
                            setPage(1);
                        }} />
                        <label className="option" htmlFor="option2">Followers{` (${followCount.followers != undefined ? followCount.followers : 0})`}</label>
                        <span className="background"></span>
                    </div>
                    <div className="follow-list-container overflow-y-auto flex-grow scroll-smooth">
                        <FollowList setFollowCount={setFollowCount} followCount={followCount} toggle={toggle} skip={skip} setSkip={setSkip} page={page} setPage={setPage} />
                    </div>
                </article>
            </section>
        </div>
    )
}

export default Profile