type NodeType = {
  value: string | null;
  next: NodeType | null;
};

type CLLType = {
  head: NodeType | null;
  addValue: (value: NodeType["value"]) => void;
};

class CLLNode implements NodeType {
  value: string | null;
  next: NodeType | null;

  constructor(value: string | null = null, next: NodeType | null = null) {
    this.value = value;
    this.next = next;
  }
}

class CLL implements CLLType {
  head: NodeType | null;
  constructor() {
    this.head = null;
  }

  addValue(value: NodeType["value"]) {
    let newNode = new CLLNode(value);
    newNode.next = this.head;
    let prevHead = this.head;
    this.head = newNode;

    let cur: NodeType | null = this.head;

    while (cur.next && cur.next != prevHead) {
      cur = cur.next;
    }

    cur.next = this.head;
  }
}

export default CLL;
