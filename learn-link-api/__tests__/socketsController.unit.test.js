const { handleSocketEvents } = require('../../learn-link-api/controllers/socketController');
const { Message } = require('../../learn-link-api/models/Message');
const { User } = require('../../learn-link-api/models/User');

jest.mock('../../learn-link-api/models/Message');
jest.mock('../../learn-link-api/models/User');

describe('socketController', () => {
  let socket, io;

  const mockUser = { user_id: 1, email: 'alice@example.com' };
  const recipient = { user_id: 2, email: 'bob@example.com' };

  beforeEach(() => {
    socket = {
      user: mockUser,
      on: jest.fn(),
      emit: jest.fn(),
      join: jest.fn(),
    };

    io = {
      to: jest.fn(() => ({
        emit: jest.fn(),
      })),
    };

    handleSocketEvents(io, socket);
  });

  it('should join the correct room on connection', () => {
    expect(socket.join).toHaveBeenCalledWith(`user_${mockUser.user_id}`);
  });

  it('should handle private message event and emit to recipient and sender', async () => {
    const fakeMessage = {
      sender_id: mockUser.user_id,
      recipient_id: recipient.user_id,
      message: 'Hello Bob!',
      sent_at: new Date().toISOString(),
    };

    // Setup mock behavior
    User.getOneByEmail.mockResolvedValue(recipient);
    User.getUserById.mockResolvedValue(mockUser);
    Message.create.mockResolvedValue(fakeMessage);

    const registeredEvents = {};
    socket.on.mockImplementation((event, callback) => {
      registeredEvents[event] = callback;
    });

    // Re-register with mock on
    handleSocketEvents(io, socket);

    // Trigger the private_message handler
    await registeredEvents['private_message']({
      recipientEmail: recipient.email,
      message: 'Hello Bob!',
    });

    expect(User.getOneByEmail).toHaveBeenCalledWith(recipient.email);
    expect(Message.create).toHaveBeenCalledWith({
      sender_id: mockUser.user_id,
      recipient_id: recipient.user_id,
      message: 'Hello Bob!',
    });

    // Check if message is sent to recipient
    expect(io.to).toHaveBeenCalledWith(`user_${recipient.user_id}`);
    expect(io.to().emit).toHaveBeenCalledWith('private_message', expect.objectContaining({
      senderId: mockUser.user_id,
      recipientId: recipient.user_id,
      message: 'Hello Bob!',
    }));

    // Check echo to sender
    expect(socket.emit).toHaveBeenCalledWith('private_message', expect.objectContaining({
      senderId: mockUser.user_id,
      recipientId: recipient.user_id,
      message: 'Hello Bob!',
    }));
  });

  it('should emit error if recipient email is missing', async () => {
    const registeredEvents = {};
    socket.on.mockImplementation((event, callback) => {
      registeredEvents[event] = callback;
    });

    handleSocketEvents(io, socket);

    await registeredEvents['private_message']({
      message: 'No recipient',
    });

    expect(socket.emit).toHaveBeenCalledWith('error', {
      message: 'Recipient or message missing',
    });
  });

  it('should handle get_chat_history_by_email', async () => {
    const mockMessages = [
      { senderId: mockUser.user_id, recipientId: recipient.user_id, message: 'Hey Bob' },
    ];

    const registeredEvents = {};
    socket.on.mockImplementation((event, callback) => {
      registeredEvents[event] = callback;
    });

    User.getOneByEmail.mockResolvedValue(recipient);
    Message.getChatHistory.mockResolvedValue(mockMessages);
    User.getUserById.mockResolvedValue(mockUser);

    handleSocketEvents(io, socket);

    await registeredEvents['get_chat_history_by_email']({
      email: recipient.email,
    });

    expect(socket.emit).toHaveBeenCalledWith('chat_history', expect.any(Array));
  });

  it('should handle get_conversations', async () => {
    const partners = [{ email: 'bob@example.com', user_id: 2 }];

    const registeredEvents = {};
    socket.on.mockImplementation((event, callback) => {
      registeredEvents[event] = callback;
    });

    Message.getConversationPartners.mockResolvedValue(partners);

    handleSocketEvents(io, socket);

    await registeredEvents['get_conversations']();

    expect(socket.emit).toHaveBeenCalledWith('conversation_list', partners);
  });
});
