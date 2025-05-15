import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

// Replace with your logged-in user ID or fetch from your auth system
const YOUR_USER_ID = parseInt(localStorage.getItem("userId"), 10) || 1;

document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.getElementById("calendar");
  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    initialView: "dayGridMonth",
    height: "auto",
  });

  calendar.render();

  async function fetchAppointments() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const appointments = await res.json();

      const events = appointments.map((appt) => ({
        id: appt.id,
        title:
          appt.requesterId === YOUR_USER_ID
            ? `Meeting with User ${appt.receiverId}`
            : `Meeting with User ${appt.requesterId}`,
        start: appt.startTime,
        end: new Date(
          new Date(appt.startTime).getTime() + appt.duration * 3600000
        ).toISOString(),
        allDay: false,
      }));

      calendar.removeAllEvents();
      calendar.addEventSource(events);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const users = await res.json();

      const receiverSelect = document.getElementById("receiver-select");
      receiverSelect.innerHTML =
        '<option value="" disabled selected>Choose user</option>';

      users.forEach((user) => {
        if (user.id !== YOUR_USER_ID) {
          const option = document.createElement("option");
          option.value = user.id;
          option.textContent = user.username || `User ${user.id}`;
          receiverSelect.appendChild(option);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchPendingRequests() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/appointments/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch pending requests");
      const pending = await res.json();

      const list = document.getElementById("pending-list");
      list.innerHTML = "";

      if (pending.length === 0) {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = "No pending appointment requests.";
        list.appendChild(li);
        return;
      }

      pending.forEach((appt) => {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center flex-wrap";

        const infoDiv = document.createElement("div");
        infoDiv.textContent = `From User ${appt.requesterId} on ${new Date(
          appt.startTime
        ).toLocaleString()}`;

        const btnGroup = document.createElement("div");
        btnGroup.className = "btn-group btn-group-sm";

        const acceptBtn = document.createElement("button");
        acceptBtn.className = "btn btn-success";
        acceptBtn.textContent = "Accept";
        acceptBtn.onclick = () => respondToAppointment(appt.id, "accepted");

        const denyBtn = document.createElement("button");
        denyBtn.className = "btn btn-danger";
        denyBtn.textContent = "Deny";
        denyBtn.onclick = () => respondToAppointment(appt.id, "denied");

        btnGroup.appendChild(acceptBtn);
        btnGroup.appendChild(denyBtn);

        li.appendChild(infoDiv);
        li.appendChild(btnGroup);
        list.appendChild(li);
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function respondToAppointment(appointmentId, status) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/appointments/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId, status }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err.error || "Failed to update appointment"));
        return;
      }
      alert(`Appointment ${status}`);
      await fetchPendingRequests();
      await fetchAppointments();
    } catch (err) {
      alert("Failed to update appointment");
      console.error(err);
    }
  }

  const appointmentModal = document.getElementById("appointmentModal");
  appointmentModal.addEventListener("show.bs.modal", fetchUsers);

  const appointmentForm = document.getElementById("appointment-form");
  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const receiverId = parseInt(
      document.getElementById("receiver-select").value,
      10
    );
    const date = document.getElementById("appointment-date").value;
    const time = document.getElementById("appointment-time").value;
    const duration = parseInt(
      document.getElementById("appointment-duration").value,
      10
    );

    if (!receiverId || !date || !time || !duration) {
      alert("Please fill out all fields.");
      return;
    }

    const startTime = new Date(`${date}T${time}`).toISOString();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId, startTime, duration }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + (err.error || "Failed to send request"));
        return;
      }

      alert("Appointment request sent!");
      appointmentForm.reset();
      const modalInstance = bootstrap.Modal.getInstance(appointmentModal);
      modalInstance.hide();

      await fetchPendingRequests();
    } catch (err) {
      alert("Failed to send request");
      console.error(err);
    }
  });

  // Initial load
  fetchAppointments();
  fetchPendingRequests();
});
