import dotenv from "dotenv";
dotenv.config();

import app from "./src/app";
import sequelize from "./src/database/connection";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database authenticated successfully!");
     await sequelize.sync({ force: false });
    console.log("DB synced ✔");

    const port = process.env.PORT || 6900;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (error) {
    console.error("Unable to connect to database:", error);
    process.exit(1); 
  }
};

startServer();
