import React, {useState} from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native'
import { PawfectColors } from '../themes/PawfectColors';
// import PawfectLogo from '../assets/PawfectLogo';

type InputItem = {
    key: string;
    title: string;
    placeholder: string;
    value?: string;
};

type CustomFormProps = {
    title: string;
    inputList: InputItem[];
    onChange: (key: string, value: string) => void;
    buttonText?: string;
    onSubmit?: () => void;
};

export default function CustomForm({
    title,
    inputList,
    onChange,
    buttonText,
    onSubmit,
}: CustomFormProps){

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string}>({});

    const isPasswordField = (key: string) => {
        return key.toLocaleLowerCase().includes('password');
    };

    const getSecureTextEntry = (key: string) => {
        if (key === 'password') return !showPassword;
        if (key === 'confpassword') return !showConfirmPassword;
        return false;
    };

    const togglePasswordVisibility = (key: string) => {
        if (key === 'password') {
            setShowPassword(!showPassword);
        } else if (key === 'confpassword') {
            setShowConfirmPassword(!showConfirmPassword);
        };
    };

    const getPasswordVisibilityState = (key: string) => {
        if (key === 'password') return showPassword;
        if (key === 'confpassword') return showConfirmPassword;
        return false;
    };

    const validateFields = () => {
        const newErrors: {[key: string]: string} = {};
        const values: Record<string, string> = {};

        inputList.forEach(item => {
            values[item.key] = item.value || '';
        });
        
        inputList.forEach(item => {
            const value = values[item.key].trim();

            if (!value) {
                newErrors[item.key] = `${item.title} is required`;
                return;
            }

            if(item.key === 'email'){
                const emailRegex = /^[^\s@]+@(gmail|yahoo|outlook|hotmail|icloud)\.[^\s@]+$/i;
                if (!emailRegex.test(value)){
                    newErrors[item.key] = 'Email must valid (@gmail, @yahoo, dll)'
                }
            }

            if (item.key === 'phone'){
                const phoneRegex = /^[0-9]{10,13}$/;
                if (!phoneRegex.test(value)) {
                    newErrors[item.key] = 'Phone Number must consist of 10-13 digits.'
                }
            }

            if (item.key === 'password') {
                const hasUpper = /[A-Z]/.test(value);
                const hasLower = /[a-z]/.test(value);
                const hasNumber = /[0-9]/.test(value);
                const hasSymbol = /[^A-Za-z0-9]/.test(value);

                if (!hasUpper)
                    newErrors[item.key] = 'Password must have uppercase letters';
                else if (!hasLower)
                    newErrors[item.key] = 'Password must have lowercase letters';
                else if (!hasNumber)
                    newErrors[item.key] = 'Password must have numbers';
                else if (!hasSymbol)
                    newErrors[item.key] = 'Password must have symbols';
            }

            if (item.key === 'confpassword'){
                if (value !== values['password']) {
                    newErrors[item.key] = 'Password confirmation must be the same as password'
                }
            }
        });

        return newErrors;
    };

    const handleSubmit = () => {
        const newErrors = validateFields();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0 && onSubmit){
            onSubmit();
        }
    };

    const handleChange = (key: string, text:string) => {
        setErrors(prev => {
            const updated = {...prev};
            delete updated[key];
            return updated;
        });
        onChange(key, text);
    };

    return(
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.shadowWrapper}>

                {/* Kotak bawah (bayangan lebih besar dan sedikit bergeser) */}
                <View style={styles.shadowBox}/>

                {/* Kotak atas (konten utama) */}
                <View style={styles.formContainer}>
                    <View style={{paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: PawfectColors.accentPink}}>
                        <Text style={styles.formTitle}>{title}</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection:'column', rowGap: 20}}>
                        <FlatList
                            contentContainerStyle={{rowGap: 15, width: '100%'}}
                            data={inputList}
                            renderItem={({item}) => (
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>{item.title}</Text>

                                {/* INPUT WRAPPER WITH ICON */}
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={[
                                            styles.inputField,
                                            isPasswordField(item.key) && styles.inputWithIcon,
                                            errors[item.key] ? {borderColor: 'red'} : {},
                                        ]}
                                        placeholder={item.placeholder}
                                        placeholderTextColor={PawfectColors.textSecondary}
                                        // value={item.key || ''}
                                        onChangeText={(text) => handleChange(item.key, text)}
                                        secureTextEntry={
                                            isPasswordField(item.key)
                                                ? getSecureTextEntry(item.key)
                                                : false
                                        }
                                        keyboardType={
                                            item.key === 'phone' ? 'phone-pad' :
                                            item.key === 'email' ? 'email-address' :
                                            'default'
                                        }
                                        autoCapitalize={
                                            item.key === 'email' ? 'none' : 'sentences'
                                        }
                                    />
                                    {/* EYE ICON FOR PASSWORD FIELDS */}
                                    {isPasswordField(item.key) && (
                                        <TouchableOpacity
                                            style={styles.eyeIcon}
                                            onPress={() => togglePasswordVisibility(item.key)}
                                        >
                                            {getPasswordVisibilityState(item.key) ? (
                                                <Eye size={20} color={PawfectColors.textSecondary}/>
                                            ) : (
                                                <EyeOff size={20} color={PawfectColors.textSecondary}/>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <View style={styles.errorContainer}>
                                    {errors[item.key] && (
                                        <Text style={styles.errorText}>{errors[item.key]}</Text>
                                    )}
                                </View>
                            </View>
                            )}
                            keyExtractor={(item) => item.key}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    shadowWrapper: {
        width: '180%',
        maxWidth: 440,
        position: 'relative',
        alignSelf: 'center'
    },
    shadowBox: {
        width: '100%',
        // maxWidth: 440,
        height: '100%',
        padding: 30,
        backgroundColor: PawfectColors.secondary,
        borderRadius: 20,
        position: 'absolute',
        top: 15,  // geser sedikit ke bawah
        left: 15, // geser sedikit ke kanan
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    formContainer: {
        width: '100%',
        height: 'auto',
        padding: 30,
        backgroundColor: PawfectColors.cardBackground,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        rowGap: 30
    },
    formTitle: {
        color: PawfectColors.textPrimary, 
        fontSize: 22, 
        // flex: 1, 
        textAlign: 'center'
    },
    inputGroup: {
        rowGap: 5,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    inputLabel: {
        color: PawfectColors.textSecondary, 
        fontWeight:'bold',
    },
    inputWrapper: {
        position: 'relative',
        width: '100%',
    },
    inputField: {
        height: 40,
        borderColor: PawfectColors.textSecondary,
        borderWidth: 1,
        // flex: 1,
        width: '100%',
        paddingHorizontal: 10,
        boxSizing: 'border-box'
    },
    // ✅ Add padding for icon space
    inputWithIcon: {
        paddingRight: 45,
    },
    // ✅ Eye icon positioning
    eyeIcon: {
        position: 'absolute',
        right: 10,
        paddingVertical: 21,
        transform: [{ translateY: -10 }],
        zIndex: 10,
    },
    errorContainer:{
        minHeight: 18,
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        width: '100%',
        textAlign: 'left',
    },
    button: {
        backgroundColor: PawfectColors.accentPink,
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        cursor: 'pointer',
        width: '100%',
        borderWidth: 0
    },
    buttonText: {
        textAlign: 'center',
        color: PawfectColors.textPrimary,
        fontWeight: 'bold',
    },
})