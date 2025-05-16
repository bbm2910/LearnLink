import { Calendar } from "https://cdn.skypack.dev/@fullcalendar/core@6.1.17";
import dayGridPlugin from "https://cdn.skypack.dev/@fullcalendar/daygrid@6.1.17";

// Replace with your actual API base URL if needed
const API_BASE = "/api/appointments";
const USER_API = "/api/users";

// Assume JWT is stored in localStorage after login
const token = localStorage.getItem("token");

// Calendar init
document.addEventListener("DOMContentLoaded", async () => {
  const calendarEl = document.getElementById("calendar");

  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth",
    },
  });

  calendar.render();

  // Load accepted appointments
  const appointments = await getAcceptedAppointments();
  appointments.forEach((appt) => {
    calendar.addEvent({
      title: "Appointment",
      start: appt.start_time,
      end: getEndTime(appt.start_time, appt.duration),
    });
  });

  // Handle appointment form submit
  const form = document.getElementById("appointment-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("appointment-email").value;
    const date = document.getElementById("appointment-date").value;
    const time = document.getElementById("appointment-time").value;
    const duration = document.getElementById("appointment-duration").value;

    if (!email || !date || !time || !duration) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const receiver = await getUserByEmail(email);
      if (!receiver) throw new Error("User not found.");

      const startTime = `${date}T${time}`;

      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: receiver.id,
          startTime,
          duration,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create appointment.");
      }

      alert("Appointment request sent!");
      form.reset();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
});

// Utility to get accepted appointments
async function getAcceptedAppointments() {
  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
}

// Utility to find user by email
async function getUserByEmail(email) {
  const res = await fetch(`${USER_API}/find?email=${encodeURIComponent(email)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;
  return res.json();
}

// Compute end time for calendar event
function getEndTime(startTime, durationHours) {
  const start = new Date(startTime);
  start.setHours(start.getHours() + parseInt(durationHours));
  return start.toISOString();
}
