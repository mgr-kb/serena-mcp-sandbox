# 推奨コマンド

## 開発関連コマンド
- `npm run dev` - 開発サーバーの起動（Vite）
- `npm run build` - プロダクションビルド（TypeScript コンパイル + Vite ビルド）
- `npm run preview` - プロダクションビルドのプレビュー

## コード品質関連
- `npm run lint` - ESLint による静的解析

## システムコマンド（macOS）
- `ls` - ファイル・ディレクトリ一覧表示
- `cd` - ディレクトリ移動
- `grep` / `rg` - テキスト検索（ripgrep推奨）
- `find` - ファイル検索
- `git` - バージョン管理

## 開発フロー
1. `npm run dev` で開発サーバー起動
2. コード変更後、`npm run lint` でコード品質チェック
3. ビルド前に `npm run build` で最終確認