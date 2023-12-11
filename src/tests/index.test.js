const featureFlags = require('../index');
const { getFlag, setFlag } = require('../services/flags');
const { checkFlag } = require('../helpers/utils');

jest.mock('../services/flags');
jest.mock('../helpers/utils');

describe('Index Operations', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should call getFlag from flags module', () => {
        getFlag.mockReturnValue(true);

        const flagValue = featureFlags.getFlag('featureA');
        expect(flagValue).toEqual(true);
        expect(getFlag).toHaveBeenCalledWith('featureA');
    });

    it('should call setFlag from flags module', () => {
        setFlag.mockImplementation((flagName, value) => {
            expect(flagName).toEqual('featureB');
            expect(value).toEqual(true);
        });

        featureFlags.setFlag('featureB', true);
        expect(setFlag).toHaveBeenCalledWith('featureB', true);
    });

    it('should call checkFlag from utils module', () => {
        checkFlag.mockReturnValue(false);

        const flagValue = featureFlags.checkFlag('featureC');
        expect(flagValue).toEqual(false);
        expect(checkFlag).toHaveBeenCalledWith('featureC');
    });

    // Add more test cases as needed for additional functionalities in index.js
});
