# Slack Status Automator

## これはなに

バイト先でひっきりなしにメンションが飛んでくるので、自分のその日の稼働有無をSlackのステータスで半自動的に意思表示するためのもの。

## 事前準備

### スプシの準備

repoにある `spreadsheet.csv` を雛形に、スプレッドシートを作成する。

- 予定：カレンダーで登録する時の文字列
- 絵文字：Slackに登録されている絵文字のエイリアスを打ち込む
- ステータス：ステータスのテキスト

スプシのメニューから「拡張機能」→「Apps Script」を選択し、スクリプトを作成後、IDをよしなに回収してこのrepoのコードをpushする。
（省略）

### カレンダーの準備

ステータスの入力に使うカレンダーをGoogle カレンダーに作成。
カレンダーIDを取り出し、スプシのスクリプトプロパティに `CALENDAR_ID` として打ち込む

### Slack Appの作成

1. Slack App を作ります。英語ドキュメントを気合いで読んで作ってください
   (このとき、リダイレクト先は適当に `https://127.0.0.1:3000/` とかにしておきます)
2. アプリ画面の「OAuth & Permissions」に遷移し、以下のスコープを「User Token Scopes」に設定する

    ```
    users.profile:write
    users.profile:read
    ```

3. 以下のURLにアクセスする
   (`<client_id>` は適宜埋める)

    ```
    https://slack.com/oauth/v2/authorize?client_id=<client_id>&scope=&user_scope=users.profile:read,users.profile:write
    ```

4. WSとチャンネルを設定して認証する

5. リダイレクトすると接続できませんと表示されるが、urlのクエリ文字列のうちcodeを拾う

6. 以下のサイトにアクセスする
    (`<client_id>`, `<client_secret>`, `<code>` を埋める。codeはさっき拾ったやつ)

    ```
    https://slack.com/oauth.v2.access?client_id=<client_id>&client_secret=<client_secret>&code=<code>&redirect=uri=
    ```

7. 返ってくるjsonからaccess_tokenを取り出し、スプシのスクリプトプロパティに `SLACK_TOKEN` として打ち込む

### スクリプトのトリガー設定

よしなに。

## 使い方

1. 日常的にカレンダーにステータスを終日予定として入力していく。予定の名前はスプシのA列に設定しているもの
2. 予定がない日はコード上の `DEFAULT_SET` にあるものがSlackに登録される。ねむねむにゃんこ。
