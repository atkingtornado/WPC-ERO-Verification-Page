import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DatePicker from "react-datepicker";

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import "react-datepicker/dist/react-datepicker.css";

import type { MenuSelection } from "../types"

dayjs.extend(utc)


interface SelectionMenuProps {
  displayType: "static"|"interactive";
  selection: MenuSelection;
  updateSelection: <K extends keyof SelectionMenuProps["selection"]>(key: K, value: SelectionMenuProps["selection"][K]) => void;
}
// displayType is accepted for parity with the callers but the menu is the same in both modes
export const SelectionMenu = ({ selection, updateSelection }: SelectionMenuProps) => {

  /**
    * Handles change events for date selection
  */
  const handleDateChange = (date: Date | null) => {
    const dayjsDate = dayjs.utc(date).hour(12).minute(0).second(0).millisecond(0)
    updateSelection("selectedDate", dayjsDate);
  };

  /**
   * Increments the selected date by one day
   */
  const incrementDate = () => {
    const tmpDate = selection.selectedDate.add(1, "day")
    const currDate = dayjs.utc().hour(12).minute(0).second(0).millisecond(0)
    // Prevent date from exceeding current date
    if (tmpDate <= currDate) {
      updateSelection("selectedDate", tmpDate);
    } 
  }

  /**
   * Decrements the selected date by one day
   */
  const decrementDate = () => {
    const tmpDate = selection.selectedDate.subtract(1, "day")
    updateSelection("selectedDate", tmpDate);
  }

  /**
    * Handles fhour change events
  */
  const handleFHourChange = (_e: React.MouseEvent<HTMLElement>, newValue: number | null) => {
    if(newValue !== null) {
      updateSelection("fHour", newValue);
    }
  };

  /**
    * Handles change events for plot selection
  */
  const handlePlotChange = (e: SelectChangeEvent<string>) => {
    updateSelection("selectedPlot", e.target.value);
  };

  return (
    <div className="z-10 flex align-center justify-center ">
      <Paper className="z-20 gap-2 p-2 w-full max-w-lg flex-col flex justify-center align-center">

        <div className="w-full flex">
          <IconButton onClick={decrementDate} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <DatePicker 
              wrapperClassName='w-full z-20'
              className='border-[1px] border-[#808080] w-full rounded pl-2 pr-2 pt-2 pb-2 placeholder-[#808080]'
              placeholderText="ERO Valid Date"
              selected={selection["selectedDate"].toDate()} 
              onChange={handleDateChange}
              // onFocus={() => {setSearchByNumber(false)}}
              // minDate={dayjs(yearOptions[0].value.toString(), "YYYY").toDate()}
              maxDate={dayjs().utc().toDate()}
          />
          <IconButton onClick={incrementDate} aria-label="forward">
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