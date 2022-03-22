import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TodoScreen from '../screens/TodoScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { useDispatch, useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import { LOGIN } from '../features/authSlice';

const Stack = createNativeStackNavigator();


export const Navigation = () => {

    const dispatch = useDispatch()
    const { userData } = useSelector((state) => state.userData)

    useEffect(() => {
        auth().onAuthStateChanged((user) => {
            const currentUser = user ? { uid: user.uid, email: user.email } : null
            dispatch(LOGIN(currentUser))
        })
    }, [])
    
    return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            contentStyle: {
                backgroundColor: 'white'
            }
        }}
    >
        {
            userData ? 
            <Stack.Screen name="TodoScreen" component={TodoScreen} />
            :
            <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </>
        }
    </Stack.Navigator>
    );
}