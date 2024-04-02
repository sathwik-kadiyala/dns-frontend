import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moon from '../assets/moon.svg';
import sun from '../assets/sun.svg';
import logo from '../assets/icon.svg';

export default function Navbar({auth,setAuth, darkMode, setDarkMode }) {
    
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

   
    const handleNavCollapseToggle = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setAuth(false);
    };

    return (
        <nav className='bg-zinc-100 border-gray-200 dark:bg-gray-900'>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to="/" className="flex items-center space-x-3 ">
                    <img src={logo} className='h-8 dark:invert' alt="Logo" />
                    <span className='self-center text-2xl font-semibold whitespace-nowrap dark:invert'>
                        DNS Atlas</span>
                </Link>
                <button onClick={handleNavCollapseToggle} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>

                <div className={`w-full md:block md:w-auto ${isNavCollapsed ? 'hidden' : ''}`} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-zinc-100 md:flex-row md:space-x-8  md:mt-0 md:border-0 md:bg-zinc-100 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <Link to="/" className="nav-items" >Home</Link>
                        </li><li>

                            <Link to="/domains" className="nav-items" >Domains</Link>
                        </li>

                        {auth ?
                            <li>
                                <Link to="/login" className="nav-items" onClick={handleLogout}>Logout</Link>
                            </li>

                            : (<>
                                <li>
                                    <Link to="/login" className="nav-items">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register" className="nav-items">Register</Link>
                                </li>
                            </>)
                        }
                        <div className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                            <button className='h-7 w-5 dark:invert ' onClick={() => setDarkMode(!darkMode)}>
                                <img src={darkMode ? moon : sun} alt="Theme Toggle" />
                            </button>
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
