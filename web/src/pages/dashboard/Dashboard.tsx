import {
    Building2,
    CircleDollarSign,
    House,
    Users,
} from "lucide-react";

import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { StatCard } from "../../components/ui/StatCard";

export const Dashboard = () => {
    return (
        <DashboardLayout>

            {/* Page Header */}

            <div
                className="
                    mb-8
                    flex
                    flex-col
                    justify-between
                    gap-4
                    sm:flex-row
                    sm:items-center
                "
            >
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Welcome back. Here's an overview of your business.
                    </p>
                </div>
            </div>


            {/* Statistics */}

            <div
                className="
                    grid
                    gap-5
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >
                <StatCard
                    title="Total Properties"
                    value="128"
                    icon={Building2}
                    description="All registered properties"
                />

                <StatCard
                    title="Available Properties"
                    value="42"
                    icon={House}
                    description="Currently available"
                />

                <StatCard
                    title="Total Customers"
                    value="356"
                    icon={Users}
                    description="Registered customers"
                />

                <StatCard
                    title="Monthly Revenue"
                    value="$24,500"
                    icon={CircleDollarSign}
                    description="This month's revenue"
                />
            </div>

        </DashboardLayout>
    );
};