import { LangKey, OrderStatus } from './../enums/index';
import Order from '$entities/Order';
import { ErrorCode } from '$enums/index';
import { EntityManager, getConnection, getRepository } from 'typeorm';
import OrderDetail from '$entities/OrderDetail';
import Product from '$entities/Product';
import Translation from '$entities/Translation';
import User from '$entities/User';
import moment from 'moment';

interface IUserSearchOrder {
  phoneNumber?: string;
  email?: string;
  langKey: LangKey;
  startDate?: Date;
  endDate?: Date;
  userId?: number;
}

export async function userGetOrders(params: IUserSearchOrder) {
  if (!params.phoneNumber && !params.email) {
    throw ErrorCode.Search_Order_Need_Email_Or_Phone_Number;
  }

  const query = getRepository(Order)
    .createQueryBuilder('o')
    .leftJoinAndMapMany('o.orderDetails', OrderDetail, 'od', 'od.order.id = o.id')
    .innerJoinAndMapOne('od.product', Product, 'p', 'p.id = od.product.id')
    .innerJoinAndMapOne('p.name', Translation, 'pnt', 'pnt.id = p.name.id')
    .leftJoinAndMapOne('o.user', User, 'u', 'u.id = o.user.id')
    .select([
      'o.id as id',
      'o.status as status',
      'o.totalPrice as totalPrice',
      'o.createdDate as createdDate',
      'o.name as name',
      'u.id as userId',
      'u.username as username',
      'u.fullName as fullName',
      'od.product.id as productId',
      'od.amount as amount',
      'od.price as price',
      'pnt.contentEng as productName',
    ])
    .where('o.isDeleted IS FALSE');

  if (params.phoneNumber) {
    query.andWhere('o.phoneNumber = :phoneNumber', {
      phoneNumber: params.phoneNumber,
    });
  }

  if (params.email) {
    query.andWhere('o.email = :email', {
      email: params.email,
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

  if (params.userId) {
    query.andWhere('u.id = :userId', {
      userId: params.userId,
    });
  }

  query.groupBy('o.id, od.id, p.id, pnt.id');
  query.orderBy('o.id', 'DESC');

  const [data, total] = await Promise.all([query.getRawMany(), query.getCount()]);

  const ordersMap = new Map();

  data.forEach((o) => {
    if (!ordersMap.has(o.id)) {
      ordersMap.set(o.id, {
        id: o.id,
        status: o.status,
        totalPrice: o.totalPrice,
        createdDate: moment(o.createdDate).format('YYYY-MM-DD HH:mm:ss'),
        name: o.name,
        user: {
          id: o.userId,
          username: o.username,
          fullName: o.fullName,
        },
        orderDetails: [],
      });
    }

    ordersMap.get(o.id).orderDetails.push({
      productId: o.productId,
      amount: o.amount,
      price: o.price,
      name: o.productName,
    });
  });

  const orders = Array.from(ordersMap.values());

  return {
    data: orders,
    total,
  };
}

interface CreateOrderDTO {
  userId?: number;
  email: string;
  phoneNumber: string;
  name: string;
  details: OrderDetailDto[];
  note: string;
}

interface OrderDetailDto {
  productId: number;
  amount: number;
  price?: number;
}

export async function userCreateOrder(params: CreateOrderDTO) {
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
      name: params.name,
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

export async function userGetOwnOrderDetail(id: number, userId: number, langKey: LangKey) {
  const orderRepo = getRepository(Order);
  const order = await orderRepo.findOne(id, {
    relations: ['orderDetails', 'orderDetails.product', 'orderDetails.product.name', 'user'],
  });

  const orderDetails = order.orderDetails.map((od) => ({
    product: {
      image: od.product.image,
      price: od.price,
      amount: od.amount,
      name: langKey === LangKey.ENG ? od.product.name.contentEng : od.product.name.contentVie,
      type: od.product.type,
    },
  }));

  if (!order) {
    throw ErrorCode.Order_Not_exist;
  }

  if (order.isDeleted) {
    throw ErrorCode.Order_Deleted;
  }

  if (order.user.id !== userId) {
    throw ErrorCode.Order_Not_Your_Own;
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
    name: order.name,
  };
}
