import { Lottery } from '../types';

export async function getLotteries(): Promise<Array<Lottery>> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/lotteries`,
    );

    const body = (await response.json()) as Array<Lottery>;

    return body;
  } catch (e) {
    console.error(e);

    throw e;
  }
}

export async function createNewLottery({
  name,
  prize,
}: {
  name: string;
  prize: string;
}): Promise<Lottery> {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/lotteries`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'simple',
          name,
          prize,
        }),
      },
    );

    const body = (await response.json()) as Lottery;

    return body;
  } catch (e) {
    console.error(e);

    throw e;
  }
}
