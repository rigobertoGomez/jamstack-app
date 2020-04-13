import React, { useReducer } from "react";
import styles from "./form.module.css";

const INITIAL_STATE = {
  name: "",
  email: "",
  subject: "",
  body: "",
  status: "IDLE",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "updateFieldValue":
      return { ...state, [action.field]: action.value };
    case "updateStatus":
      return { ...state, status: action.status };
    case "reset":
    default:
      return INITIAL_STATE;
  }
};

const Form = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const setStatus = (status) => dispatch({ type: "updateStatus", status });

  const updateFieldValue = (field) => (event) => {
    dispatch({
      type: "updateFieldValue",
      field,
      value: event.target.value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("PENDING");
    fetch("/api/contact", {
      method: "POST",
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(state),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setStatus("SUCCESS");
      })
      .catch((error) => {
        console.log(error);
        setStatus("ERROR");
      });
  };

  if (state.status === "SUCCESS") {
    return (
      <p className={styles.success}>
        Messages sent!
        <button
          type="reset"
          onClick={() => dispatch("reset")}
          className={`${styles.button} ${styles.centered}`}
        >
          Reset
        </button>
      </p>
    );
  }
  return (
    <>
      {state.status === "ERROR" && (
        <p className={styles.error}>Something went wrong. Please try again.</p>
      )}
      <form
        className={`${styles.form} ${
          state.status === "PENDING" && styles.pending
        }`}
        onSubmit={handleSubmit}
      >
        <label className={styles.label} htmlFor="">
          Name
          <input
            type="text"
            name="name"
            className={styles.input}
            value={state.name}
            onChange={updateFieldValue("name")}
          />
        </label>
        <label className={styles.label} htmlFor="">
          Email
          <input
            type="email"
            name="email"
            className={styles.input}
            value={state.email}
            onChange={updateFieldValue("email")}
          />
        </label>
        <label className={styles.label} htmlFor="">
          Subject
          <input
            type="text"
            name="subject"
            className={styles.input}
            value={state.subject}
            onChange={updateFieldValue("subject")}
          />
        </label>
        <label className={styles.label} htmlFor="">
          Body
          <textarea
            name="body"
            className={styles.input}
            value={state.body}
            onChange={updateFieldValue("body")}
          />
        </label>
        <button type="submit" className={styles.button}>
          Send
        </button>
      </form>
    </>
  );
};
export default Form;
