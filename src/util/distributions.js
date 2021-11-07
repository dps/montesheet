import React, { useState, useEffect, useMemo } from "react";
const gaussian = require('gaussian')

export function NormalDistribution(props) {
    const [monteMin, setMonteMin] = useState(Number.MAX_VALUE);
    const [monteMax, setMonteMax] = useState(Number.MIN_VALUE);
    const [monteVals, setMonteVals] = useState([]);
    const [histogram, setHistogram] = useState([]);
    const [monteMean, setMonteMean] = useState(0.0);
    const mean = props.mean || 0.0;
    const stddev = props.stddev || 1.0;
    const paramStr = `(${mean},${stddev})`;
    const distribution = gaussian(mean, stddev*stddev);
  
    const slices = props.slices || 20;
    const samples = props.samples || 1000 * slices;
  
    const sample = () => {
      return distribution.ppf(Math.random());
    };
  
    const zeros = (n) => {
      return Array(n).fill(0);
    };
  
    const monteCarlo = () => {
      console.log("Monte Carlo");
      var values = [];
      var sliceData = zeros(slices);
      console.log(sliceData);
      var min = Number.MAX_VALUE;
      var max = Number.MIN_VALUE;
      var sum = 0.0;
      for (let i = 0; i < samples; i++) {
        const x = sample();
        sum += x;
        values.push(x);
        if (x < min) {
          min = x;
        } else if (x > max) {
          max = x;
        }
      }
      setMonteMax(max);
      setMonteMin(min);
      values = values.sort();
      setMonteVals(values);
      setMonteMean(sum / samples);
      console.log("max", max);
      console.log("min", min);
      const sliceWidth = (max - min) / (1.0 * slices);
      console.log("sliceWidth", sliceWidth);
  
      for (let i = 0; i < values.length; i++) {
        const x = values[i];
        const index = Math.floor((x - min) / sliceWidth);
        if (index < slices) {
          sliceData[index]++;
        }
      }
  
      setHistogram(sliceData);
      
    };
    
    const mountEffect = useEffect(() => {
      monteCarlo();
    }, [props]);
  
    return useMemo(() => {
      return {
        monteMin,
        monteMax,
        monteVals,
        histogram,
        monteMean,
        slices,
        samples,
        paramStr
      };
    }, [monteMin, monteMax, monteVals, histogram, monteMean]);
}

export function UniformDistribution(props) {
  const [monteMin, setMonteMin] = useState(Number.MAX_VALUE);
  const [monteMax, setMonteMax] = useState(Number.MIN_VALUE);
  const [monteVals, setMonteVals] = useState([]);
  const [histogram, setHistogram] = useState([]);
  const [monteMean, setMonteMean] = useState(0.0);
  const min = props.min || 0.0;
  const max = props.max || 1.0;

  const slices = props.slices || 20;
  const samples = props.samples || 1000 * slices;
  const paramStr = `(${min},${max})`;


  const sample = () => {
    return Math.random() * (max - min) + min;
  };

  const zeros = (n) => {
    return Array(n).fill(0);
  };

  const monteCarlo = () => {
    var values = [];
    var sliceData = zeros(slices);
    console.log(sliceData);
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    var sum = 0.0;
    for (let i = 0; i < samples; i++) {
      const x = sample();
      sum += x;
      values.push(x);
      if (x < min) {
        min = x;
      } else if (x > max) {
        max = x;
      }
    }
    setMonteMax(max);
    setMonteMin(min);
    values = values.sort();
    setMonteVals(values);
    setMonteMean(sum / samples);
    console.log("max", max);
    console.log("min", min);
    const sliceWidth = (max - min) / (1.0 * slices);
    console.log("sliceWidth", sliceWidth);

    for (let i = 0; i < values.length; i++) {
      const x = values[i];
      const index = Math.floor((x - min) / sliceWidth);
      if (index < slices) {
        sliceData[index]++;
      }
    }

    setHistogram(sliceData);
    
  };
  
  const mountEffect = useEffect(() => {
    monteCarlo();
  }, [props]);

  return useMemo(() => {
    return {
      monteMin,
      monteMax,
      monteVals,
      histogram,
      monteMean,
      slices,
      samples,
      paramStr
    };
  }, [monteMin, monteMax, monteVals, histogram, monteMean]);
}