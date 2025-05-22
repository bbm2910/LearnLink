const { Message } = require('../models/Message');
const db = require('../database/connect');

jest.mock('../database/connect');

describe('Message model', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should insert a message and return a Message instance', async () => {
            const mockMessage = {
                message_id: 1,
                sender_id: 2,
                recipient_id: 3,
                message: "Hello!",
                sent_at: "2024-01-01T12:00:00Z"
            };

            db.query.mockResolvedValueOnce({ rows: [mockMessage] });

            const result = await Message.create({
                sender_id: 2,
                recipient_id: 3,
                message: "Hello!"
            });

            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO messages'), [2, 3, "Hello!"]);
            expect(result).toBeInstanceOf(Message);
            expect(result.message).toBe("Hello!");
        });
    });

    describe('getChatHistory', () => {
        it('should return ordered chat history between two users', async () => {
            const mockHistory = [
                {
                    senderId: 2,
                    recipientId: 3,
                    content: "Hey",
                    timestamp: "2024-01-01T10:00:00Z"
                },
                {
                    senderId: 3,
                    recipientId: 2,
                    content: "Hi!",
                    timestamp: "2024-01-01T10:01:00Z"
                }
            ];

            db.query.mockResolvedValueOnce({ rows: mockHistory });

            const result = await Message.getChatHistory(2, 3);

            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [2, 3]);
            expect(result).toEqual(mockHistory);
        });
    });

    describe('getConversationPartners', () => {
        it('should return a list of conversation partners with last message timestamp', async () => {
            const mockPartners = [
                {
                    user_id: 4,
                    email: "partner@example.com",
                    last_message_time: "2024-01-01T12:34:56Z"
                }
            ];

            db.query.mockResolvedValueOnce({ rows: mockPartners });

            const result = await Message.getConversationPartners(2);

            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [2]);
            expect(result).toEqual(mockPartners);
        });
    });

});
