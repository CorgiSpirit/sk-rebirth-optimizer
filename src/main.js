document.getElementById('calc-btn').addEventListener('click', () => {
    // 1. Get values from the inputs
    const atk = parseFloat(document.getElementById('atk').value);
    const buff = parseFloat(document.getElementById('buff').value);
    const def = parseFloat(document.getElementById('def').value);

    // 2. Perform the logic (Simplified formula)
    // Formula: (Attack * (1 + Buff/100)) - Defense
    const totalDamage = (atk * (1 + (buff / 100))) - def;

    // 3. Update the UI
    document.getElementById('result').innerText = `Result: ${totalDamage.toFixed(2)}`;
});