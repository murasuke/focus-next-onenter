/**
 * # Enterキー押下で次項目へ移動する。
 * 
 * ## 実装方法
 *  1. フォーカス移動可能なelementをquerySelectorAll()で取得する
 *  2. tabindex順にソートする
 *  3. それぞれのelementに対してkeypressイベントを追加する
 *  4. enterキーが押された場合は、elementの次のelementにフォーカスをセットする
 * 
 * ## radioボタンについて
 *   checkedの状態によって次に移動する先が変わるため、初期状態で次を決めることができない。
 * ・radioボタンのtabindexが混在している場合
 *   ・グループ内でチェックがない場合、tabindexが同じもの同士をグループ化して先頭(移動方向から先に見つかった)へ移動
 *    ・グループ(同一name,tabindex)はスキップ、次へ移動
 *   ・グループ内でチェックがある場合は、チェックのあるラジオボタンへ移動(チェックのあるラジオボタンのtabindex順)
 *    ・グループ(同一name,tabindex)はスキップして、次へ移動
 * 
 * ### やり方
 *  * 移動先がcheckboxの場合
 *    * 移動先グループ(同一name,tabindex)を取得
 *      移動元がグループ内に存在する場合は、ラジオボタンの次のelementへ移動
 *      グループ内にcheckedが存在する場合
 *      * 移動先のtabindexと、checkedのtabindexが同じならcheckedへフォーカスをセット
 *        移動先のtabindexと、checkedのtabindexが異なる場合は、checkboxを飛ばして次のelementへ移動
 *      それ以外の場合
 *        グループの先頭(shift押下時は最後)へ移動
 * 
 * @param {Node} root Enterキー押下で対象とするルート。省略時はdocument(全体を対象とする)
 */
export const focusNextElementOnEnter = (root) => {
  const rootNode = root?? document;
  // フォーカス可能なElementと、tabindex属性があるElementを一括で取得する
  //  (tabindexがあると、フォーカスを持つことができるため対象とする)
  const domOrderArray = [...(rootNode??document).querySelectorAll(`
    input:enabled[type]:not([type=\"hidden\"]):not([hidden]),
    select:enabled:not([hidden]),
    button:enabled[type=\"submit\"]:not([hidden]),
    textarea:enabled:not([hidden]),
    [tabindex]:enabled:not([hidden])
  `)];

  // tabIndex順にソート(sortは破壊的メソッドのためspread構文でコピーする)
  const tabSortedArray = [...domOrderArray].sort((a,b) => {
    if(a.tabIndex && b.tabIndex) {
      return a.tabIndex - b.tabIndex; 
    } else if(a.tabIndex && !b.tabIndex) {
      return -1;
    } else if(!a.tabIndex && b.tabIndex) {
      return 1;
    }
    return 0;
  });

  const keypressHandler = ({ prevNode, node, nextNode, array }) => {
    node.addEventListener('keypress', keyEvent => {
      // Only continue if event.key was "Enter"
      if (keyEvent.key !== "Enter") return;

      let nextTarget = keyEvent.shiftKey ? prevNode : nextNode;           

      
      const getNextElement = (next) => {
        if (next.type === 'radio') {
          // 移動先グループ(同一name,tabindex)を取得
          const radioList = [...rootNode.querySelectorAll(`
            input:enabled[type="radio"][name="${next.name}"][tabindex="${next.tabIndex}"]`
          )];
          
          const radioGrpIndex = radioList.findIndex(item => item === keyEvent.target);
          const checkedInSameTabindex = radioList.find( item => item.checked);
          const checkedInSameName = ([...rootNode.querySelectorAll(`input:enabled[type="radio"][name="${next.name}"]:checked`)].length > 0);

          const getNextElemSub = () => {
            const currentIndex = array.findIndex(item => item === keyEvent.target);
            if (!keyEvent.shiftKey) {
              const filterList = array.slice(currentIndex).filter( item => radioList.findIndex( radio => item === radio) < 0);
              return getNextElement(filterList[0]);
            } else {
              const filterList = array.slice(0, currentIndex).filter( item => radioList.findIndex( radio => item === radio) < 0);
              return getNextElement(filterList.slice(-1)[0]);
            }
          }

          if (radioGrpIndex >= 0) {
            // 移動元がグループ内に存在する場合は、ラジオボタンの次のelementへ移動
            return getNextElemSub();                  
          } else if (checkedInSameTabindex) {
            // 移動先のtabindexと、checkedのtabindexが同じならcheckedへフォーカスをセット
            return checkedInSameTabindex;
          } else if(checkedInSameName) {                 
            // 移動先のtabindexと、checkedのtabindexが異なる場合は、checkboxを飛ばして次のelementへ移動
            return getNextElemSub();              
          }
        }
        return next;
      }

      if (nextTarget.type === 'radio') {
        nextTarget = getNextElement(nextTarget);
      }

      if (!nextTarget) return;
      // submit抑制
      keyEvent.preventDefault();
      // フォーカス可能なelementが入れ子になっている場合、keypressを複数回実行しないようにするため
      keyEvent.stopPropagation();

      // フォーカスセット
      nextTarget.focus();

      // 文字列を選択
      if (typeof nextTarget.select === 'function') nextTarget.select();
    });
  };

  const positiveveArray = [...tabSortedArray].filter( item => item.tabIndex >= 0);
  const negativeArray = [...tabSortedArray].filter( item => item.tabIndex < 0);

  positiveveArray.forEach( (node, i, array) => keypressHandler({
      prevNode: array[i - 1] ?? array.slice(-1)[0],
      node,
      nextNode: array[i + 1] ?? array[0],
      array,
    })
  );

  negativeArray.forEach((node, i, array) => keypressHandler({
      prevNode: domOrderArray[domOrderArray.findIndex(e => e === node) - 1] ?? positiveveArray.slice(-1)[0],
      node,
      nextNode: domOrderArray[domOrderArray.findIndex(e => e === node) + 1] ?? positiveveArray[0],
      array,
    })
  );
};


