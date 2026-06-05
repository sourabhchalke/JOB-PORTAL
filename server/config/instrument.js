// Import with `import * as Sentry from "@sentry/node"` if you are using ESM

import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://10fc25a1add9397f16d143c0d9e66bc9@o4511501768458240.ingest.us.sentry.io/4511501782482944",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,

  integrations:[
    Sentry.mongooseIntegration()
  ],

});