import Category from "../../database/model/category-model";
import Product from "../../database/model/product-model";
import { User } from "../../database/model/user-model";
import { AuthRequest } from "../../middleWare/auth-middleware";
import { Response } from "express";


class ProductController {
  static async createProduct(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const {
        productName,
        productPrice,
        productDescription,
        productTotalStockQty,
        categoryId,
      } = req.body;

      if (
        !productName ||
        productPrice === undefined ||
        !productDescription ||
        productTotalStockQty === undefined ||
        !categoryId
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
     
   const imageUrl = req.file ? req.file.path : null;
    if (!imageUrl) {
      return res.status(400).json({ message: "Product image is required" });
    }
    const product = await Product.create({
        productName,
         productDescription,
          productPrice,
           productTotalStockQty,
           productImageUrl: imageUrl,
            categoryId,
            userId,
        
    })

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      console.error("Create product error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
//   static async getAllProducts(req:Request, res:Response) {
//     try {
//       const products = await Product.findAll({
//         include: [
//           { model: User, attributes: ["id", "username", "email"] },
//           { model: Category, attributes: ["id", "categoryName"] },
//         ],
//       });
//       return res.status(200).json({
//         success: true,
//         message: "Products retrieved successfully",
//         data: products,
//       });
//     } catch (error) {
//         console.error("Create product error:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   }
static async getAllProducts(req: Request, res: Response): Promise<void> {
  try {
    const products = await Product.findAll({
      include: [
        { model: User, attributes: ["id", "username", "email"] },
        { model: Category, attributes: ["id", "categoryName"] },
      ],
    });

   
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    // ✅ Call only, do NOT return
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

  static async deleteProduct(req:AuthRequest, res:Response){
    try {
      const id = req.params.id;
      const product = await Product.findByPk(id as string);
      if (product) {
         await product.destroy();
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
        
      }else{
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
     
    } catch (error) {
      console.error("Delete product error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  static async singleProduct(req:AuthRequest, res:Response){
    try {
      const id = req.params.id;
      const product = await Product.findByPk(id as string, {
        include: [
          { model: User, attributes: ["id", "username", "email"] },
          { model: Category, attributes: ["id", "categoryName"] },
        ],
      });
      if (product) {
        return res.status(200).json({
          success: true,
          message: "Product retrieved successfully",
          data: product,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    } catch (error) {
      console.error("Get single product error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default ProductController;
