const config = {
  mongodb: {
    url: 'mongodb+srv://nguyennhatninh2345:mujS8dT57DjihGNw@mongodbmondayapp.idqage7.mongodb.net/?retryWrites=true&w=majority&appName=MongodbMondayapp',
    databaseName: 'test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog'
};

module.exports = config;
