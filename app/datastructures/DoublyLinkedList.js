function DoublyLinkedList() {
	this.length = 0;
	this.head = null;
	this.tail = null;
}
function add(data) {
	var node = {
		data : data,
		next : null,
		prev : null
	};
	if (this.length == 0) {
		this.head = node;
		this.tail = node;
	} else {
		this.tail.next = node;
		node.prev = this.tail;
		this.tail = node;
	}
	this.length++;
}

function search(key1,value1,key2,value2){
	var cur = this.head;
	while(cur.next!=null){
	  if( cur.data[key1] == value1 && cur.data[key2] == value2)
		return cur;		
	  cur = cur.next;
	}
	return  -1;
}
DoublyLinkedList.prototype = {		
    add : add,
    search:search
};
module.exports = DoublyLinkedList