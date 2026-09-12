import type { Property, PropertyData } from "../types";

// Mock Data
export const mockPlotDetail: PropertyData = {
    id: '1',
    number: '12',
    size: 10,
    block: 'A',
    street: '2',
    status: 'sold',
    price: 2500000,
    ratePerMarla: 250000,
    totalAmount: 2500000,
    isParkFace: true,
    parkFaceCharges: 10,
    isCorner: false,
    cornerCharges: 0,
    dimensions: {
        width: 30,
        length: 50
    },
    owner: {
        id: '1',
        title: 'Mr.',
        name: 'Ahmad Khan',
        relation: 'S/O',
        relationName: 'Muhammad Khan',
        cnic: '12345-6789012-3',
        phone: '+92 300 1234567',
        whatsapp: '+92 300 1234567',
        email: 'ahmad.khan@example.com',
        occupation: 'Business Owner',
        address: 'House #123, Street #4, Phase 1, Royal Enclave, Okara',
        nominee: {
            name: 'Fatima Ahmad',
            title: 'Mrs.',
            relation: 'D/O',
            cnic: '12345-6789012-4',
            phone: '+92 300 7654321',
            email: 'fatima@example.com'
        },
        joinDate: '2024-01-15'
    },
    payments: [
        {
            id: 'p1',
            date: '2024-01-15',
            description: 'Booking Fee',
            receiptNo: 'R-2024-001',
            amount: 250000,
            type: 'booking',
            status: 'paid',
            method: 'cash',
            notes: 'Initial booking fee paid in cash'
        },
        {
            id: 'p2',
            date: '2024-02-01',
            description: '1st Installment',
            receiptNo: 'R-2024-015',
            amount: 250000,
            type: 'installment',
            status: 'paid',
            method: 'bank_transfer',
            notes: 'Transferred via HBL'
        },
        {
            id: 'p3',
            date: '2024-03-01',
            description: '2nd Installment',
            receiptNo: 'R-2024-032',
            amount: 250000,
            type: 'installment',
            status: 'paid',
            method: 'cheque',
            notes: 'Cheque #123456'
        },
        {
            id: 'p4',
            date: '2024-04-01',
            description: '3rd Installment',
            receiptNo: 'R-2024-048',
            amount: 250000,
            type: 'installment',
            status: 'pending',
            method: 'online',
            notes: 'Pending - Due date 2024-04-15'
        },
        {
            id: 'p5',
            date: '2024-05-01',
            description: '4th Installment',
            receiptNo: 'R-2024-063',
            amount: 250000,
            type: 'installment',
            status: 'overdue',
            method: 'bank_transfer',
            notes: 'Overdue - Payment not received'
        },
        {
            id: 'p6',
            date: '2024-06-01',
            description: '5th Installment',
            receiptNo: 'R-2024-078',
            amount: 250000,
            type: 'installment',
            status: 'pending',
            method: 'cash',
            notes: 'Pending'
        },
        {
            id: 'p7',
            date: '2024-01-20',
            description: 'Development Charges',
            receiptNo: 'R-2024-009',
            amount: 100000,
            type: 'other',
            status: 'paid',
            method: 'bank_transfer',
            notes: 'Development charges for plot'
        },
        {
            id: 'p8',
            date: '2024-02-15',
            description: 'Late Payment Penalty',
            receiptNo: 'R-2024-022',
            amount: 25000,
            type: 'penalty',
            status: 'paid',
            method: 'cash',
            notes: 'Penalty for late installment #2'
        }
    ],
    bookingDate: '2024-01-15',
    possessionDate: '2024-06-15',
    totalPaid: 1125000,
    pendingAmount: 1375000,
    installmentPlan: {
        totalInstallments: 10,
        installmentAmount: 10,

        paidInstallments: 3,
        pendingInstallments: 7,
        nextDueDate: '2024-07-01',
        nextDueAmount: 250000
    },
    documents: [
        {
            name: 'CNIC Copy',
            type: 'Identity',
            uploadedAt: '2024-01-15',
            url: '#'
        },
        {
            name: 'Booking Form',
            type: 'Application',
            uploadedAt: '2024-01-15',
            url: '#'
        },
        {
            name: 'Sale Agreement',
            type: 'Legal',
            uploadedAt: '2024-02-01',
            url: '#'
        },
        {
            name: 'Payment Receipt #R-2024-001',
            type: 'Receipt',
            uploadedAt: '2024-01-15',
            url: '#'
        }
    ],
    notes: [
        {
            id: 'n1',
            content: 'Customer visited site with family. Very interested in corner plot.',
            createdAt: '2024-01-10 14:30',
            createdBy: 'Admin'
        },
        {
            id: 'n2',
            content: 'Booking fee paid. Agreement signed.',
            createdAt: '2024-01-15 11:00',
            createdBy: 'Admin'
        },
        {
            id: 'n3',
            content: 'Requested to extend installment deadline by 15 days.',
            createdAt: '2024-03-20 09:15',
            createdBy: 'Sales Team'
        }
    ],
    downPayment: 0,
    installmentFrequency: "monthly",
    planYears: 0,
    planStartDate: ""
};


