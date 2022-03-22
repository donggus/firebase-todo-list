import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from '../features/authSlice';
import todoReducer from '../features/todoSlice';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['authReducer']
}

const rootReducer = combineReducers({
    userData: authReducer,
    todosData: todoReducer
})

const combinedReducers = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: combinedReducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
});

const persistor = persistStore(store)

export { store, persistor }