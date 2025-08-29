import React, { useState } from 'react';
import { LeftSection } from '../Components/LeftSection';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye , EyeOff } from 'lucide-react';
export const Registration = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });

    const [hoveredField, setHoveredField] = useState(null);
    const [ShowPassword, setShowPassword] = useState(false)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        console.log('Login Submitted:', formData);
        toast.success("Sign Up Succesfuly")
        // Reset form (for now)`
        setFormData({
            firstname: '',
            lastname: '',
            email: '',
            password: '',
        });
    };

    return (
        <div className="flex min-h-screen">
            <LeftSection />

            <div className="w-1/2 flex items-center justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md mx-2 p-8 border border-gray-200 shadow-md rounded-md"
                >
                    <h2 className="text-2xl font-semibold mb-6 ">Create an account</h2>

                    <div
                        className="mb-6 relative"
                        onMouseEnter={() => setHoveredField('firstname')}
                        onMouseLeave={() => setHoveredField(null)}
                    >
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 hover:bg-gray-50"
                        />
                        {hoveredField === 'firstname' && (
                            <span className="absolute top-full left-0 mt-1 text-xs text-gray-500">
                                Enter your first name
                            </span>
                        )}
                    </div>

                    <div
                        className="mb-6 relative"
                        onMouseEnter={() => setHoveredField('lastname')}
                        onMouseLeave={() => setHoveredField(null)}
                    >
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 hover:bg-gray-50"
                        />
                        {hoveredField === 'lastname' && (
                            <span className="absolute top-full left-0 mt-1 text-xs text-gray-500">
                                Enter your last name
                            </span>
                        )}
                    </div>

                    {/* Email Input */}
                    <div
                        className="mb-6 relative"
                        onMouseEnter={() => setHoveredField('email')}
                        onMouseLeave={() => setHoveredField(null)}
                    >
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 hover:bg-gray-50"
                        />
                        {hoveredField === 'email' && (
                            <span className="absolute top-full left-0 mt-1 text-xs text-gray-500">
                                Enter your email address
                            </span>
                        )}
                    </div>

                    {/* Password Input */}
                    <div
                        className="mb-6 relative"
                        onMouseEnter={() => setHoveredField('password')}
                        onMouseLeave={() => setHoveredField(null)}
                    >
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Password
                        </label>
                       <div className="relative">
                                    <input
                                      type={ShowPassword ? 'text' : 'password'}
                                      name="password"
                                      value={formData.password}
                                      onChange={handleChange}
                                      placeholder="Enter Password"
                                      required
                                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 hover:bg-gray-50 pr-10"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!ShowPassword)}
                                      className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                      {ShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                  </div>
                       
                        {hoveredField === 'password' && (
                            <span className="absolute top-full left-0 mt-1 text-xs text-gray-500">
                                Enter your account password
                            </span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type='submit' className='hover:bg-blue-400 hover:text-white border-[1px] border-gray-500 w-full p-2 text-blue-600 '>Sign Up</button>

                    {/* Register Redirect */}
                    <p className="mt-4 text-sm text-center">
                        {` Alredy have an account ? `}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-800 transition"
                        >
                            Log In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
