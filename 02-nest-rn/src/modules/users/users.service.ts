import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPasswordHelper } from '@/helpers/util';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { unuse } from 'passport';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService
  ) { }

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email });
    return user ? true : false;
  }
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;
    //check email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email already exists: ${email}`);
    }

    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image,
    });
    return {
      _id: user._id,
    }
  }



  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);

    return { results, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  async fineByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id }, { ...updateUserDto });
  }


  async remove(_id: string) {//co the  validate giong update async update(updateUserDto: UpdateUserDto) 
    if (mongoose.isValidObjectId(_id)) {
      return this.userModel.deleteOne({ _id })//delete
    }
    else {
      throw new BadRequestException(`Invalid user ID: ${_id} (must be a valid MongoDB ObjectId)`);
    }
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;
    //check email
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(`Email already exists: ${email}`);
    }

    //hash password
    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes'),
      //codeExpired: dayjs().add(15, 'seconds'),
    });


    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Active your account at @webdemo', // Subject line
      //html: '<b>hello with webdemo</b>', // HTML body content
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    //return response
    return {
      _id: user._id,
    }
  }

  async handleActive(data: { _id: string; code: string; }) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code,
    })
    if (!user) {
      throw new BadRequestException(`Invalid activation code`);
    }

    //check expired
    const isBeForeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeForeCheck) {
      //valid
      await this.userModel.updateOne({ _id: data._id }
        , {
          isActive: true,
        }
      )
      return { isBeForeCheck };
    }
    else {
      throw new BadRequestException(`Activation code has expired`);
    }
  }

  async retryActive(email: string) {

    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new BadRequestException("Account is not exist")
    }
    if (user.isActive) {
      throw new BadRequestException("Account is active")
    }
    const codeId = uuidv4();

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    });
    //send email
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Active your account at @webdemo', // Subject line
      //html: '<b>hello with webdemo</b>', // HTML body content
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user._id };
  }

  async retryPassword(email: string) {

    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new BadRequestException("Account is not exist")
    }


    //send email
    const codeId = uuidv4();

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    });

    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Change your password account at @webdemo', // Subject line
      //html: '<b>hello with webdemo</b>', // HTML body content
      template: "register",
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId
      }
    })
    return { _id: user._id, email: user.email };
  }
}
