const { validate, loginSchema } = require('../validation');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('validate(loginSchema)', () => {
  test('responde 400 con la lista de errores si el cuerpo es inválido', () => {
    const res = mockRes();
    const next = jest.fn();
    validate(loginSchema)({ body: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].errors.length).toBeGreaterThan(0);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('validate(loginSchema) con datos correctos', () => {
  test('llama a next() sin responder', () => {
    const res = mockRes();
    const next = jest.fn();
    validate(loginSchema)({ body: { email: 'a@b.com', password: '123456' } }, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
