import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/store/simpleStore';
import PlainNavigator from './src/navigation/PlainNavigator';

console.log('🚀 App: Testing with Redux + Simple Navigation');
console.log('📊 Store state:', store.getState());

export default function App() {
  console.log('🚀 QAXIM: APP Rendering with Redux...');

  
  
  return (
    <SafeAreaProvider >
      <Provider store={store}>
        <PlainNavigator />
        <StatusBar style="auto" />
      </Provider>
    </SafeAreaProvider>
  );
}
