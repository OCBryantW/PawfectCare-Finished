import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { PawfectColors } from '../themes/PawfectColors';
import { useServices } from '../redux/Hooks';
import { useAppDispatch } from '../redux/Hooks';
import { fetchServices } from '../redux/slices/ServiceSlice';
import { ServiceCard } from '../components/ServiceCard';
import { BottomButtonBar } from '../components/BottomBookingBar';
import ScrollableLayout from '../styles/ScrollableLayout';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceList'>;

export default function ServiceListPage({navigation} : Props) {
  const dispatch = useAppDispatch();
  const {services, loading, error} = useServices();

  const [lisKey, setListKey] = useState(0);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      setListKey(prevKey => prevKey + 1);
      return () => {};
    }, [])
  )

  if (loading && services.length === 0) {
    return (
      <ScrollableLayout backgroundColor={PawfectColors.primary}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size='large' color={PawfectColors.secondary}/>
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      </ScrollableLayout>
    )
  }

  if (error) {
    return (
      <ScrollableLayout backgroundColor={PawfectColors.primary}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>Please check your connection and try again.</Text>
        </View>
      </ScrollableLayout>
    )
  }

  return (
    <ScrollableLayout backgroundColor={PawfectColors.primary}>
      <View style={styles.container}>
        <FlatList
          key={lisKey.toString()}
          data={services}
          renderItem={({item, index}) => (
            <ServiceCard service={item} index={index}/>
          )}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        <BottomButtonBar/>
      </View>
    </ScrollableLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: PawfectColors.secondary,
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    color: PawfectColors.secondary,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: PawfectColors.secondary,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: PawfectColors.secondary,
    opacity: 0.9,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
});