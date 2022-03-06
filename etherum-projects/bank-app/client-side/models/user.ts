import {getApp} from 'firebase/app';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import {
  doc,
  getDocs,
  setDoc,
  getFirestore,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { Role } from '../store/types';

const app = getApp();
const firestore = getFirestore(app);

const userCol = collection(firestore, 'users');
const auth = getAuth();

class User {
  constructor(
    public uid: string,
    public email: string,
    public emailVerified: boolean,
    public user_address: string,
    public username: string,
    public role: Role,
    public acctAddress: string | undefined
  ) {}
  async addUserToDB() {
    try {
      await setDoc(doc(firestore, 'users', this.uid), {
        uid: this.uid,
        username: this.username,
        email: this.email,
        emailVerified: this.emailVerified,
        user_address: this.user_address,
        role: this.role,
        acctAddress: this.acctAddress ? this.acctAddress :null
      });
    } catch (error) {
      throw error;
    }
  }
  static async getUserFromDb(uid: string) {
    try {
      let users: User[] = [];
      const q = query(userCol, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('Sorry did not find Any User');
      }
      querySnapshot.forEach((d) => {
        // doc.data() is never undefined for query doc snapshots
        users.push(
          new User(
            d.data().uid,
            d.data().email,
            d.data().emailVerified,
            d.data().user_address,
            d.data().username,
            d.data().role  === 0 ? Role.Admin : Role.User,
            d.data().acctAddress ? d.data().acctAddress : undefined
          )
        );
      });
      return users[0];
    } catch (error) {
      throw error;
    }
  }
  static async getUserByUsername(username: string){
    try {
      let users: User[] = [];
      const q = query(userCol, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error('Sorry no Found');
      }
      querySnapshot.forEach((d) => {
        // doc.data() is never undefined for query doc snapshots
        users.push(
          new User(
            d.data().uid,
            d.data().email,
            d.data().emailVerified,
            d.data().user_address,
            d.data().username,
            d.data().role  === 0 ? Role.Admin : Role.User,
            d.data().acctAddress ? d.data().acctAddress : undefined
          )
        );
      });
      return users[0];
    } catch (error) {
      throw error;
    }
  }

}

export default User;
