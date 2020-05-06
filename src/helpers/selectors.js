// filter out appointments that match requirement
export function getAppointmentsForDay(state, day) {
  let filteredArray = [];
  const [dayObj] = state.days.filter(ea => ea.name === day);
  if(!dayObj) return filteredArray;

  for (let ea of dayObj.appointments) {
    if(!!state.appointments[ea]) {
      filteredArray.push(state.appointments[ea]);
    }
  }
  return filteredArray;
}

// filter id of interviewer and append it to the appointment object
export function getInterview(state, interview) {
  if(!interview) return null;
  for(let ea in state.interviewers) {
    if(parseInt(ea) === interview.interviewer) {
      interview.interviewer = state.interviewers[ea];
    }
  }
  return interview;
}

// filter out interviewers that match requirement
export function getInterviewersForDay(state, day) {
  let filteredArray = [];
  const [dayObj] = state.days.filter(ea => ea.name === day);
  if(!dayObj) return filteredArray;

  for (let ea of dayObj.interviewers) {
    if(!!state.interviewers[ea]) {
      filteredArray.push(state.interviewers[ea]);
    }
  }
  return filteredArray;
}
