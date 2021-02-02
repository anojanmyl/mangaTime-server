const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((self) => {
    console.log(
      "\x1b[1m\x1b[36m%s\x1b[0m",
      `BRRR it's connected to ${self.connection.name}`
    );
  })
  .catch((err) => {
    console.log(`An error occurred while connecting to the database...`);
  });
