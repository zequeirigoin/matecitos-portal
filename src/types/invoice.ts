export interface Invoice {
  id: string;
  reference: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'ARS';
  paymentStatus: 'pending' | 'partial' | 'paid';
  date: string;
  type: 'received' | 'emitted';
  mainPdf: File;
  taxProofs: File[];
  observations: string;
}