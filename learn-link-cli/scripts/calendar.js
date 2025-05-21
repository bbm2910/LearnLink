import { Calendar } from "https://cdn.skypack.dev/@fullcalendar/core@6.1.17";
import dayGridPlugin from "https://cdn.skypack.dev/@fullcalendar/daygrid@6.1.17";
import timeGridPlugin from "https://cdn.skypack.dev/@fullcalendar/timegrid@6.1.17";


const API_BASE = "http://localhost:3000/api/appointments";
const USER_API = "http://localhost:3000/api/users";


const token = localStorage.getItem("token");


let calendar;
// Calendar init
document.addEventListener("DOMContentLoaded", async () => {
  const calendarEl = document.getElementById("calendar");

  const currentUserRes = await fetch(`${USER_API}/id`, {
  headers: { Authorization: `Bearer ${token}` },
});
const currentUser = await currentUserRes.json();
const currentUserId = currentUser.user_id;

calendar = new Calendar(calendarEl, {
  plugins: [dayGridPlugin, timeGridPlugin],
  initialView: "timeGridWeek",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  slotMinTime: "09:00:00",
  slotMaxTime: "22:00:00",
  eventContent: function(arg) {
    const title = arg.event.title;
    const timeText = arg.timeText;

    return {
      html: `
        <div style="font-size: 0.85rem; line-height: 1.2">
          <strong>${timeText}</strong><br/>
          ${title}
        </div>
      `
    };
  },
  eventDidMount: function (info) {
    info.el.setAttribute(
      "title",
      `Start: ${info.event.start.toLocaleString()}\nEnd: ${info.event.end.toLocaleString()}`
    );
  }
});

  calendar.render();
  await loadPendingRequests()
  try {

    
    const appointments = await getAcceptedAppointments();

    for (const appt of appointments) {
      const otherUserId = appt.requesterId === currentUserId ? appt.receiverId : appt.requesterId;
      const user = await fetchUserById(otherUserId);

      calendar.addEvent({
      title: `${user?.first_name || "Unknown"} (${appt.duration}h)`,
      start: appt.startTime,
      end: getEndTime(appt.startTime, appt.duration),
  });
}


} catch (err) {
  console.error("Error loading appointments:", err);
}
 
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

// Getter to get accepted appointments
async function getAcceptedAppointments() {
  const res = await fetch(API_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
   return data.filter(appt => appt.status === "accepted")
}

// Getter to find user by email
async function getUserByEmail(email) {
  const res = await fetch(`${USER_API}/by-email?email=${encodeURIComponent(email)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return null;
  return res.json()
}

// Compute end time for calendar event
function getEndTime(startTime, durationHours) {
  const start = new Date(startTime);
  if (isNaN(start)) throw new Error(`Invalid startTime: ${startTime}`);
  start.setHours(start.getHours() + parseInt(durationHours));
  return start.toISOString();
}

// Utility to fetch user details by ID
async function fetchUserById(id) {
  const res = await fetch(`http://localhost:3000/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return null;
  return res.json();
}

// Fetch and display pending requests
async function loadPendingRequests() {
  const res = await fetch(`${API_BASE}/pending`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("Failed to load pending appointments");
    return;
  }

  const pending = await res.json();
  const list = document.getElementById("pending-list");
  list.innerHTML = "";

  for (const appt of pending) {
    const user = await fetchUserById(appt.requester_id);
    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center";

    item.innerHTML = `
      <span>
        <strong>${user?.email || "Unknown user"}</strong><br/>
        ${new Date(appt.start_time).toLocaleString()} for ${appt.duration}h
      </span>
      <div>
        <button class="btn btn-success btn-sm me-2" data-id="${appt.id}" data-action="accept">Accept</button>
        <button class="btn btn-danger btn-sm" data-id="${appt.id}" data-action="reject">Reject</button>
      </div>
    `;

    list.appendChild(item);
  }
}

// Event delegation for accept/reject buttons
document.getElementById("pending-list").addEventListener("click", async (e) => {
  if (e.target.tagName !== "BUTTON") return;
  const action = e.target.dataset.action;
  const id = e.target.dataset.id;

  const res = await fetch(`${API_BASE}/respond`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ appointmentId: id, status: action === "accept" ? "accepted" : "rejected" }),
  });

  if (res.ok) {
    alert(`Appointment ${action}ed.`);
    await loadPendingRequests(); // Refresh pending list

    const appointments = await getAcceptedAppointments();
    appointments.forEach((appt) => {
      calendar.addEvent({
        title: "Appointment",
        start: appt.start_time,
        end: getEndTime(appt.start_time, appt.duration),
      });
    });
  } else {
    alert("Failed to update appointment.");
  }
});
