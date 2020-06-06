import React, { useEffect } from "react";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Confirm from "components/Appointment/Confirm";
import Status from "components/Appointment/Status";
import Error from "components/Appointment/Error";
import Form from "components/Appointment/Form";
import useVisualMode from "hooks/useVisualMode";


import "components/Appointment/styles.scss";



export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const EDIT = "EDIT";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const ERROR_SAVING = "ERROR_SAVING";
  const ERROR_DELETING = "ERROR_DELETING";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    transition(SAVING, true);
    if(!name || !interviewer) {
      transition(ERROR_SAVING, true)
    } else {
      const interview = {
        student: name,
        interviewer: interviewer
      };
      props
        .bookInterview(props.id, interview)
        .then(() => transition(SHOW))
        .catch(error => transition(ERROR_SAVING, true));
    }
  }

  function cancelInterview() {
    transition(DELETING, true);
    props
      .deleteInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETING, true));
  }

  useEffect(() => {
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
    if (props.interview &&
        props.interview.student &&
        props.interview.interviewer &&
        mode === EMPTY) {
      transition(SHOW);
    }
   }, [props.interview, transition, mode]);


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === ERROR_SAVING && (
        <Error
          message={"Error Saving"}
          onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETING && (
        <Error
          message={"Error Deleting"}
          onClose={() => back()}
        />
      )}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
        interviewers={props.interviewers}
        interviewer={props.interviewer}
        onCancel={() => back()}
        onSave={(name, interviewer) => {
          save(name, interviewer);
        }}
        />
      )}
      {mode === EDIT && (
        <Form
        name={props.interview.student}
        interviewers={props.interviewers}
        interviewer={props.interview.interviewer.id}
        onCancel={() => back()}
        onSave={(name, interviewer) => {
          save(name, interviewer);
        }}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
        message={"Are you sure you would like to cancel this appointment?"}
        onCancel={() => back()}
        onConfirm={() => {
          cancelInterview();
        }}
        />
      )}
    </article>
  );
}
