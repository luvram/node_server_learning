const exercise = require('../exercise1');

describe('fizzBuzz', () => {
    it('should throw an exception if input is not a number', () =>{
        const notNumberValues = [null, undefined, NaN, '', false, '1', ['1'], {}];
        notNumberValues.forEach(v => {
            expect(() => { exercise.fizzBuzz()}).toThrow();
        });
    });
    it('should get FizzBuzz if input is divisible by 3 and 5', () => {
        const result = exercise.fizzBuzz(15);
        expect(result).toBe('FizzBuzz');
    });
    it('should get FizzBuzz if input is 0', () => {
        const result = exercise.fizzBuzz(0);
        expect(result).toMatch('FizzBuzz');
    });
    it('should get Fizz if input is divisible by 3', () => {
        const result = exercise.fizzBuzz(6);
        expect(result).toBe('Fizz');
    });
    it('should get Buzz if input is divisible by 5', () => {
        const result = exercise.fizzBuzz(10);
        expect(result).toBe('Buzz');
    });
    it('should get input if input is not divisible by 3 or 5', () => {
        const result = exercise.fizzBuzz(1);
        expect(result).toBe(1);
    });
})