import { AppService } from "./app.service";

describe('TEST Sum() method', () => {
    let appSevice: AppService;

    beforeEach(() => {
        appSevice = new AppService();
    })

    const cases = [
        { a: 5, b: 10, result: 15 },
        { a: 0, b: 0, result: 0 },
        { a: -5, b: 5, result: 0 },
        { a: -10, b: -5, result: -15 },
        { a: 100, b: 200, result: 300 },
        { a: 1.5, b: 2.5, result: 4 },
        { a: 123, b: 321, result: 444 },
        { a: -50, b: 100, result: 50 },
        { a: 9999, b: 1, result: 10000 },
        { a: 0.1, b: 0.2, result: 0.3 },
        { a: 7, b: 3, result: 10 },
        { a: -7, b: -3, result: -10 },
        { a: 10, b: -3, result: 7 },
        { a: -10, b: 3, result: -7 },
        { a: 50, b: 50, result: 100 },
        { a: 1000, b: 2000, result: 3000 },
        { a: 1234, b: 4321, result: 5555 },
        { a: 999, b: 999, result: 1998 },
        { a: 1, b: 9999, result: 10000 },
        { a: 12.34, b: 56.78, result: 69.12 },
        { a: 0.5, b: -0.25, result: 0.25 },
        { a: -0.75, b: -0.25, result: -1 },
        { a: 250, b: 750, result: 1000 },
        { a: 1e3, b: 2e3, result: 3000 },
        { a: 0, b: -10, result: -10 },
        { a: -10, b: 0, result: -10 },
        { a: 42, b: 58, result: 100 },
        { a: 3.14, b: 2.86, result: 6 },
        { a: 0.333, b: 0.667, result: 1 },
        { a: 500, b: -250, result: 250 },
        { a: -500, b: 250, result: -250 },
        { a: 123456, b: 654321, result: 777777 },
        { a: -123456, b: -654321, result: -777777 },
        { a: 0.0001, b: 0.0002, result: 0.0003 },
        { a: 1.111, b: 2.222, result: 3.333 },
        { a: 9.99, b: 0.01, result: 10 },
        { a: 10.5, b: -0.5, result: 10 },
        { a: 8, b: 12, result: 20 },
        { a: 15, b: 35, result: 50 },
        { a: 2500, b: 7500, result: 10000 },
        { a: -2500, b: 500, result: -2000 },
        { a: 600, b: 400, result: 1000 },
        { a: 0.25, b: 0.75, result: 1 },
        { a: 0.99, b: 0.01, result: 1 },
        { a: -1, b: -9, result: -10 },
        { a: 2, b: 8, result: 10 },
        { a: 100, b: -200, result: -100 },
        { a: -100, b: 200, result: 100 },
        { a: 314, b: 271, result: 585 }
    ];

    // unit test 
    test.each(cases)('sum($a, $b) = $result', ({ a, b, result }) => {
        expect(appSevice.sum(a, b)).toBe(result);
    })
})