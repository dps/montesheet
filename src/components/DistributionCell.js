import React from "react";
import { Tooltip } from "@material-ui/core";
import { Sparklines, SparklinesLine } from 'react-sparklines';
import useDarkMode from "use-dark-mode";

function DistributionCell(props) {

  const darkMode = useDarkMode();

  const distribution = props.distribution;
  
  if (distribution.exec) {
    distribution.exec();
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
            <SparklinesLine color={darkMode.value ? "pink" : "blue"} />
        </Sparklines></div></Tooltip>
        </>
        
    : null);
}

export default DistributionCell;
