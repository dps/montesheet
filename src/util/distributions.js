import { useState, useEffect, useMemo } from "react";
const gaussian = require('gaussian')

export function min(a) {
  return a.val().monteMin;
}

export function max(a) {
  return a.val().monteMax;
}

export function mean(a) {
  return a.val().monteMean;
}

export function pn(n, a) {
  return (a.val().monteVals[Math.floor(Number(n.substring(1)) * a.val().samples / 100)]);
}

export function mul(a, b) {
  if (a.paramStr || b.paramStr) {
    return new combineDistributions(a, b, "*", (a,b) => {return a * b;});
  }
  return Number(a) * Number(b);
}

export function plus(a, b) {
  if (a.paramStr || b.paramStr) {
    return new combineDistributions(a, b, "+", (a,b) => {return a + b;});
  }
  return Number(a) + Number(b);
}

export function minus(a, b) {
  if (a.paramStr || b.paramStr) {
    return new combineDistributions(a, b, "-", (a,b) => {return a - b;});
  }
  return Number(a) - Number(b);
}

export function div(a, b) {
  if (a.paramStr || b.paramStr) {
    return new combineDistributions(a, b, "/", (a,b) => {return a / b;});
  }
  return Number(a) / Number(b);
}

export function choose(a, b) {
  if (a.paramStr || b.paramStr) {
    return new combineDistributions(a, b, "choose", (a,b) => {return Math.random() > 0.5 ? a :  b;});
  }
  return "ERR"
}

export function mmax(a, b) {
  if (a.paramStr || b.paramStr) {
    return new combineDistributions(a, b, "mmax", (a,b) => {return a > b ? a : b;});
  }
  return "ERR"
}

export function combineDistributions(a, b, label, combFunc) {
  var monteMin = Number.MAX_VALUE;
  var monteMax = Number.MIN_VALUE;
  var monteVals = [];
  var histogram = [];
  var monteMean = 0.0;
  var sliceWidth = 0.0;
  var isCalculated = false;

  const aVal = a.paramStr && a.val();
  const bVal = b.paramStr && b.val();


  const type = label;
  const paramStr = `(${aVal ? aVal.monteMean.toPrecision(2) : a},${bVal ? bVal.monteMean.toPrecision(2) : b})`;


  const slices = (aVal && aVal.slices) || (bVal && bVal.slices) || 20;
  const samples = (aVal && aVal.samples) || 1000 * slices;

  const sample = () => {
    const aIdx = a.paramStr && Math.floor(Math.random() * aVal.samples | 0);
    const bIdx = b.paramStr && Math.floor(Math.random() * bVal.samples | 0);
    return combFunc(a.paramStr ? aVal.monteVals[aIdx] : a, b.paramStr ? bVal.monteVals[bIdx] : b);
  };

  const zeros = (n) => {
    return Array(n).fill(0);
  };

  const monteCarlo = () => {
    var values = [];
    var sliceData = zeros(slices);
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
    values = values.sort((a, b) => a - b);
    monteVals = values;
    monteMean = sum / samples;
    sliceWidth = (max - min) / (1.0 * slices);

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
      exec,
      sliceWidth,
    }
  };
  
    return {
      val,
      paramStr,
      type,
      exec
    };
}



export function poisson(props) {
  return GenericDistribution(
    { type: "poisson",
      paramStr: `(${props.mean})`, 
      sample: () => {
        var mean = props.mean;

        var L = Math.exp(-mean);
        var p = 1.0;
        var k = 0;
        
        do {
            k++;
            p *= Math.random();
        } while (p > L);
        
        return k - 1;
      }
      , ...props});
}

export function exponential(props) {
  return GenericDistribution(
    { type: "exponential",
      paramStr: `(${props.rate})`, 
      sample: () => {
        // http://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates
        // For example you can use it to simulate when an event is going to happen next, given its average rate:
        // Buses arrive every 30 minutes on average, so that's an average rate of 2 per hour.
        // I arrive at the bus station, I can use this to generate the next bus ETA:
        //   exponential(2); // => 0.3213031016466269 hours, i.e. 19 minutes 
        var rate = props.rate;
        return -Math.log(Math.random()) / rate;
      }
      , ...props});
}

export function normal(props) {
  const generator = gaussian(props.mean, props.stddev*props.stddev);
  return GenericDistribution(
    { type: "normal",
      paramStr: `(${props.mean}, ${props.stddev})`, 
      sample: () => {
        return generator.ppf(Math.random());
      },
      minSample: props.sampleMin,
      maxSample: props.sampleMax,
      ...props});
}

export function uniform(props) {
  return GenericDistribution(
    { type: "uniform",
      paramStr: `(${props.min}, ${props.max})`, 
      sample: () => {
        return Math.random() * (Number(props.max) - Number(props.min)) + Number(props.min)
      }
      , ...props});
}

export function GenericDistribution(props) {
  var monteMin = Number.MAX_VALUE;
  var monteMax = Number.MIN_VALUE;
  var monteVals = [];
  var histogram = [];
  var monteMean = 0.0;
  var sliceWidth = 0.0;
  var isCalculated = false;

  const MAX_RESAMPLE = 10;

  const type = props.type;
  const paramStr = props.paramStr;

  const slices = props.slices || 50;
  const samples = props.samples || 1000 * slices;

  const sample = () => {
    var val = props.sample();
    var resampled = 0;
    if (props.minSample != null || props.maxSample != null) {
      while(resampled < MAX_RESAMPLE && (val < props.minSample || val > props.maxSample)) {
        val = props.sample();
        resampled++;
      }
    }
    if (resampled == MAX_RESAMPLE) {
      return 0.0;
    }
    return val;
  };

  const zeros = (n) => {
    return Array(n).fill(0);
  };

  const monteCarlo = () => {
    var values = [];
    var sliceData = zeros(slices);
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
    values = values.sort((a, b) => a - b);
    monteVals = values;
    monteMean = sum / samples;
    sliceWidth = (max - min) / (1.0 * slices);

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
      exec,
      sliceWidth,
    }
  };
  
    return {
      val,
      paramStr,
      type,
      exec
    };
}

export function ReactDistribution(props) {
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
    values = values.sort((a, b) => a - b);
    setMonteVals(values);
    setMonteMean(sum / samples);
    const sliceWidth = (max - min) / (1.0 * slices);

    for (let i = 0; i < values.length; i++) {
      const x = values[i];
      const index = Math.floor((x - min) / sliceWidth);
      if (index < slices) {
        sliceData[index]++;
      }
    }

    setHistogram(sliceData);
    
  };
  
  useEffect(() => {
    monteCarlo();
  }, [props, monteCarlo]);

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
  }, [monteMin, monteMax, monteVals, histogram, monteMean, paramStr]);
}