import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'

const Tick = ({ tick, count, format }) => {
  const isFullHour = parseInt(moment(new Date(tick.value)).format("mm")) === 0

  const tickLabelStyle = {
    marginLeft: `${-(100 / count) / 2}%`,
    width: `${100 / count}%`,
    left: `${tick.percent}%`,
    transform: `translateX(-13px)`,
  }

  return (
    <div>
      <div
        className={`react_time_range__tick_marker${isFullHour ? '__large' : ''}`}
        style={{ left: `${tick.percent}%` }}
      />
      {isFullHour && (
        <div className='react_time_range__tick_label' style={tickLabelStyle}>
          {format(tick.value)}
        </div>
      )}
    </div>
  )
}

Tick.propTypes = {
  tick: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired
  }).isRequired,
  count: PropTypes.number.isRequired,
  format: PropTypes.func.isRequired
}

Tick.defaultProps = { format: d => d }

export default Tick
