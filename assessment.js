/* FinSense AI Assessment Form Step Wizard */

let currentStep = 1;

document.addEventListener('DOMContentLoaded', () => {
    showStep(currentStep);
    
    // Occupation change toggle for farming fields
    const occSelect = document.getElementById('occupation');
    const farmingSection = document.getElementById('farming_section');
    
    if (occSelect && farmingSection) {
        occSelect.addEventListener('change', () => {
            if (occSelect.value === 'Farmer') {
                farmingSection.style.display = 'block';
            } else {
                // If not farmer, land size can still be entered if they own agricultural land
            }
        });
    }
});

function showStep(step) {
    const steps = document.querySelectorAll('.wizard-step');
    const indicators = document.querySelectorAll('.step-item');

    steps.forEach((s, idx) => {
        if (idx + 1 === step) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });

    indicators.forEach((ind, idx) => {
        if (idx + 1 === step) {
            ind.classList.add('active');
        } else if (idx + 1 < step) {
            ind.classList.add('completed');
            ind.classList.remove('active');
        } else {
            ind.classList.remove('active', 'completed');
        }
    });
}

function nextStep(step) {
    if (validateCurrentStep(currentStep)) {
        currentStep = step;
        showStep(currentStep);
        window.scrollTo({ top: 100, behavior: 'smooth' });
    }
}

function prevStep(step) {
    currentStep = step;
    showStep(currentStep);
    window.scrollTo({ top: 100, behavior: 'smooth' });
}

function validateCurrentStep(step) {
    const currentStepEl = document.getElementById(`step-${step}`);
    if (!currentStepEl) return true;

    const requiredInputs = currentStepEl.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });

    if (!isValid && typeof showToast === 'function') {
        showToast('error', 'Please complete all required fields before proceeding.');
    }

    return isValid;
}
