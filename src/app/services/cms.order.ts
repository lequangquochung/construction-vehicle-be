import Order from '$entities/Order';
import OrderDetail from '$entities/OrderDetail';
import Product from '$entities/Product';
import User from '$entities/User';
import { ErrorCode, OrderStatus } from '$enums/index';
import moment from 'moment';
import { EntityManager, getConnection, getRepository } from 'typeorm';

interface CreateOrderDTO {
  userId?: number;
  email: string;
  phoneNumber: string;
  note?: string;
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

    let totalPrice = 0;
    params.details.forEach((detail) => {
      if (!detail.price) {
        totalPrice = null;
        return;
      } else {
        totalPrice += detail.price;
      }
    });
    const order = await orderRepo.save({
      status: OrderStatus.NEW,
      user: user,
      email: params.email,
      phoneNumber: params.phoneNumber,
      totalPrice: totalPrice,
      note: params.note,
    });

    const orderDetails: OrderDetail[] = [];
    for (const detail of params.details) {
      const product = await productRepo.findOne(detail.productId);
      if (!product) {
        throw ErrorCode.Product_Not_Exist;
      }
      const orderDetail = await orderDetailRepo.save({
        order: order,
        product: product,
        amount: detail.amount,
        price: detail.price,
      });
      orderDetails.push(orderDetail);
    }
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
      'orderDetails',
      'orderDetails.product',
      'orderDetails.product.name',
      'user',
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
      type: od.product.type,
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
    note: order.note,
  };
}

interface ISearchOrder {
  keyword?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export async function getOrders(params: ISearchOrder) {
  const query = getRepository(Order)
    .createQueryBuilder('o')
    .leftJoinAndMapOne('o.user', User, 'u', 'u.id = o.user.id')
    .select([
      'o.id as id',
      'u.id as userId',
      'u.username as username',
      'u.fullName as fullName',
      'o.email as email',
      'o.phoneNumber as phoneNumber',
      'o.status as status',
      'o.totalPrice as totalPrice',
      'o.createdDate as createdDate',
      'o.note as note',
    ])
    .orderBy('o.id', 'ASC')
    .where('1=1');

  if (params.keyword) {
    query.andWhere('o.id = :id OR o.email = :keyword OR o.phoneNumber = :keyword', {
      id: params.keyword,
      keyword: params.keyword,
    });
  }
  if (params.status) {
    query.andWhere('o.status = :status', {
      status: params.status,
    });
  }
  if (params.startDate) {
    query.andWhere('o.createdDate >= :startDate', {
      startDate: params.startDate,
    });
  }
  if (params.endDate) {
    query.andWhere('o.createdDate <= :endDate', {
      endDate: params.endDate,
    });
  }

  const total = await query.getCount();
  const data = await query.getRawMany();
  return {
    data: data.map((o) => ({
      id: o.id,
      user: {
        id: o.userId,
        username: o.username,
        fullName: o.fullName,
      },
      email: o.email,
      phoneNumber: o.phoneNumber,
      status: o.status,
      totalPrice: o.totalPrice,
      note: o.note,
      createdDate: moment(o.createdDate).format('YYYY-MM-DD HH:mm:ss'),
    })),
    total,
  };
}

interface UpdateOrderDTO {
  id: number;
  userId?: number;
  email: string;
  phoneNumber: string;
  status: string;
  note?: string;
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
      note: params.note,
    });
  });
}
