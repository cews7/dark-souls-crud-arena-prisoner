import { handleCreateHeroButton } from './create.js';
import { handleUpdateHeroDetailsButton, handleCancelUpdateHeroDetailsButton, handleBrowseEquipmentButton } from './show.js';
import { getHeroes } from './show-all.js';
import { showHero } from './show.js';

const initHero = () => {
    handleCreateHeroButton();
    handleUpdateHeroDetailsButton();
    handleCancelUpdateHeroDetailsButton();
    handleBrowseEquipmentButton();
    getHeroes();
    showHero();
}

export { initHero };