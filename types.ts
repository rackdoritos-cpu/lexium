
export enum AssetCategory {
  EQUITY = 'EQUITY',
  REAL_ESTATE = 'REAL_ESTATE',
  BUSINESS_STAKE = 'BUSINESS_STAKE',
  VEHICLE = 'VEHICLE',
  DOCUMENT = 'DOCUMENT',
  CONSTRUCTION = 'CONSTRUCTION',
  DEPOSIT = 'DEPOSIT',
  RENTAL_CONTRACT = 'RENTAL_CONTRACT'
}

export interface Transaction {
  id: string;
  assetId: string;
  date: string;
  quantity: number;
  price: number;
  fees: number;
  type: 'BUY' | 'SELL';
}

export interface StockAsset {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  sector: string;
  transactions: Transaction[];
}

export interface PropertyAsset {
  id: string;
  name: string;
  address: string;
  value: number;
  monthlyRent: number;
  status: 'Rented' | 'Vacant' | 'Maintenance';
  lastAnnualUpdate: string;
  tenantName?: string;
}

export interface StakeDocument {
  id: string;
  name: string;
  type: 'CHECK' | 'TRANSFER' | 'CONTRACT' | 'TAX_PROOFER';
  date: string;
  url: string;
}

export interface BusinessStake {
  id: string;
  companyName: string;
  percentage: number;
  acquisitionCost: number;
  currentValue: number;
  sector: string;
  lastDividend: number;
  documents?: StakeDocument[];
}

export interface Alert {
  id: string;
  type: 'PAYMENT' | 'LEGAL' | 'TAX' | 'MAINTENANCE';
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  isResolved: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  email: string;
}
