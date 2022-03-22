import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Alert } from 'react-native'

const initialState = {
    userData: {},
    loading: false,
}

const authSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
        LOGIN: (state, action ) => {
            state.userData = action.payload;
        },
        LOGOUT: (state) => {
            state.userData = null;
        },
        SET_LOADING: (state, action) => {
            state.loading = action.payload
        },
        SET_LOGGED_IN: (state, action) => {
            state.isLoggedin = action.payload
        }
  }
});

export const {
    LOGIN,
    LOGOUT,
    SET_LOADING,
    SET_LOGGED_IN
} = authSlice.actions;

export const registerEmailPassword = createAsyncThunk(
    'user/register', 
    async (args, { dispatch }) => {
        dispatch(SET_LOADING(true));
        try {
            const { user } = await auth().createUserWithEmailAndPassword( args.email, args.password )
            await firestore().collection('users').doc(user.uid).set({ todoList: [] })
            dispatch( LOGIN(user.toJSON()) );
            dispatch( SET_LOADING(false) );
            Alert.alert('Completado', 'Te has registrado exitosamente.', [{text: 'OK'}])
        } catch (error) {
            console.log('registerEmailPassword', error)
            dispatch(SET_LOADING(false))
            Alert.alert('Error', error.toString(), [{ text: 'OK' }])
        }
    }
);

export const loginEmailPassword = createAsyncThunk(
    'user/login',
    async (args, { dispatch }) => {
        dispatch(SET_LOADING(true));
        try {
            const { user } = await auth().signInWithEmailAndPassword( args.email, args.password )
            dispatch( LOGIN(user.toJSON()) )
            dispatch( SET_LOADING(false) );
            dispatch( SET_LOGGED_IN(true) );
            Alert.alert('¡Bienvenido!', '¿Que te gustaría hacer hoy?', [{ text: 'Empezar' }])
        } catch (error) {
            console.log('loginEmailPassword', error)
            dispatch(SET_LOADING(false))
            Alert.alert('Error', error.toString(), [{ text: 'OK' }])
        }
    }
)

export const startLogout = createAsyncThunk(
    'user/logout',
    async( _, { dispatch }) => {
        dispatch(SET_LOADING(true));
        await auth().signOut()
        dispatch(LOGOUT());
        dispatch(SET_LOADING(false));
    }
)

export default authSlice.reducer