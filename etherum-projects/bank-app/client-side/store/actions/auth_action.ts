import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import User from '../../models/user';
import {SignUpState} from '../../components/SignUp';
import {LoginState} from '../../pages/auth/login'
import { Role } from '../types';
import { ForgotState } from '../../components/ForgotPassword';

export const AUTH_ACTIONS = {
  AUTHENTICATE: 'AUTHENTICATE',
  SETMESSAGE: 'SETMESSAGE',
  LOGOUT: 'LOGOUT'
};

const auth = getAuth();

function clearMsg() {
  return {
    type: AUTH_ACTIONS.SETMESSAGE,
    payload: {
      message: {
        type: '',
        content: '',
        header: '',
      },
    },
  };
}

export function signup(data: SignUpState, cb: (m : string) => Promise<void>) {
  return async (dispatch: any) => {
    try {
      dispatch(clearMsg())
      if (data.password !== data.confirmPassword) {
        throw new Error('Confirm password and Password fields must be same');
      }
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = new User(
        res.user.uid,
        data.email,
        res.user.emailVerified,
        data.user_address,
        data.username,
        Role.User,
        undefined
      );
      await user.addUserToDB();
      // await sendEmailVerification(auth.currentUser!);

      dispatch({
        type: AUTH_ACTIONS.AUTHENTICATE,
        payload: {
          message: {
            type: 'SUCCESS',
            header: 'Operation Successful!',
            content: 'Success Signup',
          },
          user: user
        },
      });
      cb('SUCCESS');
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SETMESSAGE,
        payload: {
          message: {
            type: 'DANGER',
            header: 'Oops! Something went',
            content: error.message,
          },
        },
      });
      cb('ERROR');
    }
    // } finally {

    // }
  };
}

export function Signin(data : LoginState, cb : (m : string, userAdd: string) => void) {
  return async (dispatch : any) => {
    try {
      dispatch(clearMsg())
      const res = await signInWithEmailAndPassword(auth, data.email, data.password)
      const user = await User.getUserFromDb(res.user.uid)
      dispatch({
        type: AUTH_ACTIONS.AUTHENTICATE,
        payload: {
          message: {
            type: 'SUCCESS',
            header: 'Operation Success',
            content: 'Login Successful wait while you are redirected',
          },
          user: user
        },
      });
      cb('SUCCESS',  user.user_address);
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SETMESSAGE,
        payload: {
          message: {
            type: 'DANGER',
            header: 'Oops! Something went wrong',
            content: error.message,
          },
        },
      });
      cb('DANGER', '');
    }
  }
}

export function forgotPass(data : ForgotState, cb : (m : string) => void){
  return async (dispatch : any) => {
    try {
      dispatch(clearMsg())
      await sendPasswordResetEmail(auth, data.email)
      dispatch({
        type: AUTH_ACTIONS.SETMESSAGE,
        payload: {
          message: {
            type: 'SUCCESS',
            header: 'Operation Success',
            content: 'Check your mail to reset your password',
          },
        },
      });
      cb('SUCCESS')
    } catch (error) {
      console.log(error)
      cb('DANGER')
      dispatch({
        type: AUTH_ACTIONS.SETMESSAGE,
        payload: {
          message: {
            type: 'DANGER',
            header: 'Oops! Something went wrong',
            content: error.message,
          },
        },
      });
    }
  }
}

export function autoLogin(uid : string, cb : (m : string) => void) {
  return async (dispatch : any) => {
    try {
      dispatch(clearMsg())
      const user = await User.getUserFromDb(uid)
      dispatch({
        type: AUTH_ACTIONS.AUTHENTICATE,
        payload: {
          message: {
            type: 'SUCCESS',
            header: 'Operation Successful!',
            content: 'Login Successful',
          },
          user: user
        },
      });
      cb('SUCCESS')
    } catch (error) {
      cb('DANGER')
      dispatch({
        type: AUTH_ACTIONS.SETMESSAGE,
        payload: {
          message: {
            type: 'DANGER',
            header: 'Oops! Something went',
            content: error.message,
          },
        },
      });
    }
  }
}

export function logout(cb : (m : string) => void) {
  return async (dispatch :any) => {
    try {
      await signOut(auth)
      dispatch({
        type: AUTH_ACTIONS.LOGOUT,
        payload: {
          user: undefined,
          message: {
            type: 'SUCCESS',
            header: 'Operation Success',
            content: 'You have logout of your wallet'
          }
        }
      })
      cb('SUCCESS')
    } catch (error) {
      cb('DANGER')
      dispatch({
        type: AUTH_ACTIONS.SETMESSAGE,
        payload: {
          message: {
            type: 'DANGER',
            header: 'Oops! Something went',
            content: error.message,
          },
        },
      });
    }
  }
}
