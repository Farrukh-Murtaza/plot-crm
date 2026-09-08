import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/Button";

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
            <div className="w-full max-w-lg text-center">
                {/* Icon */}
                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <SearchX size={40} strokeWidth={1.8} />
                </div>

                {/* Error Code */}
                <p className="text-sm font-semibold tracking-[0.3em] text-primary">
                    ERROR 404
                </p>

                {/* Title */}
                <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">
                    Page not found
                </h1>

                {/* Description */}
                <p className="mx-auto mt-5 max-w-md text-base leading-7 text-muted-foreground">
                    The page you are looking for doesn't exist, has been moved,
                    or the URL may be incorrect.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="min-w-40"
                    >
                        <Home size={18} />
                        Go to Dashboard
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate(-1)}
                        className="min-w-40"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </Button>
                </div>

                {/* Footer */}
                <p className="mt-10 text-sm text-muted-foreground">
                    Royal Estates · Property Management System
                </p>
            </div>
        </main>
    );
};