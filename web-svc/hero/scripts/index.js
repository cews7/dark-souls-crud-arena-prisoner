import { handleCreateHeroButton } from './create.js';
import { getHeroes } from './show-all.js';
import { showHero } from './show.js';


const initHero = () => {
    handleCreateHeroButton();
    getHeroes();
    showHero();
}

export { initHero };