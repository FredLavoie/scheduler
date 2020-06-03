import React, { useState, useEffect } from "react";
import axios from "axios";

import "./Application.scss";
import DayList from "./DayList.js";
import Appointment from "./Appointment/index.js";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors.js";


export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  const setDay = day => setState({...state, day});
  const setDays = days => setState(prev => ({ ...prev, days}));
  const setAppointments = appointments => setState(prev => ({ ...prev, appointments}));
  const setInterviewers = interviewers => setState(prev => ({ ...prev, interviewers}));

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .put(`/api/appointments/${id}`, {interview})
      .then(() => {setState({...state, appointments})});
  }

  function deleteInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .delete(`/api/appointments/${id}`, {id})
      .then(() => {setState({...state, appointments})});
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then((all) => {
      setDays(all[0].data);
      setAppointments(all[1].data);
      setInterviewers(all[2].data);
    })
  }, []);

  const interviewers = getInterviewersForDay(state, state.day);
  const dayAppointments = getAppointmentsForDay(state, state.day).map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (<Appointment
      key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={interview}
      interviewer={!!appointment.interview ? interviewers[appointment.interview.interview]: null}
      interviewers={interviewers}
      bookInterview={bookInterview}
      deleteInterview={deleteInterview}
    />)
  })


  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
        <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />

      </section>
      <section className="schedule">
        {dayAppointments}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
