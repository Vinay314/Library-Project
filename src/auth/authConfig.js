/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";
/**
 * Configuration object to be passed to MSAL instance on creation. 
 */

export const msalConfig = {
    auth: {
        clientId: "275451ac-da41-42b3-a445-1515e3279e79",
        authority: "https://login.microsoftonline.com/556e6b1f-b49d-4278-8baf-db06eeefc8e9",
        redirectUri: "http://localhost:3000/"
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message, "-- Error");
                        return;
                    case LogLevel.Info:
                        console.info(message, "-- Info");
                        return;
                    case LogLevel.Verbose:
                        console.debug(message, "-- debug");
                        return;
                    case LogLevel.Warning:
                        console.warn(message, "-- warning");
                        return;
                    default:
                        return;
                }
            }
        }
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
*/
export const loginRequest = {
    scopes: ["User.Read"]
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, 
 */
export const graphConfig = {
    graphMeEndpoint: " https://graph.microsoft.com/v1.0/me"
};
