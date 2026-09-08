// src/types/index.ts

// Add these types to your existing types file
export type Title = 'Mr.' | 'Mrs.' | 'Ms.' | 'Miss' | 'Dr.' | 'Prof.';

export type Relation = 'S/O' | 'D/O' | 'W/O' | 'H/O' | 'B/O';

export type Occupation =
    | 'Business Owner'
    | 'Salaried Professional'
    | 'Government Employee'
    | 'Private Employee'
    | 'Self Employed'
    | 'Student'
    | 'Retired'
    | 'Housewife'
    | 'Farmer'
    | 'Doctor'
    | 'Engineer'
    | 'Teacher'
    | 'Lawyer'
    | 'Architect'
    | 'Real Estate Agent'
    | 'Other';

export interface Nominee {
    id?: string;
    name: string;
    title: Title;
    relation: Relation;
    cnic: string;
    phone: string;
    email?: string;
    percentage?: number; // For inheritance percentage
}

export interface OwnerDetail {
    id?: string;
    title: Title;
    name: string;
    fatherName?: string;
    relation: Relation;
    relationName?: string; // Name of father/husband/etc
    cnic: string;
    phone: string;
    whatsapp?: string;
    email: string;
    occupation: Occupation | string; // Can be from list or custom
    customOccupation?: string; // For "Other" option
    address: string;
    city?: string;
    country?: string;
    postalCode?: string;
    nominee: Nominee | null;
    joinDate?: string;
}