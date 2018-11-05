const lib = require('../lib');

describe('absolute', () => {
    it('sould return a positive number if input is positive', () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });

    it('sould return a positive number if input is negative', () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });

    it('should return 0 if input is 0', () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

describe('greet', () => {
    it('should return the greeting message', () => {
        const result = lib.greet('Boram');

        expect(result).toMatch(/Boram/);
        expect(result).toContain('Boram');
        // expect(result).toBe('Welcome Boram'); // Bad
    })
});

describe('getCurrencies', () => {
    it('should return supported currencies', () => {
        const result = lib.getCurrencies();

        // Too general
        expect(result).toBeDefined();
        expect(result).not.toBeNull();

        // To specific
        expect(result[0]).toBe('USD');
        expect(result[1]).toBe('AUD');
        expect(result[2]).toBe('EUR');
        expect(result.length).toBe(3);

        // Proper way
        expect(result).toContain('USD');
        expect(result).toContain('AUD');
        expect(result).toContain('EUR');

        // Ideal way
        expect(result).toEqual(expect.arrayContaining(['EUR', 'USD', 'AUD']));

    });
});

describe('getProduct', () => {
    it('should return the product with the given id', () => {
        const result = lib.getProduct(1);
        // expect(result).toEqual({ id: 1, price: 10 });

        expect(result).toMatchObject({ id: 1, price: 10 });
        expect(result).toHaveProperty('id', 1); // test value type

    })
});

describe('registerUser', () => {
    it('should throw if username is falsy', () => {
        // falsy: Null, undefined, NaN, '', 0, false
        const falsy = [null, undefined, NaN, '', 0, false];
        falsy.forEach(v => {
            expect(() => { lib.registerUser(v) }).toThrow();
        })
    });
    
    it('should return a user object if valid username is passed', () => {
        const result = lib.registerUser('boram');
        expect(result).toMatchObject({username: 'boram'});
        expect(result.id).toBeGreaterThan(0);
    });

})
// test('absolute - sould return a positive number if input is positive', () => {
//     const result = lib.absolute(1);
//     expect(result).toBe(1);
// });

// test('absolute - sould return a positive number if input is negative', () => {
//     const result = lib.absolute(-1);
//     expect(result).toBe(1);
// });

// test('absolute - should return 0 if input is 0', () => {
//     const result = lib.absolute(0);
//     expect(result).toBe(0);
// });