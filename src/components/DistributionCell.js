import React from "react";
import { Tooltip } from "@material-ui/core";
import { Sparklines, SparklinesLine } from 'react-sparklines';
import useDarkMode from "use-dark-mode";
import Chart from "react-apexcharts";

function DistributionCell(props) {

  const darkMode = useDarkMode();

  const distribution = props.distribution;
  
  if (distribution.exec) {
    distribution.exec();
  }

  return (
    distribution ? (
        !props.modal && (
        <><Tooltip title={
            <>
                    <p>min: {distribution.val().monteMin.toPrecision(4)}</p>
                    <p>p10: {(distribution.val().monteVals[Math.floor(distribution.val().samples / 10)]).toPrecision(4)}</p>
                    <p>μ: {distribution.val().monteMean.toPrecision(4)}</p>
                    <p>p90: {(distribution.val().monteVals[Math.floor(9 * distribution.val().samples / 10)]).toPrecision(4)}</p>
                    <p>max: {distribution.val().monteMax.toPrecision(4)}</p>
            </>

        }><div><b>{props.distribution.type}</b>{distribution.val().paramStr} μ: {distribution.val().monteMean.toPrecision(4)}<br/>
        <Sparklines data={distribution.val().histogram}  svgWidth={props.svgWidth || 180} svgHeight={props.svgHeight || 50} width={100} height={50} margin={5} min={distribution.val().monteMin}>
            <SparklinesLine color={darkMode.value ? "pink" : "blue"} />
        </Sparklines></div></Tooltip>
        
        </>) ||
        props.modal && (
            <Chart
              options={{
                chart: {
                  id: "distribution",
                  animations: {
                      speed: 1,
                  },
                  foreColor: "white",
                },
                theme: {
                    mode: "dark",
                },
                dataLabels: {
                    enabled: false,
                },
                annotations: {
                    xaxis: [
                      {
                        x: distribution.val().monteMean,
                        borderColor: '#775DD0',
                        label: {
                          style: {
                            color: '#fff',
                            background: '#775DD0',
                          },
                          text: 'mean'
                        }
                      }
                    ]
                  },
                xaxis: {
                    tickAmount: distribution.val().sliceWidth / 5,
                    labels: {
                        show: true,
                        formatter: function(val) {
                          return parseFloat(val).toFixed(1)
                        },
                        style: {
                            colors: ["white"]
                        }
                      }
                },
                yaxis: {
                    labels: {
                        formatter: function(val) {
                          return (parseFloat(val)/distribution.val().samples).toFixed(4)
                        },
                        style: {
                            colors: ["white"]
                        }
                      },
                    
                },
                tooltip: {
                    theme: "dark",
                }
                
              }}
              series={[
                {
                  name: "p",
                  data: distribution.val().histogram.map((value,i) => ([distribution.val().monteMin + distribution.val().sliceWidth * i, value]))
                }
              ]}
              type="scatter"
              width="800"
            />
        )
        )
        
    : null);
}

export default DistributionCell;
