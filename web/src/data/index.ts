import type { OwnerDetail, PropertyData } from "../types";

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


const TITLE_PREFIXES = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.'];

/** Splits a "Mr. Ahmad Khan"-style string into { title, name }. */
const splitTitle = (raw: string): { title: OwnerDetail['title']; name: string } => {
    const prefix = TITLE_PREFIXES.find((t) => raw.startsWith(t + ' '));
    return prefix
        ? { title: prefix as OwnerDetail['title'], name: raw.slice(prefix.length + 1) }
        : { title: 'Mr.', name: raw };
};

/** Builds a full OwnerDetail from the minimal info the old mock data had. Fills the rest with placeholders. */
const makeOwner = (rawName: string, phone: string, email: string): OwnerDetail => {
    const { title, name } = splitTitle(rawName);
    return {
        title,
        name,
        relation: 'S/O',
        relationName: '', // not available in old mock data
        cnic: '',          // not available in old mock data
        phone,
        whatsapp: phone,   // assumed same as phone for mock purposes
        email,
        occupation: 'Business Owner', // placeholder — not available in old mock data
        address: '',
        nominee: null,
    };
};

const addMonthsISO = (iso: string, months: number): string => {
    const d = new Date(iso);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().slice(0, 10);
};

interface BookedInput {
    id: string;
    number: string;
    size: number;
    block: string;
    street: string;
    status: PropertyData['status'];
    price: number;
    ownerName: string;
    phone: string;
    email: string;
    bookingDate: string;
    totalPaid: number;
    pendingAmount: number;
}

/** Builds a booked/reserved/pending property, synthesizing a 3-year monthly installment plan
 *  from totalPaid/pendingAmount since the old mock data didn't track individual installments. */
const makeBookedProperty = (input: BookedInput): PropertyData => {
    const planYears = 3;
    const totalInstallments = planYears * 12;
    const installmentAmount = Math.round(input.price / totalInstallments);
    const paidInstallments = Math.min(
        Math.round(input.totalPaid / installmentAmount),
        totalInstallments
    );
    const pendingInstallments = totalInstallments - paidInstallments;
    const isFullyPaid = pendingInstallments <= 0;

    return {
        id: input.id,
        number: input.number,
        size: input.size,
        block: input.block,
        street: input.street,
        status: input.status,
        price: input.price,
        ratePerMarla: Math.round(input.price / input.size),
        totalAmount: input.price,
        isParkFace: false,
        parkFaceCharges: 0,
        isCorner: false,
        cornerCharges: 0,
        dimensions: { width: 0, length: 0 }, // not available in old mock data
        owner: makeOwner(input.ownerName, input.phone, input.email),
        payments: [], // individual payment history not available in old mock data
        bookingDate: input.bookingDate,
        totalPaid: input.totalPaid,
        pendingAmount: input.pendingAmount,
        downPayment: 0,
        installmentFrequency: 'monthly',
        planYears,
        planStartDate: input.bookingDate,
        installmentPlan: {
            totalInstallments,
            paidInstallments,
            pendingInstallments,
            installmentAmount,
            nextDueDate: isFullyPaid ? undefined : addMonthsISO(input.bookingDate, paidInstallments + 1),
            nextDueAmount: isFullyPaid ? undefined : installmentAmount,
        },
        documents: [],
        notes: [],
    };
};

/** Builds an available (unbooked) property — no owner, no payments, no plan yet. */
const makeAvailableProperty = (input: {
    id: string;
    number: string;
    size: number;
    block: string;
    street: string;
    price: number;
}): PropertyData => ({
    id: input.id,
    number: input.number,
    size: input.size,
    block: input.block,
    street: input.street,
    status: 'available',
    price: input.price,
    ratePerMarla: Math.round(input.price / input.size),
    totalAmount: input.price,
    isParkFace: false,
    parkFaceCharges: 0,
    isCorner: false,
    cornerCharges: 0,
    dimensions: { width: 0, length: 0 },
    owner: undefined,
    payments: [],
    bookingDate: '',
    totalPaid: 0,
    pendingAmount: input.price,
    downPayment: 0,
    installmentFrequency: 'monthly',
    planYears: 0,
    planStartDate: '',
    installmentPlan: {
        totalInstallments: 0,
        paidInstallments: 0,
        pendingInstallments: 0,
        installmentAmount: 0,
    },
    documents: [],
    notes: [],
});

// ---------- Mock data ----------

export const mockProperties: PropertyData[] = [
    makeAvailableProperty({ id: '1', number: '1', size: 10, block: 'A', street: '1', price: 2500000 }),
    makeBookedProperty({
        id: '2', number: '2', size: 10, block: 'A', street: '1', status: 'sold', price: 2800000,
        ownerName: 'Mr. Ahmad Khan', phone: '+92 300 1234567', email: 'ahmad@example.com',
        bookingDate: '2024-01-15', totalPaid: 2800000, pendingAmount: 0,
    }),
    makeBookedProperty({
        id: '3', number: '3', size: 12, block: 'A', street: '1', status: 'reserved', price: 3200000,
        ownerName: 'Ms. Fatima Ali', phone: '+92 321 7654321', email: 'fatima@example.com',
        bookingDate: '2024-02-10', totalPaid: 1500000, pendingAmount: 1700000,
    }),
    makeBookedProperty({
        id: '4', number: '4', size: 10, block: 'A', street: '1', status: 'pending', price: 2600000,
        ownerName: 'Mr. Usman Shah', phone: '+92 333 9876543', email: 'usman@example.com',
        bookingDate: '2024-03-05', totalPaid: 500000, pendingAmount: 2100000,
    }),
    makeAvailableProperty({ id: '5', number: '5', size: 8, block: 'A', street: '2', price: 1800000 }),
    makeBookedProperty({
        id: '6', number: '6', size: 10, block: 'A', street: '2', status: 'sold', price: 2200000,
        ownerName: 'Mr. Imran Ali', phone: '+92 345 5556666', email: 'imran@example.com',
        bookingDate: '2024-01-20', totalPaid: 2200000, pendingAmount: 0,
    }),
    makeAvailableProperty({ id: '7', number: '7', size: 10, block: 'A', street: '2', price: 2300000 }),
    makeBookedProperty({
        id: '8', number: '8', size: 12, block: 'A', street: '2', status: 'reserved', price: 3000000,
        ownerName: 'Dr. Sana Khan', phone: '+92 312 3334444', email: 'sana@example.com',
        bookingDate: '2024-02-25', totalPaid: 1000000, pendingAmount: 2000000,
    }),
    makeAvailableProperty({ id: '9', number: '9', size: 10, block: 'B', street: '1', price: 2400000 }),
    makeBookedProperty({
        id: '10', number: '10', size: 10, block: 'B', street: '1', status: 'sold', price: 2700000,
        ownerName: 'Mr. Ali Raza', phone: '+92 312 7778888', email: 'ali@example.com',
        bookingDate: '2024-03-10', totalPaid: 2700000, pendingAmount: 0,
    }),
    makeAvailableProperty({ id: '11', number: '11', size: 12, block: 'B', street: '2', price: 3100000 }),
    makeBookedProperty({
        id: '12', number: '12', size: 8, block: 'B', street: '2', status: 'pending', price: 1900000,
        ownerName: 'Ms. Ayesha Malik', phone: '+92 333 9990000', email: 'ayesha@example.com',
        bookingDate: '2024-03-20', totalPaid: 300000, pendingAmount: 1600000,
    }),
];