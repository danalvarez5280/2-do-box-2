//***********************************************************
//  objects
//***********************************************************
function Idea(title, task)  {
  this.title = title;
  this.task = task;
  this.quality = 'Normal';
  this.id = Date.now();
  this.status = 'idea-card';
}

//********************************************************************************
//   functions
//*********************************************************************************

function prepend(idea)  {
  $('.card-container').prepend(`
    <article class='${idea.status}' id='${idea.id}'>
      <input class='idea-title idea-input' type='text' value='${idea.title}'>
      <button class='delete-btn'></button>
      <textarea cols='30' rows='10' class='idea-task idea-input' type='text' value=''>${idea.task}</textarea>
      <section class='btn-container'>
        <button class='arrow-up'></button>
        <button class='arrow-down'></button>
        <p class='quality'>quality:</p>
        <p class='quality-value'>${idea.quality}</p>
        <button class='completed'>Completed Task</button>
      </section>
      <hr />
    </article>
    `)
}

// enable save button on return
function enableSaveButton13()  {
  var title = $('.input-title').val();
  var task = $('.input-task').val();
  var idea = new Idea(title, task);
    if (title === "" || task === "") {
      $('.save-btn').prop('disabled', true)
  } else {$('.save-btn').prop('disabled', false)
  prepend(idea);
  sliceTodos();
  clearInputFields();
  sendToStorage(idea);
  disableSaveButton();
}
}

function enableSaveButton()  {
  var ideaTitle = $('.input-title').val();
  var ideaBody = $('.input-task').val();
    if (ideaTitle === "" || ideaBody === "") {
      $('.save-btn').prop('disabled', true)
  } else {$('.save-btn').prop('disabled', false)
  }
}

function disableSaveButton() {
  $('.save-btn').prop('disabled', true)
}

function clearInputFields() {
  $('.input-title').val('');
  $('.input-task').val('');
}

function sendToStorage(idea)  {
  localStorage.setItem(idea.id, JSON.stringify(idea));
}

function getFromStorage(id) {
	var parsedIdea = JSON.parse(localStorage.getItem(id))
	return parsedIdea;
}

function showAll(){
  document.reload();
}

function deleteThis(){
  var id = $(this).parent().prop('id');
  localStorage.removeItem(id);
  $(this).parent().remove();
  sliceTodos();
};

function getAllFromLocalStorage(){
  var allItems =[];
  for (var i = 0; i < localStorage.length; i++) {
    allItems.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
  return allItems;
}

function filterList() {
  var filteredList = [];
  var searchText = $('.search-input').val().toUpperCase();
  var fullList = getAllFromLocalStorage();
  filteredList = fullList.filter(function(item){
    console.log(item.task);
    return item.title.toUpperCase().includes(searchText) || item.task.toUpperCase().includes(searchText) || item.quality.toUpperCase().includes(searchText);
  })
  if (filteredList.length > 0) {
    displaySearchResults(filteredList);
  }
}

function displaySearchResults(searchResults) {
  $('.card-container').empty();
  searchResults.forEach(function(item){
    prepend(item);
  })
}

function showCompleted() {
  $('.task-click').show();
}

function hideCompleted() {
  $('.task-click').hide();
}

function sliceTodos() {
  $('.idea-card').slice(10).hide();
}

function sliceAll() {
  $('.idea-card').slice(10).show();
}

function filterBtns(){
  var filteredList = [];
  var searchText = $(this).text();
  console.log(searchText)
  var fullList = getAllFromLocalStorage();
  filteredList = fullList.filter(function(item){
    return item.quality.includes(searchText);
  })
  if (filteredList.length > 0) {
    displaySearchResults(filteredList);
  }
}

//************************************************************
//  event listensers
//************************************************************

$(document).ready(function() {
  var localArray = [];
  var completed = [];
  for (var i = 0; i < localStorage.length; i++) {
    var totalTodos = (JSON.parse(localStorage.getItem(localStorage.key(i))))
    if(totalTodos.status === "idea-card task-click"){
      completed.push(totalTodos)
    }else {localArray.push(totalTodos)};
  }
  var newArray = localArray.concat(completed)
  newArray.forEach(function(value){
    prepend(value)
  })
  sliceTodos();
  hideCompleted();
});

$(document).keypress(function(e) {
  if(e.which == 13) {
    enableSaveButton13();
  }
})

$('.save-btn').on('click', function()  {
  var title = $('.input-title').val();
  var task = $('.input-task').val();
  var idea = new Idea(title, task);
  prepend(idea);
  sliceTodos();
  clearInputFields();
  sendToStorage(idea);
  disableSaveButton();
})

$('.card-container').on('keyup', '.idea-title',  function() {
  var id = $(this).parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id))
  parsedIdea.title = $(this).val()
  localStorage.setItem(id, JSON.stringify(parsedIdea))
})

$('.card-container').on('keyup', '.idea-task',  function() {
  var id = $(this).parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id))
  parsedIdea.task = $(this).val()
  localStorage.setItem(id, JSON.stringify(parsedIdea))
})

$('.card-container').on('click', '.arrow-up',  function() {
  var id = $(this).parent().parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id));
  var currentQuality = parsedIdea.quality;
  var newQuality = {Critical: "Critical", High: "Critical", Normal: "High", Low: "Normal", None: "Low"}
  parsedIdea.quality = newQuality[currentQuality]
  $(this).siblings('.quality-value').text(newQuality[currentQuality])
  localStorage.setItem(id, JSON.stringify(parsedIdea));
});

$('.card-container').on('click', '.arrow-down',  function() {
  var id = $(this).parent().parent().prop('id');
  var parsedIdea = JSON.parse(localStorage.getItem(id));
  var currentQuality = parsedIdea.quality;
  var newQuality = {None: "None", Low: "None", Normal: "Low", High: "Normal", Critical: "High"}
  parsedIdea.quality = newQuality[currentQuality]
  $(this).siblings('.quality-value').text(newQuality[currentQuality])
  localStorage.setItem(id, JSON.stringify(parsedIdea));
});

$('.card-container').on('click', '.completed', function(){
  var card = $(this).closest('.idea-card');
  var id = card.attr('id');
  var grabCard = getFromStorage(id);
  card.toggleClass('task-click')
  var clickedCard = card.attr('class');
  grabCard.status = clickedCard;
  sendToStorage(grabCard);
});

$('.show-Mo').on('click', sliceAll);

$('.all-btn').on('click', showAll);

$('.card-container').on('click', '.delete-btn', deleteThis);

$('.hide-btn').on('click', hideCompleted);

$('.show-btn').on('click', showCompleted);

$('.none-btn').on('click', filterBtns);

$('.low-btn').on('click', filterBtns);

$('.norm-btn').on('click', filterBtns);

$('.high-btn').on('click', filterBtns);

$('.crit-btn').on('click', filterBtns);

$(".search-input").on("keyup", filterList);

$('.input-container').on('keyup', function()  {
  enableSaveButton();
})
