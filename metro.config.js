// module.exports = {
//   // ... other config options ...
//   resolver: {
//     alias: {
//       '@app': 'app/_layout.tsx', // adjust the path according to your project structure
//     },
//     sourceExts: ['js', 'json', 'ts', 'tsx'],
//   },
// };

// const { getDefaultConfig } = require('expo/metro-config');

// const config = getDefaultConfig(__dirname);

// // module.exports = config;


// // const config = getDefaultConfig(__dirname);

// // config.resolver.sourceExts.push('_layout.tsx'); // Add 'layout' to the list of source extensions

// // module.exports = config;


// defaultConfig.resolver.assetExts.push('ts', 'tsx');
// defaultConfig.resolver.mainFields = ['module', 'main'];
// defaultConfig.resolver.sourceExts = ['ts', 'tsx'];
// defaultConfig.resolver.transformer = {
//   getTransformOptions: async () => ({
//     transform: {
//       experimentalImportSupport: true,
//       inlineRequires: true,
//     },
//   }),
// };
// defaultConfig.resolver.ignoreList = ['node_modules/**/*'];
// defaultConfig.resolver.root = __dirname;
// defaultConfig.resolver.modules = ['node_modules'];
// defaultConfig.resolver.extensions = ['.ts', '.tsx'];
// defaultConfig.resolver.mainFields = ['module', 'main'];
// defaultConfig.resolver.sourceExts = ['ts', 'tsx'];
// defaultConfig.resolver.transformer = {
//   getTransformOptions: async () => ({
//     transform: {
//       experimentalImportSupport: true,
//       inlineRequires: true,
//     },
//   }),
// };
// module.exports = defaultConfig;



const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);
// config.resolver.sourceExts.push('ts', 'tsx'); // Add TypeScript and TypeScript React extensions

module.exports = config;
// ------------------------------------------
// const {getDefaultConfig, mergeConfig} = require('@expo/metro-config');

// const config = {
//   resolver: {
//     alias: {
//       '@app': 'app/_layout.tsx', // adjust the path according to your project structure
//     },
//   },
// };

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);


// const { getDefaultConfig } = require('@expo/metro-config');

// module.exports = (async () => {
//   const config = await getDefaultConfig(__dirname);
//   return config;
// })();

// const { getDefaultConfig } = require('expo/metro-config');

// module.exports = (async () => {
//   const config = await getDefaultConfig(__dirname);
//   config.resolver.alias = {
//     '@app': 'app/_layout.tsx',
//   };
//   return config;
// })();