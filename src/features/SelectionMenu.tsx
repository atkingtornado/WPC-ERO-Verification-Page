import { useState } from 'react'

import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from "@mui/material/Typography"
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DatePicker from "react-datepicker";

import dayjs from 'dayjs'

import "react-datepicker/dist/react-datepicker.css";

import type { MenuSelection } from "./types"


interface SelectionMenuProps {
  displayType: "static"|"interactive";
  selection: MenuSelection;
  updateSelection: <K extends keyof SelectionMenuProps["selection"]>(key: K, value: SelectionMenuProps["selection"][K]) => void;
}
export const SelectionMenu = ({selection, updateSelection}: SelectionMenuProps) => {

  /**
    * Handles change events for date selection
  */
  const handleDateChange = (date) => {
    updateSelection("selectedDate", date);
  };

  /**
    * Handles fhour change events
  */
  const handleFHourChange = (e, newValue) => {
    if(newValue !== null) {
      updateSelection("fHour", newValue);
    }
  };

  /**
    * Handles change events for plot selection
  */
  const handlePlotChange = (e) => {
    updateSelection("selectedPlot", e.target.value);
  };

  return (
    <div className="flex align-center justify-center ">
      <Paper className="gap-2 p-2 w-full max-w-lg flex-col flex justify-center align-center">

        <div className="w-full flex">
          <IconButton aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <DatePicker 
              wrapperClassName='w-full z-20'
              className='border-[1px] border-[#808080] w-full rounded pl-2 pr-2 pt-2 pb-2 placeholder-[#808080]'
              placeholderText="ERO Valid Date"
              selected={selection["selectedDate"]} 
              onChange={handleDateChange}
              // onFocus={() => {setSearchByNumber(false)}}
              // minDate={dayjs(yearOptions[0].value.toString(), "YYYY").toDate()}
              maxDate={dayjs().toDate()}
          />
          <IconButton aria-label="forward">
            <ArrowForwardIcon />
          </IconButton>
        </div>

        <div className="mt-1 w-full flex justify-center align-center">
          <FormControl fullWidth size="small">
            <InputLabel htmlFor="grouped-select">Verification Plot</InputLabel>
            <Select value={selection["selectedPlot"]} onChange={handlePlotChange} id="grouped-select" label="Verification Plot">
              <ListSubheader>Operational</ListSubheader>
              <MenuItem value={"wpc_ero_verifall"}>ERO vs. All</MenuItem>
              <MenuItem value={"wpc_ero_verifpp"}>ERO vs. Practically Perfect</MenuItem>
              <ListSubheader>New Contours</ListSubheader>
              <MenuItem value={"wpc_ero_verifallnc"}>ERO vs. All</MenuItem>
              <MenuItem value={"wpc_ero_verifppnc"}>ERO vs. Practically Perfect</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="w-full flex justify-center align-center">
          <ToggleButtonGroup
            color="primary"
            value={selection["fHour"]}
            exclusive
            onChange={handleFHourChange}
            aria-label="display mode"
            size="small"
            fullWidth
          >
            <ToggleButton value={24}>F024</ToggleButton>
            <ToggleButton value={36}>F036</ToggleButton>
            <ToggleButton value={48}>F048</ToggleButton>
            <ToggleButton value={60}>F060</ToggleButton>
            <ToggleButton value={72}>F072</ToggleButton>
            <ToggleButton value={84}>F084</ToggleButton>
            <ToggleButton value={96}>F096</ToggleButton>
            <ToggleButton value={108}>F108</ToggleButton>
            <ToggleButton value={120}>F120</ToggleButton>
          </ToggleButtonGroup>
        </div>

      </Paper>
    </div>
  )
}