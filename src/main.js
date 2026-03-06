// 1. Load the data when the page opens
fetch('../data/characters.json')
    .then(response => response.json())
    .then(data => {
        const select = document.getElementById('hero-select');
        
        // Add options to the dropdown
        data.forEach(hero => {
            let option = document.createElement('option');
            option.value = JSON.stringify(hero); // Store the object as a string
            option.text = hero.name;
            select.appendChild(option);
        });
    });

// 2. Calculation logic
document.getElementById('calc-btn').addEventListener('click', () => {
    const heroData = JSON.parse(document.getElementById('hero-select').value);
    const buff = parseFloat(document.getElementById('buff').value);

    // Formula: (BaseAtk * (1 + Buff/100)) - BaseDef
    const totalDamage = (heroData.baseAtk * (1 + (buff / 100))) - heroData.baseDef;

    document.getElementById('result').innerText = `Result for ${heroData.name}: ${totalDamage.toFixed(2)}`;
});