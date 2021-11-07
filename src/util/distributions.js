import React, { useState, useEffect, useMemo } from "react";
const gaussian = require('gaussian')

export function mul(a, b) {
  if (a.paramStr) {
    return new combineDistributions(a, b, "*", (a,b) => {return a * b;});
  }
  return Number(a) * Number(b);
}

export function plus(a, b) {
  if (a.paramStr) {
    return new combineDistributions(a, b, "+", (a,b) => {return a + b;});
  }
  return Number(a) + Number(b);
}

export function minus(a, b) {
  if (a.paramStr) {
    return new combineDistributions(a, b, "-", (a,b) => {return a - b;});
  }
  return Number(a) - Number(b);
}

export function div(a, b) {
  if (a.paramStr) {
    return new combineDistributions(a, b, "/", (a,b) => {return a / b;});
  }
  return Number(a) / Number(b);
}

export function choose(a, b) {
  if (a.paramStr) {
    return new combineDistributions(a, b, "||", (a,b) => {return Math.random() > 0.5 ? a :  b;});
  }
  return "ERR"
}

export function combineDistributions(a, b, label, combFunc) {
  console.log(label, a, b);
  var monteMin = Number.MAX_VALUE;
  var monteMax = Number.MIN_VALUE;
  var monteVals = [];
  var histogram = [];
  var monteMean = 0.0;
  var isCalculated = false;

  const aVal = a.val();
  const bVal = b.val();


  const type = label;
  const paramStr = `(${aVal.monteMean.toPrecision(2)},${bVal.monteMean.toPrecision(2)})`;


  const slices = aVal.slices || 20;
  const samples = aVal.samples || 1000 * aVal.slices;

  const sample = () => {
    const aIdx = Math.floor(Math.random() * aVal.samples | 0);
    const bIdx = Math.floor(Math.random() * bVal.samples | 0);
    return combFunc(aVal.monteVals[aIdx], bVal.monteVals[bIdx]);
  };

  const zeros = (n) => {
    return Array(n).fill(0);
  };

  const monteCarlo = () => {
    console.log("* Monte Carlo");
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
    monteMax = max;
    monteMin = min;
    values = values.sort();
    monteVals = values;
    monteMean = sum / samples;
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

    histogram = sliceData;
    
  };
  
  const exec = () => {
    if (!isCalculated) {
      monteCarlo();
      isCalculated = true;
    }
  };

  const val = () => {
    exec();
    return {
      monteMin,
      monteMax,
      monteVals,
      histogram,
      monteMean,
      slices,
      samples,
      paramStr,
      exec
    }
  };
  
    return {
      val,
      paramStr,
      type,
      exec
    };
}

export function ND(props) {
  var monteMin = Number.MAX_VALUE;
  var monteMax = Number.MIN_VALUE;
  var monteVals = [];
  var histogram = [];
  var monteMean = 0.0;
  var isCalculated = false;

  const type = "normal";
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
    monteMax = max;
    monteMin = min;
    values = values.sort();
    monteVals = values;
    monteMean = sum / samples;
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

    histogram = sliceData;
    
  };
  
  const exec = () => {
    if (!isCalculated) {
      monteCarlo();
      isCalculated = true;
    }
  };

  const val = () => {
    exec();
    return {
      monteMin,
      monteMax,
      monteVals,
      histogram,
      monteMean,
      slices,
      samples,
      paramStr,
      exec
    }
  };
  
    return {
      val,
      paramStr,
      type,
      exec
    };
}

export function UF(props) {
  var monteMin = Number.MAX_VALUE;
  var monteMax = Number.MIN_VALUE;
  var monteVals = [];
  var histogram = [];
  var monteMean = 0.0;
  var isCalculated = false;

  const type = "uniform";
  const min = props.min || 0.0;
  const max = props.max || 1.0;
  const paramStr = `(${min},${max})`;

  const slices = props.slices || 20;
  const samples = props.samples || 1000 * slices;

  const sample = () => {
    return Math.random() * (max - min) + min;
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
    monteMax = max;
    monteMin = min;
    values = values.sort();
    monteVals = values;
    monteMean = sum / samples;
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

    histogram = sliceData;
    
  };
  
  const exec = () => {
    if (!isCalculated) {
      monteCarlo();
      isCalculated = true;
    }
  };

  const val = () => {
    exec();
    return {
      monteMin,
      monteMax,
      monteVals,
      histogram,
      monteMean,
      slices,
      samples,
      paramStr,
      exec
    }
  };
  
    return {
      val,
      paramStr,
      type,
      exec
    };
}

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