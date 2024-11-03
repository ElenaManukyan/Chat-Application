import Rollbar from "rollbar";

const rollbar = new Rollbar({
    accessToken: '73803d993060485290c35ad93831d8a0',
    environment: 'development',
});

export default rollbar;