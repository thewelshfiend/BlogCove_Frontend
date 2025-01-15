import React, { useEffect, useState } from 'react'
import { IoWarning } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { BiSolidRightArrow, BiSolidLeftArrow, BiSolidErrorAlt } from "react-icons/bi";
import { FaCircleCheck } from "react-icons/fa6";
import { MdFiberNew } from "react-icons/md";
import api_client from '../Utils/ApiClient'
import Loader from './Loader';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import BlogMB from './BlogMB';
import { useDispatch, useSelector } from 'react-redux';
import { unset } from '../Utils/loginSlice';
import { useNavigate } from 'react-router-dom';

const MyBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [skip, setSkip] = useState(0);
    const [showLoader, setShowLoader] = useState(true);
    const [error, setError] = useState('');
    const [noBlogs, setNoBlogs] = useState(false);

    const navigate = useNavigate();
    const username = useSelector((store) => (store.userInfo.username));
    const dispatch = useDispatch();

    useEffect(() => {  // Fetches user's blogs
        async function getBlogs() {
            setShowLoader(true);
            api_client.get(`/blog/get-my-blogs?skip=${skip}`)
                .then((res) => {
                    switch (res.data.status) {
                        case 200:
                            setError('');
                            setNoBlogs(false);
                            setBlogs(res.data.data);
                            break;
                        case 204:
                            setNoBlogs(true);
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

    async function handleInput() {
        const { value: formValues } = await Swal.fire({
            title: "Enter data",
            html: `
                <h2>Title</h2>
                <input id="swal-input1-o" class="swal2-input alert-input" />
                <h2>Body</h2>
                <textarea id="swal-input2-o" maxlength="1000" class="swal2-textarea alert-textarea"></textarea>
                `,
            confirmButtonText: "OK",
            confirmButtonColor: "#163835",
            focusConfirm: false,
            showCancelButton: true,
            cancelButtonColor: "#d33",
            preConfirm: () => {
                return [
                    document.getElementById("swal-input1-o").value,
                    document.getElementById("swal-input2-o").value,
                ];
            },
        });

        if (formValues) {
            const [newTitle, newBody] = formValues;

            // Validation: Check if either field is empty
            if (!newTitle.trim() || !newBody.trim()) {
                await Swal.fire({
                    title: "Error",
                    text: "No field must be empty.",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#163835",
                });
                return;
            }

            // Validation: Title length should be between 3 and 100 characters
            if (newTitle.length < 3 || newTitle.length > 100) {
                await Swal.fire({
                    title: "Error",
                    text: "Title must be between 3 and 100 characters.",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#163835",
                });
                return;
            }

            // Validation: Body length should be between 5 and 1000 characters
            if (newBody.length < 5 || newBody.length > 1000) {
                await Swal.fire({
                    title: "Error",
                    text: "Body must be between 5 and 1000 characters.",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#163835",
                });
                return;
            }

            // Confirm save
            const confirmResult = await Swal.fire({
                title: "Create blog?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
                confirmButtonColor: "#163835",
                cancelButtonText: "No",
            });

            if (confirmResult.isConfirmed) {
                handleCreateNew(newTitle.trim(), newBody.trim());
            }
        }
    }

    async function handleCreateNew(title, textBody) {
        api_client.post('/blog/create-blog', { title, textBody: textBody.split('\n') })
            .then((res) => {
                switch (res.data.status) {
                    case 201:
                        toast.custom((t) => (
                            <div className='flex justify-between items-center bg-green-900 border-green-600 border-2 rounded-lg py-5 ms-[60%] sm:ms-[60%] px-3 shadow-sm bg-opacity-80 w-[40%] sm:w-[100%]'>
                                <h1 className='text-green-600 font-semibold flex items-center gap-3'><FaCircleCheck className='text-3xl' />New Blog Created!</h1>
                            </div>
                        ));
                        setBlogs((prevBlogs) => [res.data.data, ...prevBlogs]);
                        setSkip(0);
                        setPage(1);
                        if (noBlogs) {
                            setNoBlogs(false);
                            setError('');
                        }
                        else {
                            document.getElementById('my-blogs-container').scrollTop = 0;
                        }
                        break;
                    case 400:
                        toast.custom((t) => (
                            <div className={`bg-yellow-900 border-yellow-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 ms-36 flex flex-col items-center justify-between gap-3`}>
                                <IoWarning className='text-yellow-500 text-4xl' />
                                <div className='flex flex-col items-center justify-between'>
                                    <h3 className='text-yellow-600 text-lg text-center font-semibold flex items-center gap-3'>{res.data.message}</h3>
                                    <p className='text-center text-yellow-400 italic'>{res.data.error}</p>
                                </div>
                                <button type='button' className='absolute right-0 top-0' onClick={() => toast.dismiss(t)}><RxCrossCircled className='text-yellow-700 text-2xl' /></button>
                            </div>
                        ));
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
            {showLoader ? <Loader /> :
                error != '' ?
                    <div className='grid place-items-center h-[70dvh] sm:h-dvh text-lg'>
                        <h1 className='error-msg text-center ps-4 text-2xl text-red-600'>{error}</h1>
                    </div > :
                    <div id='my-blogs-container' className='h-dvh overflow-y-auto px-4 sm:px-0 py-7 flex flex-col gap-7 items-center scroll-smooth'>
                        {blogs.map((blog) => {
                            return <BlogMB key={blog._id} blog={blog} username={username} />
                        })}
                    </div>
            }
            <div className='fixed sm:bottom-4 sm:left-24 bottom-10 left-1 flex flex-col sm:flex-row justify-center items-center bg-purple-950 bg-opacity-40 hover:bg-opacity-80 backdrop-blur-lg px-3 py-1 rounded-lg'>
                <button className="hover:text-blue-800" type='button' onClick={() => {
                    if (page > 1) {
                        setPage(page - 1);
                        setSkip(skip - 5);
                        setNoBlogs(false);
                    }
                }}><BiSolidLeftArrow /></button>
                <span className='text-sm text-center text-blue-500 sm:w-20 sm:py-0 py-2'><span className='sm:inline hidden'>Page </span>{page}</span>
                <button className="hover:text-blue-800" type='button' onClick={() => {
                    if (error == '') {
                        setPage(page + 1);
                        setSkip(skip + 5);
                    }
                }}><BiSolidRightArrow /></button>
            </div>
            <div className={`fixed ${(skip == 0 && noBlogs) ? 'rounded-full top-[53dvh] sm:top-[55dvh] sm:right-[43.5dvw] right-[38dvw]' : 'rounded top-[53dvh] sm:top-[48dvh] sm:right-10 right-2'} bg-blue-900 hover:bg-blue-700`} style={{ display: `${(skip > 0 && noBlogs) ? 'none' : 'block'}` }}>
                <button className={`text-gray-950 flex sm:px-3 ${skip == 0 && noBlogs && 'px-2'} items-center outline-none`} type="button" onClick={handleInput}><span className={`${(skip == 0 && noBlogs) ? 'inline' : 'hidden'} sm:inline text-lg`}>Create</span><MdFiberNew className='text-4xl' /></button>
            </div>
        </>
    )
}

export default MyBlogs