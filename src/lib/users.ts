import type { User } from './types';

export const avatarStyles = [
  { bg: 'bg-pink-500', text: 'text-white' },
  { bg: 'bg-blue-500', text: 'text-white' },
  { bg: 'bg-amber-500', text: 'text-white' },
  { bg: 'bg-emerald-500', text: 'text-white' },
  { bg: 'bg-purple-500', text: 'text-white' },
  { bg: 'bg-red-500', text: 'text-white' },
  { bg: 'bg-indigo-500', text: 'text-white' },
  { bg: 'bg-teal-500', text: 'text-white' },
];

export const getAvatarStyle = (userId: string) => {
  const index =
    Math.abs(
      userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % avatarStyles.length;
  return avatarStyles[index];
};

export const users: User[] = [
  {
    id: 'dd',
    name: 'Daniel Denis',
    email: 'daniel@example.com',
    avatar: '/placeholder.svg?height=32&width=32',
    color: 'bg-pink-500',
    style: avatarStyles[0],
  },
  {
    id: 'js',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: '/placeholder.svg?height=32&width=32',
    color: 'bg-blue-500',
    style: avatarStyles[1],
  },
  {
    id: 'jd',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/placeholder.svg?height=32&width=32',
    color: 'bg-amber-500',
    style: avatarStyles[2],
  },
  {
    id: 'ak',
    name: 'Alice Kim',
    email: 'alice@example.com',
    avatar: '/placeholder.svg?height=32&width=32',
    color: 'bg-emerald-500',
    style: avatarStyles[3],
  },
];
