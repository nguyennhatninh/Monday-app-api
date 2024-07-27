import { Model } from 'mongoose';

export class BaseService<T, CreateDTO, UpdateDTO> {
  constructor(private readonly model: Model<T>) {}

  async create(data: CreateDTO): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, data: UpdateDTO): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }
}
