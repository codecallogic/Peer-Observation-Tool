function checkValue(str, max){
  if (str.charAt(0) !== '0' || str == '00') {
    var num = parseInt(str);
    if (isNaN(num) || num <= 0 || num > max) num = 1;
    str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString();
  };
  return str;
}

const validateDate = (e, key, caseType, reduxMethod) => {
  let name = document.getElementById(key)
  let input = e.target.value
  
  name.onkeydown = function(event){
    if(event.keyCode == 8){
      if(input.length == 1){
        name.classList.remove("red")
        return ''
      }
      return input.substr(0, input.length - 1)
    }
  }
  
  if (/\d/.test(input.substr(input.length - 1, input.length)) == false) return input.substr(0, input.length - 1);

  let values = input.split('')
  
  if (values[0]) values[0] = checkValue(values[0], 12);
  if (values[1]) values[1] = checkValue(values[1], 31);

  let output = []
  
  values.map(function(v, i) {
    let item = v

    if(i == 1 ){
      output.push(item)
      return output.push('/')
    }

    if(i == 4 ){
      output.push(item)
      return output.push('/')
    }

    if(v !== '/') return output.push(item)

  });
  
  input = output.join('').substr(0, 10);

  let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/

  if(!date_regex.test(input)){
    name.classList.add('red');
    if(input == '') name.classList.remove("red")
    return input
  }

  if(date_regex.test(input)){
    name.classList.remove("red")
    return input
  }
}

const validateNumber = (type) => {

  const input = document.getElementById(type)
  
  const regex = /[^0-9|\n\r]/g

  input.value = input.value.split(regex).join('')

}

export {
  validateDate,
  validateNumber
}