// clinical-case.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClinicalCase, ClinicalCaseDocument } from './clinical-case.schema';
import { Model } from 'mongoose';

@Injectable()
export class ClinicalCaseService {
  constructor(
    @InjectModel(ClinicalCase.name) private model: Model<ClinicalCaseDocument>,
  ) {}

  async createCase(data: Partial<ClinicalCase>) {
    const newCase = new this.model(data);
    return newCase.save();
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findByDiagnostico(diagnostico: string) {
    return this.model.find({ diagnostico: new RegExp(diagnostico, 'i') }).exec();
  }
}
