import { useReducer, useEffect } from "react";
import axios from "axios";

const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

const SET_DAY               = "SET_DAY";
const SET_APPLICATION_DATA  = "SET_APPLICATION_DATA";
const SET_INTERVIEW         = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {...state, day: action.day};
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers
      }
    case SET_INTERVIEW: {
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
      }
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {

  const [state, dispatch] = useReducer( reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });


  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      })
    })
  },[]);

  useEffect(() => {
    ws.onmessage = (event) => {
      const newInterview = JSON.parse(event.data);
      const appointment = {
        ...state.appointments[newInterview.id],
        interview: { ...newInterview.interview }
      };
      const appointments = {
        ...state.appointments,
        [newInterview.id]: appointment
      };

      const days = [
        ...state.days,
      ]

      for(let ea of days) {
        if(ea.name === state.day) {
          if(appointment.interview){
            ea.spots += 1;
          } else {
            ea.spots -= 1;
          }
        }
      }
      dispatch({ type: SET_INTERVIEW, days, appointments })
    }
    return () => ws.close();

  }, [state.day, state.appointments, state.days]);

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
      .put(`/api/appointments/${id}`, { interview })
      .then(() => dispatch({ type: SET_INTERVIEW, days, appointments }));
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
      .delete(`/api/appointments/${id}`, { id })
      .then(() => dispatch({ type: SET_INTERVIEW, days, appointments }));
  }

  return {
    state: state,
    setDay: setDay,
    bookInterview: bookInterview,
    deleteInterview: deleteInterview
  };
}
