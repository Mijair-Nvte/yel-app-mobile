const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Cambiamos el input para que apunte a la carpeta src
module.exports = withNativeWind(config, { input: './src/global.css' });