import { Request, Response } from "express";
import { prismaClient } from "..";
import { ProductSchema, UpdateProductSchema } from "../schema/user";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { successResponse } from "../response/successresponse";

export const createProduct = async (req: Request, res: Response) => {
  ProductSchema.parse(req.body);
  const productExists = await prismaClient.product.findFirst({
    where: {
      name: req.body.name,
    },
  });

  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });

  return res.json(product);
};

export const getProducts = async (req: Request, res: Response) => {
  const { limit, offset, orderBy, search, filter } = req.query;

  const products = await prismaClient.product.findMany({
    where: {
      name: {
        contains: search ? String(search) : "",
      },
      tags: {
        contains: filter ? String(filter) : "",
      },
    },

    take: Number(limit) || 10,
    skip: Number(offset) || 0,
    orderBy: {
      name: orderBy === "name" ? "asc" : "desc",
    },
  });
  const dataInfo = {
    count: products.length,
    limit: Number(limit) || 10,
    offset: Number(offset) || 0,
    orderBy: orderBy === "name" ? "asc" : "desc",
    hasPrevious: Number(offset) > 0,
    hasNext: products.length === (Number(limit) || 10),
    data: products,
  };
  return res.json(dataInfo);
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: Number(id),
      },
    });

    return successResponse(res, product, "Product found");
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  UpdateProductSchema.parse(req.body);
  const { id } = req.params;

  const product = req.body;
  if (product.tags) {
    product.tags = product.tags.join(",");
  }

  try {
    const updatedProduct = await prismaClient.product.update({
      where: {
        id: Number(id),
      },
      data: product,
    });

    return res.json(updatedProduct);
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prismaClient.product.delete({
    where: {
      id: Number(id),
    },
  });

  return res.json({ message: "Product deleted" });
};
export const fullTextSearch = async (req: Request, res: Response) => {
  //add pagination

  const products = await prismaClient.product.findMany({
    where: {
      name: {
        search: req.query.q?.toString(),
      },
      description: {
        search: req.query.q?.toString(),
      },
      tags: {
        search: req.query.q?.toString(),
      },
    },
  });
  return res.json(products);
};

//aggregate the total price of all products
export const aggregateTotalPrice = async (req: Request, res: Response) => {
  const totalPrice = await prismaClient.product.aggregate({
    where: {
      price: {
        gt: 0,
      },
    },
    _avg: {
      price: true,
    },
    _count: {
      price: true,
    },
    _sum: {
      price: true,
    },
  });

  return successResponse(res, totalPrice, "Total price aggregated");
};

//group by price
export const groupByPrice = async (req: Request, res: Response) => {
  const products = await prismaClient.product.groupBy({
    by: ["price"],
    where: {
      price: {
        // not: 90.78,
        gte: 1,
      },
      // mode: 'insensitive', // Default value: default
    },
    _count: {
      price: true,
    },
    _max: {
      price: true,
    },
    orderBy: {
      price: "asc",
    },
  });

  return successResponse(res, products, "Grouped by price");
};

// use raw query with prisma
export const rawQuery = async (req: Request, res: Response) => {
  const products = await prismaClient.$queryRaw`SELECT * FROM products`;
  return successResponse(res, products, "Raw query executed");
};

// raw query with prisma with parameters
export const rawQueryWithParams = async (req: Request, res: Response) => {
  let q = req.query.q?.toString();
  if (q) {
    console.log(q);
    // q = String(q);
    const products =
      await prismaClient.$queryRaw`SELECT * FROM products WHERE name LIKE ${q}`;
    return successResponse(res, products, "Raw query executed");
  } else {
    const products = await prismaClient.$queryRaw`SELECT * FROM products`;
    return successResponse(res, products, "Raw query executed");
  }
};

export const createWithRawQuery = async (req: Request, res: Response) => {
  try {
    const { name, price, description, tags } = req.body;

    // Validate request body
    if (!name || !price || !description || !tags) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Serialize tags array into a string
    const tagsString = JSON.stringify(tags);

    // Execute raw query to create product
    const result = await prismaClient.$executeRaw`
      INSERT INTO products (name, price, description, tags, createdAt, updatedAt)
      VALUES (${name}, ${price}, ${description}, ${tagsString}, NOW(), NOW()) 
    `;
    console.log("result", result);

    //get the newly created product
    const newProduct = await prismaClient.product.findFirst({
      where: {
        name,
        price,
        description,
      },
    });

   return successResponse(res, newProduct, "Product created successfully");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
