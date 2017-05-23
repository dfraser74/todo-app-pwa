import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from "react-router-dom";
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import CircularProgress from 'material-ui/CircularProgress';
import { withRouter } from 'react-router';
import UserService from '../../services/user';
import styles from './styles.js';
import MarkedLogo from '../../assets/images/marked.png';
import FbIcon from 'react-icons/lib/fa/facebook-square';
import GGIcon from 'react-icons/lib/fa/google-plus-square';

@observer
class Login extends Component {
  @observable errors = {};
  @observable isSubmit = false;
  @observable errorText = null;

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSocial = this.onSocial.bind(this);
  }

  componentDidMount() {
    if(!!UserService.info.uid) {
      this.props.history.replace('/');
    }
  }

  onSubmit(e) {
    e.preventDefault();
    this.errors = {};
    const errors = {};
    this.isSubmit = true;
    this.errorText = null;

    const email = this.username.getValue();
    const password = this.password.getValue();

    !!!email && (errors.email = "Email can't be blank");
    !!!password && (errors.password = "Password can't be blank");
    if (Object.keys(errors).length > 0) {
      this.isSubmit = false;
      this.errors = {...errors};
      return false;
    }

    UserService.onLogin({ email, password }, (error) => {
      this.isSubmit = false;
      !!error && (this.errorText = error.message);

      if (!error) {
        return this.props.history.replace('/');
      }
    });
  }

  onSocial(social, e) {
    e.preventDefault();
    UserService.onSocial(social, (error) => {
      this.isSubmit = false;
      !!error && (this.errorText = error.message);
      if (!error) {
        return this.props.history.replace('/');
      }
    });
  }

  render() {
    return (
      <Paper
        style={styles.container}
      >
        <div style={styles.header}>
          <img
            alt="Todo app"
            src={MarkedLogo}
            style={styles.imgLogo}
          />
        </div>
        <form
          style={styles.form}
          onSubmit={this.onSubmit}
        >
          {!!this.errorText && <legend style={styles.headerForm}> {this.errorText}</legend>}
          {!!this.isSubmit && <CircularProgress style={styles.progress} />}
          <TextField
            {...styles.input}
            fullWidth
            name="username"
            floatingLabelFixed
            errorText={this.errors.email}
            hintText="yourname@example.com"
            floatingLabelText="username"
            ref={ref => (this.username = ref)}
          />
          <TextField
            {...styles.input}
            fullWidth
            type="password"
            name="password"
            floatingLabelFixed
            hintText="********"
            floatingLabelText="password"
            errorText={this.errors.password}
            ref={ref => (this.password = ref)}
          />
          <RaisedButton
            fullWidth
            {...styles.btn}
            label="Sign In"
            labelColor="#FFFFFF"
            backgroundColor="#50D2C2"
            onTouchTap={this.onSubmit}
          />
          <div style={styles.social}>
            <RaisedButton
              {...styles.btn}
              label="via Facebook"
              name="facebook"
              labelColor="#FFFFFF"
              backgroundColor="#4862a3"
              icon={<FbIcon color="#FFFFFF" size={30} />}
              onTouchTap={(e) => this.onSocial('facebook', e)}
            />
            <RaisedButton
              {...styles.btn}
              label="via Google"
              name="google"
              labelColor="#FFFFFF"
              backgroundColor="#df4a32"
              icon={<GGIcon color="#FFFFFF" size={30} />}
              onTouchTap={(e) => this.onSocial('google', e)}
            />
          </div>
        </form>
        <div
          style={styles.footer}
        >
          <span
            style={styles.footerText}
          >
            don't have an account?
          </span>
          <Link
            style={styles.link}
            to="/register">
            sign up
          </Link>
        </div>
      </Paper>
    );
  }
}

export default withRouter(Login);
