import Rollbar from "rollbar";

const rollbarConfig = new Rollbar({
    accessToken: 'dd1711e68e6442f9a86a4a62f1bc3145',
    environment: 'testenv',
    captureUncaught: true,
    captureUnhandledRejections: true,
});

export default rollbarConfig;