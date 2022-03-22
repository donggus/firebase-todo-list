import React, { useState } from 'react'
import { 
    Text, 
    View, 
    TextInput, 
    Platform, 
    KeyboardAvoidingView, 
    ActivityIndicator, 
    Alert, 
    TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginStyles } from '../helpers/styles/loginStyles';
import Background from '../helpers/components/Background';
import { loginEmailPassword } from '../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const LoginScreen = () => {

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.userData)
    const navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Tienes campos vacíos', [{ text: 'OK' }])
        } else {
            dispatch(loginEmailPassword({ email, password }))
            setPassword('')
        } 
    }


    return (
    <>
        <Background />
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={ (Platform.OS === 'ios') ? 'padding': 'height' }
        >
            <View style={ loginStyles.formContainer }>                
                <Text style={ loginStyles.title }>Login</Text>

                <Text style={ loginStyles.label }>Email:</Text>
                <TextInput 
                    placeholder="Ingrese su email:"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    keyboardType="email-address"
                    underlineColorAndroid="white"
                    style={[ 
                        loginStyles.inputField,
                        ( Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
                    ]}
                    selectionColor="white"
                    value={ email }
                    onChange={ (e) => setEmail(e.nativeEvent.text) }
                    autoCapitalize="none"
                    autoCorrect={ false }
                />


                <Text style={ loginStyles.label }>Contraseña:</Text>
                <TextInput 
                    placeholder="******"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    underlineColorAndroid="white"
                    secureTextEntry
                    style={[ 
                        loginStyles.inputField,
                        ( Platform.OS === 'ios' ) && loginStyles.inputFieldIOS
                    ]}
                    selectionColor="white"
                    value={ password }
                    onChange={ (e) => setPassword(e.nativeEvent.text) }
                    autoCapitalize="none"
                    autoCorrect={ false }
                />


                {/* Login Button */}
                <View style={ loginStyles.buttonContainer }>
                    {
                        loading ?
                        <ActivityIndicator size={"large"} color={"white"}/>
                        :
                        <TouchableOpacity
                            activeOpacity={ 0.8 }
                            style={ loginStyles.button }
                            onPress={ handleLogin }
                        >
                            <Text style={ loginStyles.buttonText }>Login</Text>
                        </TouchableOpacity>
                    }
                </View>

                {/* Create new account */}
                <View style={ loginStyles.newUserContainer  }>
                    <TouchableOpacity
                        activeOpacity={ 0.8 }
                        onPress={ () => navigation.navigate('RegisterScreen') }
                    >
                        <Text style={ loginStyles.buttonText }>Nueva cuenta</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </KeyboardAvoidingView>
    </>
    )
}

export default LoginScreen