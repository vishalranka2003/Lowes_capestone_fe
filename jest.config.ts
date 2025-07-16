import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['./setupTests.js'],
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    
    // Coverage configuration
    collectCoverage: true, // Set to true to always collect coverage
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/index.js',
        '!src/reportWebVitals.js',
        '!src/**/*.d.ts',
        '!src/setupTests.js',
        '!src/**/__tests__/**',
        '!src/**/*.test.{js,jsx,ts,tsx}',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: [
        'text',
        'text-summary',
        'html',
        'lcov',
        'clover'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    }
};

export default config;