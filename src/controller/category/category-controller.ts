import { Request, response, Response } from "express";
import Category from "../../database/model/category-model";



class CategoryController {

  static async createCategory(req: Request, res: Response) {
    try {
      const { categoryName } = req.body;

      if (!categoryName) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const exist = await Category.findOne({ where: { categoryName } });

      if (exist) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }

      const category = await Category.create({ categoryName });

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      console.error("Create Category Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async getAllCategories (req:Request, res:Response)
{
    try {
        const categories = await Category.findAll();
        return res.status(200).json({
            succsess:true,
            data:categories,
            messsage :'categories fetched successfully'
        })
    } catch (error) {
       console.error("Create Category Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      }); 
    }
}
static async deleteCategory( req:Request, res :Response){
    try {
       const {id}= req.params;
       if(!id ){
        return res.status(400).json({
            success:false,
            message:"Category ID is required"
        })
       }
       const category = await Category.findByPk(id as string);
       if(!category){
        return res.status(404).json({
            success:false,
            message:"Category not found"
        })
       }
       await category.destroy();
       return res.status(200).json({
        success:true,
        message:"Category deleted successfully"
       })
    } catch (error) {
        
    }
}
}

export default CategoryController;
