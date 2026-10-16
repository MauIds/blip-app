import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

import './src/i18n';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
