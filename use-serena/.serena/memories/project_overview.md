# プロジェクト概要

## プロジェクトの目的
- React + TypeScript + Vite のテンプレートをベースにした Todo アプリケーション
- IndexedDB を使用したローカルストレージ機能付きの Todo 管理アプリ
- コンポーネントベースの設計でユーザーが Todo の作成、編集、削除、フィルタリングが可能

## 技術スタック
- **フロントエンド**: React 19.1.1 + TypeScript
- **ビルドツール**: Vite 7.1.2
- **スタイリング**: Tailwind CSS 4.1.12 + PostCSS + Autoprefixer
- **データベース**: IndexedDB (ブラウザ内蔵のローカルデータベース)
- **リンティング**: ESLint 9.33.0 + typescript-eslint
- **開発言語**: TypeScript 5.8.3

## ディレクトリ構造
```
src/
├── components/     # React コンポーネント
│   ├── TodoForm.tsx
│   ├── TodoItem.tsx
│   ├── TodoList.tsx
│   └── TodoFilter.tsx
├── hooks/          # カスタムフック
│   └── useTodos.ts
├── types/          # TypeScript 型定義
│   └── todo.ts
├── db/             # データベース関連
│   ├── config.ts
│   ├── repositories/
│   │   └── todoRepository.ts
│   └── services/
│       └── todoService.ts
├── assets/         # 静的ファイル
└── main.tsx        # アプリケーションのエントリーポイント
```

## コア機能
- Todo の作成、更新、削除
- Todo のフィルタリング（全て、アクティブ、完了）
- 一括操作（全て完了、完了済みクリア）
- データの永続化（IndexedDB）
- リアルタイムでのカウント表示