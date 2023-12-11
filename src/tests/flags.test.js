const { getFlag, setFlag } = require('../services/flags');

describe('Flag Operations', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should set and get a flag', () => {
        setFlag('featureA', true);
        expect(getFlag('featureA')).toEqual(true);
    });

    it('should throw an error when getting a non-existing flag', () => {
        expect(() => {
            getFlag('nonExistentFlag');
        }).toThrowError('Flag "nonExistentFlag" doesn\'t exist.');
    });

    it('should update an existing flag', () => {
        setFlag('featureB', false);
        expect(getFlag('featureB')).toEqual(false);

        setFlag('featureB', true);
        expect(getFlag('featureB')).toEqual(true);
    });

    it('should handle setting and getting multiple flags', () => {
        setFlag('featureC', true);
        setFlag('featureD', false);

        expect(getFlag('featureC')).toEqual(true);
        expect(getFlag('featureD')).toEqual(false);
    });

    it('should handle updating non-existing flags', () => {
        expect(() => {
            setFlag('featureE', true);
        }).not.toThrow();

        expect(getFlag('featureE')).toEqual(true);
    });

    it('should handle updating flags with falsy values', () => {
        setFlag('featureF', 0);
        expect(getFlag('featureF')).toEqual(0);

        setFlag('featureG', '');
        expect(getFlag('featureG')).toEqual('');
    });

    it('should handle updating flags with complex values', () => {
        const complexValue = { prop1: 'value1', prop2: 123 };
        setFlag('featureH', complexValue);
        expect(getFlag('featureH')).toEqual(complexValue);
    });

    // Additional test cases can be added to cover more scenarios
});
