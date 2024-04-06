import React from 'react'
import DatePicker from "react-multi-date-picker"
import { Form, InputGroup, Stack } from 'react-bootstrap';
import { FaRegCalendarDays } from "react-icons/fa6";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import moment from 'moment';

export const DatePickerComponent = ({ date, type, range, min, max, onChange, disabled, required, clear }) => {
	const toDate = (dateObjects) => {
		if (dateObjects.constructor === Array) {
			dateObjects = dateObjects.map((d) => new Date(Date.parse(d.format())))
		}
		else {
			dateObjects = new Date(dateObjects)
		}
	
		return dateObjects
	}

	const update = (dateObjects) => {
		if (dateObjects == null) {
			onChange(null)
			return
		}

		onChange(toDate(dateObjects))
	}

    const pagination = (diff) => {        
        switch(type) {
            case "day":
				if ((max && diff == 1 && moment(date).format("YYYY-MM-DD") == moment(max).format("YYYY-MM-DD")) || (min && diff == -1 && moment(date).format("YYYY-MM-DD") == moment(min).format("YYYY-MM-DD"))) {
					return
				}

                onChange(moment(date).add(diff, 'days').toDate())
                return
            case "month":
				if ((max && diff == 1 && moment(date).format("YYYY-MM") == moment(max).format("YYYY-MM")) || (min && diff == -1 && moment(date).format("YYYY-MM") == moment(min).format("YYYY-MM"))) {
					return
				}

                onChange(moment(date).add(diff, 'months').toDate())
                return
            case "year":
				if ((max && diff == 1 && moment(date).format("YYYY") == moment(max).format("YYYY")) || (min && diff == -1 && moment(date).format("YYYY") == moment(min).format("YYYY"))) {
					return
				}

                onChange(moment(date).add(diff, 'years').toDate())
                return
            default:
                return
        }
    }

	return (
		<DatePicker
			value={date}
			onlyMonthPicker={type === "month"}
			onlyYearPicker={type === "year"}
			minDate={min}
			maxDate={max}
			weekStartDayIndex={1}
			range={range}
			format={type === "year" ? "YYYY" : type === "month" ? "YYYY-MM" : "YYYY-MM-DD"}
			onChange={update}
			containerStyle={{
				width: "100%"
			}}
			render={(value, openCalendar) => {
				return (<>
					{disabled ? (
						<Form.Control value={value} />
					): (
						<InputGroup>
                        {(!range) && <>
                            <InputGroup.Text className='bg-white border-end-0'>
                                <Stack direction="horizontal" gap={1}>
									<FaChevronLeft onClick = {() => pagination(-1)} />
									<FaChevronRight onClick = {() => pagination(1)}/>
                                </Stack>
                            </InputGroup.Text>
                        </> }

                        <Form.Control onClick={openCalendar} className={`${(!range) && "border-start-0"} border-end-0`} value={value} disabled={disabled} required={required} />
						
						{clear === true && (date != null && date !== "") && 
							<InputGroup.Text  className="border-start-0 border-end-0 bg-white">
								<FaTimes onClick={() => update(null)}/>
							</InputGroup.Text>
						}

	  					<InputGroup.Text onClick={openCalendar} className='border-start-0 bg-white'>
							<FaRegCalendarDays />
						</InputGroup.Text>
					</InputGroup>
					)}
				</>)
			}}
		/>
	)
}