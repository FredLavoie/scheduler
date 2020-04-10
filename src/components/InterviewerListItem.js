import React from "react";
import classnames from "classnames";

import "components/InterviewerListItem.scss";

export default function InterviewerListItem(props) {
  const interviewerClass = classnames("interviewers__item", {
    "interviewers__item--selected": props.selected
  });

  const intervieweritemImageclass = classnames("interviewers__item-image", {
    "interviewers__item--selected-image": props.selected && props.image
  });

  return (
    <li className={interviewerClass} onClick={props.setInterviewer}>
      <img
        className={intervieweritemImageclass}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>

  );
}
