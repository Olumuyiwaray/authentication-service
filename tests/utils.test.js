const { checkPassword, createToken, hashPassword, } = require('../config/utils');

test('createToken should return a string', async () => {
    const response = await createToken(10)
    expect(typeof response).toBe('string');
});

test('checkPassword should return a boolean', async () => {
    const result = await checkPassword('john', 'etetetet');
    expect(typeof result).toBe('boolean');
});

test('hashPassword should return a string', async () => {
    const result = await hashPassword("goodluck");
    expect(typeof result).toBe('string');
});
