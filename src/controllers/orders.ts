import { Request, Response } from "express";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import {} from "@prisma/client";
import { prismaClient } from "..";
import { successResponse } from "../response/successresponse";
import { BadRequestsException } from "../exceptions/bad-request";

export const createOrder = async (req: Request, res: Response) => {
  //1 create transaction
  // 2 list all the cart items and proceed if not empty
  // 3 calculate the total amount
  // 4 fetch the address of the user
  // 5. define computed field for formatted address on address module
  // 6. create event for order created
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await prismaClient.cart.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      return res.json({
        message: "Cart is empty",
      });
    }

    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);

    const address = await prismaClient.address.findFirst({
      where: {
        id: req.user.defaultAddressId,
      },
    });

    if (!address) {
      throw new NotFoundException(
        "Address not found",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }

    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address.formattedAddress,
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });
    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });

    await tx.cart.deleteMany({
      where: {
        userId: req.user.id,
      },
    });

    return successResponse(res, order, "Order created successfully");
  });
};

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  return successResponse(res, orders, "Orders fetched successfully");
};

export const cancelOrder = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  if (!orderId == null || orderId == "") {
    throw new BadRequestsException(
      "Order id is required",
      ErrorCode.ORDER_ID_REQUIRED
    );
  }
  const order = await prismaClient.order.findFirst({
    where: {
      id: Number(orderId),
      userId: req.user.id,
    },
  });

  if (!order) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }

  if (order.status === "CANCELLED") {
    throw new BadRequestsException(
      "Order already cancelled",
      ErrorCode.ORDER_ALREADY_CANCELLED
    );
  }

  await prismaClient.order.update({
    where: {
      id: Number(orderId),
    },
    data: {
      status: "CANCELLED",
    },
  });

  await prismaClient.orderEvent.create({
    data: {
      orderId: Number(orderId),
      status: "CANCELLED",
    },
  });

  return successResponse(res, null, "Order cancelled successfully");
};

export const getOrderSingleById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id;
    const order = await prismaClient.order.findFirst({
      where: {
        id: Number(orderId),
        userId: req.user.id,
      },
      include: {
        products: true,
        events: true,
      },
    });

    if (!order) {
      throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
    }

    return successResponse(res, order, "Order fetched successfully");
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  //add pagination, limit and offset, status filter
  let whereClause = {};
  let skip = 0;
  let take = 10;
  let page = 1;
  let limit = 10;
  let sort = "id";
  let filter = "";
  let status = "";
  if (req.query.page) {
    page = Number(req.query.page);
  }
  if (req.query.limit) {
    limit = Number(req.query.limit);
  }
  if (req.query.sort) {
    sort = String(req.query.sort);
  }
  if (req.query.filter) {
    filter = String(req.query.filter);
  }
  if (req.query.status) {
    status = String(req.query.status);
  }
  skip = (page - 1) * limit;
  take = limit;
  //check if status is valid
  const validStatus = ["PENDING", "CANCELLED", "DELIVERED", "SHIPPED"];
  if (status && !validStatus.includes(status)) {
    throw new BadRequestsException(
      "Invalid status",
      ErrorCode.UNPROCESSABLE_ENTITY
    );
  }
  if (status) {
    whereClause = {
      status: status,
    };
  }
  const orders = await prismaClient.order.findMany({
    skip: skip,
    take: take,
    orderBy: {
      [sort]: "asc",
    },
    where: {
      address: {
        contains: filter,
      },
      ...whereClause,
    },
  });
  const pagedInfo = {
    page: page,
    limit: limit,
    hasPrevious: page > 1,
    hasNext: orders.length == limit,
    totalCount: orders.length,
  };

  return successResponse(
    res,
    { orders, pagedInfo },
    "Orders fetched successfully"
  );
};

export const changeStatus = async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const status = req.body.status;
    if (!orderId == null || orderId == "") {
        throw new BadRequestsException(
        "Order id is required",
        ErrorCode.ORDER_ID_REQUIRED
        );
    }
    if (!status == null || status == "") {
        throw new BadRequestsException(
        "Status is required",
        ErrorCode.UNPROCESSABLE_ENTITY
        );
    }
    const order = await prismaClient.order.findFirst({
        where: {
        id: Number(orderId),
        },
    });
    
    if (!order) {
        throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
    }
    
    await prismaClient.order.update({
        where: {
        id: Number(orderId),
        },
        data: {
        status: status,
        },
    });
    
    await prismaClient.orderEvent.create({
        data: {
        orderId: Number(orderId),
        status: status,
        },
    });
    
    return successResponse(res, null, "Order status updated successfully");
};

export const listUserOrders = async (req: Request, res: Response) => {
    //list all orders specific to user
    //add pagination, limit and offset, status filter
    let whereClause = {};
    let skip = 0;
    let take = 10;
    let page = 1;
    let limit = 10;
    let sort = "id";
    let filter = "";
    let status = "";

    if (req.query.page) {
        page = Number(req.query.page);
    }
    if (req.query.limit) {
        limit = Number(req.query.limit);
    }
    if (req.query.sort) {
        sort = String(req.query.sort);
    }
    if (req.query.filter) {
        filter = String(req.query.filter);
    }

    //check if status is valid

    if (req.query.status) {
        status = String(req.query.status);
    }
    skip = (page - 1) * limit;
    take = limit;
    
    //fetch all orders for the user
    const orders = await prismaClient.order.findMany({
        skip: skip,
        take: take,
        orderBy: {
        [sort]: "asc",
        },
        where: {
        userId: req.user.id,
        address: {
            contains: filter,
        },
        },
    });

    const pagedInfo = {
        page: page,
        limit: limit,
        hasPrevious: page > 1,
        hasNext: orders.length == limit,
        totalCount: orders.length,
    };

    return successResponse(
        res,
        { orders, pagedInfo },
        "Orders fetched successfully"
    );


   
};
