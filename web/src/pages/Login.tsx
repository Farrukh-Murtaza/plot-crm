import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { PasswordField } from '../components/ui/PasswordField';
import { CircleX } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { Card } from '../components/ui/Card';

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



    return (
        <AuthLayout >

            <Card className="p-8">

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


                {error && (
                    <div
                        className="mb-4 p-3 bg-status-error/10 text-sm flex items-center 
                            border border-status-error/30 text-red-400 rounded-xl "
                        role="alert"
                    >
                        <CircleX className='mr-3' />

                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit} className="space-y-6">

                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="admin@example.com"
                        required
                        icon={
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
                        }
                    />


                    <PasswordField
                        id='password'
                        label='Password'
                        placeholder="••••••••"

                    />



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

            </Card >

            <p className="mt-6 text-center text-xs text-text-muted">
                © {new Date().getFullYear()} Royal Estates. All rights reserved.
            </p>

        </AuthLayout >
    );
};

export default Login;