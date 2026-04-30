const isdev = true 
    export const URL = (isdev)? {

        BASE: 'http://localhost:3001',
        ORPC : "http://localhost:3001/rpc",
        BETTER_AUTH: "http://localhost:3001/api/auth",
        IMAGE : "http://localhost:3001"
    } : {

        BASE: 'https://one.solvesphr.com',
        ORPC : "https://one.solvesphr.com/rpc",
        BETTER_AUTH: "https://one.solvesphr.com/api/auth",
        IMAGE : "https://one.solvesphr.com"
    }
