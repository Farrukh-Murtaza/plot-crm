import {
    ArrowLeft,
    CheckCircle2,
    KeyRound,
    Mail,
    MessageCircle,
    Smartphone,
} from "lucide-react";

import {
    type FormEvent,
    useState,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { TextField } from "../components/ui/TextField";

type ResetMethod = "email" | "whatsapp";

export const ForgotPassword = () => {
    const [resetMethod, setResetMethod] =
        useState<ResetMethod>("email");

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleMethodChange = (
        method: ResetMethod
    ) => {
        setResetMethod(method);
        setError("");
        setSubmitted(false);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            /*
             * Replace this with your API request.
             *
             * Email:
             *
             * await axios.post("/api/forgot-password", {
             *     email,
             * });
             *
             * WhatsApp OTP:
             *
             * await axios.post("/api/password/send-otp", {
             *     phone,
             *     channel: "whatsapp",
             * });
             */

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );

            setSubmitted(true);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const useAnotherMethod = () => {
        setSubmitted(false);

        setResetMethod((currentMethod) =>
            currentMethod === "email"
                ? "whatsapp"
                : "email"
        );
    };

    return (
        <AuthLayout>
            <Card className="p-6 sm:p-8">

                {!submitted ? (
                    <>
                        {/* Header */}

                        <div className="mb-8 text-center">
                            <div
                                className="
                                    mx-auto
                                    mb-5
                                    flex
                                    size-16
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-primary/10
                                    text-primary
                                "
                            >
                                <KeyRound
                                    size={30}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <h1 className="text-2xl font-bold text-foreground">
                                Reset your password
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Choose how you would like to
                                verify your account.
                            </p>
                        </div>


                        {/* Reset Method Selector */}

                        <div className="mb-6 grid grid-cols-2 gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    handleMethodChange("email")
                                }
                                className={`
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    p-4
                                    transition-colors
                                    ${resetMethod === "email"
                                        ? `
                                                border-primary
                                                bg-primary/10
                                                text-primary
                                            `
                                        : `
                                                border-border
                                                bg-surface
                                                text-muted-foreground
                                                hover:bg-muted
                                                hover:text-foreground
                                            `
                                    }
                                `}
                            >
                                <Mail size={22} />

                                <span className="text-sm font-medium">
                                    Email
                                </span>
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    handleMethodChange("whatsapp")
                                }
                                className={`
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    p-4
                                    transition-colors
                                    ${resetMethod === "whatsapp"
                                        ? `
                                                border-primary
                                                bg-primary/10
                                                text-primary
                                            `
                                        : `
                                                border-border
                                                bg-surface
                                                text-muted-foreground
                                                hover:bg-muted
                                                hover:text-foreground
                                            `
                                    }
                                `}
                            >
                                <MessageCircle size={22} />

                                <span className="text-sm font-medium">
                                    WhatsApp OTP
                                </span>
                            </button>

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


                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {resetMethod === "email" ? (
                                <>
                                    <TextField
                                        id="email"
                                        name="email"
                                        type="email"
                                        label="Email Address"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="you@example.com"
                                        icon={Mail}
                                        autoComplete="email"
                                        required
                                    />

                                    <Button
                                        type="submit"
                                        loading={loading}
                                        className="w-full"
                                    >
                                        <Mail size={18} />

                                        Send Reset Link
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <TextField
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        label="WhatsApp Number"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(
                                                event.target.value
                                            )
                                        }
                                        placeholder="+1 215 555 1234"
                                        icon={Smartphone}
                                        autoComplete="tel"
                                        required
                                    />

                                    <p className="-mt-3 text-xs text-muted-foreground">
                                        Enter the mobile number
                                        associated with your account.
                                    </p>

                                    <Button
                                        type="submit"
                                        loading={loading}
                                        className="w-full"
                                    >
                                        <MessageCircle size={18} />

                                        Send OTP on WhatsApp
                                    </Button>
                                </>
                            )}

                        </form>


                        {/* Back to Login */}

                        <div className="mt-6 text-center">
                            <Link
                                to="/"
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-muted-foreground
                                    transition-colors
                                    hover:text-primary
                                "
                            >
                                <ArrowLeft size={16} />

                                Back to Sign In
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="py-4 text-center">

                        {/* Success Icon */}

                        <div
                            className="
                                mx-auto
                                mb-5
                                flex
                                size-16
                                items-center
                                justify-center
                                rounded-full
                                bg-success/10
                                text-success
                            "
                        >
                            <CheckCircle2
                                size={34}
                                strokeWidth={1.8}
                            />
                        </div>


                        {/* Email Success */}

                        {resetMethod === "email" ? (
                            <>
                                <h1 className="text-2xl font-bold text-foreground">
                                    Check your email
                                </h1>

                                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                                    If an account exists with
                                    <span className="font-medium text-foreground">
                                        {" "}
                                        {email}
                                    </span>
                                    , we've sent instructions to
                                    reset your password.
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-foreground">
                                    Check WhatsApp
                                </h1>

                                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                                    If an account exists with
                                    <span className="font-medium text-foreground">
                                        {" "}
                                        {phone}
                                    </span>
                                    , we've sent a verification
                                    code to your WhatsApp number.
                                </p>
                            </>
                        )}


                        {/* Actions */}

                        <div className="mt-8 space-y-3">

                            {resetMethod === "whatsapp" && (
                                <Button
                                    type="button"
                                    className="w-full"
                                    onClick={() => {
                                        navigate("/verify-otp", {
                                            state: {
                                                method: "whatsapp",
                                                contact: phone,
                                            },
                                        });
                                    }}
                                >
                                    Verify OTP
                                </Button>
                            )}

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={useAnotherMethod}
                                className="w-full"
                            >
                                Use Another Method
                            </Button>

                        </div>


                        {/* Back to Login */}

                        <div className="mt-5">
                            <Link
                                to="/"
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-medium
                                    text-primary
                                    transition-colors
                                    hover:text-primary-hover
                                "
                            >
                                <ArrowLeft size={16} />

                                Back to Sign In
                            </Link>
                        </div>

                    </div>
                )}

            </Card>
        </AuthLayout>
    );
};