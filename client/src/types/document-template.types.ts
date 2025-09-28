export interface DocumentTemplateAttributes {
  id: number;
  adminId: number;
  name: string;
  file: string;
  description: string;
}

export interface CreateDocumentTemplateDto {
  name: string;
  file: File;
  description: string;
}

export interface UpdateDocumentTemplateDto {
  name?: string;
  file?: File;
  description: string;
}
