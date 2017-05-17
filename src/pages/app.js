import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { observer } from 'mobx-react';
import createHistory from 'history/createBrowserHistory';

import Home from './Home';
import Login from './Login';
import Register from './Register';
import NewTask from './NewTask';
import IndexCategory from './Category/index';
import ShowCategory from './Category/show';
import EditCategory from './Category/edit';
import NewCategory from './NewCategory';
import Settings from './Settings';
import NotFound from './NotFound';
import LeftNavigation from '../components/Navigation/LeftNavigation';

const history = createHistory();
@observer
class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/new-task" key="new-task" component={NewTask} />
            <Route path="/categories" key="category" component={IndexCategory} />
            <Route exact path="/category/:categoryId" key="show-category" component={ShowCategory} />
            <Route path="/category/:categoryId/edit" key="edit-category" component={EditCategory} />
            <Route path="/new-category" key="new-category" component={NewCategory} />
            <Route path="/settings" key="settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
          <LeftNavigation />
        </div>
      </Router>
    );
  }
}

App.defaultProps = {

};

App.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default App;
