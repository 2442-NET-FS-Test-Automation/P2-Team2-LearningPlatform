
import { mount } from "cypress/react";

import "./commands";
import "@cypress/code-coverage/support";

import "../../src/index.css";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add("mount", mount);