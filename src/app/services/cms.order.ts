import Order from '$entities/Order';
import OrderDetail from '$entities/OrderDetail';
import Product from '$entities/Product';
import User from '$entities/User';
import { ErrorCode, OrderStatus } from '$enums/index';
import { EntityManager, getConnection, getRepository } from 'typeorm';

interface CreateOrderDTO {
  userId?: number;
  email: string;
  phoneNumber: string;
  details: OrderDetailDto[];
}

interface OrderDetailDto {
  productId: number;
  amount: number;
  price?: number;
}

export async function createOrder(params: CreateOrderDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const orderRepo = transaction.getRepository(Order);
    const orderDetailRepo = transaction.getRepository(OrderDetail);
    const userRepo = transaction.getRepository(User);
    const productRepo = transaction.getRepository(Product);

    let user: User = null;
    if (params.userId) {
      user = await userRepo.findOne(params.userId);
      if (!user) {
        throw ErrorCode.User_Not_Exist;
      }
    }

    const orderDetails: OrderDetail[] = [];
    params.details.forEach(async (detail) => {
      const product = await productRepo.findOne(detail.productId);
      if (!product) {
        throw ErrorCode.Product_Not_Exist;
      }
      const orderDetai = await orderDetailRepo.save({
        product: product,
        amount: detail.amount,
        price: detail.price,
      });
      orderDetails.push(orderDetai);
    });

    let totalPrice = 0;
    orderDetails.forEach((detail) => {
      if (!detail.price) {
        totalPrice = null;
        return;
      } else {
        totalPrice += detail.price;
      }
    });
    await orderRepo.save({
      status: OrderStatus.NEW,
      user: user,
      email: params.email,
      phoneNumber: params.phoneNumber,
      totalPrice: totalPrice,
    });
  });
}

export async function finishOrder(orderId: number) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const orderRepo = transaction.getRepository(Order);
    const order = await orderRepo.findOne(orderId);
    if (!order) {
      throw ErrorCode.Order_Not_exist;
    }
    if (order.status !== OrderStatus.PROCESSING) {
      throw ErrorCode.Order_Must_Be_Processing;
    }
    await orderRepo.update(orderId, {
      status: OrderStatus.FINISHED,
    });
  });
}

export async function setProcessOrder(orderId: number) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const orderRepo = transaction.getRepository(Order);
    const order = await orderRepo.findOne(orderId);
    if (!order) {
      throw ErrorCode.Order_Not_exist;
    }
    await orderRepo.update(orderId, {
      status: OrderStatus.PROCESSING,
    });
  });
}

export async function cancelOrder(orderId: number) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const orderRepo = transaction.getRepository(Order);
    const order = await orderRepo.findOne(orderId);
    if (!order) {
      throw ErrorCode.Order_Not_exist;
    }
    await orderRepo.update(orderId, {
      status: OrderStatus.CANCELED,
    });
  });
}

export async function getOrderById(orderId: number) {
  const orderRepo = getRepository(Order);
  const order = await orderRepo.findOne(orderId, {
    relations: [
      'order.orderDetails',
      'order.orderDetails.product',
      'order.orderDetails.product.name',
      'order.user',
    ],
  });

  const orderDetails = order.orderDetails.map((od) => ({
    product: {
      image: od.product.image,
      price: od.price,
      amount: od.amount,
      name: {
        contentEng: od.product.name.contentEng,
        contentVie: od.product.name.contentVie,
      },
    },
  }));

  if (!order) {
    throw ErrorCode.Order_Not_exist;
  }

  return {
    id: order.id,
    user: {
      id: order.user?.id,
      username: order.user?.username,
      fullName: order.user?.fullName,
    },
    email: order.email,
    phoneNumber: order.phoneNumber,
    status: order.status,
    createdDate: order.createdDate,
    orderDetails: orderDetails,
  };
}

interface ISearchOrder {
  keyword?: string;
}

export async function getOrders(params: ISearchOrder) {
  const query = getRepository(Order)
    .createQueryBuilder('o')
    .innerJoin(User, 'u', 'u.id = o.user.id')
    .select([
      'o.id as id',
      'o.user.username as username',
      'o.user.fullName as fullName',
      'o.email as email',
      'o.phoneNumber as phoneNumber',
      'o.status as status',
      'o.totalPrice as totalPrice',
    ])
    .orderBy('o.id', 'ASC')
    .where('1=1');

  if (params.keyword) {
    query.andWhere('o.id = :id OR o.email LIKE :keyword OR o.phoneNumber LIKE :keyword', {
      id: params.keyword,
      keyword: '%' + params.keyword + '%',
    });
  }

  const total = await query.getCount();
  const data = await query.getRawMany();
  return {
    data,
    total,
  };
}

interface UpdateOrderDTO {
  id: number;
  userId?: number;
  email: string;
  phoneNumber: string;
  status: string;
  details: OrderDetailDto[];
}

export async function updateOrder(params: UpdateOrderDTO) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const orderRepo = transaction.getRepository(Order);
    const orderDetailRepo = transaction.getRepository(OrderDetail);
    const userRepo = transaction.getRepository(User);
    const productRepo = transaction.getRepository(Product);

    const order = await orderRepo.findOne(params.id, {
      relations: ['order.user', 'order.orderDetails'],
    });
    if (!order) {
      throw ErrorCode.Order_Not_exist;
    }

    let user = null;
    if (params.userId) {
      if (params.userId !== order.user.id) {
        user = await userRepo.findOne(params.userId);
      } else {
        user = order.user;
      }
    }

    await orderDetailRepo.remove(order.orderDetails);
    const orderDetails = [];
    params.details.forEach(async (detail) => {
      const product = await productRepo.findOne(detail.productId);
      if (!product) {
        throw ErrorCode.Product_Not_Exist;
      }
      const orderDetai = await orderDetailRepo.save({
        product: product,
        amount: detail.amount,
        price: detail.price,
      });
      orderDetails.push(orderDetai);
    });

    let totalPrice = 0;
    orderDetails.forEach((detail) => {
      if (!detail.price) {
        totalPrice = null;
        return;
      } else {
        totalPrice += detail.price;
      }
    });

    await orderRepo.save({
      status: params.status,
      user: user,
      email: params.email,
      phoneNumber: params.phoneNumber,
      totalPrice: totalPrice,
    });
  });
}
