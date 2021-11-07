import React, { useState, useEffect } from "react";
import TableCell from '@material-ui/core/TableCell';
import { Tooltip } from "@material-ui/core";
import { Sparklines, SparklinesLine } from 'react-sparklines';

function DistributionCell(props) {

  const distribution = props.distribution;
  
  if (distribution.exec) {
    distribution.exec();
    console.log(distribution.val());
  }

  return (
    distribution ?
        <><Tooltip title={
            <>
                    <p>min: {distribution.val().monteMin.toPrecision(4)}</p>
                    <p>p10: {(distribution.val().monteVals[Math.floor(distribution.val().samples / 10)]).toPrecision(4)}</p>
                    <p>μ: {distribution.val().monteMean.toPrecision(4)}</p>
                    <p>p90: {(distribution.val().monteVals[Math.floor(9 * distribution.val().samples / 10)]).toPrecision(4)}</p>
                    <p>max: {distribution.val().monteMax.toPrecision(4)}</p>
            </>

        }><div><b>{props.distribution.type}</b>{distribution.val().paramStr} μ: {distribution.val().monteMean.toPrecision(4)}<br/>
        <Sparklines data={distribution.val().histogram}  svgWidth={180} svgHeight={50} width={100} height={50} margin={5} min={distribution.val().monteMin}>
            <SparklinesLine color="blue" />
        </Sparklines></div></Tooltip>
        </>
        
    : null);
}

export default DistributionCell;
