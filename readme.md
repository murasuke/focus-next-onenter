# enterキー押下時に次項目へフォーカス移動するjavascript

1. tabindex(1以上)の順に移動 ⇒ 最大まで行ったらtabindex未指定をDOM出現に移動 ⇒ URL入力欄に移動
1. 同じtabindexが複数ある場合はDOM出現順に移動
1. tabindex=0は未指定と同じ
1. tabindexがマイナスの項目にフォーカスがある場合、次項目はDOM出現順に移動可能な項目へ移動
1. 移動可能：tabindex指定なし、もしくは0以上