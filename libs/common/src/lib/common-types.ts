export type NoId<T> = Omit<T, 'id'>;

export interface UserProps {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string | null;
    phone?: string;
}

export interface BaseUser extends UserProps {
    id: string;
}