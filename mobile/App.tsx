import LotteriesScreen from './screens/LotteriesScreen';
import AddLotteryScreen from './screens/AddLotteryScreen';
import {
  createStaticNavigation,
  type StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { PaperProvider } from 'react-native-paper';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Lotteries',
  screens: {
    Lotteries: {
      screen: LotteriesScreen,
      options: { title: '' },
    },
    AddLottery: AddLotteryScreen,
  },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <PaperProvider>
      <Navigation />
      <Toast />
    </PaperProvider>
  );
}
