import { Warehouse } from '../types/warehouse';
import HeaderClient from './HeaderClient';

interface HeaderServerProps {
  warehouses: Warehouse[];
}

export default function HeaderServer({ warehouses }: HeaderServerProps) {
  return <HeaderClient warehouses={warehouses} />;
}

