import React, { useEffect, useState } from 'react'
import api_client from '../Utils/ApiClient';
import LoaderMini from './LoaderMini';
import { BiSolidRightArrow, BiSolidLeftArrow, BiSolidErrorAlt } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { PiUserCircleFill } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux';
import { unset } from '../Utils/loginSlice';
import { addId, deleteID } from '../Utils/followingSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const FollowList = ({ setFollowCount, followCount, toggle, skip, setSkip, page, setPage }) => {
    const [showLoader, setShowLoader] = useState(true);
    const [followingList, setFollowingList] = useState([]);
    const [followersList, setFollowersList] = useState([]);
    const [error, setError] = useState('');
    const [maxPage, setMaxPage] = useState(1);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const followingIDs = useSelector((store) => (store.followingIDs));

    useEffect(() => {
        if (toggle == 'following') {
            setMaxPage(Math.ceil(followCount.following / 5));
        } else {
            setMaxPage(Math.ceil(followCount.followers / 5));
        }
    }, [followCount, toggle]);

    useEffect(() => {
        setShowLoader(true);

        if (toggle == 'following') {
            getFollowing();
        } else {
            getFollowers();
        }

        async function getFollowing() {
            api_client.get(`/follow/following-list?skip=${skip}`)
                .then((res) => {
                    switch (res.data.status) {
                        case 200:
                            setFollowingList(res.data.data);
                            setError('');
                            setShowLoader(false);
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
                        case 204:
                            setShowLoader(false);
                            setError('Yet to follow anyone');
                            break;
                        case 500:
                            console.log(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        async function getFollowers() {
            api_client.get(`/follow/follower-list?skip=${skip}`)
                .then((res) => {
                    switch (res.data.status) {
                        case 200:
                            setFollowersList(res.data.data);
                            setError('');
                            setShowLoader(false);
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
                        case 204:
                            setShowLoader(false);
                            setError('No followers yet');
                            break;
                        case 500:
                            console.log(res.data.message);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [skip, toggle]);

    async function handleFollow(targetUserId) {
        api_client.post('/follow/follow-target', { targetUserId })
            .then((res) => {
                switch (res.data.status) {
                    case 201:
                        dispatch(addId(targetUserId));
                        setFollowCount({ ...followCount, following: followCount.following + 1 });
                        break;
                    case 429:
                        toast.custom((t) => (
                            <div className={`bg-yellow-900 border-yellow-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 ms-32 flex flex-col items-center justify-between gap-3`}>
                                <IoWarning className='text-yellow-500 text-4xl' />
                                <h3 className='text-yellow-600 text-lg text-center font-semibold flex items-center gap-3'>{res.data.message}</h3>
                                <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-yellow-700 text-2xl' /></button>
                            </div>
                        ));
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
                    default:
                        toast.custom((t) => (
                            <div className={`bg-yellow-900 border-yellow-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 ms-32 flex flex-col items-center justify-between gap-3`}>
                                <IoWarning className='text-yellow-500 text-4xl' />
                                <div className='flex flex-col items-center justify-between'>
                                    <h3 className='text-yellow-600 text-lg text-center font-semibold flex items-center gap-3 text-nowrap'>{res.data.message}</h3>
                                    <p className='text-center text-nowrap text-yellow-400 italic'>{res.data.error}</p>
                                </div>
                                <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-yellow-700 text-2xl' /></button>
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

    async function handleUnfollow(targetUserId) {
        api_client.post('/follow/unfollow-target', { targetUserId })
            .then((res) => {
                switch (res.data.status) {
                    case 200:
                        dispatch(deleteID(targetUserId));
                        setFollowCount({ ...followCount, following: followCount.following - 1 });
                        break;
                    case 429:
                        toast.custom((t) => (
                            <div className={`bg-yellow-900 border-yellow-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 ms-32 flex flex-col items-center justify-between gap-3`}>
                                <IoWarning className='text-yellow-500 text-4xl' />
                                <h3 className='text-yellow-600 text-lg text-center font-semibold flex items-center gap-3'>{res.data.message}</h3>
                                <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-yellow-700 text-2xl' /></button>
                            </div>
                        ));
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
                    case 400:
                        toast.custom((t) => (
                            <div className={`bg-yellow-900 border-yellow-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 ms-32 flex flex-col items-center justify-between gap-3`}>
                                <IoWarning className='text-yellow-500 text-4xl' />
                                <div className='flex flex-col items-center justify-between'>
                                    <h3 className='text-yellow-600 text-lg text-center font-semibold flex items-center gap-3 text-nowrap'>{res.data.message}</h3>
                                    <p className='text-center text-nowrap text-yellow-400 italic'>{res.data.error}</p>
                                </div>
                                <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-yellow-700 text-2xl' /></button>
                            </div>
                        ));
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

    return (
        <>
            {showLoader ? <LoaderMini /> :
                error != '' ?
                    <div className='grid place-items-center h-[80%]'>
                        <h1 className='error-msg-mini text-center ps-4 text-lg text-red-600'>{error}</h1>
                    </div > :
                    <div className='px-2 md:h-[91%] h-[85%] flex flex-col items-stretch gap-4'>
                        {toggle == 'following' ? followingList.map((following) => {
                            return (
                                <div key={following._id} className='follow-card flex items-center justify-between rounded-2xl px-4 md:py-2 min-h-fit min-w-fit'>
                                    <div className='lg:h-16 h-14 min-w-fit flex items-center gap-2'>
                                        <PiUserCircleFill className='text-2xl md:w-full w-10 h-full' />
                                        <h3 className='lg:text-lg text-sm font-semibold text-nowrap'>{following.name}</h3>
                                    </div>
                                    {followingIDs[following._id] ?
                                        <button className='unfollow-mini sm:text-sm text-xs' type="button" onClick={() => {
                                            handleUnfollow(following._id);
                                        }}>Unfollow</button> :
                                        <button className='follow-mini sm:text-sm text-xs' type="button" onClick={() => {
                                            handleFollow(following._id);
                                        }}>Follow</button>}
                                </div>
                            )
                        }) : followersList.map((follower) => {
                            return (
                                <div key={follower._id} className='follow-card flex items-center justify-between rounded-2xl px-4 md:py-2 overflow-x-hidden min-h-fit min-w-fit'>
                                    <div className='lg:h-16 h-14 min-w-fit flex items-center gap-2'>
                                        <PiUserCircleFill className='text-2xl md:w-full w-10 h-full' />
                                        <h3 className='lg:text-lg text-sm font-semibold text-nowrap'>{follower.name}</h3>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
            }
            <button
                className={`absolute left-0 top-[50%] hover:text-blue-800 bg-purple-700 hover:bg-opacity-45 bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded-lg ${page === 1 ? 'hidden' : ''}`}
                type="button"
                onClick={() => {
                    if (page > 1) {
                        setPage((prev) => prev - 1);
                        setSkip((prev) => prev - 5);
                    }
                }}
            >
                <BiSolidLeftArrow />
            </button>
            <button
                className={`absolute right-0 top-[50%] hover:text-blue-800 bg-purple-700 hover:bg-opacity-45 bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded-lg ${page === maxPage || error ? 'hidden' : ''}`}
                type="button"
                onClick={() => {
                    if (!error && page < maxPage) {
                        setPage((prev) => prev + 1);
                        setSkip((prev) => prev + 5);
                    }
                }}
            >
                <BiSolidRightArrow />
            </button>

        </>
    )
}

export default FollowList