export const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Miss', 'Dr.', 'Prof.'] as const;

export const RELATIONS = ['S/O', 'D/O', 'W/O', 'H/O', 'B/O'] as const;

export const OCCUPATIONS = [
    'Business Owner',
    'Salaried Professional',
    'Government Employee',
    'Private Employee',
    'Self Employed',
    'Student',
    'Retired',
    'Housewife',
    'Farmer',
    'Doctor',
    'Engineer',
    'Teacher',
    'Lawyer',
    'Architect',
    'Real Estate Agent',
    'Other',
] as const;

// Derived union types so OwnerDetail can use these instead of `string`
export type Title = (typeof TITLES)[number];
export type Relation = (typeof RELATIONS)[number];
export type Occupation = (typeof OCCUPATIONS)[number];