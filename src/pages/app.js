import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {BrowserRouter as Router, Route} from "react-router-dom";
import Home from './Home';
import NotFound from './NotFound';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogin: false,
    };
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/404" component={NotFound} />
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
