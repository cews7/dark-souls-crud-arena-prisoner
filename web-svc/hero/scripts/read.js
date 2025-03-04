const getHeroes = () => {
    localStorage.setItem('heroes', JSON.stringify([
        {
            name: 'Steve',
            level: 1,
            class: 'Warrior'
        },
        {
            name: 'John',
            level: 2,
            class: 'Mage'
        },
        {
            name: 'Jane',
            level: 3,
            class: 'Archer'
        },
        
        
    ]));
    const heroes = localStorage.getItem('heroes');
    const heroList = document.getElementById('heroList');
    return heroes ? JSON.parse(heroes).forEach(hero => {
        const heroItem = document.createElement('li');
        heroItem.id = hero.name;
        heroItem.style.listStyleType = 'none';
        heroItem.innerHTML = `<h4>${hero.name}</h4> <p>Level: ${hero.level}</p> <p>Class: ${hero.class}</p>`;
        heroList.appendChild(heroItem);
    }) : [];
}

export { getHeroes };
