import 'semantic-ui-css/semantic.min.css'
import '../styles/globals.css'
import '../firebase-config'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, combineReducers } from 'redux';
import authreducer, {AuthState} from '../store/reducers/auth';
import userReducer, { UserState } from '../store/reducers/userReducer';

export interface Store {
  auth: AuthState,
  user: UserState
}

const rootReducer = combineReducers({
  auth: authreducer,
  user: userReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

function MyApp({Component, pageProps}: AppProps) {
  return (
    <Provider store= {store}>
      <Component {...pageProps} />
    </Provider>
  );
}


export default MyApp
