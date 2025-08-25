// ./config/middlewares.js
module.exports = ({ env }) => {
  const cfHost = (env('CF_PUBLIC_ACCESS_URL') || '')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  return [
    'strapi::logger',
    'strapi::errors',

    // ⬇️ Replace the default security entry with your custom config
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            // add ws/wss if you use websockets (e.g. admin, plugins)
            'connect-src': ["'self'", 'https:', 'ws:', 'wss:'],
            'img-src': [
              "'self'",
              'data:',
              'blob:',
              'market-assets.strapi.io', // keep this (used by the in-app market)
              cfHost || '',
            ],
            'media-src': [
              "'self'",
              'data:',
              'blob:',
              'market-assets.strapi.io',
              cfHost || '',
            ],
            upgradeInsecureRequests: null,
          },
        },
      },
    },

    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
