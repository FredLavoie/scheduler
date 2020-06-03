import React from "react";

import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Confirm from "components/Appointment/Confirm";
import Status from "components/Appointment/Status";
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
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  async function save(name, interviewer) {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer: interviewer
    };
    await props.bookInterview(props.id, interview);
    transition(SHOW);
  }

  async function cancelInterview() {
    transition(DELETING);
    await props.deleteInterview(props.id);
    transition(EMPTY);
  }


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
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
