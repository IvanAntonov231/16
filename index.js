const URL = 'https://62054479161670001741b708.mockapi.io/api/todo/';
const TODO_ITEM_SELECTOR = '.todoItem';
const EDIT_BTN_CLASS = 'editBtn';
const DELETE_BTN_CLASS = 'deleteBtn';

const todoList = document.querySelector('#todoList');
const input = document.querySelector('#title');
const todoForm = document.querySelector('#todoForm');

todoForm.addEventListener('submit', onTodoFormSubmit);
todoList.addEventListener('click', onTodoListClick);

getTodoList()
    .then(renderTodoList)
    .catch(showError);


function onTodoFormSubmit(e) {
    e.preventDefault();

    const todo = getTodo();

    createTodo(todo)
        .then(newTodo => {
            renderTodoItem(newTodo);
            clearForm();
        })
        .catch(showError);
}

function getTodo() {
    return {
        title: input.value,
        status: false,
    };
}

function getTodoList() {
    return fetch(URL)
        .then(res => res.json());
}

function createTodo(todo) {
    return fetch(URL, {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Content-type': 'application/json',
        },
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }

        throw new Error('Can not create new todo');
    });
}

function onTodoListClick(e) {
    const todoItem = getTodoItem(e.target);
    const id = todoItem.dataset.id;
    const status = todoItem.dataset.status;

    if (todoItem) {
        if (e.target.classList.contains(EDIT_BTN_CLASS)) {
            console.log('edit');
            return;
        }
        if (e.target.classList.contains(DELETE_BTN_CLASS)) {
            deleteTodo(id)
                .then(() => todoItem.remove())
                .catch(showError);
            return;
        }

        updateTodo(id, { status: !status })
                .then(() => todoItem.classList.toggle('done'))
                .catch(showError);
    }
}

function deleteTodo(id) {
    return fetch(URL + id, {
        method: 'DELETE',
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }

        throw new Error(`Can not delete todo with id "${id}"`);
    });
}

function updateTodo(id, changes) {
    return fetch(URL + id, {
        method: 'PUT',
        body: JSON.stringify(changes),
        headers: {
            'Content-type': 'application/json',
        },
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }

        throw new Error(`Can not update todo with id "${id}"`);
    });
}

function getTodoItem(el) {
    return el.closest(TODO_ITEM_SELECTOR);
}

function renderTodoList(list) {
    const html = list.map(generateTodoHtml).join('');

    todoList.innerHTML = html;
}

function renderTodoItem(todo) {
    const todoItemTemplateHTML = generateTodoHtml(todo);

    todoList.insertAdjacentHTML('beforeend', todoItemTemplateHTML);
}

function generateTodoHtml(todo) {
    const status = todo.status ? 'done' : '';

    return `
        <li
            class="todoItem ${status}"
            data-id="${todo.id}"
            data-status="${todo.status}"
        >
            <span>${todo.title}</span>
            <button class="editBtn">[Edit]</button>
            <button class="deleteBtn">[Delete]</button>
        </li>
    `;
}

function clearForm() {
    todoForm.reset();
}

function showError(e) {
    alert(e.message);
}