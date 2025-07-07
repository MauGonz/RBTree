#include <iostream>
using namespace std;

// Definicion de colores
const int RED = 0;
const int BLACK = 1;

// Estructura para un nodo
struct Node{
    int data;
    int color;
    Node *parent;
    Node *left;
    Node *right;

    // Constructor
    Node(int val) : data(val), color(RED), parent(nullptr), left(nullptr), right(nullptr) {}
};

class RedBlackTree{
private:
    Node *root;
    Node *TNULL; // Nodo nulo para simplificar operaciones y representar hojas negras

    // Corrige las propiedades del arbol despues de una insercion.
    void fixInsert(Node *k){
        while (k->parent != nullptr && k->parent->color == RED){
            if (k->parent == k->parent->parent->left){
                Node *u = k->parent->parent->right; // Tio del nodo actual
                if (u != nullptr && u->color == RED){
                    // Caso 1: Tio es rojo
                    k->parent->color = BLACK;
                    u->color = BLACK;
                    k->parent->parent->color = RED;
                    k = k->parent->parent;
                } 
                else {
                    // Caso 2: Tio es negro y el nodo es un hijo derecho
                    if (k == k->parent->right){
                        k = k->parent;
                        leftRotate(k);
                    }
                    // Caso 3: Tio es negro y el nodo es un hijo izquierdo
                    k->parent->color = BLACK;
                    k->parent->parent->color = RED;
                    rightRotate(k->parent->parent);
                }
            } 
            else { // Simetrico para cuando el padre es el hijo derecho del abuelo
                Node *u = k->parent->parent->left; // Tio del nodo actual
                if (u != nullptr && u->color == RED){
                    // Caso 1: Tio es rojo
                    k->parent->color = BLACK;
                    u->color = BLACK;
                    k->parent->parent->color = RED;
                    k = k->parent->parent;
                } 
                else {
                    // Caso 2: Tio es negro y el nodo es un hijo izquierdo
                    if (k == k->parent->left){
                        k = k->parent;
                        rightRotate(k);
                    }
                    // Caso 3: Tio es negro y el nodo es un hijo derecho
                    k->parent->color = BLACK;
                    k->parent->parent->color = RED;
                    leftRotate(k->parent->parent);
                }
            }
        }
        root->color = BLACK; // La raiz siempre debe ser negra
    }

    // Corrige las propiedades del arbol despues de una eliminacion.
    void fixDelete(Node *x){
        while (x != root && x->color == BLACK){
            if (x == x->parent->left){
                Node *s = x->parent->right; // Hermano del nodo x
                if (s != nullptr && s->color == RED){
                    // Caso 1: Hermano es rojo
                    s->color = BLACK;
                    x->parent->color = RED;
                    leftRotate(x->parent);
                    s = x->parent->right;
                }

                if ((s->left == nullptr || s->left->color == BLACK) && (s->right == nullptr || s->right->color == BLACK)){
                    // Caso 2: Hermano es negro y sus hijos son negros
                    s->color = RED;
                    x = x->parent;
                } 
                else {
                    if (s->right == nullptr || s->right->color == BLACK){
                        // Caso 3: Hermano es negro, hijo izquierdo es rojo, hijo derecho es negro
                        if (s->left != nullptr) s->left->color = BLACK;
                        s->color = RED;
                        rightRotate(s);
                        s = x->parent->right;
                    }
                    // Caso 4: Hermano es negro, hijo derecho es rojo
                    s->color = x->parent->color;
                    x->parent->color = BLACK;
                    if (s->right != nullptr) s->right->color = BLACK;
                    leftRotate(x->parent);
                    x = root; // Para salir del bucle
                }
            } 
            else { // Simetrico para cuando x es el hijo derecho
                Node *s = x->parent->left; // Hermano del nodo x
                if (s != nullptr && s->color == RED){
                    // Caso 1: Hermano es rojo
                    s->color = BLACK;
                    x->parent->color = RED;
                    rightRotate(x->parent);
                    s = x->parent->left;
                }

                if ((s->right == nullptr || s->right->color == BLACK) && (s->left == nullptr || s->left->color == BLACK)){
                    // Caso 2: Hermano es negro y sus hijos son negros
                    s->color = RED;
                    x = x->parent;
                } 
                else {
                    if (s->left == nullptr || s->left->color == BLACK){
                        // Caso 3: Hermano es negro, hijo derecho es rojo, hijo izquierdo es negro
                        if (s->right != nullptr) s->right->color = BLACK;
                        s->color = RED;
                        leftRotate(s);
                        s = x->parent->left;
                    }
                    // Caso 4: Hermano es negro, hijo izquierdo es rojo
                    s->color = x->parent->color;
                    x->parent->color = BLACK;
                    if (s->left != nullptr) s->left->color = BLACK;
                    rightRotate(x->parent);
                    x = root; // Para salir del bucle
                }
            }
        }
        if (x != nullptr){ // Verifica que x no sea nullptr
            x->color = BLACK; // El nodo que reemplazo al eliminado siempre se vuelve negro
        }
    }

    // Encuentra el nodo con el valor minimo en el subarbol dado.
    Node *minimum(Node *node){
        while (node->left != TNULL){
            node = node->left;
        }
        return node;
    }

    // Reemplaza el subarbol en 'u' con el subarbol en 'v'
    void rbTransplant(Node *u, Node *v){
        if (u->parent == nullptr){
            root = v;
        } 
        else if (u == u->parent->left){
            u->parent->left = v;
        } 
        else {
            u->parent->right = v;
        }
        if (v != nullptr){ // Verifica que v no sea nullptr
            v->parent = u->parent;
        }
    }

