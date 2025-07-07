const Color = {
    RED: 'red',
    BLACK: 'black'
};

class Node {
    constructor(val) {
        this.data = val;
        this.color = Color.RED;
        this.parent = null;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
    }
}

class RedBlackTree {
    constructor() {
        this.TNULL = new Node(0);
        this.TNULL.color = Color.BLACK;
        this.TNULL.left = null;
        this.TNULL.right = null;
        this.TNULL.parent = null;
        this.root = this.TNULL;
    }

    leftRotate(x) {
        let y = x.right;
        x.right = y.left;
        if (y.left !== this.TNULL) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    }

    rightRotate(x) {
        let y = x.left;
        x.left = y.right;
        if (y.right !== this.TNULL) {
            y.right.parent = x;
        }
        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.right) {
            x.parent.right = y;
        } else {
            x.parent.left = y;
        }
        y.right = x;
        x.parent = y;
    }

    fixInsert(k) {
        while (k.parent !== null && k.parent.color === Color.RED) {
            if (k.parent === k.parent.parent.left) {
                let u = k.parent.parent.right;
                if (u !== this.TNULL && u.color === Color.RED) {
                    k.parent.color = Color.BLACK;
                    u.color = Color.BLACK;
                    k.parent.parent.color = Color.RED;
                    k = k.parent.parent;
                } else {
                    if (k === k.parent.right) {
                        k = k.parent;
                        this.leftRotate(k);
                    }
                    k.parent.color = Color.BLACK;
                    k.parent.parent.color = Color.RED;
                    this.rightRotate(k.parent.parent);
                }
            } else {
                let u = k.parent.parent.left;
                if (u !== this.TNULL && u.color === Color.RED) {
                    k.parent.color = Color.BLACK;
                    u.color = Color.BLACK;
                    k.parent.parent.color = Color.RED;
                    k = k.parent.parent;
                } else {
                    if (k === k.parent.left) {
                        k = k.parent;
                        this.rightRotate(k);
                    }
                    k.parent.color = Color.BLACK;
                    k.parent.parent.color = Color.RED;
                    this.leftRotate(k.parent.parent);
                }
            }
        }
        this.root.color = Color.BLACK;
    }

    insert(key) {
        if (this.search(key) !== null) {
            console.log(`El valor ${key} ya existe en el árbol.`);
            return false;
        }

        let node = new Node(key);
        node.left = this.TNULL;
        node.right = this.TNULL;

        let y = null;
        let x = this.root;

        while (x !== this.TNULL) {
            y = x;
            if (node.data < x.data) {
                x = x.left;
            } else {
                x = x.right;
            }
        }

        node.parent = y;
        if (y === null) {
            this.root = node;
        } else if (node.data < y.data) {
            y.left = node;
        } else {
            y.right = node;
        }

        if (node.parent === null) {
            node.color = Color.BLACK;
            return true;
        }

        if (node.parent.parent === null) {
            return true;
        }

        this.fixInsert(node);
        return true;
    }

    minimum(node) {
        while (node.left !== this.TNULL) {
            node = node.left;
        }
        return node;
    }

    rbTransplant(u, v) {
        if (u.parent === null) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        if (v !== this.TNULL) {
            v.parent = u.parent;
        }
    }

    fixDelete(x) {
        while (x !== this.root && x.color === Color.BLACK) {
            if (x === x.parent.left) {
                let s = x.parent.right;
                if (s !== this.TNULL && s.color === Color.RED) {
                    s.color = Color.BLACK;
                    x.parent.color = Color.RED;
                    this.leftRotate(x.parent);
                    s = x.parent.right;
                }

                if ((s.left === this.TNULL || s.left.color === Color.BLACK) &&
                    (s.right === this.TNULL || s.right.color === Color.BLACK)) {
                    s.color = Color.RED;
                    x = x.parent;
                } else {
                    if (s.right === this.TNULL || s.right.color === Color.BLACK) {
                        if (s.left !== this.TNULL) s.left.color = Color.BLACK;
                        s.color = Color.RED;
                        this.rightRotate(s);
                        s = x.parent.right;
                    }
                    s.color = x.parent.color;
                    x.parent.color = Color.BLACK;
                    if (s.right !== this.TNULL) s.right.color = Color.BLACK;
                    this.leftRotate(x.parent);
                    x = this.root;
                }
            } else {
                let s = x.parent.left;
                if (s !== this.TNULL && s.color === Color.RED) {
                    s.color = Color.BLACK;
                    x.parent.color = Color.RED;
                    this.rightRotate(x.parent);
                    s = x.parent.left;
                }

                if ((s.right === this.TNULL || s.right.color === Color.BLACK) &&
                    (s.left === this.TNULL || s.left.color === Color.BLACK)) {
                    s.color = Color.RED;
                    x = x.parent;
                } else {
                    if (s.left === this.TNULL || s.left.color === Color.BLACK) {
                        if (s.right !== this.TNULL) s.right.color = Color.BLACK;
                        s.color = Color.RED;
                        this.leftRotate(s);
                        s = x.parent.left;
                    }
                    s.color = x.parent.color;
                    x.parent.color = Color.BLACK;
                    if (s.left !== this.TNULL) s.left.color = Color.BLACK;
                    this.rightRotate(x.parent);
                    x = this.root;
                }
            }
        }
        if (x !== this.TNULL) {
            x.color = Color.BLACK;
        }
    }

    deleteNode(data) {
        let z = this.TNULL;
        let temp = this.root;
        while (temp !== this.TNULL) {
            if (temp.data === data) {
                z = temp;
            }
            if (temp.data <= data) {
                temp = temp.right;
            } else {
                temp = temp.left;
            }
        }

        if (z === this.TNULL) {
            console.log(`El nodo ${data} no se encontró en el árbol.`);
            return false;
        }

        let x;
        let y = z;
        let yOriginalColor = y.color;

        if (z.left === this.TNULL) {
            x = z.right;
            this.rbTransplant(z, z.right);
        } else if (z.right === this.TNULL) {
            x = z.left;
            this.rbTransplant(z, z.left);
        } else {
            y = this.minimum(z.right);
            yOriginalColor = y.color;
            x = y.right;
            if (y.parent === z) {
                if (x !== this.TNULL) {
                    x.parent = y;
                }
            } else {
                this.rbTransplant(y, y.right);
                y.right = z.right;
                y.right.parent = y;
            }

            this.rbTransplant(z, y);
            y.left = z.left;
            y.left.parent = y;
            y.color = z.color;
        }
        z = null;

        if (yOriginalColor === Color.BLACK) {
            if (x !== this.TNULL) {
                this.fixDelete(x);
            } else if (this.root === this.TNULL) {
            } else if (x.parent === null && x === this.root) {
            }
        }
        return true;
    }

    search(key) {
        let temp = this.root;
        while (temp !== this.TNULL && key !== temp.data) {
            if (key < temp.data) {
                temp = temp.left;
            } else {
                temp = temp.right;
            }
        }
        return temp === this.TNULL ? null : temp;
    }

    getTreeContainer() {
        return document.getElementById('treeContainer');
    }

    clearTreeDisplay() {
        const container = this.getTreeContainer();
        container.innerHTML = '';
    }

    drawNode(node) {
        if (node === this.TNULL) return;

        const container = this.getTreeContainer();
        const nodeDiv = document.createElement('div');
        nodeDiv.classList.add('node', node.color);
        nodeDiv.textContent = node.data;
        nodeDiv.style.left = `${node.x}px`;
        nodeDiv.style.top = `${node.y}px`;
        nodeDiv.id = `node-${node.data}`;
        container.appendChild(nodeDiv);
    }

    drawLine(parentX, parentY, childX, childY) {
        const container = this.getTreeContainer();
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('line');

        const dx = childX - parentX;
        const dy = childY - parentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        lineDiv.style.width = `${distance}px`;
        lineDiv.style.transform = `rotate(${angle}deg)`;
        lineDiv.style.left = `${parentX}px`;
        lineDiv.style.top = `${parentY}px`;
        container.appendChild(lineDiv);
    }

    calculateNodePositions(node, x, y, level, offsetX = 0) {
        if (node === this.TNULL) return;

        const horizontalSpacing = 100 * Math.pow(0.8, level);
        const verticalSpacing = 70;

        node.x = x;
        node.y = y;

        if (node.left !== this.TNULL) {
            this.calculateNodePositions(node.left, x - horizontalSpacing, y + verticalSpacing, level + 1);
        }
        if (node.right !== this.TNULL) {
            this.calculateNodePositions(node.right, x + horizontalSpacing, y + verticalSpacing, level + 1);
        }
    }

    drawTree(highlightNode = null) {
        this.clearTreeDisplay();

        if (this.root === this.TNULL) {
            const container = this.getTreeContainer();
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'El árbol está vacío.';
            emptyMessage.style.textAlign = 'center';
            container.appendChild(emptyMessage);
            return;
        }

        const containerWidth = this.getTreeContainer().clientWidth;
        const startX = containerWidth / 2;
        const startY = 50;

        this.calculateNodePositions(this.root, startX, startY, 0);

        const nodesToDraw = [];
        const linesToDraw = [];

        const traverseAndCollect = (node) => {
            if (node === this.TNULL) return;

            nodesToDraw.push(node);

            if (node.left !== this.TNULL) {
                const parentCenterX = node.x + 20;
                const parentCenterY = node.y + 20;
                const childCenterX = node.left.x + 20;
                const childCenterY = node.left.y + 20;
                linesToDraw.push({ pX: parentCenterX, pY: parentCenterY, cX: childCenterX, cY: childCenterY });
                traverseAndCollect(node.left);
            }
            if (node.right !== this.TNULL) {
                const parentCenterX = node.x + 20;
                const parentCenterY = node.y + 20;
                const childCenterX = node.right.x + 20;
                const childCenterY = node.right.y + 20;
                linesToDraw.push({ pX: parentCenterX, pY: parentCenterY, cX: childCenterX, cY: childCenterY });
                traverseAndCollect(node.right);
            }
        };

        traverseAndCollect(this.root);

        linesToDraw.forEach(line => {
            this.drawLine(line.pX, line.pY, line.cX, line.cY);
        });

        nodesToDraw.forEach(node => {
            this.drawNode(node);
            if (highlightNode && node.data === highlightNode.data && node.color === highlightNode.color) {
                 document.getElementById(`node-${node.data}`).classList.add('highlight');
            }
        });
    }
}

