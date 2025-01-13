import React, { useEffect, useState } from 'react'
import { PiUserCircleFill, PiStickerFill } from "react-icons/pi";
import { BiSolidErrorAlt } from "react-icons/bi";
import { IoWarning } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import api_client from '../Utils/ApiClient';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { addId, deleteID } from '../Utils/followingSlice';

const BlogF = ({ blog }) => {
    const [date, setDate] = useState('');

    const dispatch = useDispatch();
    const followingIDs = useSelector((store) => (store.followingIDs));

    useEffect(() => {  // Date Format Change
        let d = new Date(Number(blog.creationDateTime)).toDateString().split(` `);
        setDate(`${d[0]} - ${d[1]} ${d[2]}, ${d[3]}`);
    }, []);

    async function handleFollow() {
        api_client.post('/follow/follow-target', { targetUserId: blog.userId._id })
            .then((res) => {
                switch (res.data.status) {
                    case 201:
                        dispatch(addId(blog.userId._id));
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

    async function handleUnfollow() {
        api_client.post('/follow/unfollow-target', { targetUserId: blog.userId._id })
            .then((res) => {
                switch (res.data.status) {
                    case 200:
                        dispatch(deleteID(blog.userId._id));
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
        <div className='blog-f sm:w-8/12 w-10/12 min-w-52 h-fit shadow-xl bg-green-500 rounded-2xl flex flex-col'>
            <section className='info flex items-center justify-between bg-green-600 rounded-tl-2xl rounded-tr-2xl text-sm ps-2 pe-4 py-2'>
                <div className='flex items-center gap-2'>
                    <PiUserCircleFill className='text-4xl' />
                    <h3 className='font-medium text-lg sm:text-sm'>{blog.userId.username}</h3>
                </div>
                {followingIDs[blog.userId._id] ?
                    <button className='unfollow sm:text-sm text-xs' type="button" onClick={handleUnfollow}>Unfollow</button> :
                    <button className='follow sm:text-sm text-xs' type="button" onClick={handleFollow}>Follow</button>}
            </section>
            <section className='flex flex-col gap-2 p-3'>
                <h2 className='font-semibold text-xl'>{blog.title}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{blog.textBody.join('\n')}</p>
                <blockquote className='text-xs text-right'>Created: <span className='font-semibold'>{date}</span></blockquote>
            </section>
            <section className='reaction self-center flex p-1 w-full md:w-8/12 justify-between items-stretch'>
                <textarea rows={1} maxLength={100} name='comment' className='flex-grow text-sm text-slate-300 italic font-thin py-1 px-3 rounded-tl-2xl rounded-bl-2xl bg-slate-800 border-purple-900 border-t-2 border-b-2 border-l-2 outline-none' placeholder='Write a comment (Dummy feature)' />
                <button type="button" title='Post' className='bg-slate-800 border-purple-900 border-t-2 border-b-2 border-r-2 px-2 rounded-tr-2xl rounded-br-2xl'><PiStickerFill className='text-2xl text-amber-500 text-opacity-60 hover:text-opacity-75' /></button>
            </section>
        </div>
    )
}

export default BlogF
