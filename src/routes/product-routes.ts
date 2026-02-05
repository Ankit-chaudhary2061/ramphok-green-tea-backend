import { Router } from "express";
import multer from "multer";
import storage from "../middleWare/cloudinary-middleware";
import ProductController from "../controller/product/product-controller";
import { AuthMiddleware, UserRole } from "../middleWare/auth-middleware";

const router = Router();

// Multer config
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});


router.post(
  "/",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.restrictTo(UserRole.ADMIN),
  upload.single("image"),
  ProductController.createProduct
);


router.get("/", ProductController.getAllProducts);


router.get("/:id", ProductController.singleProduct);


router.delete(
  "/:id",
  AuthMiddleware.isLoggedIn,
  AuthMiddleware.restrictTo(UserRole.ADMIN),
  ProductController.deleteProduct
);

export default router;
