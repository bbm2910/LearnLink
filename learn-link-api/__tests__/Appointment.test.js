const Appointment = require("../models/Appointment"); // adjust path as needed
const db = require("../database/connect");

jest.mock("../database/connect");

describe("Appointment model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createAppointment", () => {
    it("should insert and return a new appointment", async () => {
      const mockData = {
        id: 1,
        requester_id: 1,
        receiver_id: 2,
        start_time: "2025-05-22T10:00:00Z",
        duration: 60,
        status: "pending",
        created_at: "2025-05-21T10:00:00Z",
      };

      db.query.mockResolvedValueOnce({ rows: [mockData] });

      const appointment = await Appointment.createAppointment({
        requesterId: 1,
        receiverId: 2,
        startTime: mockData.start_time,
        duration: 60,
      });

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO appointments"),
        [1, 2, mockData.start_time, 60]
      );

      expect(appointment).toBeInstanceOf(Appointment);
      expect(appointment.receiverId).toBe(2);
    });
  });

  describe("findById", () => {
    it("should return an appointment by id", async () => {
      const mockData = {
        id: 1,
        requester_id: 1,
        receiver_id: 2,
        start_time: "2025-05-22T10:00:00Z",
        duration: 60,
        status: "accepted",
        created_at: "2025-05-21T10:00:00Z",
      };

      db.query.mockResolvedValueOnce({ rows: [mockData] });

      const appointment = await Appointment.findById(1);

      expect(appointment).toBeInstanceOf(Appointment);
      expect(appointment.id).toBe(1);
    });

    it("should return null if not found", async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const appointment = await Appointment.findById(999);
      expect(appointment).toBeNull();
    });
  });

  describe("getUserAppointments", () => {
    it("should return accepted appointments for a user", async () => {
      const userId = 1;
      const mockRows = [
        {
          id: 1,
          requester_id: 1,
          receiver_id: 2,
          start_time: "2025-05-22T10:00:00Z",
          duration: 60,
          status: "accepted",
          created_at: "2025-05-21T10:00:00Z",
        },
      ];

      db.query.mockResolvedValueOnce({ rows: mockRows });

      const appointments = await Appointment.getUserAppointments(userId);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining(
          "WHERE (requester_id = $1 OR receiver_id = $1) AND status = 'accepted'"
        ),
        [userId]
      );

      expect(appointments).toHaveLength(1);
      expect(appointments[0]).toBeInstanceOf(Appointment);
    });
  });

  describe("getPendingAppointments", () => {
    it("should return pending appointments for a user", async () => {
      const userId = 2;
      const mockRows = [
        {
          id: 1,
          requester_id: 1,
          start_time: "2025-05-22T10:00:00Z",
          duration: 60,
          receiver_id: 2,
        },
      ];

      db.query.mockResolvedValueOnce({ rows: mockRows });

      const appointments = await Appointment.getPendingAppointments(userId);

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining(
          "WHERE receiver_id = $1 AND status = 'pending'"
        ),
        [userId]
      );

      expect(appointments).toHaveLength(1);
      expect(appointments[0]).toBeInstanceOf(Appointment);
    });
  });

  describe("respond", () => {
    it("should update and return the appointment", async () => {
      const originalData = {
        id: 1,
        requester_id: 1,
        receiver_id: 2,
        start_time: "2025-05-22T10:00:00Z",
        duration: 60,
        status: "pending",
        created_at: "2025-05-21T10:00:00Z",
      };

      const updatedData = {
        ...originalData,
        status: "accepted",
      };

      const appointment = new Appointment(originalData);
      db.query.mockResolvedValueOnce({ rows: [updatedData] });

      const updated = await appointment.respond("accepted");

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE appointments"),
        ["accepted", appointment.id]
      );

      expect(updated.status).toBe("accepted");
    });
  });
});
