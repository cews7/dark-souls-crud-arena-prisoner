import { handleCreateEquipmentButton } from './scripts/create.js';
import { getAllEquipment } from './scripts/index.js';

const initEquipment = () => {
    handleCreateEquipmentButton();
    getAllEquipment();
}

export { initEquipment };