import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../service/api'

const  UserList = () => {
  const [users, setUsers ] = useState([])
  let cont = 1

  useEffect(() => {
    document.title = 'Usuários'
    async function loadUsers(){
      const { data } = await api.get('/users')
      setUsers(data)
   
    }
    loadUsers()
  }, [])

/** */
  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col-md-12 border-bottom">
          <Link type="button" className="btn btn-indigo float-right" to='/usuarios/cadastrar'>Cadastrar Usuário</Link>

          <h2>Usuários</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nome</th>
                <th scope="col">Editar</th>
              </tr>
            </thead>
            <tbody>
              {users.map(r =>
                <tr key={r.id}>
                  <th scope="row">{cont++}</th>
                  <td>{r.name}</td>
                  <td><Link to={`/usuarios/editar/${r.id}`} title="Editar Usuário"><i className="fas fa-edit"></i></Link></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UserList