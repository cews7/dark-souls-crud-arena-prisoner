import { handleCreateHeroButton } from './create.js';
import { getHeroes } from './show-all.js';
import { showHero, handleUpdateHeroButton } from './show.js';

const initHero = () => {
    handleCreateHeroButton();
    getHeroes();
    showHero();
    handleUpdateHeroButton();
}

export { initHero };