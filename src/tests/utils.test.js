const { checkFlag } = require('../helpers/utils');
const { getFlag } = require('../services/flags');

jest.mock('../services/flags');

describe('Utils Operations', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return the flag value when flag exists', () => {
        // Mock getFlag to return true for 'featureX'
        getFlag.mockImplementation((flagName) => {
            if (flagName === 'featureX') {
                return true;
            }
        });

        const flagValue = checkFlag('featureX');
        expect(flagValue).toEqual(true);
        expect(getFlag).toHaveBeenCalledWith('featureX');
    });

    it('should throw an error when getting a non-existing flag', () => {
        // Mock getFlag to throw an error for non-existing flag
        getFlag.mockImplementation(() => {
            throw new Error('Flag does not exist');
        });

        expect(() => {
            checkFlag('nonExistentFlag');
        }).toThrowError('Flag does not exist');
    });

    it('should handle different flag values', () => {
        // Mock getFlag for different flag values
        getFlag.mockImplementation((flagName) => {
            switch (flagName) {
                case 'featureY':
                    return false;
                case 'featureZ':
                    return 'someString';
                default:
                    throw new Error('Flag does not exist');
            }
        });

        expect(checkFlag('featureY')).toEqual(false);
        expect(checkFlag('featureZ')).toEqual('someString');
    });

    // Add more test cases for different scenarios and edge cases
});
