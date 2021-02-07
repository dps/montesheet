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

const toposort = require('toposort');

window.values = {'A1': 100, 'A2': '=A3+1', 'A3': '=A1*2'};

const useStyles = makeStyles((theme) => ({
  paperItems: {
    minHeight: "300px",
  },
  tableCell: {
      borderLeftColor: theme.palette.divider, borderLeftStyle: "solid", borderLeftWidth: "1px"
  },
  outlined : {
      backgroundColor: theme.palette.info.main}
}));


function SpreadsheetItems(props) {
  const classes = useStyles();

  const formulaFieldRef = createRef();

  const defaultItems = {'A1': 100, 'A2': '=A3+1', 'A3': '=A1*2'};

  const [cells, setCells] = useState(defaultItems);
  const [errorCellText, setErrorCellText] = useState({});
  
  const [editCell, setEditCell] = useState("A1");

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

  const cellParts = (cellName) => {
    const parts = cellName.match(/([A-Z])([0-9]+)/);
    console.log("cellParts ", parts);
    return [parts[1], parts[2]];
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

  const formulaKeyDown = (e) => {
    if (e.key === "Enter") {
        cells[editCell] = formulaFieldRef.current.value;
        setEditCell(nextCell(editCell, 1, 0));
    } else if (e.key === "ArrowDown") {
        setEditCell(nextCell(editCell, 1, 0));
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setEditCell(nextCell(editCell, -1, 0));
    } else if (e.key === "ArrowLeft") {
        setEditCell(nextCell(editCell, 0, -1));
    } else if (e.key === "ArrowRight") {
        setEditCell(nextCell(editCell, 0, 1));
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
                      className={cellName === editCell ? classes.outlined : classes.tableCell}
                      key={"cell-" + cellName}
                      onClick={() => {setEditCell(cellName);}}
                      align="right">{window.values[cellName] || ''}
                      
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
