const Appointment = require('../models/Appointment')

async function createAppointment(req, res) {
    try {
        const {receiverId, startTime, duration} = req.body
        const requesterId = req.user.id
        console.log('JWT Token UserID: ', requesterId);
        const appointment = await Appointment.createAppointment({
            requesterId,
            receiverId,
            startTime,
            duration,
        });

        res.status(201).json(appointment)

    } catch(error){
        res.status(500).json({error: 'Failed to create appointment'})
    }
};

async function respondToAppointment(req, res){
    try {
        const {appointmentId, status} = req.body
        const appointment = await Appointment.findById(appointmentId)

        if(!appointment) return res.status(404).json({error: 'Appointment not found'});

        const updatedAppointment = await appointment.respond(status)
        res.json(updatedAppointment)
    } catch (error) {
        res.status(500).json({error: 'Failed to update appointment'})
    }
};

async function getAppointments(req, res){
    try {
        const appointments = await Appointment.getUserAppointments(req.user.id)
        res.json(appointments)
    } catch (error){
        res.status(500).json({error: 'Failed to fetch appointments'})
    }
};

async function getPendingAppointments(req, res) {
    try {
        const userId = req.user.id
        const pendingAppointments = await Appointment.getPendingAppointments(userId)

        const data = pendingAppointments.map(appt => ({
            id: appt.id,
            requester_id: appt.requesterId,
            start_time: appt.startTime,
            duration: appt.duration

    }));
     res.json(data);
     
    } catch(error) {
        res.status(500).json({error: 'Failed to fetch pending appointments'})
    }
}

module.exports = {createAppointment, respondToAppointment, getAppointments, getPendingAppointments}