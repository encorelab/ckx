import React from 'react';
import { connect } from 'react-redux'
import { FlatButton } from 'app/lib/icons'
import Dialog from 'material-ui/Dialog';
import { infoSelector } from 'app/reducers/observations/reducers'
import { closeInfo } from 'app/reducers/ui/actions'

const ObservationDetails = ( {observation, closeInfo} ) => {
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
        {observation.media.map(function(url) {
          let src = "http://pikachu.coati.encorelab.org/" + url
          return <img src={src} style={imgBoxStyle} ></img>
        })}
      </div>
    </Dialog>
  )
}


const ObservationCond = (props) =>
  props.observation ? <ObservationDetails {...props} /> : null

export default connect(
  e => ({ observation: infoSelector(e) }),
  {closeInfo: closeInfo}
)(ObservationCond)



const imgBoxStyle = {
  padding: '5px',
  width: '100px',
  height: '100px'
}