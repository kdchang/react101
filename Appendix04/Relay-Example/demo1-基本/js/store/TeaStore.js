/**
 * Created by simon on 2017/3/8.
 */

import React from 'react';
import Relay from 'react-relay';
import Tea from '../components/Tea'

class TeaStore extends React.Component {
  render() {
    const store = this.props.store
    console.info(store)
    const teas = store.teas
    return (
      <ul>
        {teas.map(tea => <Tea tea={tea}></Tea>)}
      </ul>
    )
  }
}

export default Relay.createContainer(TeaStore, {
  fragments: {
    store: () => Relay.QL`
      fragment on Store{
        teas {
          ${ Tea.getFragment('tea') }
        }
      }
    `
  }
})
