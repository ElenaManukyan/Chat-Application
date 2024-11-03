import Rollbar from "rollbar";

const rollbarConfig = new Rollbar({
    accessToken: '73803d993060485290c35ad93831d8a0',
    environment: 'testenv',
    captureUncaught: true,
    captureUnhandledRejections: true,
});

export default rollbarConfig;