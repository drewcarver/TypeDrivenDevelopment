import { Typography } from "@material-ui/core";
import * as React from "react";

type ConfirmationProps = {};

const Confirmation = (props: ConfirmationProps) => {
  return (
    <div>
      <Typography>
        Sign up successful! Please check your email inbox for a confirmation
        email.
      </Typography>
    </div>
  );
};

export default Confirmation;
