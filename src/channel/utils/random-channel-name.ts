import * as crypto from 'crypto';

const words: string[] = [
  'cool',
  'awesome',
  'chat',
  'connect',
  'network',
  'room',
  'fun',
  'friends',
  'friendship',
  'buddies',
  'buddy',
  'pals',
  'mates',
  'chums',
  'companions',
  'amigos',
  'acquaintances',
  'comrades',
  'confidants',
  'familiars',
  'intimates',
  'playmates',
  'gaming',
  'winning',
  'losing',
  'victory',
  'defeat',
  'ping',
];

const capitalizeWords = (str: string): string => {
  const words = str.split(' ');
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join(' ');
};

const generateRandomNumber = (min: number, max: number): number => {
  const range = max - min + 1;
  const randomBytes = crypto.randomBytes(4);
  const randomNumber = Math.floor(
    (randomBytes.readUInt32BE(0) / 0xffffffff) * range,
  );
  return min + randomNumber;
};

export function randomChannelName(): string {
  const numWords = generateRandomNumber(2, 3);
  const selectedWords = [];

  while (selectedWords.length < numWords)
    selectedWords.push(words[generateRandomNumber(0, words.length - 1)]);

  return capitalizeWords(selectedWords.join(' '));
}
