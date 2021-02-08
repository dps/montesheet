import React, { createRef, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from "@material-ui/core/styles";
import { parse } from "../jison/grammar";
import { InputAdornment, TextField } from "@material-ui/core";
import useMousetrap from "react-hook-mousetrap"

const toposort = require('toposort');

window.values = {'A1': 1, 'A2': '=A1+1'};

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


function SpreadsheetItems(props) {
  const classes = useStyles();

  const formulaFieldRef = createRef();

  const defaultItems = {'A1': 1, 'A2': '=A1+1'};

  const [cells, setCells] = useState(defaultItems);
  const [errorCellText, setErrorCellText] = useState({});
  
  const [editCell, setEditCell] = useState("A2");
  const [selection, setSelection] = useState("A2:A5");

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

            if (edgesAdded == 0) {
                // This cell has no dependencies, but it is a formula so
                // compute its value right now. (e.g. pure math)
                try {
                  window.values[item] = parse(formula);
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
                window.values[cell] = val;
                if (isNaN(val)) {
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

  const fillDown = () => {
      console.log("fillDown");
      const startCell = selection.split(":")[0];
      const endCell = selection.split(":")[1];
      const startParts = cellParts(startCell);
      const endParts = cellParts(endCell);

      var templateFormula = cells[startCell];
      console.log("templateFormula", templateFormula);

      for (var i = startParts[1] + 1; i <= endParts[1]; i++) {
          console.log(i);
        const regex = /([A-Z])([0-9]+)/g;
        var computedFormula = "";
        var matches;
        var pos = 0;
        while (matches = regex.exec(templateFormula)) {
            console.log("matches", matches, computedFormula, pos);
            // Add the next bit that isn't a cell name
            computedFormula += templateFormula.substr(pos, matches.index);

            // Then grab the cell name and increment it by one row (filling DOWN).
            computedFormula += matches[1] + (Number(matches[2]) + 1);
            pos = matches.index + matches[0].length;
        }
        // copy over anything left at the end of the template after all matches.
        computedFormula += templateFormula.substring(pos);

        console.log("computed", computedFormula);
        cells[startParts[0] + i] = computedFormula;
        templateFormula = computedFormula;
      }
      toposortCells();
      setCells(cells);
      handleUnmodifiedDirKey(0,0);
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

useMousetrap("down", () => handleUnmodifiedDirKey(1, 0));
useMousetrap("up", () => handleUnmodifiedDirKey(-1, 0));
useMousetrap("left", () => handleUnmodifiedDirKey(0, -1));
useMousetrap("right", () => handleUnmodifiedDirKey(0, 1));
useMousetrap("shift+down", () => handleShiftDirKey(1, 0));
useMousetrap("esc", () => handleUnmodifiedDirKey(0, 0));

const handleUnmodifiedDirKey = (v, h) => {
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
        setEditCell(nextCell(editCell, 1, 0));
    } else if (e.key === "ArrowDown") {
        if (e.shiftKey) {
            handleShiftDirKey(1, 0);
        } else {
            handleUnmodifiedDirKey(1, 0);
        }
    } else if (e.key === "ArrowUp") {
        if (e.shiftKey) {
            handleShiftDirKey(-1, 0);
        } else {
            e.preventDefault();
            handleUnmodifiedDirKey(-1, 0);
        }
    } else if (e.key === "ArrowLeft") {
        handleUnmodifiedDirKey(0, -1);
    } else if (e.key === "ArrowRight") {
        handleUnmodifiedDirKey(0, 1);
    } else if (e.key === "Escape") {
        handleUnmodifiedDirKey(0, 0);
    } else if (e.key === "d" && e.ctrlKey) {
        // Fill down
        fillDown();
    } 
    formulaFieldRef.current.focus();
};

  return (
    <>
    {toposortCells()}
    <TextField inputRef={formulaFieldRef} key={"formula-" + editCell}
      fullWidth id="filled-basic" label="Formula" variant="filled" defaultValue={cells[editCell] || ""}
      onKeyDown={formulaKeyDown} autoFocus
      helperText={errorCellText[editCell] || " "}
    InputProps={{
        form: {
            autocomplete: 'off',
        },
        startAdornment: <InputAdornment position="start">{editCell}</InputAdornment>,
      }}
    />

    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>🧮</TableCell>
            {[...Array(21).keys()].map((i) => 
                <TableCell align="center">{String.fromCharCode('A'.charCodeAt(0) + i)}</TableCell>)
            }            
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(20).keys()].map((r, row) => (
            <TableRow key={"row-" + row}>
              <TableCell component="th" scope="row" key={"rowl-" + row}>
                {row + 1}
              </TableCell>
              {[...Array(21).keys()].map((i) => {
                  const cellName = String.fromCharCode('A'.charCodeAt(0) + i) + (row + 1);
                  return <TableCell 
                      className={cellName === editCell ? classes.outlined : inSelection(cellName) ? classes.selectedCell : classes.tableCell}
                      key={"cell-" + cellName + "-" + (cells[cellName] || '')}
                      onClick={() => {setEditCell(cellName);setSelection(cellName + ":" + cellName);}}
                      align="right">{window.values[cellName] || cells[cellName] || ''}
                      
                      </TableCell>;}
                  )
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </>
  );
}

export default SpreadsheetItems;
