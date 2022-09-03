const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')
const dateSelector = document.querySelectorAll('li.day')
const monthSelector = document.querySelectorAll('.months li a')


Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

Array.from(dateSelector).forEach((el)=>{
    el.addEventListener('click', selectDay)
})

Array.from(monthSelector).forEach((el)=>{
    el.addEventListener('click', selectMonth)
})

addEventListener('DOMContentLoaded', setTodaysDate())


function setTodaysDate(){
    const days = document.getElementById('days').children
    const months = document.getElementById('months').children
    var today = new Date()
    var dd = String(today.getDate());
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const monthsKey ={
        '01' :'Jan',
        '02' :'Feb',
        '03' :'Mar',
        '04' :'Apr',
        '05' :'May',
        '06' :'Jun',
        '07' :'Jul',
        '08' :'Aug',
        '09' :'Sep',
        '10' :'Oct',
        '11' :'Nov',
        '12' :'Dec' 
   }
   //selects this month as default on load
    for(let i = 0; i<months.length; i++){
        if(months[i].firstChild.getAttribute('title') == monthsKey[mm]){             
              months[i].firstChild.classList.add('selected')
          }
      }

    //selects todays date as the default on load
    for(let i = 1; i<days.length-1; i++){
      if(days[i].firstChild.getAttribute('title') == dd){             
            days[i].firstChild.classList.add('selected')
        }
    }
    const skipDays = {
        Jan: 5,
        Feb: 1,
        Mar: 1,
        Apr: 4,
        May: 6,
        Jun: 2,
        Jul: 4,
        Aug: 0,
        Sep: 3,
        Oct: 5,
        Nov: 1,
        Dec: 3
    }
    const ul = document.getElementById('days')
    const li = document.createElement('li')
    const anchor = document.createElement('a')
    
    for(let i = 0; i < skipDays[monthsKey[mm]]; i++){   
        li.classList.add('blank') 
        ul.insertBefore(li.cloneNode(true), ul.firstChild).appendChild(anchor.cloneNode(true)).appendChild(document.createTextNode(''))
        
    }
}

//selects the day that has been clicked on
function selectDay(){
    const days = document.getElementById('days').childNodes
    for(let i = 1; i<days.length-1; i++){
      if(days[i].firstChild){      
      days[i].firstChild.classList.remove('selected')}    
    }
    const selectedDay = this.firstChild.getAttribute('data-value')
    this.firstChild.className = 'selected'
}

function selectMonth(){
    //selects the clicked month
    const months = document.getElementById('months').childNodes
    for(let i = 0; i<months.length; i++){
        if(months[i].firstChild){
        months[i].firstChild.classList.remove('selected')
        }
    }
    const selectedMonth = this.getAttribute('title')
    this.className= 'selected'
    //put the correct number of days for the selected month
    function numOfDays(){
        const daysEachMonth = {
            Jan: 31,
            Feb: 28,
            Mar: 31,
            Apr: 30,
            May: 31,
            Jun: 30,
            Jul: 31,
            Aug: 31,
            Sep: 30,
            Oct: 31,
            Nov: 30,
            Dec: 31
        }


    const numOfDaysThisMonth = daysEachMonth[selectedMonth]
    const numOfDaysPrevMonth = Array.from(document.getElementsByClassName('day')).length  
    const daysToChange = numOfDaysThisMonth - numOfDaysPrevMonth
    let dateCounter = numOfDaysPrevMonth + 1
    const ul = document.getElementById('days')
    const li = document.createElement('li')
    const anchor = document.createElement('a')

    if (daysToChange > 0){
        for(let i = 0; i< daysToChange; i++){
            li.classList.add('day')   
            anchor.setAttribute('href', '#')
            anchor.setAttribute('title', dateCounter)
            anchor.setAttribute('data-value', dateCounter) 
            ul.appendChild(li.cloneNode(true)).appendChild(anchor.cloneNode(true)).appendChild(document.createTextNode(dateCounter))
            dateCounter++
        }
    }
    if(daysToChange < 0){
        for(let i = 0; i>daysToChange; i--){
        ul.removeChild(ul.lastChild)
        }
    }
}
    //starts the month on the correct day of the week
    function firstDayOfTheMonth(){
        const skipDays = {
            Jan: 5,
            Feb: 1,
            Mar: 1,
            Apr: 4,
            May: 6,
            Jun: 2,
            Jul: 4,
            Aug: 0,
            Sep: 3,
            Oct: 5,
            Nov: 1,
            Dec: 3
        }


        //removes previous blank spaces
        const blanks = document.getElementsByClassName('blank')
         while(blanks.length > 0){
             blanks[0].parentNode.removeChild(blanks[0])
        }
        //adds new blank spaces
        const ul = document.getElementById('days')
        const li = document.createElement('li')
        const anchor = document.createElement('a')
        for(let i = 0; i < skipDays[selectedMonth]; i++){   
            li.classList.add('blank') 
            ul.insertBefore(li.cloneNode(true), ul.firstChild ).appendChild(anchor.cloneNode(true)).appendChild(document.createTextNode(''))
            
        }
        
    }       
firstDayOfTheMonth()
numOfDays()
}

async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

