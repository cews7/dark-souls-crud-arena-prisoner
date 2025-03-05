const getHeroes = () => {
    fetch('http://localhost:3000/api/heroes')
    .then(response => response.json())
    .then(data => {
        const heroList = document.getElementById('heroList');
        data.forEach(hero => {
            const heroItem = document.createElement('li');
            heroItem.id = hero.name;
            heroItem.style.listStyleType = 'none';
            heroItem.innerHTML = `<h4>${hero.name}</h4> <p>Level: ${hero.level}</p> <p>Class: ${hero.class}</p>`;
            heroList.appendChild(heroItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    })
}

export { getHeroes };
