import {AUTH_ACTIONS} from  '../actions/auth_action'
import {MessageType, ActionObject} from '../types'
import User from '../../models/user'



export interface AuthState {
    message: MessageType
    user: User | undefined
}




const intialState : AuthState = {
    message: {
        type: '',
        content: '',
        header: ''
    },
    user: undefined
}

export default function authreducer (state = intialState, action: ActionObject) {
    switch (action.type) {
        case AUTH_ACTIONS.AUTHENTICATE:
            return {
                ...state,
                user: action.payload.user,
                message: action.payload.message
            }
        
        case AUTH_ACTIONS.SETMESSAGE:
            return {
                ...state,
                message: action.payload.message
            }

        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: action.payload.user,
                message: action.payload.message
            }

        default:
            return state
    }
}