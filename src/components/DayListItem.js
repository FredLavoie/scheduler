import React from "react";
import classnames from "classnames";

import "components/DayListItem.scss";

function formatSpots(value) {
  switch (value) {
    case 0:
      return "no spots remaining";
    case 1:
      return "1 spot remaining";
    default:
      return `${value} spots remaining`;
  }
}

export default function DayListItem(props) {
  const dayClass = classnames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
