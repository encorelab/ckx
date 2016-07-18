import React from 'react'
import { connect } from 'react-redux'
import BoardObservationCluster from './BoardObservationCluster'
import LockTablets from './LockTablets'
import ObservationDetail from '../Student/ReadView/ObservationDetail'

const BoardViewEl = ({ ui, observations, dispatch }) => {
  return (
    <div>
      <h1>{ui.board}</h1>
      <BoardObservationCluster
        ui = {ui}
        observations = {observations}
        dispatch = {dispatch}
      />
      <ObservationDetail />
      <LockTablets
        ui = {ui}
        dispatch = {dispatch}
      />
    </div>
  )
}

// connect is a curried component that maps the state from redux (first call) to a presentational component (second call, in this case List)
const BoardView = connect(e => ({ui: e.ui, observations: e.observations}))(BoardViewEl)
export default BoardView