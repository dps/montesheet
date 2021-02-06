import React from "react";
import LinkMui from "@material-ui/core/Link";
import { Link } from "./../util/router.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: "0.9rem",
    textAlign: "center",
    marginTop: theme.spacing(3),
    "& > a": {
      margin: `0 ${theme.spacing(1)}px`,
    },
  },
}));

function AuthFooter(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.type === "signup" && (
        <>
          Have an account already?
          <LinkMui component={Link} to="/auth/signin">
            {props.typeValues.linkTextSignin}
          </LinkMui>
        </>
      )}

      {props.type === "signin" && (
        <>
          <LinkMui component={Link} to="/auth/signup">
            {props.typeValues.linkTextSignup}
          </LinkMui>

          <LinkMui component={Link} to="/auth/forgotpass">
            {props.typeValues.linkTextForgotpass}
          </LinkMui>
        </>
      )}
    </div>
  );
}

export default AuthFooter;
