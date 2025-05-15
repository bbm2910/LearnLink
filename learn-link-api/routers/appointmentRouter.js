const { Router } = require('express');

const appointmentController = require('../controllers/appointmentController');
const authenticator = require('../middleware/authenticator');

const appointmentRouter = Router()

appointmentRouter.post('/', authenticator, appointmentController.createAppointment);
appointmentRouter.post('/respond', authenticator, appointmentController.respondToAppointment);
appointmentRouter.get('/', authenticator, appointmentController.getAppointments);
appointmentRouter.get('/pending', authenticator, appointmentController.getPendingAppointments)

module.exports = { appointmentRouter };