module.exports = {
  async up(db) {
    await db.collection('users').updateMany({}, { $set: { verify: false } });
  }
};
