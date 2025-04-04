import '@testing-library/jest-dom';
import { TextEncoder } from 'util';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
global.TextEncoder = TextEncoder;
