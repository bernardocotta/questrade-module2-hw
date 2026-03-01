import { useState } from 'react';
import { View, FlatList } from 'react-native';
import {
  ActivityIndicator,
  Card,
  FAB,
  Text,
  TextInput,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import useLotteries from '../hooks/useLotteries';
import { Lottery } from '../types';

function LotteryCard({ lottery }: { lottery: Lottery }) {
  return (
    <Card mode="outlined" style={{ marginBottom: 12 }}>
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

  const filteredLotteries = lotteries.data.filter((lottery) =>
    lottery.name.includes(filter),
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={filteredLotteries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LotteryCard lottery={item} />}
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
    </View>
  );
}
