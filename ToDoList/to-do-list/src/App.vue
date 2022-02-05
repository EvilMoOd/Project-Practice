<template>
	<div id="root">
		<div class="todo-container">
			<div class="todo-wrap">
				<Top :addTodo="addTodo" />
				<List :todos="todos" :checkTodo="checkTodo" :deleteTodo="deleteTodo" />
				<Last :todos="todos" :checkAllTodo="checkAllTodo" :clearAllTodo="clearAllTodo"/>
			</div>
		</div>
	</div>
</template>

<script>
import Last from "./components/Last.vue";
import List from "./components/List.vue";
import Top from "./components/Top.vue";

export default {
	name: "App",
	components: { Last, List, Top },
	data() {
		return {
			todos:[
				{id:'001',title:'吃饭',done:true},
				{id:'002',title:'喝酒',done:true},
				{id:'003',title:'开车',done:true}
			]
		}
	},
	methods: {
		//添加一个todo
		addTodo(todo){
			this.todos.unshift(todo)
		},
		//勾选or取消勾选一个todo
		checkTodo(id){
			this.todos.forEach((todo) => {
				if(todo.id === id){
				todo.done = !todo.done;
				}
			})
		},
		//删除一个todo
		deleteTodo(id){
			this.todos = this.todos.filter((todo)=>{
				return todo.id !==id
			})
		},
		//多选汇总
		checkAllTodo(done){
			this.todos.forEach((thing) => {
			thing.done = done
			})
		},
		//清空按钮
		clearAllTodo(){
			this.todos = this.todos.filter((thing) => {
				return !thing.done;
			})
		}
	},
};
</script>

<style>
/*base*/
body {
	background: #fff;
}

.btn {
	display: inline-block;
	padding: 4px 12px;
	margin-bottom: 0;
	font-size: 14px;
	line-height: 20px;
	text-align: center;
	vertical-align: middle;
	cursor: pointer;
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
		0 1px 2px rgba(0, 0, 0, 0.05);
	border-radius: 4px;
}

.btn-danger {
	color: #fff;
	background-color: #da4f49;
	border: 1px solid #bd362f;
}

.btn-danger:hover {
	color: #fff;
	background-color: #bd362f;
}

.btn:focus {
	outline: none;
}

.todo-container {
	width: 600px;
	margin: 0 auto;
}
.todo-container .todo-wrap {
	padding: 10px;
	border: 1px solid #ddd;
	border-radius: 5px;
}
</style>
