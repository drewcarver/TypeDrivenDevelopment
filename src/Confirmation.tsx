import * as React from 'react';
import './Confirmation.css';

type ConfirmationProps = {};

const Confirmation = (props: ConfirmationProps) => {
  return (
    <div className="confirmation">
      <h1>Sign up successful! </h1>
      <p>Please check your email inbox for a confirmation email.</p>
    </div>
  );
};

export default Confirmation;
