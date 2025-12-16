console.log('🚀 AppNavigator.js: Starting imports...');

try {
  console.log('🚀 AppNavigator.js: Importing React...');
  const React = require('react');
  console.log('✅ AppNavigator.js: React imported');
  
  console.log('🚀 AppNavigator.js: Importing navigation...');
  const { NavigationContainer } = require('@react-navigation/native');
  const { createStackNavigator } = require('@react-navigation/stack');
  console.log('✅ AppNavigator.js: Navigation imported');
  
  console.log('🚀 AppNavigator.js: Importing TestScreen...');
  const TestScreen = require('../screens/TestScreen').default;
  console.log('✅ AppNavigator.js: TestScreen imported');
  
  const Stack = createStackNavigator();
  
  const AppNavigator = () => {
    console.log('🧭 AppNavigator: Component rendering...');
    return React.createElement(
      NavigationContainer,
      null,
      React.createElement(
        Stack.Navigator,
        { initialRouteName: "Test" },
        React.createElement(Stack.Screen, {
          name: "Test",
          component: TestScreen,
          options: { title: 'Redux Test' }
        })
      )
    );
  };
  
  console.log('✅ AppNavigator.js: Component created successfully');
  
  // Export both ways to ensure compatibility
  module.exports = AppNavigator;
  module.exports.default = AppNavigator;
  
} catch (error) {
  console.error('❌ AppNavigator.js: Error:', error.message);
  console.error('❌ AppNavigator.js: Full error:', error);
  throw error;
}

export default AppNavigator;