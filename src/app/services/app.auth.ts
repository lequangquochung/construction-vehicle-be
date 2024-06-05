import { getRepository, EntityManager, getConnection } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import User from '$entities/User';
import { sign, verify } from 'jsonwebtoken';
import { pick } from 'lodash';
import { promisify } from 'util';
import to from 'await-to-js';
import config from '$config';
import { AccountStatus, ErrorCode } from '$enums/index';

const verifyAsync = promisify(verify) as any;

export async function getUserById(userId: number) {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ id: userId });
  return user;
}

interface LoginParams {
  email: string;
  phoneNumber: string;
  password: string;
}
export async function login(params: LoginParams) {
  const userRepository = getRepository(User);
  const { email, phoneNumber, password } = params;
  const querybuilder = userRepository.createQueryBuilder('member').where('1=1');
  if (email) {
    querybuilder.andWhere('member.email = :email', { email });
  }

  if (phoneNumber) {
    querybuilder.andWhere(
      `REGEXP_REPLACE(member.phoneNumber, '[^A-Za-z0-9 ]', '') = :phoneNumber`,
      { phoneNumber: phoneNumber.replace('-', '') }
    );
  }
  const member = await querybuilder.getOne();
  if (!member) throw ErrorCode.ID_Or_Password_Invalid;
  if (member.status !== AccountStatus.ACTIVE) {
    throw ErrorCode.User_Not_Exist;
  }

  let isTruePassword = await compare(password, member.password);
  if (!isTruePassword) {
    throw ErrorCode.ID_Or_Password_Invalid;
  }

  userRepository.update(
    { id: member.id },
    {
      lastLogged: new Date(),
    }
  );

  return {
    ...(await generateToken(member.id)),
  };
}

export async function createRefreshToken(memberId: number, refreshToken: string) {
  const member = await getUserById(memberId);
  const [error] = await to(verifyAsync(refreshToken, config.auth.RefreshTokenSecret));
  if (error || member?.refreshToken !== refreshToken) throw ErrorCode.Refresh_Token_Expire;
  return await generateToken(memberId);
}

export async function generateToken(memberId: number) {
  const userRepository = getRepository(User);
  const member = await getUserById(memberId);
  const dataEncode = pick(member, ['id', 'status', 'email', 'phoneNumber']);
  dataEncode['type'] = 'memberId';
  const token = generateAccessToken(dataEncode);
  const oldRefreshToken = member.refreshToken;
  const [error] = await to(verifyAsync(oldRefreshToken, config.auth.RefreshTokenSecret));

  if (error) {
    const dataEncodeRefreshToken = pick(member, ['id', 'status', 'email', 'phoneNumber']);
    dataEncodeRefreshToken['type'] = 'memberId';
    const newRefreshToken = generateRefreshToken(dataEncodeRefreshToken);
    await userRepository.update(memberId, { refreshToken: newRefreshToken });
    return { token, refreshToken: newRefreshToken };
  }

  return { token, refreshToken: oldRefreshToken };
}

export async function createAccessToken(memberId: number): Promise<string> {
  const member = await getUserById(memberId);
  const dataEncode = pick(member, ['id', 'status', 'email', 'phoneNumber', 'permissions']);
  dataEncode['type'] = 'memberId';
  return generateAccessToken(dataEncode);
}

const generateAccessToken = (dataEncode: any) => {
  return sign(dataEncode, config.auth.AccessTokenSecret, {
    algorithm: 'HS256',
    expiresIn: Number(config.auth.AccessTokenExpire),
  });
};

const generateRefreshToken = (dataEncode: any) => {
  return sign(dataEncode, config.auth.RefreshTokenSecret, {
    algorithm: 'HS256',
    expiresIn: config.auth.RefreshTokenExpire,
  });
};

interface RegisterParams {
  fullName: string;
  username: string;
  phoneNumber: string;
  birthday?: string;
  email: string;
  password: string;
  gender?: number;
}

export async function register(params: RegisterParams) {
  return await getConnection().transaction(async (transaction: EntityManager) => {
    const userRepo = transaction.getRepository(User);

    const usernameExisted = await userRepo.findOne({ username: params.username });
    if (usernameExisted) {
      throw ErrorCode.Username_Existed;
    }

    const emailExisted = await userRepo.findOne({ email: params.email });
    if (emailExisted) {
      throw ErrorCode.Email_Existed;
    }

    const phoneNumberExisted = await userRepo.findOne({ phoneNumber: params.phoneNumber });
    if (phoneNumberExisted) {
      throw ErrorCode.Phone_Number_Already_exist;
    }
    const password = await hash(params.password, config.auth.SaltRounds);
    const member = await userRepo.save({
      ...params,
      password,
    });
    return {
      id: member.id,
    };
  });
}

interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}
export async function changePassword(memberId: number, params: ChangePasswordParams) {
  const userRepo = getRepository(User);
  const { oldPassword, newPassword } = params;
  if (oldPassword === newPassword) throw ErrorCode.New_Password_Must_Be_Different;

  const member = await userRepo.findOne(memberId, { select: ['password', 'email', 'fullName'] });
  if (!member) throw ErrorCode.User_Not_Exist;

  const isTruePassword = await compare(oldPassword, member.password);
  if (!isTruePassword) throw ErrorCode.Password_Invalid;

  const passwordHash = await hash(newPassword, config.auth.SaltRounds);
  await userRepo.update(memberId, { password: passwordHash });
  return;
}
