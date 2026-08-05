class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement, historyListElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.historyListElement = historyListElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert('No se puede dividir por cero');
                    this.clear();
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        const result = Math.round(computation * 100000000) / 100000000;
        this.addToHistory(`${this.previousOperand} ${this.operation} ${this.currentOperand} = ${result}`);
        this.currentOperand = result.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }

    addToHistory(entry) {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.textContent = entry;
        this.historyListElement.prepend(li);
    }
}

// Inicialización e Interacción con el DOM
const previousOperandTextElement = document.getElementById('previous-op');
const currentOperandTextElement = document.getElementById('current-op');
const historyListElement = document.getElementById('history-list');
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, historyListElement);

// Event Listeners para los botones

document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

document.querySelectorAll('[data-operator]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operator);
        calculator.updateDisplay();
    });
});

document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

document.querySelector('[data-action="delete"]').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

document.querySelector('[data-action="percent"]').addEventListener('click', () => {
    calculator.applyPercent();
    calculator.updateDisplay();
});

const clearHistoryBtn = document.getElementById('clear-history');
clearHistoryBtn.addEventListener('click', () => {
    historyListElement.innerHTML = '';
});

// Soporte para Teclado Físico
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    }
    if (['+', '-', '*', '/'].includes(e.key)) {
        calculator.chooseOperation(e.key);
        calculator.updateDisplay();
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
    }
    if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
});

calculator.updateDisplay();

Calculator.prototype.applyPercent = function() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;
    this.currentOperand = (current / 100).toString();
};

