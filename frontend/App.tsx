
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import ServiceList from './pages/ServiceListPage';
import CustomNavbar from './components/CustomNavbar';
import AuthPage from './pages/AuthPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BookingFormPage from './pages/BookingFormPage';
import MyBookingsPage from './pages/MyBookingsPage';
import { Provider } from 'react-redux';
import { store } from './redux/Store';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAuth } from './redux/Hooks';
import { checkStoredAuth } from './redux/slices/AuthSlice';
import { PawfectColors } from './themes/PawfectColors';

  export type RootStackParamList = {
    Auth: {mode?: 'login' | 'register'} | undefined;
    ServiceList: undefined;
    ServiceDetail: {id: string};
    BookingForm: undefined;
    MyBookings: undefined;
  }

  const Stack = createNativeStackNavigator<RootStackParamList>();

  function AppContent() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAuth();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
      dispatch(checkStoredAuth()).finally(() => {
        setIsCheckingAuth(false);
      });
    }, [dispatch]);

    if (isCheckingAuth) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={PawfectColors.accentPink}/>
        </View>
      );
    }
  
    return (
          <NavigationContainer
            onStateChange={(state) => {
              if (!state || typeof window === 'undefined' || Platform.OS !== 'web') return;
              
              try {
                const route = state.routes[state.index];
                let path = '/';
  
                switch (route.name) {
                  case 'Auth':
                    const authParams = route.params as RootStackParamList['Auth'];
                    const mode = authParams?.mode || 'register';
                    path = `/auth/${mode}`;
                    break;
                  case 'ServiceList':
                    path = '/services';
                    break;
                  case 'ServiceDetail':
                    const detailParams = route.params as RootStackParamList['ServiceDetail'];
                    path = `/services/${detailParams?.id || ''}`;
                    break;
                  case 'BookingForm':
                    path = '/booking';
                    break;
                  case 'MyBookings':
                    path = '/my-bookings';
                    break;
                }
  
                if (window.location.pathname !== path) {
                  window.history.replaceState({}, '', path);
                }
  
              } catch (error) {
                console.error('Error updating URL:', error);
              }
            }}
          >
            <Stack.Navigator
              id='root-stack'
              screenOptions={{
                header: (props) => <CustomNavbar {...props}/>
              }}
            >
              <Stack.Screen 
                name="Auth" 
                component={AuthPage} 
                options={{headerShown: false}}
                initialParams={{mode: 'register'}}
              />
              <Stack.Screen name="ServiceList" component={ServiceList} />
              <Stack.Screen name="ServiceDetail" component={ServiceDetailPage} />
              <Stack.Screen name="BookingForm" component={BookingFormPage} />
              <Stack.Screen name="MyBookings" component={MyBookingsPage} />
            </Stack.Navigator>
          </NavigationContainer>
  
    )
  }


  export default function App() {
    // const navigationRef = useWebNavigation();

    return (
      <Provider store={store}>
        <AppContent/>
      </Provider>
    );
  }

  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
