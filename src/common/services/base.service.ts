import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { AuthUser } from '../types/auth-user';

export class BaseService<
  TEntity extends { id: string; companyId?: string },
  TCreateDto = DeepPartial<TEntity>,
  TUpdateDto = DeepPartial<TEntity>,
> {
  constructor(protected readonly repo: Repository<TEntity>) {}

  async findAllByCompany(companyId: string): Promise<TEntity[]> {
    return this.repo.find({
      where: { companyId } as FindOptionsWhere<TEntity>,
    });
  }

  async findOne(id: string, companyId: string): Promise<TEntity | null> {
    return this.repo.findOne({
      where: { id, companyId } as FindOptionsWhere<TEntity>,
    });
  }

  async createWithUserContext(
    data: TCreateDto,
    user: AuthUser,
  ): Promise<TEntity> {
    const entity = this.repo.create({
      ...data,
      companyId: user.companyId,
      modifiedByUserId: user.userId,
    } as DeepPartial<TEntity>);
    return this.repo.save(entity);
  }

  async updateWithUserContext(
    id: string,
    data: TUpdateDto,
    user: AuthUser,
  ): Promise<TEntity | null> {
    const existing = await this.repo.findOne({
      where: { id, companyId: user.companyId } as FindOptionsWhere<TEntity>,
    });

    if (!existing) throw new Error('Entity not found');

    const updated = this.repo.merge(existing, {
      ...data,
      modifiedByUserId: user.userId,
    } as DeepPartial<TEntity>);

    return this.repo.save(updated);
  }

  async softDelete(id: string, companyId: string): Promise<void> {
    await this.repo.softDelete({ id, companyId } as FindOptionsWhere<TEntity>);
  }

  async hardDelete(id: string, companyId: string): Promise<void> {
    await this.repo.delete({ id, companyId } as FindOptionsWhere<TEntity>);
  }
}
