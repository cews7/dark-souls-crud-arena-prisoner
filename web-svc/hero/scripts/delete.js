const deleteHeroRequest = async (id) => {
    const response = await fetch(`/api/heroes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });
    return response.json();
}


export const handleDeleteHeroButton = async () => {
    const deleteHeroButton = document.getElementById('deleteHeroButton');
    if (!deleteHeroButton) return;

    deleteHeroButton.addEventListener('click', async () => {
        const selectedHero = JSON.parse(localStorage.getItem('selectedHero'));
        if (deleteHeroButton.disabled) return;
        const response = await deleteHeroRequest(selectedHero.id);
        if (response.error) {
            console.error(response.error);
        }

        if (response.message) {
            console.log(response);
            localStorage.removeItem(`heroEquipment-${selectedHero.id}`);
            window.location.href = '/';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleDeleteHeroButton();
});