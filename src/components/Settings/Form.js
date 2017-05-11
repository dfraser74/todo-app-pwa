import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import DatePicker from 'material-ui/DatePicker';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import styles from './styles';
import { observer } from 'mobx-react';
import { observable, autorun, toJS } from 'mobx';
import UserService from '../../services/user';
import moment from 'moment';

@observer
class Form extends Component {
  @observable profile = {
    email: "",
    gender: "",
    birthday: "",
    password: "",
    displayName: "",
    notifications: true,
  };

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onChange = this.onChange.bind(this);

    autorun(() => {
      this.profile = toJS({ ...UserService.info });
    })
  }

  onChange(e, value) {
    !!e && e.preventDefault();
    const name = !!e ? e.target.name : 'birthday';
    this.profile = {...this.profile, [name]: value};
  }

  onSave() {
    const profile = {...this.profile};
    delete profile.password;
    delete profile.email;
    return UserService.onSave(profile)
  }

  render() {
    const { displayName, email, password, birthday, gender, notifications } = this.profile;
    return (
      <Paper
        zDepth={0}
        style={styles.container}
      >
        <TextField
          {...styles.input}
          fullWidth
          name="displayName"
          floatingLabelFixed
          hintText="abc xyz"
          value={displayName || ''}
          floatingLabelText="FULL NAME"
          onChange={this.onChange}
          ref={ref => (this.displayName = ref)}
        />
        <TextField
          {...styles.input}
          disabled
          fullWidth
          name="email"
          floatingLabelFixed
          hintText="abc@example.com"
          value={email || ''}
          floatingLabelText="EMAIL"
          ref={ref => (this.email = ref)}
          onChange={this.onChange}
        />
        <TextField
          {...styles.input}
          fullWidth
          name="password"
          floatingLabelFixed
          hintText="********"
          value={password || ''}
          floatingLabelText="PASSWORD"
          ref={ref => (this.password = ref)}
          onChange={this.onChange}
        />
        <DatePicker
          autoOk={true}
          name="birthday"
          style={styles.datePicker}
          floatingLabelText="BIRTHDAY"
          disableYearSelection={false}
          value={new Date(birthday)}
          textFieldStyle={styles.textFieldStyle}
          onChange={this.onChange}
          formatDate={(date) => moment(date).format('MMM DD, YYYY')}
        />
        <div style={styles.genderGroup}>
          <label style={styles.scale}>GENDER</label>
          <RadioButtonGroup
            name="gender"
            labelPosition="right"
            style={styles.radioGroup}
            onChange={this.onChange}
            valueSelected={gender}
          >
            <RadioButton
              value="female"
              label="Female"
              {...styles.radio}
            />
            <RadioButton
              value="male"
              label="Male"
              {...styles.radio}
            />
          </RadioButtonGroup>
        </div>
        <Divider />
        <Toggle
          name="notifications"
          label="NOTIFICATIONS"
          style={styles.toggle}
          toggled={!!notifications}
          onToggle={(e) => this.onChange(e, !notifications)}
        />
      </Paper>
    )
  }
}

export default Form
