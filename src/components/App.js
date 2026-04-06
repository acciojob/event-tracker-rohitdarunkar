import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Popup from "react-popup";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/App.css";

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingEvent, setEditingEvent] = useState(null);


  const filteredEvents = events.filter((event) => {
    if (filter === "past") return moment(event.start).isBefore(moment());
    if (filter === "upcoming") return moment(event.start).isAfter(moment());
    return true;
  });


  const resetForm = () => {
    setTitle("");
    setLocation("");
    setSelectedDate(null);
    setEditingEvent(null);
  };


  const handleSave = () => {
    if (!title) return;

    const newEvent = {
      title: `${title} (${location})`,
      start: selectedDate,
      end: selectedDate,
    };

    setEvents([...events, newEvent]);
    Popup.close();
    resetForm();
  };

  const handleEdit = () => {
    const updated = events.map((ev) =>
      ev === editingEvent
        ? { ...ev, title: `${title} (${location})` }
        : ev
    );

    setEvents(updated);
    Popup.close();
    resetForm();
  };


  const handleDelete = () => {
    setEvents(events.filter((ev) => ev !== editingEvent));
    Popup.close();
    resetForm();
  };


  const openCreatePopup = (date) => {
    setSelectedDate(date);

    Popup.create({
      title: "Create Event",
      content: (
        <div>
          <input
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Event Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      ),
      buttons: {
        right: [
          {
            text: "Save",
            className: "mm-popup__btn",
            action: () => handleSave(),
          },
        ],
      },
    });
  };


  const openEditPopup = (event) => {
    setEditingEvent(event);
    setTitle(event.title);

    Popup.create({
      title: "Edit Event",
      content: (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ),
      buttons: {
        left: [
          {
            text: "Delete",
            className: "mm-popup__btn--danger",
            action: () => handleDelete(),
          },
        ],
        right: [
          {
            text: "Edit",
            className: "mm-popup__btn--info",
            action: () => handleEdit(),
          },
        ],
      },
    });
  };


  const eventStyleGetter = (event) => {
    const isPast = moment(event.start).isBefore(moment());

    return {
      style: {
        backgroundColor: isPast
          ? "rgb(222, 105, 135)" // pink
          : "rgb(140, 189, 76)", // green
        color: "white",
        borderRadius: "5px",
      },
    };
  };

  return (
    <div>
      <h2>Event Tracker</h2>


      <div>
        <button className="btn" onClick={() => setFilter("all")}>
          All
        </button>
        <button className="btn" onClick={() => setFilter("past")}>
          Past
        </button>
        <button className="btn" onClick={() => setFilter("upcoming")}>
          Upcoming
        </button>
      </div>


      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 500, margin: "20px" }}
        eventPropGetter={eventStyleGetter}
        onSelectSlot={(slotInfo) => openCreatePopup(slotInfo.start)}
        onSelectEvent={(event) => openEditPopup(event)}
      />
    </div>
  );
};

export default App;