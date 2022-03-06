import {AuthState} from './reducers/auth'
import { UserState } from './reducers/userReducer'
export type MessageType ={
    type: string,
    header: string,
    content: string
}

export enum Role {
    Admin, User
}
export type ActionObject = {
    type: string,
    payload: AuthState
}

export type UserActionObject = {
    type: string,
    payload: UserState
}

export interface User {
    uid: string
    email: string
    username: string;
    user_address: string;
    emailVerified: boolean
}