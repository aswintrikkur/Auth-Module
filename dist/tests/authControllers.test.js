"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authControllers_1 = require("../controllers/authControllers");
const userModel_1 = require("../models/userModel");
const appError_1 = require("../utils/appError");
jest.mock('../models/userModel');
describe('registerUser', () => {
    const mockReq = {
        body: {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        },
    };
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    const mockNext = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should register a new user and return success', async () => {
        userModel_1.User.findOne.mockResolvedValue(null); // Fix here
        userModel_1.User.prototype.save.mockResolvedValue(undefined);
        userModel_1.User.prototype.toObject.mockReturnValue({
            _id: 'userId',
            name: 'Test User',
            email: 'test@example.com',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await (0, authControllers_1.registerUser)(mockReq, mockRes, mockNext);
        expect(userModel_1.User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' }); // Fix here
        expect(userModel_1.User.prototype.save).toHaveBeenCalled();
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
        const req = { body: { name: '', email: '', password: '' } };
        await (0, authControllers_1.registerUser)(req, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(expect.any(appError_1.AppError));
    });
    it('should call next with error if user already exists', async () => {
        userModel_1.User.find.mockResolvedValue([{}]);
        await (0, authControllers_1.registerUser)(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(expect.any(appError_1.AppError));
    });
});
