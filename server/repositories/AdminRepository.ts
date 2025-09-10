// src/repositories/AdminnRepository.ts



import Admin, { AdminCreationAttributes } from '../models/Admin'
import BaseRepository from './BaseRepository'


class AdminnRepository extends BaseRepository<Admin> {
  constructor() {
    super(Admin)
  }

  async createUser(userData: AdminCreationAttributes): Promise<Admin> {
    return await this.create(userData)
  }

  async findUserByEmail(email: string): Promise<Admin | null> {

    return await this.findOne({ email })
  }

  async findUserById(id: string | number): Promise<Admin | null> {

    return await this.findById(id) as Admin | null
  }
 
  async findUserByResetToken(hashedToken: string): Promise<Admin | null> {
    
    return await this.findOne({ passwordResetToken: hashedToken })
  }
  async findUserByVerificationToken(token: string): Promise<Admin | null> {
    return await this.findOne({ verificationToken: token })
  }

  async updateUserById(id: string | number, updates: Partial<Admin>): Promise<Admin | null> {
    return await this.updateById(id, updates)
  }

  async getAllUsers(): Promise<Admin[]> {
    const result = await this.findAll()
    return result.data
  }
}

export default new AdminnRepository()