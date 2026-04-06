// @/features/addresses/api/types.ts

export interface Province {
    code: number;
    name: string;
    divisionType: string;
}

export interface District {
    code: number;
    name: string;
    divisionType: string;
}

export interface Ward {
    code: number;
    name: string;
    divisionType: string;
}

export interface Coordinate {
    latitude: number;
    longitude: number;
}