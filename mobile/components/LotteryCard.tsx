import { Card, Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Lottery } from '../types';

interface LotteryCardProps {
  lottery: Lottery;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

export default function LotteryCard({
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
