module.exports ={
    port : 3000,

    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret',
        jwtRefreshSecret: process.env.JWT_SECRET || 'refsecret'
      }
}
