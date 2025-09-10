import { Request, Response } from 'express';
import BankDetails from '../models/Bank';


// --- Bank Details ---
export const getBankDetails = async (req: Request, res: Response) => {
  const adminId= req.params.adminId
  console.log('getBankDetails called');
  try {
    const bank = await BankDetails.findOne({
      where:{adminId}
    });
    console.log('Fetched bank details count:');
    res.json(bank);
  } catch (err) {
    console.error('Failed to fetch bank details:', err);
    res.status(500).json({ error: 'Failed to fetch bank details', details: err });
  }
};

export const createBankDetails = async (req: Request, res: Response) => {
  console.log('createBankDetails called with body:', req.body);
  const adminId= req.params.adminId
  try {
    const bank = await BankDetails.create({...req.body,adminId});
    console.log('Bank details created:', bank);
    res.status(201).json(bank);
  } catch (err) {
    console.error('Failed to create bank details:', err);
    res.status(500).json({ error: 'Failed to create bank details', details: err });
  }
};

export const updateBankDetails = async (req: Request, res: Response):Promise<void> => {
  console.log('updateBankDetails called with id:', req.params.id, 'body:', req.body);
  try {
    const bank = await BankDetails.findByPk(req.params.id);
    if (!bank) {
      console.log('Bank details not found:', req.params.id);
       res.status(404).json({ error: 'Bank details not found' });
       return
    }
    await bank.update(req.body);
    console.log('Bank details updated:', bank);
    res.json(bank);
  } catch (err) {
    console.error('Failed to update bank details:', err);
    res.status(500).json({ error: 'Failed to update bank details', details: err });
  }
};

export const deleteBankDetails = async (req: Request, res: Response):Promise<void> => {
  console.log('deleteBankDetails called with id:', req.params.id);
  try {
    const bank = await BankDetails.findByPk(req.params.id);
    if (!bank) {
      console.log('Bank details not found:', req.params.id);
       res.status(404).json({ error: 'Bank details not found' });
       return
    }
    await bank.destroy();
    console.log('Bank details deleted:', req.params.id);
    res.json({ message: 'Bank details deleted successfully' });
  } catch (err) {
    console.error('Failed to delete bank details:', err);
    res.status(500).json({ error: 'Failed to delete bank details', details: err });
  }
};

