import React, { createRef, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { makeStyles } from "@material-ui/core/styles";
import { parse } from "../util/parser";
import { InputAdornment, TextField } from "@material-ui/core";
import useMousetrap from "react-hook-mousetrap"
import DistributionCell from "./DistributionCell";
const cloneDeep = require('clone-deep');
const toposort = require('toposort');

window.values = {};
const rowCount = 20;
const colCount = 21;

const useStyles = makeStyles((theme) => ({
  paperItems: {
    minHeight: "300px",
  },
  tableCell: {
      borderLeftColor: theme.palette.divider, borderLeftStyle: "solid", borderLeftWidth: "1px"
  },
  outlined : {
      backgroundColor: theme.palette.info.main
  },
  selectedCell : {
        backgroundColor: theme.palette.secondary.main}
  }
  ));

function useStickyState(defaultValue, key) {
  const [value, setValue] = React.useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  React.useEffect(() => {
    console.log(key, "changes");
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function SpreadsheetItems(props) {
  const classes = useStyles();

  const formulaFieldRef = createRef();

  const defaultItems = {};

  const [cells, setCells] = useStickyState(defaultItems, "montesheet");
  const [errorCellText] = useState({});
  
  const [editCell, setEditCell] = useState("A1");
  const [selection, setSelection] = useState("A1:A1");

  const clearAll = () => {
    window.values = {};
    setCells({});
  }

  const demo1 = () => {
    window.values = {};
    setCells({'A1':'😎 Demo 1', 'B1': 'Probabilistic revenue model', 'C1': 'Deterministic model',
              'A2': 'Total annual addressable market (M units)', 'B2': '=normal(10,2)', 'C2': '10',
              'A3': 'Terminal market share (%)', 'B3': '=normal(0.5,0.05)', 'C3': '0.5',
              'A4': 'Unit price ($)', 'B4': '=uniform(100,150)', 'C4': '125',
              'A5': 'Total annual revenue ($)', 'B5': '=B2*B3*B4', 'C5': '=C2*C3*C4'});
  }

  const demo2 = () => {
    window.values = {};
    setCells({'A1':'🧚🏻 Demo 2', 'B1': '',
              'A2': 'Lost teeth per year', 'B2': '=poisson(3)',
              'A3': 'Per tooth bounty', 'B3': '=uniform(1.0,2.0)',
              'A5': 'Expected annual payout ($)', 'B5': '=B2*B3',});
  }

  const demo3 = () => {
    window.values = {};
    setCells(
      JSON.parse('{"A1":"mean for C6","B1":"1.0","A2":"stddev for C6","B2":"0.5","A3":"","B3":"","A4":"","B4":"","C6":"=normal(B1,B2)","B6":"normal(mean, stddev)","B7":"uniform(min, max)","C7":"=uniform(1,2)","B8":"poisson(mean)","C8":"=poisson(3.0)","B9":"exponential(rate)","C9":"=exponential(2)"}')
      );
    }

  const toposortCells = () => {
    var graph = [];

    for (var item in cells) {
        const formula = String(cells[item]);
        if (!formula.startsWith("=")) {
            window.values[item] = formula;
        } else {
            var edgesAdded = 0;

            const matches = formula.match(/[A-Z][0-9]+/g);
            for (var match in matches) {
                edgesAdded++;
                graph.push([matches[match], item]);
            }

            if (edgesAdded === 0) {
                // This cell has no dependencies, but it is a formula so
                // compute its value right now. (e.g. pure math)
                try {
                  var res = parse(formula);
                  if (res.paramStr) {
                    res.exec();
                  }
                  window.values[item] = res;
                  delete errorCellText[item];
                } catch (err) {
                  errorCellText[item] = err.message;
                  window.values[item] = "ERR";
                }
            }
        }

      }
      const topo = toposort(graph);
      parseCells(topo);
  }

  const parseCells = (topo) => {
      for (var i in topo) {
          const cell = topo[i];
          const formula = String(cells[cell]);

          if (formula.startsWith("=")) {
              try {
                const val = parse(cells[cell]);
                if (val.paramStr) {
                  val.exec();
                  window.values[cell] = val;
                } else {
                  window.values[cell] = val;
                }
                if (!val.paramStr && isNaN(val)) {
                    window.values[cell] = "NAN";
                }
                delete errorCellText[cell];
              } catch (err) {
                errorCellText[cell] = err.message;
                window.values[cell] = "ERR";
              }
          }
      }
  }

  const fillDown = (e) => {
      const startCell = selection.split(":")[0];
      const endCell = selection.split(":")[1];
      const startParts = cellParts(startCell);
      const endParts = cellParts(endCell);

      var templateFormula = cells[startCell];

      for (var i = startParts[1] + 1; i <= endParts[1]; i++) {
        const regex = /([A-Z])([0-9]+)/g;
        var computedFormula = "";
        var matches;
        var pos = 0;
        while ((matches = regex.exec(templateFormula))) {
            // Add the next bit that isn't a cell name
            computedFormula += templateFormula.substr(pos, matches.index - pos);

            // Then grab the cell name and increment it by one row (filling DOWN).
            computedFormula += matches[1] + (Number(matches[2]) + 1);
            pos = matches.index + matches[0].length;
        }
        // copy over anything left at the end of the template after all matches.
        computedFormula += templateFormula.substring(pos);

        cells[startParts[0] + i] = computedFormula;
        templateFormula = computedFormula;
      }
      toposortCells();
      setCells(cells);
      handleUnmodifiedDirKey(0,0,e);
  }

  const cellParts = (cellName) => {
    const parts = cellName.match(/([A-Z])([0-9]+)/);
    return [parts[1], Number(parts[2])];
  }

  const nextCell = (cellName, vdir, hdir) => {
    const p = cellParts(cellName);
    var v = Number(p[1]) + vdir;
    if (v < 1) {
        v = 1;
    }
    var h = String.fromCharCode(p[0].charCodeAt(0) + hdir);
    if (h === '@') {
        h = 'A';
    }
    return h + v;
  }

  const inSelection = (cellName) => {
      const parts = cellParts(cellName);
      const selStartParts = cellParts(selection.split(":")[0]);
      const selEndParts = cellParts(selection.split(":")[1]);

      return (parts[0] >= selStartParts[0] &&
        parts[0] <= selEndParts[0] &&
        parts[1] >= selStartParts[1] &&
        parts[1] <= selEndParts[1]);
}

useMousetrap("down", (e) => handleUnmodifiedDirKey(1, 0, e));
useMousetrap("up", (e) => handleUnmodifiedDirKey(-1, 0, e));
useMousetrap("left", (e) => handleUnmodifiedDirKey(0, -1, e));
useMousetrap("right", (e) => handleUnmodifiedDirKey(0, 1, e));
useMousetrap("shift+down", (e) => handleShiftDirKey(1, 0, e));
useMousetrap("esc", (e) => handleUnmodifiedDirKey(0, 0, e));

const handleUnmodifiedDirKey = (v, h, e) => {
    if (formulaFieldRef.current.selectionStart != formulaFieldRef.current.value.length) {
        return;
    }
    e.preventDefault();
    const nCell = nextCell(editCell, v, h);
    setEditCell(nCell);
    setSelection(nCell + ":" + nCell);
}

const handleShiftDirKey = (v, h) => {
    setSelection(
        selection.split(":")[0] + ":" +
        nextCell(selection.split(":")[1], v, h)
    )
}

  const formulaKeyDown = (e) => {
    if (e.key === "Enter") {
        cells[editCell] = formulaFieldRef.current.value;
        setCells(cloneDeep(cells));
        setEditCell(nextCell(editCell, 1, 0));
    } else if (e.key === "ArrowDown") {
        if (e.shiftKey) {
            handleShiftDirKey(1, 0);
        } else {
            handleUnmodifiedDirKey(1, 0, e);
        }
    } else if (e.key === "ArrowUp") {
        if (e.shiftKey) {
            handleShiftDirKey(-1, 0);
        } else {
            e.preventDefault();
            handleUnmodifiedDirKey(-1, 0, e);
        }
    } else if (e.key === "ArrowLeft") {
        handleUnmodifiedDirKey(0, -1, e);
    } else if (e.key === "ArrowRight") {
        handleUnmodifiedDirKey(0, 1, e);
    } else if (e.key === "Escape") {
        handleUnmodifiedDirKey(0, 0, e);
    } else if (e.key === "d" && e.ctrlKey) {
        // Fill down
        fillDown(e);
    } 
    formulaFieldRef.current.focus();
};

const renderDistOrVal = (cellName) => {
  if (window.values[cellName] && window.values[cellName].paramStr) {
    return <DistributionCell distribution={window.values[cellName]} />;
  }
  return window.values[cellName] || cells[cellName] || '';
}

  return (
    <>
    {toposortCells()}
    <ButtonGroup disableElevation size="small">
      <Button onClick={demo1}>Demo 1: Revenue Model</Button>
      <Button onClick={demo2}>Demo 2: Tooth Fairy</Button>
      <Button onClick={demo3}>Demo 3: All the distributions</Button>
      <Button onClick={clearAll}><ClearAllIcon/></Button>
    </ButtonGroup>
    <TextField inputRef={formulaFieldRef} key={"formula-" + editCell}
      fullWidth id="filled-basic" label="Formula" variant="filled" defaultValue={cells[editCell] || ""}
      onKeyDown={formulaKeyDown} autoFocus
      autoComplete="off"
      helperText={errorCellText[editCell] || " "}
      InputProps={{
        startAdornment: <InputAdornment position="start">{editCell}</InputAdornment>,
      }}
    />

    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>🧮</TableCell>
            {[...Array(colCount).keys()].map((i) => 
                <TableCell align="center">{String.fromCharCode('A'.charCodeAt(0) + i)}</TableCell>)
            }            
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(rowCount).keys()].map((r, row) => (
            <TableRow key={"row-" + row}>
              <TableCell component="th" scope="row" key={"rowl-" + row}>
                {row + 1}
              </TableCell>
              {[...Array(colCount).keys()].map((i) => {
                  const cellName = String.fromCharCode('A'.charCodeAt(0) + i) + (row + 1);
                  return <TableCell 
                      className={cellName === editCell ? classes.outlined : inSelection(cellName) ? classes.selectedCell : classes.tableCell}
                      key={"cell-" + cellName + "-" + (cells[cellName] || '')}
                      onClick={() => {setEditCell(cellName);setSelection(cellName + ":" + cellName);}}
                      align="right">{renderDistOrVal(cellName)}
                      </TableCell>;
                })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </>
  );
}

export default SpreadsheetItems;
