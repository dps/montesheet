
## 🧮 Montesheet

Demo: https://montesheet.singleton.io/

A simple proof-of-concept probabilistic spreadsheet in React with Material-UI.

## Usage

It's a spreadsheet! Enter labels or numbers directly. Formulae begin with `=`. Reference other cells by name e.g. `=A1+A2`. Fill down by clicking on start cell, holding shift + down arrow to select the fill range, then press ctrl+d.

Where this spreadsheet is different is that you can assign probability *distributions* as values. You can use cells in math expressions whether they contain a scalar or a distribution. When two distributions are combined, a Monte Carlo simulation runs to generate a new value in that cell.

The following distribution functions are available:

# Distributions

### normal
`=normal(mean, stddev)`
A normal distribution (gaussian) with mean and standard deviation as specified.

`=normal(mean, stddev, [min])`
A normal distribution (gaussian) with mean and standard deviation as specified and a minimum sample value of min. Note that this can skew the distribution mean higher than the mean you specify as the center of the normal distribution. Any samples falling below the minimum value will be resampled.

`=normal(mean, stddev, [min , max])`
A normal distribution (gaussian) with mean and standard deviation as specified, a minimum sample value of min and a maximum sample value of max. Note that this can skew the distribution mean higher or lower than the mean you specify as the center of the normal distribution. Any samples falling outside of [min, max] will be resampled.
*warning* - montesheet is not yet smart enough to detect invalid min,max values for the given mean and stddev and will hang trying to find samples that match. Use with care.

### uniform
`=uniform(min, max)`
A uniform distribution of floating point values >= min and < max.

### exponential
`=exponential(rate)`
An exponential distribution of values with rate as specified.
For example you can use it to simulate when an event is going to happen next, given its average rate.

### poisson
`=poisson(mean)`
A poisson distribution with a mean as specified.
_For instance, a call center receives an average of 180 calls per hour, 24 hours a day. The calls are independent; receiving one does not change the probability of when the next one will arrive. The number of calls received during any minute has a Poisson probability distribution with mean 3: the most likely numbers are 2 and 3 but 1 and 4 are also likely and there is a small probability of it being as low as zero and a very small probability it could be 10._

# Combining distributions
All regular math operations (`+`,`-`,`/`,`*`) work on distributions. You can also use:

### mmax
`=mmax(distA, distB)`
Samples pairs uniformly at random from distribution A and distribution B and chooses the maximum value each time. This is useful if you want to model e.g. latency of a process which always depends on the maximum latency of its subprocesses.

### choose
`=choose(distA, distB)`
Samples pairs uniformly at random from distribution A and distribution B and chooses one value from the pair with equal probability. Useful for creating bi-modal distributions from constitent parts.

# Computing scalars from distributions

The following functions are available

### min, mean, max
`=min(dist)`, `=mean(dist)`, `=max(dist)`
Compute the minimum, mean or maximum value respectively.

### pN
`=p[0-9]+(dist)` e.g. `=p50(dist)`
Computes the N/100th percentile value in the distribution. `p50` computes the median and `p99` computes the 99th percentile.

# Nesting expressions in formulae
Expressions can be nested arbitrarily in formulae e.g. `=normal(p50(exponential(5)), 1.0)` is perfectly valid.
<img width="235" alt="Screen Shot 2021-11-09 at 9 38 28 PM" src="https://user-images.githubusercontent.com/237355/141056213-765b6897-4092-4985-91e5-8fe4c984531a.png">

## Building

To re-generate the parser from `grammar.jison`
```
npm install jison -g
cd src/jison
jison grammar.jison
```
Which writes the file `grammar.js` in the same directory.

To run
```
npm install
```
Install the Netlify CLI
```
npm install netlify-cli -g
```
Run the development server
```
netlify dev
```
When the above command completes you'll be able to view your website at `http://localhost:8888`


  
