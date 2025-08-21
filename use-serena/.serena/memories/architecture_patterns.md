# アーキテクチャとデザインパターン

## 全体アーキテクチャ
- **MVC 風の分離**: View（Components）、Model（DB Layer）、Controller（Hooks）
- **Repository パターン**: データアクセス層の抽象化
- **Service Layer**: ビジネスロジックの分離

## ファイル構成パターン

### コンポーネント設計
- `src/components/`: UI コンポーネント
- 単一責任の原則に従った小さなコンポーネント
- Props による状態管理と機能の注入

### データ管理層
- `src/db/config.ts`: DatabaseManager クラスでIndexedDB管理
- `src/db/repositories/`: データアクセス層
- `src/db/services/`: ビジネスロジック層

### 状態管理
- `src/hooks/useTodos.ts`: カスタムフックによる状態管理
- React の useState, useEffect を活用
- 非同期データ操作の管理

### 型定義
- `src/types/todo.ts`: Todo 関連の型定義
- インターフェース駆動の開発
- TypeScript の型安全性を活用

## 設計原則
- **関心の分離**: UI、ビジネスロジック、データアクセスを分離
- **依存性注入**: Props や Context を通じた依存関係の管理
- **型安全性**: TypeScript を活用した型駆動開発
- **再利用性**: 小さく再利用可能なコンポーネント設計