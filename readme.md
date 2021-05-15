# enterキー押下時に次項目へフォーカス移動するjavascript

[テストページ](https://murasuke.github.io/focus-next-onenter/public/index.html)

## フォーカス移動の仕様(手で動かしながら調べたので違っているかも)
1. input, button, select, textarea, aがフォーカス移動可能なelement
1. 上記以外でも、tabindex属性を与えると移動対象となる
1. disabled、見えない項目は移動対象外
1. tabindex(1以上)の順に移動 ⇒ 最大まで行ったらtabindex未指定(or 0,空白)をDOM出現順に移動 ⇒ URL入力欄に移動
1. 同じtabindexが複数ある場合はDOM出現順に移動
1. `tabindex=0`や`tabindex=""`は未指定と同じ扱い
1. tabindexがマイナスの項目には移動しない。
1. tabindexがマイナスの項目にフォーカスがある場合、次項目はDOM出現順に移動可能な項目へ移動
1. Shiftを押下時は逆順に移動
1. ラジオボタンは同じnameを持つ場合、グループ化される。
  * グループがチェックを持つ場合は、そこへフォーカスする。
  * チェックがない場合は、グループの先頭にフォーカスする。
  * 同一グループ内で異なるtabindexを持つ場合
    * チェックがなければ、それぞれのtabindex毎にグループ化されるような動き
    * チェックがあれば、チェックがある箇所のみが移動対象となる


## 仕様
* ~~anchorも移動対象~~ 移動しても、Enterでリンク先に移動してしまうので対象から外す

## 制限事項

* フォーカス前後をロード時に確定(radioボタン以外)するため、動的に追加したelementやdisabledの切替に対応していない
## 参考資料
https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation





## jqueryを使った場合の移動について

セレクタで「:focusable」「:tabbable」があるが、tabindexの順番まで考慮して並べ替えはしてくれない模様。
  ⇒ 画面の項目順に移動する前提であれば使える。

[api-focusable-selector](http://www.w3big.com/ja/jqueryui/api-focusable-selector.html)

[api-tabbable-selector](http://www.w3big.com/ja/jqueryui/api-tabbable-selector.html)