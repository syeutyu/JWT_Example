module.exports={
    db_url :'mongodb://localhost:27017/local',
    server_port:3001,
    db_schmas:[
        {file:'./user',collection:'JWT',schemaname:'user',modelName:'model'}
    ],
    secret : 'SeCrEtKeYfOrHaShInG'
}