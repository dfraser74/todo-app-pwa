import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import DatePicker from 'material-ui/DatePicker';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import styles from './styles';
import { observer } from 'mobx-react';
import { observable, autorun, toJS } from 'mobx';
import UserService from '../../services/user';
import moment from 'moment';
import IconButton from 'material-ui/IconButton';
import MdPlus from 'react-icons/lib/md/add';

import userImage from '../../assets/images/user.png';

@observer
class Form extends Component {
  @observable profile = {
    email: "",
    gender: "",
    birthday: "",
    password: "",
    displayName: "",
    photoURL: "",
    notifications: true,
  };
  @observable file = null;

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onOpenUpload = this.onOpenUpload.bind(this);

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
    return UserService.onSave(profile, this.file)
  }

  onOpenUpload() {
    this.inputFile.click();
    this.inputFile.onchange = (e) => {
      const reader = new FileReader();
      const file = this.inputFile.files[0];

      reader.onloadend = () => {
        this.imageName = file.name;
        this.profile.photoURL = reader.result;
      }
      this.file = file;
      reader.readAsDataURL(file);
    }
  }

  render() {
    const { displayName, email, birthday, gender, photoURL } = this.profile;
    return (
      <Paper
        zDepth={0}
        style={styles.container}
      >
        <Avatar
          style={styles.avatar}
        >
          <IconButton
            style={styles.icon}
            onTouchTap={this.onOpenUpload}
          >
            <MdPlus size={20} />
          </IconButton>
          <img style={styles.img} src={photoURL || userImage} alt={displayName || email}/>
        </Avatar>

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
        <input
          style={{display: 'none'}}
          type="file" ref={(ref) => (this.inputFile = ref)} accept="image/*" />
      </Paper>
    )
  }
}

export default Form
