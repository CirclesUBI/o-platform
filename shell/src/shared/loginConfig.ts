import { LoginConfig } from "@toruslabs/openlogin-utils";
import { LOGIN_PROVIDER } from "@toruslabs/openlogin-utils";

export default {
  // email_passwordless: {
  //   loginProvider: "email_passwordless",
  //   name: "Binance Login",
  //   typeOfLogin: LOGIN_PROVIDER.JWT,
  //   description: "Login with Auth0",
  //   verifier: "lioneell-auth0-email-password",
  //   clientId: "MfPdpVU82zbowrP1zefQg7mCCdXzENTG",
  //   showOnModal: true,
  //   showOnDesktop: true,
  //   showOnMobile: true,
  //   mainOption: true,
  //   verifierSubIdentifier: "",
  //   logoDark: "https://images.web3auth.io/example-login-hello-dark.svg",
  //   logoLight: "https://images.web3auth.io/example-login-hello-light.svg",
  //   logoHover: "https://images.web3auth.io/example-login-hello-hover.svg",
  //   jwtParameters: {
  //     domain: "https://dev-zraq1p5o.us.auth0.com",
  //     connection: "Username-Password-Authentication",
  //   },
  // } as LoginConfig[keyof LoginConfig],
  custom_google: {
    loginProvider: "custom_google",
    name: "Google Login",
    typeOfLogin: LOGIN_PROVIDER.GOOGLE,
    description: "Login with Custom Google",
    verifier: "",
    clientId: "",
    showOnModal: true,
    showOnDesktop: true,
    showOnMobile: true,
    mainOption: true,
    verifierSubIdentifier: "",
    logoDark: "https://images.web3auth.io/example-login-hello-dark.svg",
    logoLight: "https://images.web3auth.io/example-login-hello-light.svg",
    logoHover: "https://images.web3auth.io/example-login-hello-hover.svg",
  } as LoginConfig[keyof LoginConfig],
};
