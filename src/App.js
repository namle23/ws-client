import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import axios from 'axios'

class App extends Component {
  state = {
    username: '',
    comment: '',
    fileName: '',
    date: '',
    displayComment: null,
    selectedFile: null,
    searchKeyword: ''
  }

  handleRead = e => {
    axios.get('http://localhost:3000/read').then(res => {
      if (res.status >= 400) throw new Error('Bad response')

      let comment = res.data.map(data => (
        <tr key={data.id}>
          <th>{data.username}</th>
          <th>{data.comment}</th>
          <th>{data.photo}</th>
          <th>{data.date}</th>
          <th>
            <button onClick={() => this.handleDelete(data.id)}>Delete</button>
          </th>
        </tr>
      ))

      let displayComment = (
        <div>
          <br />
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Comment</th>
                <th>Photo name</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>{comment}</tbody>
          </table>
          <br />

          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            onChange={this.searchChange}
            placeholder="Search a comment.."
          />
          <button
            onClick={() => this.handleSearch(this.state.searchKeyword)}
            type="submit"
          >
            Search
          </button>
        </div>
      )

      this.setState({ displayComment: displayComment })
    })
  }

  handleCreate = e => {
    let todb = {
      username: this.state.username,
      comment: this.state.comment,
      photo: this.state.fileName,
      date: this.state.date
    }

    axios.post('http://localhost:3000/create', { todb }).then(res => {})

    this.handleRead()
    this.handleUpload()
  }

  handleDelete = entryId => {
    let todb = { entryId }

    axios.post('http://localhost:3000/delete', { todb }).then(res => {
      if (res.status >= 400) throw new Error('Bad response')
    })

    this.handleRead()
  }

  handleSearch = keyword => {
    let todb = { keyword }

    axios.post('http://localhost:3000/search', { todb }).then(res => {
      let comment = res.data.map(data => (
        <tr key={data.id}>
          <th>{data.username}</th>
          <th>{data.comment}</th>
          <th>{data.photo}</th>
          <th>{data.date}</th>
          <th>
            <button onClick={() => this.handleDelete(data.id)}>Delete</button>
          </th>
        </tr>
      ))

      let displayComment = (
        <div>
          <br />
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Comment</th>
                <th>Photo name</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>{comment}</tbody>
          </table>
          <br />
        </div>
      )

      this.setState({ displayComment: displayComment })
    })
  }

  handleUpload = () => {
    const data = new FormData()
    data.append('file', this.state.selectedFile)

    axios.post('http://localhost:3000/create', data, {}).then(res => {
      console.log(res.statusText)
    })
  }

  fileNameChange = e => {
    let date = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, '/')

    this.setState({
      selectedFile: e.target.files[0],
      loaded: 0,
      fileName: e.target.files[0].name,
      date: date
    })
  }

  usernameChange = e => {
    this.setState({ username: e.target.value })
  }

  commentChange = e => {
    this.setState({ comment: e.target.value })
  }

  searchChange = e => {
    this.setState({ searchKeyword: e.target.value })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Web Service</h2>
        </div>

        <br />

        <div className="split left">
          <button onClick={this.handleRead}>Show all comments</button>

          {this.state.displayComment}
        </div>

        <div className="split right">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={this.state.username}
            onChange={this.usernameChange}
            placeholder="Username.."
          />

          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            value={this.state.comment}
            onChange={this.commentChange}
            placeholder="Write something.."
          ></textarea>

          <label htmlFor="comment">Upload</label>
          <input type="file" name="file" onChange={this.fileNameChange} />

          <button onClick={this.handleCreate} type="submit">
            Add
          </button>
        </div>
      </div>
    )
  }
}

export default App
