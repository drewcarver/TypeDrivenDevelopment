import { jssPreset } from "@material-ui/core";
import { create, createGenerateClassName } from "jss";
import * as React from "react";
// @ts-ignore
import JssProvider from "react-jss/lib/JssProvider";
import "./App.css";
import SignUpForm from "./SignUpForm";

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: "jss-insertion-point"
});

const App = () => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <SignUpForm />
  </JssProvider>
);

export default App;
