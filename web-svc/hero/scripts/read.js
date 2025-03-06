const getHeroes = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/heroes');
        const data = await response.json();
        const heroList = document.getElementById('heroList');
        heroList.innerHTML = '';
        data.forEach(hero => {
            const heroItem = document.createElement('div');
            heroItem.classList.add('heroItem');
            heroItem.innerHTML = `<h4>${hero.name}</h4> <p>Level: ${hero.level}</p> <p>Class: ${hero.class}</p>`;

            heroItem.addEventListener('click', () => {
                window.location.href = `http://localhost:3000/heroes/${hero.id}`;
            });
            heroList.appendChild(heroItem);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

export { getHeroes };
