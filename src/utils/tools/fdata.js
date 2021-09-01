
/**
 * 
 * @param {Object} json json对象
 * @returns FormData
 */
export function toFormData(json){
  let fdata = new FormData()
  for (const key in json) {
    fdata.append(key,json[key])
  }
  return fdata
} 