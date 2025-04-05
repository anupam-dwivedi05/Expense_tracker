document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const filter = document.getElementById("filter-category");
    const totalAmount = document.getElementById("total-amount");

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    displayExpenses(expenses);
    updateTotalAmount();

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-cat").value;
        const date = document.getElementById("expense-date").value;

        if (!name || isNaN(amount) || !category || !date) {
            alert("Please fill out all fields correctly!");
            return;
        }

        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date,
        };

        expenses.push(expense);
        saveToLocalStorage(expenses);
        displayExpenses(expenses);
        updateTotalAmount();
        expenseForm.reset();
    });

    expenseList.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        
        if (e.target.classList.contains("delete-btn")) {
            expenses = expenses.filter(expense => expense.id !== id);
            saveToLocalStorage(expenses);
            displayExpenses(expenses);
            updateTotalAmount();
        }

        if (e.target.classList.contains("edit-btn")) {
            const expense = expenses.find(expense => expense.id === id);

            if (expense) {
                document.getElementById("expense-name").value = expense.name;
                document.getElementById("expense-amount").value = expense.amount;
                document.getElementById("expense-cat").value = expense.category;
                document.getElementById("expense-date").value = expense.date;

                expenses = expenses.filter(exp => exp.id !== id);
                saveToLocalStorage(expenses);
                displayExpenses(expenses);
                updateTotalAmount();
            }
        }
    });

    filter.addEventListener("change", (e) => {
        const category = e.target.value;

        if (category === "All") {
            displayExpenses(expenses);
        } else {
            const filteredExpense = expenses.filter(expense => expense.category === category);
            displayExpenses(filteredExpense);
        }
    });

    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="edit-btn" data-id="${expense.id}">Edit</button>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;
            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.innerText = total.toFixed(2);
    }

    function saveToLocalStorage(data) {
        localStorage.setItem("expenses", JSON.stringify(data));
    }
});
