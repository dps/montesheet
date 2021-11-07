import React, { useState, useEffect } from "react";
import TableCell from '@material-ui/core/TableCell';
import { Tooltip } from "@material-ui/core";
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { NormalDistribution, UniformDistribution } from "../util/distributions";

function DistributionCell(props) {

  const distribution = props.type === "uniform" ? new UniformDistribution(props) : new NormalDistribution(props);
  
  return (
    distribution && distribution.monteVals && distribution.monteVals.length > 0 ?
    <>
        <TableCell><Tooltip title={
            <>
                    <p>min: {distribution.monteMin.toPrecision(4)}</p>
                    <p>p10: {(distribution.monteVals[Math.floor(distribution.samples / 10)]).toPrecision(4)}</p>
                    <p>μ: {distribution.monteMean.toPrecision(4)}</p>
                    <p>p90: {(distribution.monteVals[Math.floor(9 * distribution.samples / 10)]).toPrecision(4)}</p>
                    <p>max: {distribution.monteMax.toPrecision(4)}</p>
            </>

        }><div><b>{props.type}</b>{distribution.paramStr}<br/>
        <Sparklines data={distribution.histogram}  svgWidth={180} svgHeight={50} width={100} height={50} margin={5} min={props.min}>
            <SparklinesLine color="blue" />
        </Sparklines></div></Tooltip>
        </TableCell>
        
    </> : null);
}

export default DistributionCell;
