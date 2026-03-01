import { useCallback, useLayoutEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  FAB,
  Text,
  TextInput,
} from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import useLotteries from '../hooks/useLotteries';
import RegisterModal from '../components/RegisterModal';
import { Lottery } from '../types';

const REGISTERED_KEY = 'registeredLotteries';

interface LotteryCardProps {
  lottery: Lottery;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

function LotteryCard({
  lottery,
  selected,
  disabled,
  onSelect,
}: LotteryCardProps) {
  return (
    <Card
      mode="outlined"
      onPress={disabled ? undefined : onSelect}
      style={{
        marginBottom: 12,
        ...(selected && { borderColor: '#42a5f5', borderWidth: 2 }),
        ...(disabled && { opacity: 0.4, backgroundColor: 'grey' }),
      }}
    >
      <MaterialCommunityIcons
        name="sync"
        size={20}
        style={{ position: 'absolute', top: 8, right: 8 }}
      />
      <Card.Content>
        <Text variant="titleMedium">{lottery.name}</Text>
        <Text variant="bodySmall">{lottery.prize}</Text>
        <Text variant="bodySmall">{lottery.id}</Text>
      </Card.Content>
    </Card>
  );
}

export default function LotteriesScreen() {
  const navigation = useNavigation();
  const lotteries = useLotteries();
  const [filter, setFilter] = useState('');
  const [selectedLotteries, setSelectedLotteries] = useState<string[]>([]);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [registeredLotteries, setRegisteredLotteries] = useState<string[]>([]);

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
      <FlatList
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
        ListHeaderComponent={
          <>
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
          </>
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
