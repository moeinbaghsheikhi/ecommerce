import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import UserRoleEnum from './enums/userRoleEnum';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}
  async create(createUserDto: CreateUserDto) {
    try{
      const alreadyUser = await this.findOneByMobile(createUserDto.mobile, true);

      if(!alreadyUser){
        const newUser = this.userRepository.create(createUserDto)

        return await this.userRepository.save(newUser)
      }
      else throw new BadRequestException("کاربری با این شماره موبایل در سیستم وجود دارد!");

    } catch(error){
      throw error;
    }
  }

  async findAll(role?: UserRoleEnum, limit: number = 10, page: number = 1) {
    const query = this.userRepository.createQueryBuilder('projects');

    if(role){
      query.where('role = :role', { role })
    }
    
    query.skip((page - 1) * limit).take(limit)

    return await query.getMany();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id })

    if(!user) throw new NotFoundException(`کاربر ${id} پیدا نشد!`)

    return user
  }

  async findOneByMobile(mobile: string, checkExist: boolean = false) {
    const user = await this.userRepository.findOneBy({ mobile })

    if(!checkExist) if(!user) throw new NotFoundException(`کاربر ${mobile} پیدا نشد!`);

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)

    try{
      await this.userRepository.update(id, {
        display_name: updateUserDto.display_name,
        role: updateUserDto.role
      })

      return await this.findOne(id)
    } catch{
      throw new BadRequestException("هنگام آپدیت پروژه خطایی رخ داد!")
    }
  }

  async addProductToBasket(userId, product){
    const user = await this.userRepository.findOne({where: {id: userId}, relations: ['basket_items']});

    user.basket_items.push(product);

    return await this.userRepository.save(user);
  }

  async removeProductFromBasket(userId: number, product): Promise<void> {
    // یافتن کاربر به همراه آیتم‌های سبد خرید
    const user = await this.userRepository.findOne({ 
        where: { id: userId }, 
        relations: ['basket_items'] 
    });

    if (!user) {
        throw new NotFoundException('User not found');
    }

    // پیدا کردن آیتم مورد نظر در سبد خرید
    const productIndex = user.basket_items.findIndex(item => item.id === product.id);

    if (productIndex === -1) {
        throw new NotFoundException('Product not found in the basket');
    }

    // حذف آیتم از سبد خرید
    user.basket_items.splice(productIndex, 1);

    // ذخیره تغییرات
    await this.userRepository.save(user);
}

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id)
    
    if(result.affected === 0)
      throw new NotFoundException(`کاربر ${id} پیدا نشد!`)
  }
}
