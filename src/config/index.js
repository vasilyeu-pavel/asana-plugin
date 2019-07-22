export default {
  development: {
    CLIENT_ID: '*',
    REDIRECT_URI: 'https://localhost:3000/oauth_callback',
    CLIENT_SECRET: '*',
  },
  production: {
    CLIENT_ID: '*',
    REDIRECT_URI: 'https://asana-plugin.firebaseapp.com/oauth_callback',
    CLIENT_SECRET: '*',
  },
}[process.env.NODE_ENV];
