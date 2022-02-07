<template>
	<div id="root">
		<div class="todo-container">
			<div class="todo-wrap">
				<Top @addTodo="addTodo" />
				<List :todos="todos" />
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
			todos:JSON.parse(localStorage.getItem('todos'))||[]
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
		//更新一个Todo
		updateTodo(id,title){
			this.todos.forEach((todo) => {
				if(todo.id === id){
				todo.title = title;
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
	watch:{
		todos:{
			deep:true,
			handler(value){
				localStorage.setItem('todos',JSON.stringify(value))
			}
		}
	},
	mounted() {
		this.$bus.$on('checkTodo',this.checkTodo)
		this.$bus.$on('deleteTodo',this.deleteTodo)
		this.$bus.$on('updateTodo',this.updateTodo)
	},
	beforeDestroy() {
		this.$bus.$off('checkTodo')
		this.$bus.$off('deleteTodo')
		this.$bus.$off('updateTodo')
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

.btn-edit {
	color: #fff;
	background-color: orange;
	border: 1px solid rgb(209, 147, 30);
	margin-right: 5px;
}

.btn-danger:hover {
	color: #fff;
	background-color: #bd362f;
}

.btn-edit:hover {
	color: #fff;
	background-color: rgb(209, 147, 30);
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
