import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/authSlice';
import todoReducer from '../features/todoSlice';

export const store = configureStore({
    reducer: {
        userData: authReducer,
        todosData: todoReducer
    }
});