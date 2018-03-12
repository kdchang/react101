/**
 * Created by simon on 2017/3/8.
 */

import React from 'react';
import Relay from 'react-relay';

class Tea extends React.Component {
  render() {
    const tea = this.props.tea;
    console.info(tea)
    return (
      <li key={tea}>
        {tea.name}
        (<em>{tea.id}</em>)
      </li>
    );
  }
}

export default Relay.createContainer(Tea, {
  fragments: {
    tea: () => Relay.QL`
      fragment on Tea {
        name
      }
    `
  }
})
