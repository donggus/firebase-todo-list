import React, { useContext, useEffect, useState } from 'react'
import { 
    KeyboardAvoidingView, 
    Platform, 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    ActivityIndicator, 
    Alert 
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { registerEmailPassword } from '../features/authSlice';
import { loginStyles } from '../helpers/styles/loginStyles';

const RegisterScreen = ( { navigation }) => {

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.userData)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Tienes campos vacíos', [{ text: 'OK' }])
        } else {
            dispatch(registerEmailPassword({ email, password }))
            setPassword('')
        } 
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#5856D6' }}
                behavior={ ( Platform.OS === 'ios') ? 'padding': 'height' }
            >
                <View style={ loginStyles.formContainer }>                
                    <Text style={ loginStyles.title }>Registro</Text>

                    {/* Form section */}
                    <Text style={ loginStyles.label }>Nombre:</Text>
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
                    {/* Register Button */}
                    {
                        !loading ? 
                        <View style={ loginStyles.buttonContainer }>
                            <TouchableOpacity
                                activeOpacity={ 0.8 }
                                style={ loginStyles.button }
                                onPress={ handleRegister }
                            >
                                <Text style={ loginStyles.buttonText } >Crear cuenta</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={ loginStyles.buttonContainer }>
                            <ActivityIndicator size={"large"} color={"white"}/>
                        </View>
                    }

                    {/* Back button */}
                    <TouchableOpacity
                        onPress={ () => navigation.pop() }
                        activeOpacity={ 0.8 }
                        style={ loginStyles.buttonReturn }
                    >
                        <Text style={ loginStyles.buttonText }>Volver</Text>
                    </TouchableOpacity>
                </View>
                
            </KeyboardAvoidingView>
        </>
    )
}

export default RegisterScreen;