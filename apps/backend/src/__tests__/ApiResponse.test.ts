import { ApiResponse } from '../core/utils/ApiResponse';
import { Response } from 'express';

describe('ApiResponse Utility', () => {
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: { requestId: 'test-req-id' }
    };
  });

  it('should format success response correctly', () => {
    ApiResponse.success(mockRes as Response, { user: 'test' }, 'Custom Message', 201);
    
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'Custom Message',
      data: { user: 'test' },
      requestId: 'test-req-id'
    }));
  });

  it('should format error response correctly', () => {
    ApiResponse.error(mockRes as Response, 'Something went wrong', 400, 'BAD_REQUEST', { field: 'email' });
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Something went wrong',
      error: expect.objectContaining({
        code: 'BAD_REQUEST',
        details: { field: 'email' }
      }),
      requestId: 'test-req-id'
    }));
  });
});
