import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  FAB,
  Text,
  TextInput,
} from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import useLotteries from '../hooks/useLotteries';
import LotteryCard from '../components/LotteryCard';
import RegisterModal from '../components/RegisterModal';

const REGISTERED_KEY = 'registeredLotteries';

const HEADER_MAX = 150;
const SCROLL_DISTANCE = 100;

export default function LotteriesScreen() {
  const navigation = useNavigation();
  const lotteries = useLotteries();
  const [filter, setFilter] = useState('');
  const [selectedLotteries, setSelectedLotteries] = useState<string[]>([]);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [registeredLotteries, setRegisteredLotteries] = useState<string[]>([]);

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [HEADER_MAX, 0],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(REGISTERED_KEY).then((value) => {
        if (value) {
          setRegisteredLotteries(JSON.parse(value));
        }
      });
    }, []),
  );

  const handleSelect = useCallback(
    (lotteryId: string) => {
      if (registeredLotteries.includes(lotteryId)) {
        return;
      }
      setSelectedLotteries((prev) => {
        const index = prev.indexOf(lotteryId);
        if (index >= 0) {
          return [...prev.slice(0, index), ...prev.slice(index + 1)];
        }
        return [...prev, lotteryId];
      });
    },
    [registeredLotteries],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          disabled={selectedLotteries.length === 0}
          onPress={() => setRegisterModalVisible(true)}
        >
          Register
        </Button>
      ),
    });
  }, [navigation, selectedLotteries.length]);

  const filteredLotteries = lotteries.data.filter((lottery) =>
    lottery.name.includes(filter),
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Animated.FlatList
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        data={filteredLotteries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LotteryCard
            lottery={item}
            selected={selectedLotteries.includes(item.id)}
            disabled={registeredLotteries.includes(item.id)}
            onSelect={() => handleSelect(item.id)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListHeaderComponentStyle={{ marginBottom: 16 }}
        ListHeaderComponent={
          <Animated.View
            style={{
              height: headerHeight,
              opacity: headerOpacity,
              transform: [{ scale: headerScale }],
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 24,
              }}
            >
              <Text variant="headlineLarge">Lotteries</Text>
              <MaterialCommunityIcons
                name="dice-5"
                size={32}
                style={{ marginLeft: 12 }}
              />
            </View>
            <TextInput
              mode="outlined"
              placeholder="Filter lotteries"
              value={filter}
              onChangeText={setFilter}
              right={<TextInput.Icon icon="magnify" />}
              style={{ marginBottom: 16 }}
            />
          </Animated.View>
        }
        ListEmptyComponent={
          lotteries.loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 32 }} />
          ) : lotteries.data.length === 0 ? (
            <Text
              variant="bodyLarge"
              style={{ textAlign: 'center', marginTop: 32 }}
            >
              There are no lotteries currently
            </Text>
          ) : (
            <Text
              variant="bodyLarge"
              style={{ textAlign: 'center', marginTop: 32 }}
            >
              No search results for '{filter}'
            </Text>
          )
        }
      />
      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        onPress={() => navigation.navigate('AddLottery')}
      />
      <RegisterModal
        visible={registerModalVisible}
        onClose={() => setRegisterModalVisible(false)}
        onSubmit={() => {
          const merged = [
            ...new Set([...registeredLotteries, ...selectedLotteries]),
          ];
          AsyncStorage.setItem(REGISTERED_KEY, JSON.stringify(merged));
          setRegisteredLotteries(merged);
          setSelectedLotteries([]);
          Toast.show({
            type: 'success',
            text1: 'Registered to lotteries successfully!',
          });
        }}
        selectedLotteries={selectedLotteries}
      />
    </View>
  );
}
