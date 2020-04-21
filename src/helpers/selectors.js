// filter out users that match requirement
export function getAppointmentsForDay(state, day) {
  let filteredArray = [];
  const dayObj = state.days.filter(ea => ea.name === day);
  if(!dayObj[0]) return filteredArray;

  for (let id of dayObj[0].appointments) {
    if(!!state.appointments[id]) {
      filteredArray.push(state.appointments[id]);
    }
  }
  return filteredArray;
}
