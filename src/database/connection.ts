import dotenv from "dotenv";
import { Dialect } from "sequelize";
dotenv.config();
import { Sequelize } from "sequelize-typescript";
import { User } from "./model/user-model";
import Category from "./model/category-model";
import Product from "./model/product-model";
const dialect: Dialect = (process.env.DB_DIALECT as Dialect) || "mysql";



const sequelize  = new Sequelize({
     database: process.env.DB_NAME || "rampokha",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  dialect,
  models :[User, Category, Product]
})

User.hasMany(Product,{foreignKey:'userId'})
Product.belongsTo(User,{foreignKey:'userId'})

//category and product

Category.hasOne(Product,{foreignKey:'categoryId'})
Product.belongsTo(Category,{foreignKey:'categoryId'})

export default sequelize