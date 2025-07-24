import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { AuthUser } from '../types/auth-user';

function whereCompany<TEntity extends { companyId?: string }>(
  companyId: string,
): FindOptionsWhere<TEntity> {
  return { companyId } as FindOptionsWhere<TEntity>;
}

function whereIdAndCompany<TEntity extends { id: string; companyId?: string }>(
  id: string,
  companyId: string,
): FindOptionsWhere<TEntity> {
  return { id, companyId } as FindOptionsWhere<TEntity>;
}

export class BaseService<
  TEntity extends { id: string; companyId?: string },
  TCreateDto = DeepPartial<TEntity>,
  TUpdateDto = DeepPartial<TEntity>,
> {
  constructor(protected readonly repo: Repository<TEntity>) {}

  async findAllByCompany(companyId: string): Promise<TEntity[]> {
    return this.repo.find({
      where: whereCompany<TEntity>(companyId),
    });
  }

  async findOne(id: string, companyId: string): Promise<TEntity | null> {
    return this.repo.findOne({
      where: whereIdAndCompany<TEntity>(id, companyId),
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
      where: whereIdAndCompany<TEntity>(id, user.companyId),
    });

    if (!existing) throw new Error('Entity not found');

    const updated = this.repo.merge(existing, {
      ...data,
      modifiedByUserId: user.userId,
    } as DeepPartial<TEntity>);

    return this.repo.save(updated);
  }

  async softDelete(id: string, companyId: string): Promise<void> {
    await this.repo.softDelete(whereIdAndCompany<TEntity>(id, companyId));
  }

  async hardDelete(id: string, companyId: string): Promise<void> {
    await this.repo.delete(whereIdAndCompany<TEntity>(id, companyId));
  }
}
