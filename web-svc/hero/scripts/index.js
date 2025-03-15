import { handleCreateHeroButton } from './create.js';
import { handleUpdateHeroDetailsButton, handleCancelUpdateHeroDetailsButton, handleBrowseEquipmentButton, handleEquipmentSelectionCancelButton } from './show.js';
import { handleEquipmentSelectionSubmitButton } from '../equipment/scripts/create.js';
import { handleEquipmentDeleteButton } from '../equipment/scripts/delete.js';
import { getHeroes } from './show-all.js';
import { showHero } from './show.js';

const initHero = () => {
    handleCreateHeroButton();
    handleUpdateHeroDetailsButton();
    handleCancelUpdateHeroDetailsButton();
    handleBrowseEquipmentButton();
    handleEquipmentSelectionCancelButton();
    handleEquipmentSelectionSubmitButton();
    handleEquipmentDeleteButton();
    getHeroes();
    showHero();
}

export { initHero };