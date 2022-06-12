import React from 'react'
import logo from './logo.svg';
import './App.css';

var url = 'http://127.0.0.1:8000/api/task/'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList:[],
      activeItem: {
        id: null,
        title: '',
        completed: false
      },
      editing:false,
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };


  componentWillMount() {
    this.fetchTasks()
  }

  fetchTasks() {
    console.log('Fetching')

    fetch('http://127.0.0.1:8000/api/task/')
    .then(response => response.json())
    .then(data => 
      this.setState({
        todoList:data
      }) 
    )
  }

  handleChange(e) {
    var name = e.target.name
    var value = e.target.value
    console.log('Name', name)
    console.log('Value', value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log('Item', this.state.activeItem)
    var method = 'POST'

    if(this.state.editing) {
      url = url + this.state.activeItem.id + '/'
      method = 'PUT'
      this.setState({
        editing:false
      })
    }

    fetch(url, {
      method:method,
      headers: {
        'Content-type':'application/json',
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks()
      this.setState({
        activeItem: {
          id: null,
          title: '',
          completed: false
        }
      })
    }).catch(function(error) {
      console.log('ERROR',error)
    })
  }

  startEdit(task) {
    this.setState({
      activeItem:task,
      editing:true
    })
  }

  deleteItem(task) {
    fetch(url + task.id + '/', {
      method:'DELETE',
      headers:{
        'Content-type':'application/json'
      }
    }).then((response) => {
      this.fetchTasks()
    })
  }

  strikeUnstrike(task) {
    task.completed = !task.completed

    fetch(url + task.id + '/', {
      method:'PUT',
      headers:{
        'Content-type':'application/json'
      },
      body: JSON.stringify({'completed': task.completed, 'title': task.title})
    }).then((response) => {
      this.fetchTasks()
    })

    console.log('TASK:', task.completed)
  }

  render() {
    var tasks = this.state.todoList
    var self = this
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{flex:6}}>
                  <input onChange={this.handleChange} className="form-control" value={this.state.activeItem.title} type="text" id="title" name="title" placeholder="Добавить таск"/>
                </div>
                <div style={{flex:6}}>
                  <input className="btn btn-warning" type="submit" id="submit" name="Add"/>
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
              {tasks.map(function(task, index) {
                return(
                  <div key={index} className="task-wrapper flex-wrapper">
                    <div onClick={() => self.strikeUnstrike(task)} style={{flex:7}}>
                      {task.completed == false ? (
                        <span>{task.title}</span>
                      ) : (
                        <strike>{task.title}</strike>
                      )}
                      
                    </div>
                    <div style={{flex:1}}>
                      <button onClick={() => self.startEdit(task)} className="btn btn-sm btn-outline-info">Изменить</button>
                    </div>
                    <div style={{flex:1}}>
                      <button onClick={() => self.deleteItem(task)} className="btn btn-sm btn-outline-info">-</button>
                    </div>
                    
                  </div>
                )
              })}
          </div>
        </div>

      </div>
    )
  }
}

export default App;
