const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add support for react-native-vector-icons
//   config.resolve.alias = {
//     ...config.resolve.alias,
//     'react-native-vector-icons/MaterialCommunityIcons': 'react-native-vector-icons/dist/MaterialCommunityIcons',
//     'react-native-vector-icons/MaterialIcons': 'react-native-vector-icons/dist/MaterialIcons',
//     'react-native-vector-icons/Ionicons': 'react-native-vector-icons/dist/Ionicons',
//     'react-native-vector-icons/FontAwesome': 'react-native-vector-icons/dist/FontAwesome',
//   };


  // ① サブパッケージを install 済みなら不要 --------------------
  config.resolve.alias['@react-native-vector-icons/material-design-icons'] =
    '@expo/vector-icons/MaterialIcons';

  // ③ Expo 版に一括置換する場合のみ ---------------------------
  Object.assign(config.resolve.alias, {
    'react-native-vector-icons': '@expo/vector-icons',
    '@react-native-vector-icons': '@expo/vector-icons',
  });

  return config;
}; 
