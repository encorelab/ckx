import React from 'react';
import { render } from 'react-dom'
import Formsy from 'formsy-react'
import { isEqual } from 'lodash'
import { notEmpty } from 'app/lib/utils'
import { connect } from 'react-redux';
import MediaContainer from './MediaContainer'
import observationFields from './observationFields'
import * as uiActions from 'app/ui/actions'
import * as studentStateActions from 'app/reducers/student-state-actions'
import crudActions from 'app/reducers/crud-actions'

class WriteView extends React.Component {
  constructor() {
    super();
    this.state = {valid: false, draft: {doc: {}}}
  }

  componentDidMount = () => { 
    const interval = window.setInterval(this.periodicSaveDraft, 1000)
    
    if(this.props.obsToEdit) { 
      this.setState({id: this.props.obsToEdit.id})
    } 
    if(this.props.draft && this.props.draft.id) { 
      this.setState({id: this.props.draft.id})
    }
    // maybe an assert or some kind of sanity check - depends on ObsContainer, should never be able
    // to edit while already having a draft

    const formFields = observationFields(this.props.fields, this.props.obsToEdit, this.props.draft)
    this.setState({
      interval,
      formFields,
    })
    this.postDraftNotice()
  }

  postDraftNotice = () => {
    if(notEmpty(this.props.draft)) { 
      if(this.props.draft.id) {  // continuing on draft of published post
        this.props.postNotice('You are currently continuing editing the draft of an already published note. If you want to abolish this draft, and not change the published note, click on "Cancel"')
      } else if(notEmpty(this.props.draft.doc)) { // continuing on draft of unpublished post
        this.props.postNotice('You are currently editing a draft of an observation that you began, but never posted. If you want to throw away this draft, click on "Cancel"')
      }
    }
  }
 
  componentWillUnmount = () => {
    window.clearInterval(this.state.interval) // stop updating drafts
    this.props.unsetEdit()  
  }

  // save draft if there is text, and has been changed from last save
  periodicSaveDraft = () => { 
    if(notEmpty(this.state.doc) && 
      !isEqual(this.state.doc, this.state.prevDoc)) {
        this.props.storeDraft({id: this.state.id, doc: this.state.doc})
        this.setState({prevDoc: this.state.doc})
    }
  }

  valid = () => this.setState({valid: true});
  invalid = () => this.setState({valid: false});
  cancel = () => {
    this.props.discardDraft()
    this.props.switchView('read')
  }

  onChange = (doc) => this.setState({doc: doc}) 
  onSubmit = () => {
    if(this.state.id) {
      this.props.editObservation({...this.state.doc, id: this.state.id, owner: this.props.user })
    } else {
      this.props.addObservation({...this.state.doc, owner: this.props.user })
    }

    this.props.discardDraft()
    this.props.switchView('read')
  }

  render() {
    return (
      <div>
        <Formsy.Form
          onSubmit = {this.onSubmit}
          onValid = {this.valid}
          onInvalid = {this.invalid}
          onChange = {this.onChange}
        >
          <fieldset>
            {this.state.formFields}
          </fieldset>
          <input
            className = "btn btn-primary"
            type = "submit"
            defaultValue = "Submit"
            disabled = {!this.state.valid}
          />
        </Formsy.Form>
        <button onClick = {this.cancel}>Cancel</button>
      </div>
    )
  }
}

export default connect(
  e => ({fields: e.ui.fields, user: e.ui.user, draft: e.studentstate.draft, obsToEdit: e.ui.observationToEdit}),
    {...uiActions, ...studentStateActions, ...crudActions('Observation')}
)(WriteView)
