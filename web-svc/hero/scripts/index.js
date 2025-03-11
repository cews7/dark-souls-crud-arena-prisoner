import { handleCreateHeroButton } from './create.js';
import { handleUpdateHeroButton } from './update.js';
import { getHeroes } from './show-all.js';
import { showHero } from './show.js';

const initHero = () => {
    handleCreateHeroButton();
    handleUpdateHeroButton();
    getHeroes();
    showHero();
}

export { initHero };