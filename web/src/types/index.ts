// src/types/index.ts
import type { Title, Relation, Occupation } from '../constants/contact';
import type { PaymentType, PaymentMethod } from '../constants/payment';

export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type PaymentFilter = 'all' | PaymentStatus;
export type PropertyStatus = 'available' | 'sold' | 'reserved' | 'pending';

export interface AddPaymentFormData {
    date: string;
    description: string;
    amount: number;
    type: PaymentType;
    method: PaymentMethod;
    notes: string;
}



export interface AddPaymentFormData {
    date: string;
    description: string;
    amount: number;
    type: PaymentType
    method: PaymentMethod;
    notes?: string;
}


export interface Nominee {
    id?: string;
    name: string;
    title: Title;
    relation: Relation;
    cnic: string;
    phone: string;
    email?: string;
}

export interface OwnerDetail {
    id?: string;
    title: Title;
    name: string;
    relation: Relation;
    relationName?: string;
    cnic: string;
    phone: string;
    whatsapp: string;
    email: string;
    occupation: Occupation;
    customOccupation?: string;
    address: string;
    nominee: Nominee | null;
    joinDate?: string;
}

export interface EditOwnerFormData {
    id?: string;
    title: string;
    name: string;
    relation: string;
    relationName?: string;
    cnic: string;
    phone: string;
    whatsapp: string;
    email: string;
    occupation: string;
    customOccupation?: string;
    address: string;
    nominee?: {
        name: string;
        title: string;
        relation: Relation;
        cnic: string;
        phone: string;
        email?: string;
    } | null;
    joinDate?: string;
}

export interface Payment {
    id: string;
    date: string;
    description: string;
    receiptNo: string;
    amount: number;
    type: PaymentType;
    status: PaymentStatus;
    method: PaymentMethod;
    notes?: string;
}

export interface Document {
    name: string;
    type: string;
    uploadedAt: string;
    url: string;
}

export interface Note {
    id: string;
    content: string;
    createdAt: string;
    createdBy: string;
}


export interface Property {
    id: string;
    number: string;
    size: string;
    block: string;
    street: string;
    status: PropertyStatus;
    price: number;
    owner?: {
        name: string;
        phone: string;
        email: string;
    };
    bookingDate?: string;
    totalPaid?: number;
    pendingAmount?: number;
}


export interface PropertyData {
    id: string;
    number: string;
    size: number;
    block: string;
    street: string;
    status: PropertyStatus;

    // Pricing
    price: number;
    ratePerMarla: number;
    totalAmount: number;

    // Premium features
    isParkFace: boolean;
    parkFaceCharges: number;
    isCorner: boolean;
    cornerCharges: number;

    dimensions: {
        width: number;
        length: number;
    };

    owner: OwnerDetail;
    payments: Payment[];

    bookingDate: string;
    possessionDate?: string;
    totalPaid: number;
    pendingAmount: number;

    // Installment plan setup (editable on the form)
    downPayment: number;
    installmentFrequency: 'monthly' | 'quarterly' | 'semiannual' | 'yearly';
    planYears: number;
    planStartDate: string; // ISO date, e.g. "2026-09-12"

    // Installment plan state (computed on save, read by the cron job / dashboard)
    installmentPlan: {
        totalInstallments: number;
        paidInstallments: number;
        pendingInstallments: number;
        installmentAmount: number;
        nextDueDate?: string;
        nextDueAmount?: number;
    };

    documents: Document[];
    notes: Note[];
}
