import React, { useEffect, useState } from 'react'
import { 
  View, 
  SafeAreaView, 
  Platform,
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  FlatList, 
  Modal, 
  Alert,
  ActivityIndicator
} from 'react-native'
import { startLogout } from '../features/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore'
import { SET_LOADING, updateTodoList } from '../features/todoSlice';

const TodoScreen = () => {

  const dispatch = useDispatch();
  const { todosData, loading: todoLoading } = useSelector((state) => state.todosData)
  const { userData, loading } = useSelector((state) => state.userData)

  const [todos, setTodos] = useState([])
  const [inputText, setInputText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [inputEditValue, setInputEditValue] = useState('')
  const [todoId, setTodoId] = useState('')

  const [uid, setUid] = useState('')

  useEffect(() => {
    const getTodos = async() => {
      dispatch(SET_LOADING(true))
      const { _data } = await firestore().collection('users').doc(userData.uid).get();
      setTodos(_data.todoList)
      dispatch(SET_LOADING(false))
    }

    if (userData) {
      setUid(userData.uid)
    }
    
    getTodos().catch(error => console.log('getTodos'))
  }, [userData, todosData])  

  // Add a new to-do
  const handleAddTodo = () => {
    if (inputText === "" ) return;

    const newTodo = {
      id:  Math.floor(Math.random() * 1000),
      text: inputText,
    };
    // Append new to-do to already existing list
    const todoList = [...todos, newTodo]
    dispatch(updateTodoList({ uid, todos: { todoList }}))
    setInputText("");
  };

  // Open the modal when the EDIT button is pressed.
  const handleOpenEdit = (todo) => {
    setModalVisible(true)
    setInputEditValue(todo.text)
    setTodoId(todo.id)
  };

  // Confirm the Edit
  const handleEdit = () => {
    let todoList = todos;
    const index = todoList.findIndex( item => item.id == todoId )
    todoList[index].text = inputEditValue

    dispatch(updateTodoList({ uid, todos: { todoList }}))
    setModalVisible(!modalVisible)    
  };

  // Delete a to-do
  const handleDelete = (todo) => {
    let newTodos = todos;
    const todoList = newTodos.filter( item => todo != item )
    Alert.alert('Eliminar', 'Estas a punto de eliminar la tarea. ¿Estás seguro?', 
      [{ text: 'Si', onPress: () => dispatch(updateTodoList({ uid, todos: { todoList }}))}, { text: 'Cancelar', style: 'destructive' }]
    )
  };

  // FlatList's renderItem
  const renderItem = ({item}) => (
    <>
      <View style={styles.todoItem}>
        {/* TO-DO Item */}
        <Icon name='chevron-forward-sharp' color='#5856D6' size={30}/>
        <Text style={ styles.todoText }>{item.text}</Text>
        {/* Action Buttons */}
        <View style={ styles.actionBtnContainer }>
          <TouchableOpacity onPress={ () => handleOpenEdit(item) } style={ styles.editBtn }>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={ () => handleDelete(item) } activeOpacity={0.5} style={ styles.deleteBtn }>
            <Icon name='trash-sharp' size={30} color='red'/>
          </TouchableOpacity>
        </View>
      </View>
      {/* Vertical divider */}
      <View style={ styles.divider }/>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='slide'
      >
          <View style={ styles.modal }>
            <View style={ styles.modalView }>
              <Text style={ styles.modalCloseTxt }>Editar tarea</Text>
              <TextInput value={inputEditValue} onChangeText={ text => setInputEditValue(text) } style={ styles.modalInput } placeholder="Editar"/>
              <TouchableOpacity style={ styles.modalCloseBtn } onPress={ handleEdit }>
                <Text style={ styles.modalCloseTxt }>Editar/Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
    </>
  );

  // Logout from session
  const logout = () => {
    Alert.alert('Salir', 'Estas a punto de salir. ¿Estás seguro?', 
      [{ text: 'Si', onPress: () => dispatch( startLogout() ) }, { text: 'Cancelar', style: 'destructive'}]
    )
  };
  
  return (
    <View style={ styles.root }>
      <View style={styles.inputContainer} >
        <TextInput 
          value={ inputText }
          onChangeText={ text => setInputText(text) }
          style={ styles.input }
          placeholder="Escribe tus tareas"
          />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={ handleAddTodo }
        >
          <View style={ styles.submitBtn }>
            <Icon name='add-sharp' size={30} color={'white'}/>
          </View>
        </TouchableOpacity>

        {/* LogOut Button */}
        {
          loading ?
          <View style={ styles.logoutBtn }>
            <ActivityIndicator size={"small"} color={"white"}/>
          </View>
          : 
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={ logout }
          >
            <View style={ styles.logoutBtn }>
              <Text style={ styles.logoutTxt }>
                Salir
              </Text>
            </View>
          </TouchableOpacity>
        }
      </View>
      <View style={ styles.todosContainer }>
        {
          todoLoading ? 
          <View style={ styles.todoLoading }>
            <ActivityIndicator size={"large"} color={"#5856D6"}/>
          </View>
          : todos.length == 0 ?
          <View style={ styles.emptyList }>
            <Icon name='sad-outline' size={100} color={'grey'}/>
            <Text style={ styles.emptyText }>¡No tienes ninguna tarea!</Text>
          </View>
          :
          <FlatList 
            data={ todos }
            renderItem={ renderItem }
            keyExtractor={ (item, index) => item.id + index }
          />

        }
      </View>
    </View>
  )
}

export default TodoScreen

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#5856D6'
  },
  inputContainer: {
    height: Platform.OS === 'ios' ? 100 : 60,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderBottomEndRadius: 20,
    borderBottomLeftRadius: 20,
    paddingBottom: 10
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 12,
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'white',
  },
  modalInput: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 12,
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'white',
    marginVertical: 15
  },
  submitBtn: {
    width: 40, 
    height: 40, 
    backgroundColor: '#5856D6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginLeft: 10,
  },
  todosContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 20
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 5
  },
  todoText: {
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    color: 'black'
  },
  logoutBtn: {
    width: 100, 
    height: 40, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 12,
    marginLeft: 10,
    marginRight: 10
  },
  logoutTxt: {
    color: 'white',
    fontWeight: 'bold'
  },

  actionBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  editBtn: {
    marginRight: 15
  },
  deleteBtn: {
    marginRight: 15
  },
  divider: { 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(88, 86, 214, 0.4)', 
    height: 10, 
    flex: 1, 
    marginHorizontal: 15 
  },
  modal: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  modalView: {
    margin: 20,
    backgroundColor: '#5856D6',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCloseBtn: {
    backgroundColor: 'red', 
    width: 100, 
    height: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20 
  },
  modalCloseTxt: {
    color: 'white',
    fontWeight: 'bold'
  },
  todoLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  emptyText: {
    color: 'grey'
  }
})