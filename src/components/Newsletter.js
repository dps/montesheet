import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import newsletter from "./../util/newsletter.js";
import { useForm } from "react-hook-form";

function Newsletter(props) {
  const [subscribed, setSubscribed] = useState(false);

  const { handleSubmit, register, errors } = useForm();

  const onSubmit = ({ email }) => {
    setSubscribed(true);
    // Parent component can optionally
    // find out when subscribed.
    props.onSubscribed && props.onSubscribed();
    // Subscribe them
    newsletter.subscribe({ email });
  };

  return (
    <>
      {subscribed === false && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={true}>
              <TextField
                variant="outlined"
                type="email"
                label="Email"
                name="email"
                error={errors.email ? true : false}
                helperText={errors.email && errors.email.message}
                fullWidth={true}
                inputRef={register({
                  required: "Please enter an email address",
                })}
              />
            </Grid>
            <Box display="flex" alignItems="stretch" clone={true}>
              <Grid item={true} xs="auto">
                <Button
                  variant="contained"
                  color={props.buttonColor}
                  size="large"
                  type="submit"
                >
                  {props.buttonText}
                </Button>
              </Grid>
            </Box>
          </Grid>
        </form>
      )}

      {subscribed === true && <div>{props.subscribedMessage}</div>}
    </>
  );
}

export default Newsletter;
