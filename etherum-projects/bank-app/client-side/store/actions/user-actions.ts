import {
  doc,
  getDocs,
  setDoc,
  getFirestore,
  collection,
  query,
  where,
  getDoc,
} from 'firebase/firestore';
import {getApp} from 'firebase/app';
import {AUTH_ACTIONS} from './auth_action';
import { TransactionType } from '../../pages/admin/transactions';

const app = getApp();
const firestore = getFirestore(app);

export const USER_ACTIONS = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
};


export function addTransactionToDB(userId: string, hash: string, type : TransactionType ) {
  return async (dispatch: any, getState: any) => {
    const transactions = getState().user.transactions;
    transactions.push({
      hash: hash,
      type: type
    });
    try {
      await setDoc(doc(firestore, 'transactions', userId), {
        transactions: transactions,
      });
      dispatch({
        type: USER_ACTIONS.SET_TRANSACTIONS,
        payload: {
          transactions: transactions,
        },
      });
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SETMESSAGE,
        payload: {
          message: {
            type: 'DANGER',
            content: error.message,
            header: 'Could Not Record your Transaction',
          },
        },
      });
    }
  };
}

export function getTransactionsFromDB(userId: string, cb : (trxs : any[]) => void) {
  return async (dispatch: any) => {
    try {
      let transactions: any[] = [];
      const docRef = doc(firestore, 'transactions', userId);
      const fetchedDoc = await getDoc(docRef);
      transactions = [...fetchedDoc.data()!.transactions];
      console.log(transactions)
      dispatch({
        type: USER_ACTIONS.SET_TRANSACTIONS,
        payload: {
          transactions: transactions,
        },
      });
      cb(transactions)
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SETMESSAGE,
        payload: {
          message: {
            type: 'DANGER',
            content: error.message,
            header: 'Could Not get your Transaction',
          },
        },
      });
      cb([])
    }
  };
}
