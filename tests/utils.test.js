const {
  createToken,
  hashPassword,
  comparePassword,
  genSalt
} = require('../config/utils');

test('createToken should return a string', async () => {
  const response = await createToken(10);
  expect(typeof response).toBe('string');
});

test('genSalt should generate salt', async () => {
  const response = await genSalt();
  expect(typeof response).toBe('string');
});

test('checkPassword should return a boolean', async () => {
  const result = await comparePassword('password', 'userPassword', 'userSalt');
  expect(typeof result).toBe('boolean');
});

test('hashPassword should return a string', async () => {
  const result = await hashPassword('password', 'salt');
  expect(typeof result).toBe('string');
});
