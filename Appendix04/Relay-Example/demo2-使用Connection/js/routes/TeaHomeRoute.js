/**
 * Created by simon on 2017/3/8.
 */
import Relay from 'react-relay';

export default class TeaHomeRoute extends Relay.Route {
  static queries = {
    contry: () => Relay.QL`
      query{
        contry(name: $contryName)
      }
    `
  }
  static routeName = 'TeaHomeRoute';
}
