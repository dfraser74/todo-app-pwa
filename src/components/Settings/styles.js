export default {
  container: {
    padding: 25,
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    floatingLabelStyle: {
      textTransform: 'uppercase',
    },
    underlineFocusStyle: {
      borderWidth: 1,
      borderColor: '#50D2C2',
    },
    floatingLabelFocusStyle: {
      color: '#50D2C2',
    },
  },
  datePicker: {
    display: 'flex',
  },
  textFieldStyle: {
    flex: 1,
    paddingBottom: 10,
  },
  genderGroup: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    userSelect: 'none',
    alignItems: 'center',
    pointerEvents: 'none',
    color: 'rgba(0, 0, 0, 0.3)',
  },
  scale: {
    transform: 'scale(0.75)',
    transformOrigin: 'left top 0px',
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
  },
  radioGroup: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  radio: {
    style: {
      display: 'flex',
      marginRight: -10,
      width: 'initial',
      transform: 'scale(0.75)',
    },
    inputStyle: {
    }
  },
  toggle: {
    fontSize: 13,
    marginTop: 20,
    color: 'rgba(0, 0, 0, 0.3)',
  }
};
