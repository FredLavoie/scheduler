import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

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

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = [
      ...state.days,
    ]

    for(let ea of days) {
      if(ea.name === state.day) {
        ea.spots -= 1;
      }
    }

    return axios
      .put(`/api/appointments/${id}`, {interview})
      .then(() => {setState({...state, appointments, days})});
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

    const days = [
      ...state.days,
    ]

    for(let ea of days) {
      if(ea.name === state.day) {
        ea.spots += 1;
      }
    }

    return axios
      .delete(`/api/appointments/${id}`, {id})
      .then(() => {setState({...state, appointments})});
  }

  return {
    state: state,
    setDay: setDay,
    bookInterview: bookInterview,
    deleteInterview: deleteInterview
  };
}
