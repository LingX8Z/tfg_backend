// clinical-case.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClinicalCaseDocument = ClinicalCase & Document;

@Schema({ timestamps: true })
export class ClinicalCase {
  @Prop({ required: true })
  filename: string;

  @Prop()
  sintomas: string;

  @Prop()
  diagnostico: string;

  @Prop()
  tratamiento: string;

  @Prop({ type: [String] })
  recomendaciones: string[];

  @Prop()
  profesional: string;
}

export const ClinicalCaseSchema = SchemaFactory.createForClass(ClinicalCase);
