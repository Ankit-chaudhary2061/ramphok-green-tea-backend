import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
} from "sequelize-typescript";
import { User } from "./user-model";
import Category from "./category-model";
import { InferAttributes, InferCreationAttributes } from "sequelize";

@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true,
})
class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "productName",
  })
  declare productName: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    field: "productPrice",
  })
  declare productPrice: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: "productDescription",
  })
  declare productDescription: string;
   @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productTotalStockQty: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare productImageUrl: string;
   // ✅ Foreign keys
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.UUID, allowNull: false })
  declare categoryId: string;
}

export default Product;
