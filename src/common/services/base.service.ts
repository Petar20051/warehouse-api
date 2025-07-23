import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { AuthUser } from '../types/auth-user';

export class BaseService<T extends { id: string; companyId?: string }> {
  constructor(protected readonly repo: Repository<T>) {}

  async findAllByCompany(companyId: string): Promise<T[]> {
    return this.repo.find({
      where: { companyId } as FindOptionsWhere<T>,
    });
  }

  async findOne(id: string, companyId: string): Promise<T | null> {
    return this.repo.findOne({
      where: { id, companyId } as FindOptionsWhere<T>,
    });
  }

  async createWithUserContext(
    data: DeepPartial<T>,
    user: AuthUser,
  ): Promise<T> {
    const entity = this.repo.create({
      ...data,
      companyId: user.companyId,
      modifiedByUserId: user.userId,
    });
    return this.repo.save(entity);
  }

  async updateWithUserContext(
    id: string,
    data: DeepPartial<T>,
    user: AuthUser,
  ): Promise<T | null> {
    const entity = await this.repo.preload({
      id,
      ...data,
      companyId: user.companyId,
      modifiedByUserId: user.userId,
    } as DeepPartial<T>);
    if (!entity) return null;
    return this.repo.save(entity);
  }

  async softDelete(id: string, companyId: string): Promise<void> {
    await this.repo.softDelete({ id, companyId } as FindOptionsWhere<T>);
  }

  async hardDelete(id: string, companyId: string): Promise<void> {
    await this.repo.delete({ id, companyId } as FindOptionsWhere<T>);
  }
}
