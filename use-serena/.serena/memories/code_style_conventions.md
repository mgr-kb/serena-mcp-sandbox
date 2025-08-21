# コードスタイルと規約

## TypeScript 設定
- `tsconfig.json` は分割設定（`tsconfig.app.json`, `tsconfig.node.json`）
- strict モードでの型チェック
- ES2020 構文をサポート

## ESLint 設定
- `@eslint/js` の recommended 設定を使用
- TypeScript ESLint の recommended 設定
- React hooks の推奨ルールを適用
- React refresh のルールを適用
- `dist` ディレクトリは除外

## ファイル命名規約
- React コンポーネント: PascalCase（例: `TodoItem.tsx`）
- カスタムフック: camelCase with "use" prefix（例: `useTodos.ts`）
- 型定義ファイル: camelCase（例: `todo.ts`）
- 設定ファイル: kebab-case（例: `vite.config.ts`）

## コンポーネント構造
- 機能別にディレクトリ分割
- コンポーネント、フック、型定義、データベース層で責任分離
- IndexedDB を使用した Repository パターンの採用

## スタイリング
- Tailwind CSS 4.1.12 を使用
- PostCSS + Autoprefixer でブラウザ互換性を確保
- ユーティリティファーストのアプローチ