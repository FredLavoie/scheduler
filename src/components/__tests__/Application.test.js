import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  prettyDOM
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Appointment", () => {
  it("[1] defaults to Monday and changes the schedule when a new day is selected", async () => {
    // 1. Render the Application
    const { getByText } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText("Monday"));
    // 3. Click on a different day in sidebar
    fireEvent.click(getByText("Tuesday"));
    // 4. Expect the name that is only in Tuesday to be present in document
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  })

  it("[2] loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // 1. Render the Application
    const { container } = render(<Application />);
    // 2. Wait for text to be present in document
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Create appointment container
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    // 4. Click to add an event,  enter in a name, select an interviewer and click save
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    // 5. Expect the saving loading text to be present in the document
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 6. Wait for the page to load the SHOW mode
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // 7. Make sure that the name added is present in the document
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  })

  it("[3] loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the first empty appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Click the "Confirm" button
    fireEvent.click(getByText(appointment, "Confirm"));
    // 5. Expect the element with the text "Deleting" is displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 6. Wait until the element with the alt text "Add" is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 7. Check that the DayListItem with the text "Monday" also has the text "1 spots remaining"
    const day = getAllByTestId(container, 'day').find(day =>
      queryByText(day, 'Monday')
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
  })

  it("[4] loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

  })

  it("[5] shows the save error when failing to save an appointment", async () => {

  })

  it("[6] shows the delete error when failing to delete an existing appointment", async () => {

  })

});
