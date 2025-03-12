import { handleCreateEquipmentButton } from './create.js';
import { getAllEquipment } from './show-all.js';

const initEquipment = () => {
    handleCreateEquipmentButton();
    getAllEquipment();
}

export { initEquipment };