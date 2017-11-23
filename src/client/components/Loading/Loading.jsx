import React from 'react'
import PropTypes from 'prop-types'
import ReactLoading from 'react-loading'

const Loading = props =>
  (<div className='loading'>
    <ReactLoading type={props.type} height={props.height} width={props.width} color='black' />
  </div>)

Loading.propTypes = {
  type: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired
}

export default Loading
