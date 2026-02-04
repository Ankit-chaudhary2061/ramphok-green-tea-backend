import { Model, Table, Column, DataType, PrimaryKey } from "sequelize-typescript";
import { UserRole } from "../../middleWare/auth-middleware";

@Table({
    tableName:'user',
    modelName:'User',
    timestamps:true
})

export class User extends Model {

    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    declare id: string;

    @Column({
        type:DataType.STRING,
        allowNull: false,
         field: 'username'
    })
    declare username:string
     @Column({
        type:DataType.STRING,
        allowNull: false,
         field: 'email'
    })
    declare email:string
     @Column({
        type:DataType.STRING,
        allowNull: false,
         field: 'password'
    })
    declare password:string
       @Column({
    type: DataType.ENUM("admin", "customer"),
    defaultValue: "customer",
  })
  declare role: UserRole
}