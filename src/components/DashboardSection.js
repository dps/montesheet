import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import SpreadsheetItems from "./SpreadsheetItems";
import DistributionCell from "./DistributionCell";

function DashboardSection(props) {

  return (
      <Container>
        {/* <Grid container={true} spacing={4}>
          <Grid item={true} xs={12} md={12}>
            <SpreadsheetItems />
          </Grid>
        </Grid> */}
        <Grid container={true} spacing={4}>
          <Grid item={true} xs={12} md={12}>
            <DistributionCell type={"normal"} mean={2} stddev={0.5}/>
            <DistributionCell type={"normal"} mean={0} stddev={5}/>
            <DistributionCell type={"uniform"} min={-1} max={5.5}/>
            <DistributionCell type={"uniform"} min={-10000} max={10000}/>
          </Grid>
        </Grid>
      </Container>
  );
}

export default DashboardSection;
