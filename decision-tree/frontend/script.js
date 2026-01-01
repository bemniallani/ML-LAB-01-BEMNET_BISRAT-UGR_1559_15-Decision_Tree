document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const resetBtn = document.getElementById('resetBtn');
    const resultContainer = document.getElementById('resultContainer');
    const loader = document.getElementById('loader');

    const API_URL = 'https://ml-lab-01-bemnet-bisrat-ugr-1559-15-q1br.onrender.com'; 

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        loader.style.display = 'flex';
        
        try {
            const formData = {
                Pregnancies: parseFloat(document.getElementById('pregnancies').value),
                Glucose: parseFloat(document.getElementById('glucose').value),
                BloodPressure: parseFloat(document.getElementById('bloodPressure').value),
                SkinThickness: parseFloat(document.getElementById('skinThickness').value),
                Insulin: parseFloat(document.getElementById('insulin').value),
                BMI: parseFloat(document.getElementById('bmi').value),
                DiabetesPedigreeFunction: parseFloat(document.getElementById('dpf').value),
                Age: parseFloat(document.getElementById('age').value)
            };

            const response = await fetch(`${API_URL}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            updateResultUI(result);
            resultContainer.style.display = 'block';
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error making prediction. Ensure Decision Tree backend is running on port 8000.');
        } finally {
            loader.style.display = 'none';
        }
    });

    resetBtn.addEventListener('click', function() {
        form.reset();
        resultContainer.style.display = 'none';
    });

    function updateResultUI(result) {
        const statusText = document.getElementById('predictionStatus');
        const statusIcon = document.getElementById('statusIcon');
        const riskText = document.getElementById('riskText');
        
        // Decision Tree usually returns 1 for Diabetic, 0 for Non-Diabetic
        const isDiabetic = result.prediction === 1;

        if (isDiabetic) {
            statusText.textContent = "Diabetic";
            statusText.style.color = "#e74c3c";
            statusIcon.innerHTML = '<i class="fas fa-user-shield" style="color: #e74c3c;"></i>';
            riskText.textContent = "High probability of diabetes detected.";
        } else {
            statusText.textContent = "Non-Diabetic";
            statusText.style.color = "#2ecc71";
            statusIcon.innerHTML = '<i class="fas fa-user-check" style="color: #2ecc71;"></i>';
            riskText.textContent = "Low probability of diabetes detected.";
        }
    }

});
