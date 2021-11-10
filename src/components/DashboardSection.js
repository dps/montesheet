import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import SpreadsheetItems from "./SpreadsheetItems";

function DashboardSection(props) {

  return (
      <Container>
        <Grid container={true} spacing={4}>
          <Grid item={true} xs={12} md={12}>
            <SpreadsheetItems setTitle={props.setTitle}/>
          </Grid>
        </Grid>
      </Container>
  );
}

export default DashboardSection;
