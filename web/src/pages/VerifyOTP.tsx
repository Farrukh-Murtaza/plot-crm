import {
    ArrowLeft,
    CheckCircle2,
    Clock,

    Shield,
    XCircle,
} from "lucide-react";
import {
    type FormEvent,
    useState,
    useEffect,
    useRef,
    useMemo,
} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

// OTP input component with proper TypeScript refs
const OTPInput = ({
    length = 6,
    onComplete,
    isSubmitting,
}: {
    length?: number;
    onComplete: (otp: string) => void;
    isSubmitting: boolean;
}) => {
    const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
    // ✅ Fixed: Use MutableRefObject<HTMLInputElement | null>[]
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // ✅ Initialize refs array with correct length
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-advance to next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if all fields are filled
        if (newOtp.every((digit) => digit !== "")) {
            onComplete(newOtp.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();
        const digits = pastedData.replace(/\D/g, "").slice(0, length);

        if (digits.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < digits.length && i < length; i++) {
                newOtp[i] = digits[i];
            }
            setOtp(newOtp);
            const nextIndex = Math.min(digits.length, length - 1);
            inputRefs.current[nextIndex]?.focus();

            // Check if complete
            if (newOtp.every((digit) => digit !== "")) {
                onComplete(newOtp.join(""));
            }
        }
    };

    // ✅ Fixed: Proper ref callback that returns void
    const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
        inputRefs.current[index] = el;
    };

    return (
        <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={setInputRef(index)} // ✅ Use the ref callback
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isSubmitting}
                    autoFocus={index === 0}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    className={`
                        w-12 h-14 text-center text-xl font-bold rounded-xl border-2
                        bg-surface dark:bg-surface-elevated
                        text-foreground 
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-primary/50
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${digit ? "border-primary" : "border-border dark:border-border"}
                        ${isSubmitting ? "opacity-50" : ""}
                    `}
                    aria-label={`OTP digit ${index + 1}`}
                />
            ))}
        </div>
    );
};

// Main component
export const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Use useMemo to extract state from location (no setState in effect)
    const locationState = useMemo(() => {
        const state = location.state as {
            method?: "email" | "whatsapp";
            contact?: string
        } | null;
        return {
            method: state?.method || "email",
            contact: state?.contact || "",
        };
    }, [location.state]);

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);

    // Use the memoized values directly
    const verificationMethod = locationState.method;
    const contactInfo = locationState.contact;

    // Resend timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleOTPComplete = (value: string) => {
        setOtp(value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (otp.length < 6) {
            setError("Please enter the complete 6-digit OTP");
            return;
        }

        setLoading(true);
        setError("");

        try {
            /*
             * Replace this with your API request:
             *
             * await axios.post("/api/password/verify-otp", {
             *     otp,
             *     method: verificationMethod,
             *     contact: contactInfo,
             * });
             */

            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Simulate validation
            if (otp === "123456") {
                setSubmitted(true);
                // Navigate to reset password after success
                setTimeout(() => {
                    navigate("/reset-password", {
                        state: {
                            method: verificationMethod,
                            contact: contactInfo
                        },
                    });
                }, 2000);
            } else {
                setError("Invalid OTP. Please try again.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to verify OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;

        setLoading(true);
        setError("");

        try {
            /*
             * Replace with your API:
             *
             * await axios.post("/api/password/resend-otp", {
             *     method: verificationMethod,
             *     contact: contactInfo,
             * });
             */

            await new Promise((resolve) => setTimeout(resolve, 1000));
            setResendCooldown(60);
            setError("");
        } catch (err) {
            setError(`Failed to resend OTP. Please try again. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const getMethodLabel = () => {
        return verificationMethod === "email" ? "Email" : "WhatsApp";
    };

    const getMethodContact = () => {
        return contactInfo || (verificationMethod === "email"
            ? "your-email@example.com"
            : "+1 215 555 1234"
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
                                <Shield size={30} strokeWidth={1.8} />
                            </div>

                            <h1 className="text-2xl font-bold text-foreground ">
                                Verify OTP
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-neutral-400">
                                Enter the 6-digit code sent to your{" "}
                                <span className="font-medium text-foreground ">
                                    {getMethodLabel()}
                                </span>
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground dark:text-neutral-500">
                                {getMethodLabel()}:{" "}
                                <span className="font-medium text-foreground dark:text-neutral-300">
                                    {getMethodContact()}
                                </span>
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div
                                role="alert"
                                className="
                                    mb-6
                                    flex
                                    items-start
                                    gap-3
                                    rounded-xl
                                    border
                                    border-danger/30
                                    bg-danger/10
                                    px-4
                                    py-3
                                    text-sm
                                    text-danger
                                    dark:border-danger/20
                                    dark:bg-danger/5
                                "
                            >
                                <XCircle size={18} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* OTP Form */}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-muted-foreground dark:text-neutral-400">
                                        Enter OTP
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={resendCooldown > 0 || loading}
                                        className="
                                            text-sm font-medium
                                            text-primary hover:text-primary-hover
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            transition-colors
                                        "
                                    >
                                        {resendCooldown > 0 ? (
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {resendCooldown}s
                                            </span>
                                        ) : (
                                            "Resend OTP"
                                        )}
                                    </button>
                                </div>

                                <OTPInput
                                    length={6}
                                    onComplete={handleOTPComplete}
                                    isSubmitting={loading}
                                />

                                <p className="text-center text-xs text-muted-foreground dark:text-neutral-500">
                                    Didn't receive the code? Check your spam folder or try again.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                loading={loading}
                                className="w-full"
                                disabled={otp.length < 6}
                            >
                                <CheckCircle2 size={18} />
                                Verify OTP
                            </Button>
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
                                    dark:text-neutral-400
                                    dark:hover:text-primary
                                "
                            >
                                <ArrowLeft size={16} />
                                Back to Sign In
                            </Link>
                        </div>
                    </>
                ) : (
                    // Success State
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
                                animate-pulse
                            "
                        >
                            <CheckCircle2 size={34} strokeWidth={1.8} />
                        </div>

                        <h1 className="text-2xl font-bold text-foreground ">
                            OTP Verified! 🎉
                        </h1>

                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground dark:text-neutral-400">
                            Your identity has been confirmed. Redirecting you to reset your password...
                        </p>

                        {/* Loading indicator */}
                        <div className="mt-6 flex justify-center">
                            <div className="w-12 h-1 bg-primary/20 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" />
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </AuthLayout>
    );
};