import { Redirect } from 'expo-router';

export default function Index() {
  // You can add logic here to determine where to redirect based on auth status
  return <Redirect href="/(auth)/login" />;
}