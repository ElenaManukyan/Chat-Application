import Rollbar from 'rollbar';

const rollbarConfig = new Rollbar({
  accessToken: process.env.REACT_APP_ROLLBAR_ACCESS_TOKEN,
  environment: 'testenv',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default rollbarConfig;
