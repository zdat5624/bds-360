import { Gender, Role } from "@/constants";

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    gender: Gender;
    balance: number;
    phone: string;
    address?: string;
    avatar?: string;
    createdAt: string;
    createdBy: string;
    updatedAt?: string;
    updatedBy?: string;
}