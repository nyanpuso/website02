# スライド用画像フォルダ

このフォルダにスライドで使用する画像をアップロードしてください。

## 必要な画像ファイル

各スライドに対応する以下のファイルを配置してください：

| ファイル名 | 説明 | サイズ推奨 |
|----------|------|---------|
| event-spring.jpg | 春の大セール（イベント） | 400×300px以上 |
| shop-a-menu.jpg | サンプル店舗A（おすすめメニュー） | 400×300px以上 |
| shop-b-event.jpg | サンプル店舗B（イベント情報） | 400×300px以上 |
| recruitment.jpg | 出店者募集情報 | 400×300px以上 |

## 画像ファイル形式

- JPG / PNG / WebP
- アスペクト比：4:3推奨

## app.jsでのスライド設定

[js/app.js](../js/app.js) の `slidesData` 配列内で、各画像のパスを指定しています。

新しいスライドを追加する場合：
1. 画像を `/slides/` フォルダに配置
2. `slidesData` に新しいオブジェクトを追加
3. `image` プロパティにファイルパスを指定

## サンプル設定

```javascript
{
    id: 'slide-1',
    title: 'イベント名',
    subtitle: 'サブタイトル',
    image: 'slides/your-image.jpg',
    description: '説明テキスト',
    type: 'event', // 'event' | 'shop' | 'recruitment'
    shopId: 'shop-a', // type: 'shop' の場合のみ必要
}
```
