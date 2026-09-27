import { Tabs } from 'expo-router/tabs';

import { TabBar } from '@/components/navigation/TabBar';
import { colors } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.cream } }}>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explorar' }} />
      <Tabs.Screen name="play" options={{ title: 'Brincar' }} />
      <Tabs.Screen name="collection" options={{ title: 'Bichupédia' }} />
    </Tabs>
  );
}
