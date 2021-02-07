import React from "react";
import Section from "./Section";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import SpreadsheetItems from "./SpreadsheetItems";


function DashboardSection(props) {

  return (
    <Section
      bgColor={props.bgColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <Grid container={true} spacing={4}>
          <Grid item={true} xs={12} md={12}>
            <SpreadsheetItems />
          </Grid>
        </Grid>
      </Container>
    </Section>
  );
}

export default DashboardSection;
