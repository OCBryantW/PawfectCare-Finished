// ============================================
// AuthPage.tsx - Main Auth Page (Register + Login)
// ============================================
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
// import { RegisterData, useRegister } from '../contexts/RegisterContext';
import { PawfectColors } from '../themes/PawfectColors';
import CustomForm from '../components/CustomForm';
import ScrollableLayout from '../styles/ScrollableLayout';
// import PawfectLogo from '../assets/PawfectLogo';
import { Toast } from '../components/Toast';

import { useAppDispatch } from '../redux/Hooks';
import { useAuth } from '../redux/Hooks';
import {
  updateRegisterData,
  registerUser,
  loginUser,
  clearError,
  clearUser
} from '../redux/slices/AuthSlice';
import { RegisterData } from '../redux/Types';

import { Svg, Text as SvgText } from 'react-native-svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;
type RegisterField = keyof RegisterData;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const { width, height } = Dimensions.get('window');

const registerInputs: { key: RegisterField; title: string; placeholder: string }[] = [
  {
    key: 'fullname',
    title: 'Full Name',
    placeholder: 'Enter your Name',
  },
  {
    key: 'phone',
    title: 'Phone Number',
    placeholder: 'Enter your Phone Number',
  },
  {
    key: 'email',
    title: 'Email',
    placeholder: 'Enter your Email',
  },
  {
    key: 'password',
    title: 'Password',
    placeholder: 'Enter your Password',
  },
  {
    key: 'confpassword',
    title: 'Confirm Password',
    placeholder: 'Enter your Confirm Password',
  },
];

