const { User } = require('../models/User');
const db = require('../database/connect');

jest.mock('../database/connect');

describe('User model', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a new user and return a User instance', async () => {
      const mockId = 1;
      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        postcode: '12345',
        image_url: 'http://example.com/image.jpg'
      };

      const mockUserRow = {
        user_id: mockId,
        ...userData
      };

      db.query
        .mockResolvedValueOnce({ rows: [{ user_id: mockId }] }) // insert
        .mockResolvedValueOnce({ rows: [mockUserRow] }); // getUserById

      const result = await User.create(userData);

      expect(db.query).toHaveBeenCalledTimes(2);
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe('john@example.com');
    });
  });

  describe('getUserById', () => {
    it('should return a User instance for a valid user ID', async () => {
      const mockUser = {
        user_id: 2,
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice@example.com',
        password: 'password',
        postcode: '45678',
        image_url: null
      };

      db.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.getUserById(2);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [2]);
      expect(result).toBeInstanceOf(User);
      expect(result.first_name).toBe('Alice');
    });

    it('should throw an error if user not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(User.getUserById(999)).rejects.toThrow('Unable to locate user');
    });
  });

  describe('getOneByEmail', () => {
    it('should return a User instance for a valid email', async () => {
      const mockUser = {
        user_id: 3,
        first_name: 'Bob',
        last_name: 'Brown',
        email: 'bob@example.com',
        password: 'password123',
        postcode: '11111',
        image_url: null
      };

      db.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.getOneByEmail('bob@example.com');

      expect(db.query).toHaveBeenCalledWith(expect.any(String), ['bob@example.com']);
      expect(result).toBeInstanceOf(User);
      expect(result.last_name).toBe('Brown');
    });

    it('should throw an error if no user found with the email', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(User.getOneByEmail('notfound@example.com')).rejects.toThrow('Unable to locate user');
    });
  });

  describe('getTopUsers', () => {
    it('should return a list of top users with session counts', async () => {
      const mockUsers = [
        {
          user_id: 10,
          first_name: 'Emma',
          last_name: 'Watson',
          image_url: 'http://example.com/emma.jpg',
          sessions_taught: '5'
        },
        {
          user_id: 11,
          first_name: 'Daniel',
          last_name: 'Radcliffe',
          image_url: 'http://example.com/daniel.jpg',
          sessions_taught: '3'
        }
      ];

      db.query.mockResolvedValueOnce({ rows: mockUsers });

      const result = await User.getTopUsers(2);

      expect(db.query).toHaveBeenCalledWith(expect.any(String), [2]);
      expect(result.length).toBe(2);
      expect(result[0].sessions_taught).toBe(5);
    });
  });

});
