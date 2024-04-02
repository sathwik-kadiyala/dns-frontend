import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/icon.svg';
import axios from 'axios';

import * as Yup from 'yup'
export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required(),
        password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required')
    })

    async function handleSubmit(e) {
        e.preventDefault();
        const newUser = {
            email,
            password,
            confirmPassword
        }
        try {
            await validationSchema.validate(newUser, { abortEarly: false });

            const response = await axios.post('https://dns-backend-937x.onrender.com/check-email', { email });
            if (response.data.exists) {
                alert("Email already exists");
                return;
            }

            const { data } = await axios.post('https://dns-backend-937x.onrender.com/register', newUser);
            // console.log(data); 

            navigate('/login')


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
    // console.log(errors, password, confirmPassword);

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
                            Create an account
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" >
                            <div>
                                <label htmlFor="email" className="input-label">Your email</label>

                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" id="email" className="input-container" placeholder="name@example.com" />
                                {errors.email && <span className="text-red-700">{errors.email}</span>}
                            </div>
                            <div>
                                <label htmlFor="password" className="input-label">Password</label>

                                <input type="password" value={password} autocomplete="on" onChange={(e) => setPassword(e.target.value)} name="password" id="password" placeholder="••••••••" className="input-container" />
                                {errors.password && <span className="text-red-700">{errors.password}</span>}
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="input-label">Confirm password</label>
                                <input
                                    type="password"
                                    autocomplete="on"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    name="confirm-password"
                                    id="confirm-password"
                                    placeholder="••••••••"
                                    className="input-container"
                                />
                                {errors.confirmPassword && <span className="text-red-700">{errors.confirmPassword}</span>}
                            </div>

                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create an account</button>

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Already have an account? <Link to='/login' className="font-medium text-blue-600 hover:underline dark:text-blue-500">Login here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
