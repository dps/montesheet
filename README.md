
## 🧮 Montesheet

A simple proof-of-concept probabilistic spreadsheet in React with Material-UI.

## Using

The following distribution functions are available

### normal
`=normal(mean, stddev)`
A normal distribution (gaussian) with mean and standard deviation as specified.

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

#### Combining distributions
All regular math operations (`+`,`-`,`/`,`*`) work on distributions. You can also use:

### mmax
`=mmax(distA, distB)`
Samples pairs uniformly at random from distribution A and distribution B and chooses the maximum value each time. This is useful if you want to model e.g. latency of a process which always depends on the maximum latency of its subprocesses.

### choose
`=choose(distA, distB)`
Samples pairs uniformly at random from distribution A and distribution B and chooses one value from the pair with equal probability. Useful for creating bi-modal distributions from constitent parts.

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


  
