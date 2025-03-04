const handleCreateHeroButton = () => {
    const button = document.getElementById('createHero');
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const heroName = document.getElementById('heroName').value;
        const heroLevel = document.getElementById('heroLevel').value;
        const heroClass = document.getElementById('heroClass').value;
        const hero = {
            name: heroName,
            level: heroLevel,
            class: heroClass
        }
        fetch('http://localhost:3000/api/heroes', {
            method: 'POST',
            body: JSON.stringify(hero),
            headers: {
                'Content-Type': 'application/json'
            }
            })
        .then(response => 
            response.json()
        )
        .catch(error => {
            console.error('Error:', error);
        })
    })
}

export { handleCreateHeroButton };
