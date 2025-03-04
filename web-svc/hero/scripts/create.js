
const createHeroButton = () => {
    const button = document.createElement('button');
    button.id = 'createHeroButton';
    button.textContent = 'Create Hero';
    return button;
}

export { createHeroButton };
