import "./commands";
import "@cypress/code-coverage/support";

import "../../src/index.css";

import {mount} from "cypress/react";
import { interfaces } from "mocha";

Cypress.Commands.add("mount", mount);