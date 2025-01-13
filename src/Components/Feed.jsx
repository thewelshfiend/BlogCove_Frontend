import React, { useEffect, useState } from 'react'
import BlogF from './BlogF';
import { IoWarning } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { BiSolidRightArrow, BiSolidLeftArrow, BiSolidErrorAlt } from "react-icons/bi";
import api_client from '../Utils/ApiClient'
import Loader from './Loader';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { initializeIDs } from '../Utils/followingSlice';
import { unset } from '../Utils/loginSlice';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [skip, setSkip] = useState(0);
    const [showLoader, setShowLoader] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {  // Fetches blogs
        async function getBlogs() {
            setShowLoader(true);
            api_client.get(`/blog/get-blogs?skip=${skip}`)
                .then((res) => {
                    switch (res.data.status) {
                        case 200:
                            setError('');
                            setBlogs(res.data.data);
                            break;
                        case 204:
                            setError(res.data.message);
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
                    setShowLoader(false);
                })
                .catch((err) => {
                    console.log(err);
                    setError("Something went wrong...");
                    toast.custom((t) => (
                        <div className='flex justify-between items-center bg-red-900 border-red-600 border-2 rounded-lg py-5 ms-[45%] sm:ms-[65%] px-3 shadow-sm bg-opacity-80 w-[55%] sm:w-[130%]'>
                            <h1 className='text-red-600 font-semibold flex items-center gap-3'><BiSolidErrorAlt className='text-2xl' />{err.message}</h1>
                            <button type='button' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-red-500 text-lg' /></button>
                        </div>
                    ));
                });
        }

        getBlogs();
    }, [skip]);

    useEffect(() => {  // Fetches following IDs
        async function getFollowingIDs() {
            api_client.get('/follow/following-ids')
                .then((res) => {
                    if (res.data.status == 200) {
                        const map = {};
                        res.data.data.forEach(id => {
                            map[id] = true; // Mark as following
                        });
                        dispatch(initializeIDs(map));
                    }
                    else if (res.data.message) {
                        console.log(res.data.message);
                    }
                    else {
                        console.log(res.data.error);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        getFollowingIDs();
    }, []);

    return (
        <>
            {showLoader ? <Loader /> :
                error != '' ?
                    <div className='grid place-items-center h-[70dvh] sm:h-dvh text-lg'>
                        <h1 className='error-msg text-center ps-4 text-2xl text-red-600'>{error}</h1>
                    </div > :
                    <div className='h-dvh overflow-y-auto px-4 sm:px-0 py-7 flex flex-col gap-7 items-center scroll-smooth'>
                        {blogs.map((blog) => {
                            return <BlogF key={blog._id} blog={blog} />
                        })}
                    </div>
            }
            <div className='fixed sm:bottom-4 sm:left-24 bottom-1 left-1 flex flex-col sm:flex-row justify-center items-center bg-purple-950 bg-opacity-40 backdrop-blur-lg px-3 py-1 rounded-lg'>
                <button className="hover:text-blue-800" type='button' onClick={() => {
                    if (page > 1) {
                        setPage(page - 1);
                        setSkip(skip - 5);
                    }
                }}><BiSolidLeftArrow /></button>
                <span className='text-sm text-center text-blue-500 sm:w-20 pb-'><span className='sm:inline hidden'>Page </span>{page}</span>
                <button className="hover:text-blue-800" type='button' onClick={() => {
                    if (error == '') {
                        setPage(page + 1);
                        setSkip(skip + 5);
                    }
                }}><BiSolidRightArrow /></button>
            </div>
        </>
    )
}

export default Feed