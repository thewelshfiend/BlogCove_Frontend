import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { PiUserCircleFill, PiStickerFill } from "react-icons/pi";
import { BiSolidErrorAlt } from "react-icons/bi";
import { RiDeleteBinFill } from "react-icons/ri";
import { MdEditDocument } from "react-icons/md";
import { IoWarning } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import { FaCircleCheck } from "react-icons/fa6";
import Swal from 'sweetalert2';
import api_client from '../Utils/ApiClient';

const BlogMB = ({ blog, username }) => {
    const [date, setDate] = useState('');
    const [editWindow, setEditWindow] = useState(0);
    const [editedTitle, setEditedTitle] = useState(blog.title);
    const [editedTextBody, setEditedTextBody] = useState(blog.textBody);
    const [isDeleted, setIsDeleted] = useState(false);

    useEffect(() => {
        let d = new Date(Number(blog.creationDateTime)).toDateString().split(` `);  // Date Format Change
        setDate(`${d[0]} - ${d[1]} ${d[2]}, ${d[3]}`);

        setEditWindow((Date.now() - blog.creationDateTime) / (1000 * 60));  // Edit Window
    }, []);

    async function handleEdit() {
        const { value: formValues } = await Swal.fire({
            title: "Enter new data",
            html: `
            <h2>Title</h2>
            <input id="swal-input1" value="${editedTitle}" class="swal2-input alert-input" />
            <h2>Body</h2>
            <textarea id="swal-input2" maxlength="1000" class="swal2-textarea alert-textarea">${editedTextBody.join('\n')}</textarea>
            `,
            confirmButtonText: "OK",
            confirmButtonColor: "#163835",
            focusConfirm: false,
            showCancelButton: true,
            cancelButtonColor: "#d33",
            preConfirm: () => {
                return [
                    document.getElementById("swal-input1").value,
                    document.getElementById("swal-input2").value,
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
                title: "Save changes?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes",
                confirmButtonColor: "#163835",
                cancelButtonText: "No",
            });

            if (confirmResult.isConfirmed) {
                handleEditSave(newTitle.trim(), newBody.trim());
            }
        }
    }

    async function handleEditSave(title, textBody) {
        api_client.post('/blog/edit-blog', { data: { title, textBody: textBody.split('\n') }, blogId: blog._id })
            .then((res) => {
                switch (res.data.status) {
                    case 200:
                        toast.custom((t) => (
                            <div className='flex justify-between items-center bg-green-900 border-green-600 border-2 rounded-lg py-5 ms-[60%] sm:ms-[60%] px-3 shadow-sm bg-opacity-80 w-[40%] sm:w-[130%]'>
                                <h1 className='text-green-600 font-semibold flex items-center gap-3'><FaCircleCheck className='text-3xl' />Blog Updated!</h1>
                            </div>
                        ));
                        setEditedTitle(title);
                        setEditedTextBody(textBody.split('\n'));
                        break;
                    case 400:
                        toast.custom((t) => (
                            <div className={`bg-yellow-900 border-yellow-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 ms-36 flex flex-col items-center justify-between gap-3`}>
                                <IoWarning className='text-yellow-500 text-4xl' />
                                <div className='flex flex-col items-center justify-between'>
                                    <h3 className='text-yellow-600 text-lg text-center font-semibold flex items-center gap-3'>{res.data.message}</h3>
                                    {res.data.error && <p className='text-center text-yellow-400 italic'>{res.data.error}</p>}
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
                    case 403:
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

    async function deleteConfirmation() {
        const confirmResult = await Swal.fire({
            title: "Delete blog?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            confirmButtonColor: "#163835",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                handleDelete();
            }
        });
    }

    async function handleDelete() {
        api_client.post('/blog/delete-blog', { blogId: blog._id })
            .then((res) => {
                switch (res.data.status) {
                    case 200:
                        toast.custom((t) => (
                            <div className='flex justify-between items-center bg-green-900 border-green-600 border-2 rounded-lg py-5 ms-[60%] sm:ms-[60%] px-3 shadow-sm bg-opacity-80 w-[40%] sm:w-[130%]'>
                                <h1 className='text-green-600 font-semibold flex items-center gap-3'><FaCircleCheck className='text-3xl' />Blog Deleted!</h1>
                            </div>
                        ));
                        setIsDeleted(true);
                        break;
                    case 403:
                        toast.custom((t) => (
                            <div className={`bg-yellow-900 border-yellow-600 border-2 rounded-lg relative min-h-20 max-w-md p-3 ms-32 flex flex-col items-center justify-between gap-3`}>
                                <IoWarning className='text-yellow-500 text-4xl' />
                                <h3 className='text-yellow-600 text-lg text-center font-semibold flex items-center gap-3'>{res.data.message}</h3>
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
        <div className={`blog-mb ${isDeleted && 'hidden'} sm:w-8/12 w-10/12 min-w-52 h-fit shadow-xl bg-purple-300 sm:bg-purple-500 rounded-2xl flex flex-col`}>
            <section className='info flex items-center justify-between bg-purple-400 sm:bg-purple-600 rounded-tl-2xl rounded-tr-2xl text-sm ps-2 pe-4 py-2'>
                <div className='flex items-center gap-2'>
                    <PiUserCircleFill className='text-4xl' />
                    <h3 className='font-medium text-sm'>{username}</h3>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='edit sm:text-lg text-sm outline-none' disabled={editWindow > 30} type="button" onClick={handleEdit}><MdEditDocument /></button>
                    <button className='delete sm:text-lg text-sm' type="button" onClick={deleteConfirmation}><RiDeleteBinFill /></button>
                </div>
            </section>
            <section className='flex flex-col gap-2 p-3'>
                <h2 className='font-semibold text-xl'>{editedTitle}</h2>
                <p style={{ whiteSpace: 'pre-line' }}>{editedTextBody.join('\n')}</p>
                <blockquote className='text-xs text-right'>Created: <span className='font-semibold'>{date}</span></blockquote>
            </section>
            <section className='reaction self-center flex p-1 w-full md:w-8/12 justify-between items-stretch'>
                <textarea rows={1} maxLength={100} name='comment' className='flex-grow text-sm text-slate-300 italic font-thin py-1 px-3 rounded-tl-2xl rounded-bl-2xl bg-slate-800 border-purple-900 border-t-2 border-b-2 border-l-2 outline-none' placeholder='Write a comment (Dummy feature)' />
                <button type="button" title='Post' className='bg-slate-800 border-purple-900 border-t-2 border-b-2 border-r-2 px-2 rounded-tr-2xl rounded-br-2xl'><PiStickerFill className='text-2xl text-amber-500 text-opacity-60 hover:text-opacity-75' /></button>
            </section>
        </div>
    )
}

export default BlogMB