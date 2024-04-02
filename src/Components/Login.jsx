import logo from '../assets/icon.svg';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Login({setAuth}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required(),
        password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
    })

    async function handleSubmit(e) {
        e.preventDefault();
        const newUser = {
            email,
            password,
        }
        try {
            await validationSchema.validate(newUser, { abortEarly: false });

            const { data } = await axios.post('https://dns-backend-937x.onrender.com/login', newUser);
            // console.log(data); 
            if (data.result) {
                alert('Enter correct credentials');
            }
            localStorage.setItem('user', JSON.stringify(data))
            setAuth(true);
            navigate('/')


        }
        catch (error) {
            
            // console.log(error.inner)
            if (error.inner) {
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            } else {
                console.error(error); // Log any other unexpected errors
            }

        }
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img src={logo} className=" dark:invert w-8 h-8 mr-2" alt="logo" />
                    DNS Atlas
                </Link>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" >
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>

                                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="input-container" placeholder="name@example.com" />
                                {errors.email && <span className="text-red-700">{errors.email}</span>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>

                                <input type="password" name="password" autocomplete="on" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-container" />
                                {errors.password && <span className="text-red-700">{errors.password}</span>}
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-white ">
                                Don’t have an account yet?
                                <Link to="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
