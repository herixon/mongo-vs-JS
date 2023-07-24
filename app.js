require('dotenv').config(); // 環境変数をロードするためにdotenvモジュールを読み込む
const express = require('express'); // Expressフレームワークを読み込む
const app = express();
const mongoose = require('mongoose'); // Mongooseモジュールを読み込む
const bodyParser = require('body-parser'); // body-parserモジュールを読み込む

const app  = express();

// MongoDBと接続するためのコード
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// データモデルの定義
const Todo = mongoose.model('Todo', new mongoose.Schema({
    text: { type: String, required: true },
    done: { type: Boolean, default: false }
}));

app.use(bodyParser.json()); // JSONデータの解析を行う
app.use(express.static("./public")); // publicディレクトリ内の静的ファイルをホストする

//以下ルーティングの設定

// GETメソッドは、情報を取り出す時に使います。例えば、図書館で本を探すような感じです。
// ここでは、'/todos'の場所から、全部のToDoリスト（やることリスト）を取り出します。
app.get("/", (req, res) => {
    // "index.html"ファイルをクライアントに送信します。このファイルは、通常、ウェブサイトのホームページの内容を含んでいます。
    res.sendFile("index.html");
    // サーバーのコンソールにメッセージを表示します。これは、このルートへのアクセスがあったときにデバッグ情報を提供します。
    console.log("/ へアクセスがありました");
});

// '/todos'へのGETリクエストを処理します。これは、通常、データベースに保存されているすべてのToDoアイテムを取得するために使用されます。
app.get('/todos', async (req, res) => {
    // データベースからすべてのToDoアイテムを非同期に取得します。
    const todos = await Todo.find();
    // 取得したToDoアイテムをクライアントに送信します。
    res.send(todos);
});


/// POSTメソッドは、新しい情報を追加する時に使います。例えば、新しい本を図書館に寄贈するような感じです。
// ここでは、新しいToDoリストの項目を作ります（'/todos'の場所に新しいものを追加します）。


// '/todos'へのPOSTリクエストを処理します。これは、通常、データベースに新しいToDoアイテムを追加するために使用されます。
app.post('/todos', async (req, res) => {
    // リクエストボディから取得したテキストを使用して、新しいToDoアイテムを作成します。
    const todo = new Todo({
        text: req.body.text,
        done: false
    });
    // ToDoアイテムを非同期にデータベースに保存します。
    const savedTodo = await todo.save();
    // 保存したToDoアイテムをクライアントに送信します。
    res.send(savedTodo);
});

// PUTメソッドは、情報を更新したり、新しい情報を置く時に使います。例えば、本を図書館の棚に戻すような感じです。
// ここでは、特定のToDoリストの項目（'/todos/:id'の場所にあるもの）を更新します。

app.put('/todos/:id', async (req, res) => {
    // リクエストパラメータから取得したIDとリクエストボディから取得した情報を使用して、ToDoアイテムを非同期に更新します。
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // 更新したToDoアイテムをクライアントに送信します。
    res.send(updatedTodo);
});

// DELETEメソッドは、情報を削除する時に使います。例えば、古い本を図書館から取り除くような感じです。
// ここでは、特定のToDoリストの項目（'/todos/:id'の場所にあるもの）を削除します。

app.delete('/todos/:id', async (req, res) => {
    // リクエストパラメータから取得したIDを使用して、ToDoアイテムを非同期に削除します。
    const deletedTodo = await Todo.findByIdAndRemove(req.params.id);
    // 削除したToDoアイテムをクライアントに送信します。
    res.send(deletedTodo);
});

//ポート設定。eｎvポートがない場合、localhost:3000でつながる。

const PORT = process.env.PORT || 3000; // 環境変数からポート番号を取得、存在しない場合は3000をデフォルトとする

// HTTPサーバを起動する
app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); // 指定したポートでサーバを起動
