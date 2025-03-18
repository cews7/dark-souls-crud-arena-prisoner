import { handleCreateHeroButton } from './scripts/create.js';
import { handleUpdateHeroDetailsButton, handleCancelUpdateHeroDetailsButton, handleBrowseEquipmentButton, handleEquipmentSelectionCancelButton } from './scripts/show.js';
import { handleEquipmentSelectionSubmitButton } from './equipment/scripts/submit.js';
import { getHeroes } from './scripts/index.js';
import { showHero } from './scripts/show.js';

const initHero = () => {
    handleCreateHeroButton();
    handleUpdateHeroDetailsButton();
    handleCancelUpdateHeroDetailsButton();
    handleBrowseEquipmentButton();
    handleEquipmentSelectionCancelButton();
    handleEquipmentSelectionSubmitButton();
    getHeroes();
    showHero();
}

export { initHero };