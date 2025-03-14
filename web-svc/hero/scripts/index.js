import { handleCreateHeroButton } from './create.js';
import { handleUpdateHeroDetailsButton, handleCancelUpdateHeroDetailsButton, handleBrowseEquipmentButton, handleEquipmentSelectionCancelButton } from './show.js';
import { getHeroes } from './show-all.js';
import { showHero } from './show.js';

const initHero = () => {
    handleCreateHeroButton();
    handleUpdateHeroDetailsButton();
    handleCancelUpdateHeroDetailsButton();
    handleBrowseEquipmentButton();
    handleEquipmentSelectionCancelButton();
    getHeroes();
    showHero();
}

export { initHero };