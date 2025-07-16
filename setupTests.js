import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
process.env.REACT_APP_API_URL = 'http://localhost:3000';
global.fetch = jest.fn();