// Mock data
export const mockProperties: Property[] = [
    {
        id: '1',
        number: '1',
        size: '10',
        block: 'A',
        street: '1',
        status: 'available',
        price: 2500000,
    },
    {
        id: '2',
        number: '2',
        size: '10',
        block: 'A',
        street: '1',
        status: 'sold',
        price: 2800000,
        owner: {
            name: 'Mr. Ahmad Khan',
            phone: '+92 300 1234567',
            email: 'ahmad@example.com'
        },
        bookingDate: '2024-01-15',
        totalPaid: 2800000,
        pendingAmount: 0
    },
    {
        id: '3',
        number: '3',
        size: '12',
        block: 'A',
        street: '1',
        status: 'reserved',
        price: 3200000,
        owner: {
            name: 'Ms. Fatima Ali',
            phone: '+92 321 7654321',
            email: 'fatima@example.com'
        },
        bookingDate: '2024-02-10',
        totalPaid: 1500000,
        pendingAmount: 1700000
    },
    {
        id: '4',
        number: '4',
        size: '10',
        block: 'A',
        street: '1',
        status: 'pending',
        price: 2600000,
        owner: {
            name: 'Mr. Usman Shah',
            phone: '+92 333 9876543',
            email: 'usman@example.com'
        },
        bookingDate: '2024-03-05',
        totalPaid: 500000,
        pendingAmount: 2100000
    },
    {
        id: '5',
        number: '5',
        size: '8',
        block: 'A',
        street: '2',
        status: 'available',
        price: 1800000,
    },
    {
        id: '6',
        number: '6',
        size: '10',
        block: 'A',
        street: '2',
        status: 'sold',
        price: 2200000,
        owner: {
            name: 'Mr. Imran Ali',
            phone: '+92 345 5556666',
            email: 'imran@example.com'
        },
        bookingDate: '2024-01-20',
        totalPaid: 2200000,
        pendingAmount: 0
    },
    {
        id: '7',
        number: '7',
        size: '10',
        block: 'A',
        street: '2',
        status: 'available',
        price: 2300000,
    },
    {
        id: '8',
        number: '8',
        size: '12',
        block: 'A',
        street: '2',
        status: 'reserved',
        price: 3000000,
        owner: {
            name: 'Dr. Sana Khan',
            phone: '+92 312 3334444',
            email: 'sana@example.com'
        },
        bookingDate: '2024-02-25',
        totalPaid: 1000000,
        pendingAmount: 2000000
    },
    {
        id: '9',
        number: '9',
        size: '10',
        block: 'B',
        street: '1',
        status: 'available',
        price: 2400000,
    },
    {
        id: '10',
        number: '10',
        size: '10',
        block: 'B',
        street: '1',
        status: 'sold',
        price: 2700000,
        owner: {
            name: 'Mr. Ali Raza',
            phone: '+92 312 7778888',
            email: 'ali@example.com'
        },
        bookingDate: '2024-03-10',
        totalPaid: 2700000,
        pendingAmount: 0
    },
    {
        id: '11',
        number: '11',
        size: '12',
        block: 'B',
        street: '2',
        status: 'available',
        price: 3100000,
    },
    {
        id: '12',
        number: '12',
        size: '8',
        block: 'B',
        street: '2',
        status: 'pending',
        price: 1900000,
        owner: {
            name: 'Ms. Ayesha Malik',
            phone: '+92 333 9990000',
            email: 'ayesha@example.com'
        },
        bookingDate: '2024-03-20',
        totalPaid: 300000,
        pendingAmount: 1600000
    },
];