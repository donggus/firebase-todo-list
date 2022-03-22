import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import firestore from '@react-native-firebase/firestore'
import { Alert } from 'react-native'

const initialState = {
    todosData: [],
    loading: false,
}

const todoSlice = createSlice({
  name: 'userTodo',
  initialState,
  reducers: {
        SET_TODOS: (state, action) => {
            state.todosData = action.payload
        },
        UPDATE_TODO: (state, action ) => {
            state.todosData = action.payload;
        },
        SET_LOADING: (state, action) => {
            state.loading = action.payload
        }
  }
});

export const {
    SET_TODOS,
    UPDATE_TODO,
    SET_LOADING,
} = todoSlice.actions;

export const getTodoList = createAsyncThunk(
    'todoList/get', 
    async (args, { dispatch }) => {
        dispatch(SET_LOADING(true));
        try {
            const { todos } = await firestore().collection('users').doc(args.uid).get()
            dispatch( SET_TODOS(todos) )
            dispatch( SET_LOADING(false) );
        } catch (error) {
            console.log(error)
            dispatch(SET_LOADING(false))
            Alert.alert('updateTodoList', error.toString(), [{ text: 'OK' }])
        }
    }
);

export const updateTodoList = createAsyncThunk(
    'todoList/update', 
    async (args, { dispatch }) => {
        dispatch(SET_LOADING(true));
        try {
            await firestore().collection('users').doc(args.uid).set(args.todos)
            dispatch( UPDATE_TODO(args.todos) )
            dispatch( SET_LOADING(false) );
            // Alert.alert('Completado', 'Te has registrado exitosamente.', [{text: 'OK'}])
        } catch (error) {
            console.log(error)
            dispatch( SET_LOADING(false) )
            Alert.alert('updateTodoList', error.toString(), [{ text: 'OK' }])
        }
    }
);

export default todoSlice.reducer