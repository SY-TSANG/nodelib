import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { scaleTime } from 'd3-scale'
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'
import moment from 'moment'
import { MdOutlineZoomIn, MdOutlineZoomOut, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

import SliderRail from './components/SliderRail'
import Track from './components/Track'
import Tick from './components/Tick'
import Handle from './components/Handle'

import './styles/index.css'

const getTimelineConfig = (timelineStart, timelineLength) => (date) => {
  const percent = (Number(moment(new Date(date)).format('x')) - Number(moment(new Date(timelineStart)).format('x')))/timelineLength * 100
  const value = Number(moment(new Date(date)).format('x'))

  return { percent, value }
}

const getFormattedBlockedIntervals = (blockedDates = [], [startTime, endTime]) => {
  if (!blockedDates.length) return null

  const timelineLength = Number(moment(new Date(endTime)).format('x')) - Number(moment(new Date(startTime)).format('x'))
  const getConfig = getTimelineConfig(startTime, timelineLength)

  const formattedBlockedDates = blockedDates.map((interval, index) => {
    let { start, end } = interval

    if (moment(start) < moment(startTime)) start = startTime
    if (moment(end) > moment(endTime)) end = endTime

    const source = getConfig(start)
    const target = getConfig(end)

    return { id: `blocked-track-${index}`, source, target }
  })

  return formattedBlockedDates
}

const getNowConfig = ([startTime, endTime])  => {
  const timelineLength = Number(moment(new Date(endTime)).format('x')) - Number(moment(new Date(startTime)).format('x'))
  const getConfig = getTimelineConfig(startTime, timelineLength)

  const source = getConfig(new Date())
  const target = getConfig(moment(new Date()).add(1, "minutes").toDate())

  return { id: 'now-track', source, target }
}

export const TimeRangePicker = ({
  containerClassName,
  onUpdateCallback,
  onChangeCallback,
  setTimelineInterval,
  selectedInterval,
  timelineInterval,
  sliderRailClassName,
  showNow,
  formatTick,
  disabledIntervals,
  step,
  ticksNumber,
  error,
  mode,
  min,
  max
}) => {
  const [selectedScale, setSelectedScale] = useState(0)
  const scale = [24, 12, 8, 4, 2]

  const formattedDisabledIntervals = getFormattedBlockedIntervals(disabledIntervals.filter((i) => i.start < timelineInterval[1] && i.end > timelineInterval[0]).map((i) => ({"start": moment.max(moment(i.start), moment(timelineInterval[0])),"end": moment.min(moment(i.end), moment(timelineInterval[1]))})), timelineInterval)

  useEffect(() => {
    const isValuesNotValid = checkIsValid(selectedInterval)

    onUpdateCallback({ error: isValuesNotValid})
  }, [formattedDisabledIntervals])

  const zoomIn = () => {
    if (selectedScale == scale.length-1 ) {
      return
    }

    setSelectedScale(selectedScale+1)
    scaleUpdate(selectedScale+1)
  }

  const zoomOut = () => {
    if (selectedScale == 0) {
      return
    }

    setSelectedScale(selectedScale-1)
    scaleUpdate(selectedScale-1)
  }

  const shiftLeft = () => {
    const curr_start = timelineInterval[0]

    const new_start = moment.max(
      moment(curr_start).subtract(scale[selectedScale]/2, 'hours'),
      moment(min)
    )

    setTimelineInterval([addHour(moment(new_start), 0), addHour(moment(new_start), scale[selectedScale])])
  }

  const shiftRight = () => {
    const curr_end = timelineInterval[1]

    const new_end = moment.min(
      moment(curr_end).add(scale[selectedScale]/2, 'hours'),
      moment(max)
    ).toDate()

    setTimelineInterval([addHour(new_end, (scale[selectedScale])*-1), addHour(moment(new_end), 0)])
  }

  const scaleUpdate = (value) => {
    const newScale = scale[value]

    const curr_start = timelineInterval[0]
    const curr_end = timelineInterval[1]
    const center = (Math.abs(moment(curr_start).diff(curr_end)))/2+Math.min(moment(curr_start).valueOf(),moment(curr_end).valueOf())
    
    const new_start = addHour(center, (newScale/2)*-1)
    const new_end = addHour(center, newScale/2)

    if (new_start < min) {
      setTimelineInterval([addHour(min, 0), addHour(min, newScale)])
    }
    else if (new_end > max) {
      setTimelineInterval([addHour(max, newScale*-1), addHour(max, 0)])
    }
    else {
      setTimelineInterval([new_start, new_end])
    }
  }

  const addHour = (value, diff) => {
    return moment(value).add(diff, 'hours').startOf('hour').toDate()
  }

  const now = () => {
    return getNowConfig(timelineInterval)
  }

  const onChange = (newTime) => {
    const formattedNewTime = newTime.map(t => new Date(t))
    onChangeCallback(formattedNewTime)
  }

  const checkIsSelectedIntervalNotValid = ([start, end], source, target) => {
    const { value: startInterval } = source
    const { value: endInterval } = target

    if (startInterval > start && endInterval <= end || startInterval >= start && endInterval < end)
      return true
    if (start >= startInterval && end <= endInterval) return true

    const isStartInBlockedInterval = start > startInterval && start < endInterval && end >= endInterval
    const isEndInBlockedInterval = end < endInterval && end > startInterval && start <= startInterval

    return isStartInBlockedInterval || isEndInBlockedInterval
  }

  const checkIsValid = (newTime) => {
    if (formattedDisabledIntervals != null && formattedDisabledIntervals.length) {
      const isValuesNotValid = formattedDisabledIntervals.some(({ source, target }) =>
        checkIsSelectedIntervalNotValid(newTime, source, target)
      )

      return isValuesNotValid
    }
  }

  const onUpdate = (newTime) => {
    if (formattedDisabledIntervals != null && formattedDisabledIntervals.length) {
      const isValuesNotValid = checkIsValid(newTime)
      const formattedNewTime = newTime.map(t => new Date(t))

      onUpdateCallback({ error: isValuesNotValid, time: formattedNewTime })
      return
    }

    const formattedNewTime = newTime.map(t => new Date(t))
    onUpdateCallback({ error: false, time: formattedNewTime })
  }

  const getDateTicks = () => {
    return scaleTime().domain(timelineInterval).ticks(ticksNumber).map(t => +t)
  }

  const domain = timelineInterval.map(t => Number(t))

  return (
    <div>
      <div style={{"display": "flex", "align-items": "center", "paddingLeft": "30px", "paddingRight": "30px"}}>
        <MdOutlineZoomIn size={25} onClick={() => zoomIn()}/>
        <MdOutlineZoomOut size={25} onClick={() => zoomOut()}/>

        <MdKeyboardArrowLeft size={25} onClick={() => shiftLeft()}/>
        <MdKeyboardArrowRight size={25} onClick={() => shiftRight()}/>
      </div>
      
      <div className={containerClassName || 'react_time_range__time_range_container' }>
        <Slider
          mode={mode}
          step={step}
          domain={domain}
          onUpdate={onUpdate}
          onChange={onChange}
          values={[moment.max(moment(selectedInterval[0]), moment(timelineInterval[0])), moment.min(moment(selectedInterval[1]), moment(timelineInterval[1]))].map(t => +t)}
          rootStyle={{ position: 'relative', width: '100%' }}
        >
          <Rail>
            {({ getRailProps }) =>
              <SliderRail className={sliderRailClassName} getRailProps={getRailProps} />}
          </Rail>

          <Handles>
            {({ handles, getHandleProps }) => (
              <div>
                {handles.map(handle => (
                  <Handle
                    error={error}
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>

          <Tracks left={false} right={false}>
            {({ tracks, getTrackProps }) => (
              <div>
                {tracks.map(({ id, source, target }) =>
                  <Track
                    error={error}
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                )}
              </div>
            )}
          </Tracks>

          {formattedDisabledIntervals != null && formattedDisabledIntervals.length && (
            <Tracks left={false} right={false}>
              {({ getTrackProps }) => (
                <div>
                  {formattedDisabledIntervals.map(({ id, source, target }) => (
                    <Track
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                      disabled
                    />
                  ))}
                </div>
              )}
            </Tracks>
          )}

          {showNow && (
            <Tracks left={false} right={false}>
              {({ getTrackProps }) => (
                <Track
                  key={now.id}
                  source={now.source}
                  target={now.target}
                  getTrackProps={getTrackProps}
                />
              )}
            </Tracks>
          )}

          <Ticks values={getDateTicks()}>
            {({ ticks }) => (
              <div>
                {ticks.map(tick => (
                  <Tick
                    key={tick.id}
                    tick={tick}
                    count={ticks.length}
                    format={formatTick}
                  />
                ))}
              </div>
            )}
          </Ticks>
        </Slider>
      </div>
  </div>
)
}

TimeRangePicker.propTypes = {
  ticksNumber: PropTypes.number.isRequired,
  selectedInterval: PropTypes.arrayOf(PropTypes.object),
  timelineInterval: PropTypes.arrayOf(PropTypes.object),
  disabledIntervals: PropTypes.arrayOf(PropTypes.object),
  containerClassName: PropTypes.string,
  sliderRailClassName: PropTypes.string,
  step: PropTypes.number,
  formatTick: PropTypes.func,
}

TimeRangePicker.defaultProps = {
  selectedInterval: [],
  timelineInterval: [],
  formatTick: ms => moment(new Date(ms)).format('HH:mm'),
  disabledIntervals: [],
  step: 1000*60*30,
  ticksNumber: 48,
  error: false,
  mode: 3,
}
