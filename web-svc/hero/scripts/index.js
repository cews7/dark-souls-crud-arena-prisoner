import { handleCreateHeroButton } from './create.js';
import { handleUpdateHeroSubmit } from './update.js';
import { getHeroes } from './show-all.js';
import { showHero } from './show.js';

const initHero = () => {
    handleCreateHeroButton();
    handleUpdateHeroSubmit();
    getHeroes();
    showHero();
}

export { initHero };