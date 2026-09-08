import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { PasswordField } from '../components/ui/PasswordField';
import { Building2, Mail } from 'lucide-react';
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
        console.log(email, password);
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
        <AuthLayout>

            <Card className="p-8">

                {/* Header */}

                <div className="mb-8 text-center">

                    <div
                        className="
                            relative
                            mx-auto
                            mb-4
                            flex
                            h-20
                            w-20
                            items-center
                            justify-center
                            rounded-2xl
                            bg-primary
                            text-primary-foreground
                            shadow-lg
                        "
                    >
                        <Building2 size={38} />
                    </div>

                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-foreground
                        "
                    >
                        Royal Estates
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            font-medium
                            text-muted-foreground
                        "
                    >
                        Property Management System
                    </p>

                </div>
                {/* Error */}
                {error && (
                    <div
                        role="alert"
                        className="
                            mb-6
                            rounded-xl
                            border
                            border-danger/30
                            bg-danger/10
                            px-4
                            py-3
                            text-sm
                            text-danger
                        "
                    >
                        {error}
                    </div>
                )}


                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="admin@example.com"
                        required
                        icon={Mail}
                    />


                    <PasswordField
                        id="password"
                        name="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />


                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >
                        <label
                            className="
                                flex
                                cursor-pointer
                                items-center
                                gap-2
                            "
                        >
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={
                                    formData.rememberMe
                                }
                                onChange={handleChange}
                                className="
                                    h-4
                                    w-4
                                    rounded
                                    border-border
                                    accent-(--primary)
                                "
                            />

                            <span
                                className="
                                    text-sm
                                    text-muted-foreground
                                "
                            >
                                Remember me
                            </span>
                        </label>


                        <Link
                            to="/forgot-password"
                            className=" text-sm font-medium text-primary
                             transition-colors hover:text-primary-hover"
                        >
                            Forgot password?
                        </Link>
                    </div>


                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full py-3.5"
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </Button>

                </form>



            </Card>

        </AuthLayout>
    );
};

export default Login;