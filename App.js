import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/store/simpleStore';
import PlainNavigator from './src/navigation/PlainNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PlainNavigator />
        <StatusBar style="auto" />
      </Provider>
    </SafeAreaProvider>
  );
}
