const appointmentController = require('../controllers/appointmentController');
const Appointment = require('../models/Appointment');

jest.mock('../models/Appointment');

describe('Appointment Controller', () => {

    const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    const mockUser = { user_id: 'user123' };

    describe('createAppointment', () => {
        it('should create an appointment and return 201', async () => {
            const req = {
                user: mockUser,
                body: {
                    receiverId: 'receiver456',
                    startTime: '2025-06-01T10:00:00Z',
                    duration: 60
                }
            };
            const res = mockRes();
            const mockAppointment = { id: 'appt789', ...req.body, requesterId: req.user.user_id };

            Appointment.createAppointment.mockResolvedValue(mockAppointment);

            await appointmentController.createAppointment(req, res);

            expect(Appointment.createAppointment).toHaveBeenCalledWith({
                requesterId: 'user123',
                receiverId: 'receiver456',
                startTime: '2025-06-01T10:00:00Z',
                duration: 60
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockAppointment);
        });

        it('should handle errors in appointment creation', async () => {
            const req = {
                user: mockUser,
                body: {
                    receiverId: 'receiver456',
                    startTime: 'invalid',
                    duration: 60
                }
            };
            const res = mockRes();
            Appointment.createAppointment.mockRejectedValue(new Error('DB error'));

            await appointmentController.createAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create appointment' });
        });
    });

    describe('respondToAppointment', () => {
        it('should respond to an existing appointment', async () => {
            const req = {
                body: {
                    appointmentId: 'appt001',
                    status: 'accepted'
                }
            };
            const res = mockRes();

            const mockAppointment = {
                id: 'appt001',
                respond: jest.fn().mockResolvedValue({ id: 'appt001', status: 'accepted' })
            };

            Appointment.findById.mockResolvedValue(mockAppointment);

            await appointmentController.respondToAppointment(req, res);

            expect(Appointment.findById).toHaveBeenCalledWith('appt001');
            expect(mockAppointment.respond).toHaveBeenCalledWith('accepted');
            expect(res.json).toHaveBeenCalledWith({ id: 'appt001', status: 'accepted' });
        });

        it('should return 404 if appointment not found', async () => {
            const req = { body: { appointmentId: 'missing', status: 'declined' } };
            const res = mockRes();

            Appointment.findById.mockResolvedValue(null);

            await appointmentController.respondToAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Appointment not found' });
        });

        it('should handle errors in respondToAppointment', async () => {
            const req = { body: { appointmentId: 'error-id', status: 'declined' } };
            const res = mockRes();

            Appointment.findById.mockRejectedValue(new Error('DB Error'));

            await appointmentController.respondToAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update appointment' });
        });
    });

    describe('getAppointments', () => {
        it('should return a list of appointments', async () => {
            const req = { user: mockUser };
            const res = mockRes();
            const mockAppointments = [{ id: '1' }, { id: '2' }];

            Appointment.getUserAppointments.mockResolvedValue(mockAppointments);

            await appointmentController.getAppointments(req, res);

            expect(Appointment.getUserAppointments).toHaveBeenCalledWith('user123');
            expect(res.json).toHaveBeenCalledWith(mockAppointments);
        });

        it('should handle error while fetching appointments', async () => {
            const req = { user: mockUser };
            const res = mockRes();

            Appointment.getUserAppointments.mockRejectedValue(new Error('DB error'));

            await appointmentController.getAppointments(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch appointments' });
        });
    });

    describe('getPendingAppointments', () => {
        it('should return pending appointments in formatted response', async () => {
            const req = { user: mockUser };
            const res = mockRes();
            const mockPending = [
                { id: '1', requesterId: 'a1', startTime: 'time1', duration: 30 },
                { id: '2', requesterId: 'a2', startTime: 'time2', duration: 60 }
            ];

            Appointment.getPendingAppointments.mockResolvedValue(mockPending);

            await appointmentController.getPendingAppointments(req, res);

            expect(Appointment.getPendingAppointments).toHaveBeenCalledWith('user123');
            expect(res.json).toHaveBeenCalledWith([
                { id: '1', requester_id: 'a1', start_time: 'time1', duration: 30 },
                { id: '2', requester_id: 'a2', start_time: 'time2', duration: 60 }
            ]);
        });

        it('should handle error while fetching pending appointments', async () => {
            const req = { user: mockUser };
            const res = mockRes();

            Appointment.getPendingAppointments.mockRejectedValue(new Error('DB error'));

            await appointmentController.getPendingAppointments(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch pending appointments' });
        });
    });
});
