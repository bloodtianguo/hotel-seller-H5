export function hidetextFun(text) {
  let newtext;
  if(text.length>7){
    newtext=`${text.substring(0,7)}......`
   }else{
    newtext=text
   }
  return newtext
}