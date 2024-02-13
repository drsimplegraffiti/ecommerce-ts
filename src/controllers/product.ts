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
  const { limit, offset, orderBy,search,filter} = req.query;

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
}
 