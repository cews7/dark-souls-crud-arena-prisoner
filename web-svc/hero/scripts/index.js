const getHeroes = async () => {
    try {
        const response = await fetch('/api/heroes');
        const data = await response.json();
        localStorage.setItem('heroes', JSON.stringify(data));
        const heroList = document.getElementById('heroList');
        heroList.innerHTML = '';
        data.forEach(hero => {
            const heroItem = document.createElement('div');
            heroItem.classList.add('heroItem');
            heroItem.innerHTML = `<h4>${hero.name}</h4> <p>Level: ${hero.level}</p> <p>${hero.class}</p>`;

            heroItem.addEventListener('click', () => {
                localStorage.setItem('selectedHero', JSON.stringify(hero));
                window.location.href = `/heroes/${hero.id}`;
            });
            heroList.appendChild(heroItem);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

export { getHeroes };
