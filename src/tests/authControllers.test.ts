import { registerUser } from '../controllers/authControllers';
import { User } from '../models/userModel';
import { AppError } from '../utils/appError';

jest.mock('../models/userModel');

describe('registerUser', () => {
  const mockReq: any = {
    body: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    },
  };
  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user and return success', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null); // Fix here
    (User.prototype.save as jest.Mock).mockResolvedValue(undefined);
    (User.prototype.toObject as jest.Mock).mockReturnValue({
      _id: 'userId',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await registerUser(mockReq, mockRes, mockNext);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' }); // Fix here
    expect(User.prototype.save).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'User registered successfully',
      data: {
        _id: 'userId',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });

  it('should call next with error if required fields are missing', async () => {
    const req = { body: { name: '', email: '', password: '' } } as any;
    await registerUser(req, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should call next with error if user already exists', async () => {
    (User.find as jest.Mock).mockResolvedValue([{}]);
    await registerUser(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
  });
});