const rbt = new RedBlackTree();

document.addEventListener('DOMContentLoaded', () => {
    const nodeValueInput = document.getElementById('nodeValue');
    const insertBtn = document.getElementById('insertBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const searchBtn = document.getElementById('searchBtn');

    rbt.drawTree();

    insertBtn.addEventListener('click', () => {
        const value = parseInt(nodeValueInput.value);
        if (!isNaN(value)) {
            const inserted = rbt.insert(value);
            if (inserted) {
                rbt.drawTree();
                nodeValueInput.value = '';
            } else {
                alert(`El número ${value} ya existe en el árbol.`);
            }
        } else {
            alert('Por favor, introduce un número válido para insertar.');
        }
    });

    deleteBtn.addEventListener('click', () => {
        const value = parseInt(nodeValueInput.value);
        if (!isNaN(value)) {
            const deleted = rbt.deleteNode(value);
            if (deleted) {
                rbt.drawTree();
            }
            nodeValueInput.value = '';
        } else {
            alert('Por favor, introduce un número válido para eliminar.');
        }
    });

    searchBtn.addEventListener('click', () => {
        const value = parseInt(nodeValueInput.value);
        if (!isNaN(value)) {
            const foundNode = rbt.search(value);
            rbt.drawTree(foundNode);
            if (foundNode) {
                console.log(`Nodo ${value} encontrado.`);
            } else {
                console.log(`Nodo ${value} no encontrado.`);
                alert(`El nodo ${value} no se encontró en el árbol.`);
            }
        } else {
            alert('Por favor, introduce un número válido para buscar.');
        }
    });
});