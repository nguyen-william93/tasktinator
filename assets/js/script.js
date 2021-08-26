var formEl = document.querySelector("#task-form"); 
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) { 
  event.preventDefault(); 
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  var isEdit = formEl.hasAttribute("data-task-id");

  if(!taskNameInput || !taskTypeInput){
    formEl.reset();
    alert("You need to fill out the task form!");
    return false;
  }

  if (isEdit){
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput,taskTypeInput,taskId);
  } else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };
    createTaskEl(taskDataObj);
  }
}; 

var completeEditTask = function(taskName, taskType, taskId){
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;
  
  for (var i = 0; i < tasks.length; i++){
    if (tasks[i].id === parseInt(taskId)){
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  };

  saveTasks();

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
};

var createTaskEl = function(taskDataObj){
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  listItemEl.setAttribute("data-task-id", taskIdCounter);
  
  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  
  listItemEl.appendChild(taskInfoEl);
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  
  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);
  saveTasks();
  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);
  taskIdCounter++;

  console.log(taskDataObj);
  console.log(taskDataObj.status);

};

var createTaskActions = function(taskId){
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i = 0; i < statusChoices.length; i++){
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusSelectEl.appendChild(statusOptionEl);
  }

  actionContainerEl.appendChild(statusSelectEl);
  return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var deleteTask = function(taskId){
  var taskSelected = document.querySelector(".task-item[data-task-id ='"+ taskId + "']");
  taskSelected.remove();
  var updatedTaskArr = [];

  for (var i = 0; i < tasks.length; i++){
    if (tasks[i].id != parseInt(taskId)){
      updateTaskArr.push(tasks[i]);
    }
  }
  tasks = updateTaskArr;
  saveTasks();
};

var editTask = function(taskId){
  console.log("edit task # " + taskId);
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  var taskName =  taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
};

var taskButtonHandler = function(event){
  var targetEl = event.target;
  if (targetEl.matches(".edit-btn")){
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  if (event.target.matches(".delete-btn")){
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var taskStatusChangeHandler = function (event){
  var taskId = event.target.getAttribute("data-task-id");
  var statusValue = event.target.value.toLowerCase();
  var taskSelected = document.querySelector(".task-item[data-task-id = '" + taskId + "']");
  if (statusValue === "to do"){
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress"){
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed"){
    tasksCompletedEl.appendChild(taskSelected);
  }
  for (var i = 0; i < tasks.length; i++){
    if (tasks[i].id === parseInt(taskId)){
      tasks[i].status = statusValue;
    }
  }
  saveTasks();
};

var saveTasks = function(){
  localStorage.setItem("tasks", JSON.stringify(tasks));

}

var loadTasks = function(){
  var savedTasks = localStorage.getItem("tasks");
  if (!savedTasks){
    return false;
  }
  savedTasks = JSON.parse(savedTasks);
  for (var i = 0; i < savedTasks.length; i++){
    createTaskEl(savedTasks[i]);
  }
};

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
