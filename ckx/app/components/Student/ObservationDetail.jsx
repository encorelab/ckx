import React from 'react';
import { connect } from 'react-redux'
import { FlatButton } from 'app/lib/icons'
import Dialog from 'material-ui/Dialog';
import { infoSelector } from 'app/reducers/observations'
import { closeInfo } from 'app/ui/actions'

const ObservationDetail = ( {observation, closeInfo} ) => {
  const actions = [
    <FlatButton
      label = "X"
      secondary = {true}
      onClick = {closeInfo}
    />
  ]

  return (
    <Dialog
      title = {observation.title}
      modal = {false}
      open = {true}
      actions = {actions}
      onRequestClose = {closeInfo}
    >
      <div>
        {observation.content}
      </div>
      <br />
      <div>
        Media goes here eventually
      </div>
    </Dialog>
  )
}


const ObservationCond = (props) => 
  props.observation ? <ObservationDetail {...props} /> : null

export default connect(
  e => ({ observation: infoSelector(e) }),
  {closeInfo: closeInfo}
)(ObservationCond)