export default function AuthPage({ navigation, route }: Props) {
  const initialForm = route.params?.mode || 'register';
  const dispatch = useAppDispatch();
  const { registerData, loading, error, user, isAuthenticated } = useAuth();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [currentForm, setCurrentForm] = useState<'register' | 'login'>(initialForm);
  const [animationKey, setAnimationKey] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);

  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (route.params?.mode && route.params.mode !== currentForm) {
      setCurrentForm(route.params.mode);
    }
  }, [route.params?.mode]);

  // useEffect(() => {
  //   if (Platform.OS === 'web') {
  //     const newPath = currentForm === 'register' ? '/auth/register' : '/auth/login';

  //     if (window.location.pathname !== newPath) {
  //       window.history.pushState({}, '', newPath);
  //     }
  //   }
  // }, [currentForm]);

  // useEffect(() => {
  //   if (Platform.OS === 'web') {
  //     const pathname = window.location.pathname;

  //     if (pathname.includes('/login')) {
  //       setCurrentForm('login');
  //     } else if (pathname.includes('/register')) {
  //       setCurrentForm('register');
  //     }
  //   }
  // })

  // Reset animasi setiap kali reload
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, []);

  // Animasi masuk saat pertama kali atau reset
  useEffect(() => {
    slideAnim.setValue(SCREEN_WIDTH);
    fadeAnim.setValue(0);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animationKey, currentForm]);

  // HANDLE ERROR DARI REDUX
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearError());
    }
  }, [error]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  const switchForm = (target: 'register' | 'login') => {
    navigation.setParams({mode: target});
    if (target === 'login') dispatch(clearUser());
    
    // Animasi keluar
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Setelah keluar, ganti form
      setCurrentForm(target);
      setAnimationKey((prev) => prev + 1);
    });
  };

  // HANDLE REGISTER MENGGUNAKAN REDUX
  const handleRegisterChange = (key: string, value: string) => {
    dispatch(updateRegisterData({ [key]: value }));
  };

  const handleLoginChange = (key: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [key]: value }));
  };

  // HANDLE REGISTER SUBMIT MENGGUNAKAN REDUX
  const handleRegisterSubmit = async () => {
    // Validasi sudah dilakukan di CustomForm
    // Setelah register berhasil, pindah ke login
    const {fullname, phone, email, password, confpassword} = registerData;

    if (!fullname || !phone || !email || !password || !confpassword) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    if (password !== confpassword) {
      showToast ('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6){
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      await dispatch(registerUser(registerData)).unwrap();
      setIsNewUser(true);
      switchForm('login');
      showToast('Registration successful! Please login.', 'success');
    } catch (err: any){
      console.log('Register failed:', err);
    }
  };

  // HANDLE LOGIN SUBMIT MENGGUNAKAN REDUX
  const handleLoginSubmit = async () => {
    const { email, password } = loginData;

    if (!email || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    try {
      await dispatch(loginUser({email, password})).unwrap();
    } catch (err: any) {
      console.log('Login failed:', err);
    }
    // Bandingkan dengan data register
    // if (email === registerData.email && password === registerData.password) {
    //   showToast(`Welcome back, ${registerData.fullname}!`, 'success');
    //   setTimeout(() => {
    //     navigation.navigate('ServiceList');
    //   }, 1500);
    // } else {
    //   showToast('Email or password is incorrect.', 'error');
    // }
  };

    // HANDLE SUCCESSFUL LOGIN
  useEffect(() => {
    console.log('useEffect Check:', {
      user,
      currentForm,
      isAuthenticated,
      isNewUser
    });

    if (user && currentForm === 'login' && isAuthenticated) {

      const welcomeMessage = isNewUser
        ? `Welcome petlovers, ${user.fullName}!`
        : `Welcome back, ${user.fullName}!`;

      showToast(welcomeMessage, 'success');
      setTimeout(() => {
        navigation.navigate('ServiceList');
        setIsNewUser(false);
      }, 1500);
    }
  }, [user, currentForm, isAuthenticated, isNewUser]);

  const loginInputs = [
    {
      key: 'email',
      title: 'Email',
      placeholder: 'Enter your email',
      value: loginData.email,
    },
    {
      key: 'password',
      title: 'Password',
      placeholder: 'Enter your password',
      value: loginData.password,
    },
  ];

  return (
    <ScrollableLayout backgroundColor={PawfectColors.primary}>
      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        // left='65%'
      />

      {/* LOADING OVERLAY */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color={PawfectColors.secondary}/>
          <Text style={styles.loadingText}>
            {currentForm === 'register' ? 'Creating account...' : 'Logging in...'}
          </Text>
        </View>
      )}

      <View style={styles.container}>
        {/* Hero Section - Kiri (Tetap) */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Image
              style={{width: width * 0.2, height: height * 0.3}}
              source={require('../assets/PawfectLogo.png')}
            />
            <Text style={styles.logoText}>Pawfect Care</Text>
          </View>

          <Text style={styles.welcomeText}>Welcome to Pawfect Care</Text>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroText}>
              Because your furry friend deserves the pawfect care.
            </Text>
            <Text style={styles.heroText}>
              Gentle grooming, soothing spa, and loving hands — all in one place
              to keep your pet happy, healthy, and shining.
            </Text>
          </View>

          {/* Toggle Button */}
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() =>
              switchForm(currentForm === 'register' ? 'login' : 'register')
            }
          >
            <Text style={styles.toggleButtonText}>
              {currentForm === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Section - Kanan (Animasi) */}
        <Animated.View
          style={[
            styles.formSection,
            {
              transform: [{ translateX: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          {/* <View style={styles.formWrapper}> */}
            {currentForm === 'register' ? (
              <CustomForm
                key="registerForm"
                title="Register"
                inputList={registerInputs.map((item) => ({
                  ...item,
                  value: registerData[item.key],
                }))}
                onChange={handleRegisterChange}
                buttonText="Register"
                onSubmit={handleRegisterSubmit}
              />
            ) : (
              <View style={styles.formWrapper}>
                <CustomForm
                  key="loginForm"
                  title="Login"
                  inputList={loginInputs}
                  onChange={handleLoginChange}
                  buttonText="Login"
                  onSubmit={handleLoginSubmit}
                />

              </View>
            )}
          {/* </View> */}
        </Animated.View>
      </View>
    </ScrollableLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    // paddingVertical: 60,
    gap: 60,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  logoContainer: {
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  logoText: {
    position: 'absolute', 
    display: 'flex',  
    alignSelf: 'flex-end',
    fontWeight: 'bold',
    fontSize: 31,
    color: PawfectColors.secondary,
    marginBottom: 25
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: PawfectColors.secondary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 10,
  },
  heroTextContainer: {
    gap: 15,
    paddingHorizontal: 20,
  },
  heroText: {
    fontSize: 17,
    textAlign: 'center',
    color: PawfectColors.secondary,
    lineHeight: 24,
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {
    width: '100%',
    paddingVertical: '22%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  toggleButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: PawfectColors.secondary,
    borderRadius: 8,
  },
  toggleButtonText: {
    color: PawfectColors.secondary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: PawfectColors.secondary,
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
});