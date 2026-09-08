import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

// Types
interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface LoginResponse {
    success: boolean;
    user?: {
        email: string;
        role: 'admin' | 'customer';
    };
    error?: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Simulate API call
            const response = await simulateLogin(formData.email, formData.password);

            if (response.success && response.user) {
                // Store user data
                localStorage.setItem('user', JSON.stringify(response.user));
                if (formData.rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                navigate('/dashboard');
            } else {
                setError(response.error || 'Invalid email or password');
            }
        } catch (err) {
            setError(`An unexpected error occurred. Please try again. : ${err}`);
        } finally {
            setLoading(false);
        }
    };

    // Mock login function
    const simulateLogin = (email: string, password: string): Promise<LoginResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email === 'admin@example.com' && password === 'password') {
                    resolve({
                        success: true,
                        user: { email, role: 'admin' },
                    });
                } else if (email === 'user@example.com' && password === 'password') {
                    resolve({
                        success: true,
                        user: { email, role: 'customer' },
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'Invalid email or password',
                    });
                }
            }, 1000);
        });
    };

    // Quick fill for demo
    const fillDemoCredentials = (role: 'admin' | 'customer') => {
        setFormData({
            email: role === 'admin' ? 'admin@example.com' : 'user@example.com',
            password: 'password',
            rememberMe: false,
        });
    };

    return (
        <div
            className="min-h-screen flex items-center 
            justify-center bg-linear-to-br from-corporate-black
            via-corporate-dark to-corporate-surface p-4">

            <div className="w-full max-w-md">
                {/* Main Card */}
                <div
                    className="w-full bg-corporate-card
                    rounded-dashboard shadow-modal p-8 
                    borderborder-corporate-border backdrop-blur-sm">

                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block">

                            <div
                                className="w-20 h-20 bg-linear-to-br
                                from-brand to-brand-dark rounded-2xl
                                flex items-center justify-center mx-auto mb-4shadow-brand"
                            >
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>

                            {/* Amber Accent */}
                            <div
                                className="absolute -top-1 -right-1 w-4 h-4 bg-brand-light 
                                rounded-full shadow-lg shadow-brand/30"
                            />
                        </div>

                        <h1
                            className="text-3xl font-bold
                            text-text-primary tracking-tight">
                            Royal Estates
                        </h1>

                        <p
                            className="text-text-secondary text-sm
                            mt-1 font-medium tracking-wide">
                            Property Management System
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div
                            className="mb-4 p-3 bg-status-error/10 text-sm flex items-start 
                            border border-status-error/30 text-red-400 rounded-xl "
                            role="alert"
                        >
                            <svg
                                className="w-5 h-5 mr-2 shrink-0 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>

                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-text-primary mb-1.5"
                            >
                                Email Address
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-text-muted"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                </div>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="admin@example.com"
                                    aria-label="Email address"
                                    className=" w-full pl-10 pr-4 py-3 bg-corporate-dark 
                                    border border-corporate-border rounded-xl text-text-primary 
                                    placeholder:text-text-muted outline-none transition focus:border-brand 
                                    focus:ring-2 focus:ring-brand/20"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-text-primary mb-1.5"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-text-muted"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    aria-label="Password"
                                    className=" w-full pl-10 pr-4 py-3 bg-corporate-dark 
                                    border border-corporate-border rounded-xl text-text-primary 
                                    placeholder:text-text-muted outline-none transition focus:border-brand 
                                    focus:ring-2 focus:ring-brand/20" />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center
                                    text-text-muted hover:text-brand-light transition"
                                    aria-label={
                                        showPassword ? "Hide password" : "Show password"
                                    } >
                                    {/* Your existing eye SVG */}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">

                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded bg-corporate-dark border-corporate-border
                                    text-brand focus:ring-brand/30 cursor-pointer"/>

                                <span className="ml-2 text-sm text-text-secondary group-hover:text-text-primary transition">
                                    Remember me
                                </span>
                            </label>

                            <a
                                href="#"
                                className="text-sm text-brand-light hover:text-brand-hover font-medium 
                                    transition">
                                Forgot password?
                            </a>

                        </div>


                        {/* Submit Button */}
                        <Button disabled={loading} className={'w-full'}>Sign In</Button>
                    </form>

                    {/* Decorative Divider */}
                    <div className="mt-8 pt-6 border-t border-corporate-border relative">

                        <span
                            className="absolute -top-3 left-1/2 -translate-x-1/2
                                 bg-corporate-card px-4 text-brand-light 
                                 text-xs font-bold tracking-wider"
                        >
                            PREMIUM
                        </span>

                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6">

                        <p className="text-xs text-text-muted text-center font-medium">
                            Quick Demo Access
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <Button className={'flex-col'} onClick={() => fillDemoCredentials("admin")} variant='secondary'>
                                <span className="block mb-1">👑 Admin</span>

                                <span className="text-[10px] text-text-muted">
                                    admin@example.com
                                </span>
                            </Button>


                            <Button className={'flex-col'} onClick={() => fillDemoCredentials("customer")} variant='secondary'>
                                <span className="block mb-1">🏠 Customer</span>

                                <span className="text-[10px] text-text-muted">
                                    user@example.com
                                </span>
                            </Button>

                        </div>

                        <p className="mt-3 text-[10px] text-text-muted text-center">
                            Password for both:
                            {" "}
                            <span className="font-mono text-text-secondary font-medium">
                                password
                            </span>
                        </p>

                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-text-muted">
                    © {new Date().getFullYear()} Royal Estates. All rights reserved.
                </p>
            </div >
        </div >
    );
};

export default Login;