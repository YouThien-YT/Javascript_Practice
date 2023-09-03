// forEach, map, find, filter, some,every, reduce

var crouses = [
   {
      title: 'javascript',
      coin: 10
   },
   {
      title: 'php',
      coin: 20
   },
   {
      title: 'python',
      coin: 30
   },
   {
      title: 'c#',
      coin: 40
   }
]

// filter =====================================
Array.prototype.filter2 = function(callback){
   var output = [];
   for(var index in this){
      if(this.hasOwnProperty(index))
      {
         var result= callback(this[index],index,this)
         if(result)
         {
            output.push(this[index])
         }
      }
   }
   return output;

var newCrouses = crouses.filter2(function(crouse,index,arry){
   return crouse.coin < 30 
})
}
// every =====================================

Array.prototype.every2 = function(callback){
   var output = true ;
   for(var index in this)
   {
      if(this.hasOwnProperty(index))
      {
         var result = callback(this[index],index,this);
         if(!result)
         {
            return false;
         }
      };
   };
   return output;
};

var someCrouses = crouses.every2(function(crouse,index,arry){
   return crouse.coin > 0
})

// =======================DeQuy_Loop=======================

function dequy (start,end,callback){
   if(start < end){
      callback(start);
      return dequy(start +1, end, callback)
   }
}
dequy(0,crouses.length,function(index){
   // console.log(crouses[index])
})

// =====================HTML_DOM=========================
  /* 
   + Element :
       1.getElementById --> 1 element
       2.getElementsByClassName --> HTML collection
       3.getElementsByTagName --> HTML collection
       4.querySelector --> 1 element
       5.querySelectorAll

       6. HTML collection

       7. document write
      console.log(document.forms)

   + Attribute :
      getAttribute()

   + Text :
      1. innerText
      2. textContent
      */


var elements = document.querySelector('.classh2');

   // elements.innerText = 'xin chao'

// console.log(elements.innerText)

// ============ innerHTML , outnerHTML ================
var elements = document.querySelectorAll('.classh2');

for(var index in elements){
   if(elements.hasOwnProperty(index)){
      elements[index].innerHTML = '<p>add element 1</p>'
      // console.log(elements[index])
   }
}

// =================== ClassList ======================
var elements = document.querySelector('.classh2');

setInterval(() => {
   // elements.classList.toggle('blue')
}, 1000);

// console.log(elements.textContent)


// ======================= Dom Events ===================

var h1Elements = document.querySelectorAll('h2')

for(var i=0; i < h1Elements.length; i++){
   h1Elements[i].onclick = function(e){
      // console.log(e.target);
   }
}

// ====================== From Validation ===============

// khoi tao ham xac nhan
function validator(option){

   function getParent (element, selector){
      while ( element.parentElement )
      {
         if ( element.parentElement.matches(selector)){
            return element.parentElement;
         }
         element = element.parentElement;
      }
   }

   function thongBaoError (inputElement,rule){
      // var errorElement = ;
      var errorElement = getParent(inputElement, option.formGroupSelector).querySelector(option.errorMessage);
      // var messageError = rule.check(inputElement.value);

      // lấy tất cả các rules của từng select
      var rules = selectorRules[rule.select]

      /* lập qua từng rule trong rules của select và check 
         nếu gặp lỗi là dừng ngay*/
      for( var i = 0; i < rules.length; ++i ){

         switch (inputElement.type){
            case 'radio':
            case 'checkbox':
               messageError = rules[i](
                  formElement.querySelector(rule.select + ':checked')
               );
      
               break;
            default:
               messageError = rules[i](inputElement.value);
         }

         if(messageError){
            break;
         }
      }

      if(messageError){
         errorElement.innerText = messageError;
      }
      else{
       errorElement.innerText = ''
      }
      return !messageError ;
   }
   
// lấy element của form cần validate
  var formElement = document.querySelector(option.form);

  if(formElement) {
      
      var selectorRules = {};
      
      // lăp qua mỗi rule và xữ lý các sự kiện lắng nghe (blur,input,...)
      option.rules.forEach(function(rule){
         
         // lưu lại các rules cho mỗi input 
         if( Array.isArray(selectorRules[rule.select]) ) {
            selectorRules[rule.select].push(rule.check);
         }
         else{
            selectorRules[rule.select] = [rule.check];
         }

         var inputElements = formElement.querySelectorAll(rule.select)

         Array.from(inputElements).forEach( function(inputElement) {
            
            // xu ly khi blur
            inputElement.onblur = function() {
               thongBaoError(inputElement,rule);
            }
            // xu ly khi nhap
            inputElement.oninput = function() {
               var errorElement = getParent(inputElement, option.formGroupSelector).querySelector(option.errorMessage);
               errorElement.innerText = ''
            }
         })
      })

      // khi submit form
      formElement.onsubmit = function(e){
         e.preventDefault();

         var flagErrorForm = true ;

         // lặp qua từng rules và validator
         option.rules.forEach(function(rule){
            var inputElement = formElement.querySelector(rule.select);
            var flagError = thongBaoError(inputElement,rule);

            if (!flagError){
               flagErrorForm = false;
            }
         });

         if (flagErrorForm){

            // truong hop submit voi javasrcipt
            if(typeof option.onsubmit === 'function' ){

               var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
               var formValues = Array.from(enableInputs).reduce(function (values, input) {

                  switch (input.type){
                     case 'radio':
                        values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                        break;
                     case 'checkbox':
                        if( !input.matches(':checked') ) {
                           // values[input.name] = '1';
                           return values;
                        }
                        if( !Array.isArray(values[input.name]) ) {
                           values[input.name] = [];
                        }
                        values[input.name].push(input.value);
                        break;
                     case 'file':
                        values[input.name] = input.files;
                        break;
                     default:
                        values[input.name] = input.value;
                  }

                  return values;
               }, {} );
               option.onsubmit(formValues)
            }
            // truong hop submit voi html mac dinh
            else {
               formElement.submit();
            }
         }
      }

   }
}

// khoi tao cac rules
validator.isRequestName = function(selector,message) {
   return {
      select: selector,
      check: function (value) {
         return value ? undefined : message || 'Vui long nhap name' 
      } 
   };
}

validator.isRequestEmail = function(selector,message) {
   return {
      select: selector,
      check: function (value) {
          var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return regex.test(value) ? undefined : message || 'Trường này phải là email';
      }
  };
}

validator.isRequestPassword = function(selector, min,message) {
   return {
      select: selector,
      check: function (value) {
          return value.length >= min ? undefined : message || `vui long nhap toi thieu ${min} ky tu`;
      }
  };
}

validator.isConfirmPassword = function(selector,getConfirmPassword,message){
   return {
      select: selector,
      check: function(value){
         return value === getConfirmPassword() ? undefined : message || 'Gia tri nhap vao chua chinh xac'
      }
   }
}

// =================================== JSON ================================

//  1. stringify : tu javascript -> json
//  2. parse : tuwf json -> javascript


// ================================= Promise ================================

var promise = new Promise(
   // Executor
   function(resolve, reject){

   }
)