# enterキー押下時に次項目へフォーカス移動するjavascript

[テストページ](https://murasuke.github.io/focus-next-onenter/public/index.html)

1. tabindex(1以上)の順に移動 ⇒ 最大まで行ったらtabindex未指定をDOM出現に移動 ⇒ URL入力欄に移動
1. 同じtabindexが複数ある場合はDOM出現順に移動
1. `tabindex=0`や`tabindex=""`は未指定と同じ
1. tabindexがマイナスの項目にフォーカスがある場合、次項目はDOM出現順に移動可能な項目へ移動
1. 移動可能：tabindex指定なし、もしくは0以上

## 他考慮する事柄
* 通常移動できないelementでも、tabindex属性を与えると移動できるようになる。
  * 値が空の場合や、マイナスの場合は？
* ~~anchorも移動対象~~ 移動しても、Enterでリンク先に移動してしまうので対象から外す


## 参考資料
https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation

* jqueryのタブ移動関連セレクタ

[api-focusable-selector](http://www.w3big.com/ja/jqueryui/api-focusable-selector.html)

[api-tabbable-selector](http://www.w3big.com/ja/jqueryui/api-tabbable-selector.html)

## jqueryを使った場合の移動について

セレクタで「:focusable」「:tabbable」があるが、tabindexの順番まで考慮して並べ替えはしてくれない模様。

  ⇒ 画面の項目順に移動する前提であれば使える。
