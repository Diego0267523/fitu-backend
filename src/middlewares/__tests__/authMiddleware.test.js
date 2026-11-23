const jwt = require('jsonwebtoken');
const verifyToken = require('../authMiddleware');
const verifyTokenOptional = require('../authMiddlewareOptional');

const SECRET = 'test-secret';

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeAll(() => {
  process.env.JWT_SECRET = SECRET;
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => jest.restoreAllMocks());

describe('verifyToken', () => {
  test('responde 401 si no hay header Authorization', () => {
    const res = mockRes();
    const next = jest.fn();
    verifyToken({ headers: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('responde 401 si el token es inválido', () => {
    const res = mockRes();
    const next = jest.fn();
    verifyToken({ headers: { authorization: 'Bearer token-falso' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('acepta "Bearer <token>" y guarda el id en req.user', () => {
    const token = jwt.sign({ id: 7 }, SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();
    verifyToken(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 7 });
  });

  test('acepta el token sin prefijo Bearer', () => {
    const token = jwt.sign({ userId: 9 }, SECRET);
    const req = { headers: { authorization: token } };
    const next = jest.fn();
    verifyToken(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 9 });
  });
});

describe('verifyTokenOptional', () => {
  test('continúa sin usuario si no hay token', () => {
    const req = { headers: {} };
    const next = jest.fn();
    verifyTokenOptional(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  test('continúa sin usuario si el token es inválido', () => {
    const req = { headers: { authorization: 'Bearer malo' } };
    const next = jest.fn();
    verifyTokenOptional(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  test('establece req.user con un token válido', () => {
    const token = jwt.sign({ id: 3 }, SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();
    verifyTokenOptional(req, mockRes(), next);
    expect(req.user).toEqual({ id: 3 });
  });
});
