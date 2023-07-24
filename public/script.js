// APIのベースURLを設定します
const API_URL = '/todos';

// ページのDOMから必要な要素を取得します
const todoListElement = document.getElementById('todo-list'); // ToDoリストを表示する要素
const todoInput = document.getElementById('todo-input'); // 新しいToDoを入力するフィールド
const todoButton = document.getElementById('todo-submit'); // 新しいToDoを追加するボタン

// すべてのToDoを表示する関数
async function displayTodos() {
  // APIからToDoリストを取得します
  const response = await fetch(API_URL);
  // APIからのレスポンスは通常テキスト形式であるため、.json()メソッドを使用してレスポンスをJSON形式に解析します。
// これにより、レスポンスボディがJavaScriptオブジェクトとして使用できます。そのオブジェクトは非同期的に得られるため、
// ここでは'await'を使ってJavaScriptに解析が完了するまで待つように指示しています。
// 解析が完了したら、その結果（この場合はToDo項目の配列）を変数'todos'に代入します。
  const todos = await response.json();

  // ToDoリストをクリアします
  todoListElement.innerHTML = '';

  // 取得した各ToDo項目に対して
  todos.forEach((todo) => {
    // 新しい<li>要素を作成します
    const todoElement = document.createElement('li');

    // "Done" / "Undone"ボタンを作成します
    const updateButton = document.createElement('button');
    updateButton.innerText = todo.done ? 'Undone' : 'Done';
    updateButton.addEventListener('click', () => updateTodo(todo._id, !todo.done));

    // "Delete"ボタンを作成します
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', () => deleteTodo(todo._id));

    // ToDoのテキストとボタンを<li>要素に追加します
    todoElement.innerText = todo.text;
    todoElement.append(updateButton);
    todoElement.append(deleteButton);

    // <li>要素をToDoリストに追加します
    todoListElement.append(todoElement);
  });
}

// 新しいToDoを作成する関数
async function createTodo() {
  // 入力フィールドからテキストを取得してクリアします
  const text = todoInput.value;
  todoInput.value = '';

  // 新しいToDoをAPIに送信します
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  // 作成したToDoを取得します
  const newTodo = await response.json();

  // ToDoリストを更新します
  displayTodos();
}

// 既存のToDoを更新する関数
async function updateTodo(id, done) {
  // 更新情報をAPIに送信します
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ done }),
  });

  // 更新したToDoを取得します
  const updatedTodo = await response.json();

  // ToDoリストを更新します
  displayTodos();
}

// 既存のToDoを削除する関数
async function deleteTodo(id) {
  // ToDoの削除をAPIに通知します
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  // ToDoリストを更新します
  displayTodos();
}

// ページのロードが完了したときにToDoリストを表示します
window.onload = displayTodos;

// "Add"ボタンにクリックイベントを追加します。ボタンをクリックすると新しいToDoが作成されます
todoButton.addEventListener('click', createTodo);