    // Realiza un recorrido inorder del arbol y lo imprime
    void inorderHelper(Node *node){
        if (node != TNULL) {
            inorderHelper(node->left);
            cout << node->data << (node->color == RED ? "(R)" : "(B)") << " ";
            inorderHelper(node->right);
        }
    }

    // Libera la memoria de los nodos recursivamente
    void destroyTree(Node *node){
        if (node != TNULL){
            destroyTree(node->left);
            destroyTree(node->right);
            delete node;
        }
    }

public:
    // Constructor
    RedBlackTree(){
        TNULL = new Node(0); // El nodo nulo es siempre negro
        TNULL->color = BLACK;
        root = TNULL;
    }

    // Destructor
    ~RedBlackTree(){
        destroyTree(root);
        delete TNULL;
    }

    // Realiza una rotacion a la izquierda alrededor del nodo 'x'
    void leftRotate(Node *x){
        Node *y = x->right;
        x->right = y->left;
        if (y->left != TNULL) {
            y->left->parent = x;
        }
        y->parent = x->parent;
        if (x->parent == nullptr) {
            this->root = y;
        } 
        else if (x == x->parent->left) {
            x->parent->left = y;
        } 
        else {
            x->parent->right = y;
        }
        y->left = x;
        x->parent = y;
    }

    // Realiza una rotacion a la derecha alrededor del nodo 'x'.
    void rightRotate(Node *x){
        Node *y = x->left;
        x->left = y->right;
        if (y->right != TNULL){
            y->right->parent = x;
        }
        y->parent = x->parent;
        if (x->parent == nullptr){
            this->root = y;
        } 
        else if (x == x->parent->right){
            x->parent->right = y;
        } 
        else {
            x->parent->left = y;
        }
        y->right = x;
        x->parent = y;
    }

    // Inserta un nuevo nodo con el valor dado en el arbol.
    // Retorna true si la insercion fue exitosa, false si el valor ya existe.
    bool insert(int key){
        if (search(key) != nullptr){ // Verifica si el valor ya existe
            cout << "El valor " << key << " ya existe en el arbol. No se insertara duplicado." << endl;
            return false;
        }

        Node *node = new Node(key);
        node->parent = nullptr;
        node->data = key;
        node->left = TNULL;
        node->right = TNULL;
        node->color = RED; // Los nuevos nodos se insertan como rojos

        Node *y = nullptr;
        Node *x = this->root;

        while (x != TNULL){
            y = x;
            if (node->data < x->data){
                x = x->left;
            } 
            else {
                x = x->right;
            }
        }

        node->parent = y;
        if (y == nullptr){
            root = node;
        } 
        else if (node->data < y->data){
            y->left = node;
        } 
        else {
            y->right = node;
        }

        if (node->parent == nullptr){
            node->color = BLACK;
            return true;
        }

        if (node->parent->parent == nullptr){
            return true;
        }

        fixInsert(node);
        return true;
    }

    // Busca un nodo con el valor dado en el arbol.
    // Retorna el puntero al nodo si lo encuentra, nullptr si no.
    Node *search(int key){
        Node *temp = root;
        while (temp != TNULL && key != temp->data){
            if (key < temp->data) {
                temp = temp->left;
            } 
            else {
                temp = temp->right;
            }
        }
        if (temp == TNULL) {
            return nullptr; // No encontrado
        }
        return temp; // Encontrado
    }

    // Elimina un nodo con el valor dado del arbol
    // Retorna true si se elimino, false si el nodo no se encontro
    bool deleteNode(int data) {
        Node *nodeToDelete = TNULL;
        Node *temp = this->root;
        while (temp != TNULL) {
            if (temp->data == data) {
                nodeToDelete = temp;
            }

            if (temp->data <= data) {
                temp = temp->right;
            } 
            else {
                temp = temp->left;
            }
        }

        if (nodeToDelete == TNULL) {
            cout << "El nodo " << data << " no se encontro en el arbol." << endl;
            return false;
        }

        Node *x, *y;
        y = nodeToDelete;
        int y_original_color = y->color;

        if (nodeToDelete->left == TNULL) {
            x = nodeToDelete->right;
            rbTransplant(nodeToDelete, nodeToDelete->right);
        } 
        else if (nodeToDelete->right == TNULL) {
            x = nodeToDelete->left;
            rbTransplant(nodeToDelete, nodeToDelete->left);
        } 
        else {
            y = minimum(nodeToDelete->right);
            y_original_color = y->color;
            x = y->right;
            if (y->parent == nodeToDelete) {
                if (x != nullptr) { // Asegurar que x no sea nullptr
                    x->parent = y;
                }
            } 
            else {
                rbTransplant(y, y->right);
                y->right = nodeToDelete->right;
                y->right->parent = y;
            }

            rbTransplant(nodeToDelete, y);
            y->left = nodeToDelete->left;
            y->left->parent = y;
            y->color = nodeToDelete->color;
        }
        delete nodeToDelete; // Libera la memoria del nodo eliminado
        if (y_original_color == BLACK) {
            if (x != nullptr) { // Asegurar que x no sea nullptr
                fixDelete(x);
            }
        }
        return true;
    }

    // Muestra el arbol en inorder
    void printTree() {
        if (root == TNULL) {
            cout << "El arbol esta vacio." << endl;
        } 
        else {
            inorderHelper(this->root);
            cout << endl;
        }
    }
};