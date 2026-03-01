import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Lottery } from '../types';
import * as LotteryService from '../services/lottery';

export default function useLotteries() {
  const [lotteries, setLotteries] = useState<Array<Lottery>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchLotteries = () => {
    setLoading(true);
    setError(undefined);

    LotteryService.getLotteries()
      .then((lotteries) => {
        setLoading(false);
        setLotteries(lotteries);
      })
      .catch((e: Error) => {
        setLoading(false);
        setError(e.message);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchLotteries();
    }, []),
  );

  return {
    data: lotteries,
    loading,
    error,
    fetchLotteries,
  };
}
