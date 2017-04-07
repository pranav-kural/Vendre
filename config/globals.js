// Global configuration settings
module.exports = {

    // MLab authentication configuration
    db: 'mongodb://pranavkural:9855032878@ds127948.mlab.com:27948/comp2068',  // mlab

    // Facebook authentication configuration
    facebook: {
        clientID: '718128238365266',
        clientSecret: '5ad25596bc77aa3d85e987721769c87f',
        callbackURL: 'http://localhost:3000/facebook/callback'
    },

    // Google authentication configuration
    google: {
        clientID: '947732061728-fueicusit6642lnakd5tl5n7vjp1040i.apps.googleusercontent.com',
        clientSecret: 'cC-Jn2_yEn_ErUqj4HYbo6PW',
        callbackURL: "http://localhost:3000/google/callback"
    }
};
