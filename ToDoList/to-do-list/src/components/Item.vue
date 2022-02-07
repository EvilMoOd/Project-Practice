<template>
	<transition name="todo" appear>
		<li>
		<label>
			<input
				type="checkbox"
				:checked="thing.done"
				@change="handleCheck(thing.id)"
			/>
			<!-- <input type="checkbox" v-model="thing.done"/> -->
			<span v-show="!thing.isEdit">{{ thing.title }}</span>
			<input v-show="thing.isEdit" type="text" :value="thing.title" @blur="handleBlur(thing,$event)" ref="inputTitle">
		</label>
		<button class="btn btn-danger" @click="handleDelete(thing.id)">删除</button>
		<button v-show="!thing.isEdit" class="btn btn-edit" @click="handleEdit(thing)">编辑</button>
	</li>
	</transition>
</template>

<script>
export default {
	name: "Item",
	//声明接收thing对象
	props: ["thing"],
	methods: {
		//勾选or取消勾选
		handleCheck(id) {
			// this.checkTodo(id);
			this.$bus.$emit("checkTodo", id);
		},
		//删除
		handleDelete(id) {
			// this.deleteTodo(id)
			this.$bus.$emit("deleteTodo", id);
		},
		handleEdit(thing){
			// thing.isEdit = true 直接添加到对象上无法加载到data中进行数据代理
			if(thing.hasOwnProperty.call(thing,'isEdit')){
				thing.isEdit = true
			}else{
				this.$set(thing,'isEdit',true)
			}
			//下面因vue执行顺序问题，导致模板还没刷新就执行focus，无法聚焦
			// this.$ref.inputTitle.focus()
			this.$nextTick(function(){
				this.$refs.inputTitle.focus()
			}) 
		},
		handleBlur(thing,e){
			thing.isEdit = false
			this.$bus.$emit('updateTodo',thing.id,e.target.value)
		}
	},
};
</script>

<style scoped>
/*item*/
li {
	list-style: none;
	height: 36px;
	line-height: 36px;
	padding: 0 5px;
	border-bottom: 1px solid #ddd;
}

li label {
	float: left;
	cursor: pointer;
}

li label li input {
	vertical-align: middle;
	margin-right: 6px;
	position: relative;
	top: -1px;
}

li button {
	float: right;
	display: none;
	margin-top: 3px;
}

li:before {
	content: initial;
}

li:last-child {
	border-bottom: none;
}
li:hover {
	background-color: #ccc;
}
li:hover button {
	display: block;
}

.todo-enter-active{
	animation:ac 0.5s linear;
}
.todo-leave-active{
	animation:ac 0.8s linear reverse;
}
@keyframes ac {
	from{transform: translateX(100%);}
	to{transform: translate(0px);}
}
	
</style>
