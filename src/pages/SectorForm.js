import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import api from '../service/api'
import logout from '../utils/logout'

import Loading from '../components/Loading'
import Alert from '../components/Alert'
import {loadSectors, loadUsers, loadResources} from '../utils/load'


const ResourceForm = (props) => {

  const [sector, setSector ] = useState({name:''})
  const [btn, setBtn] = useState({label:'Salvar', disabled:false})
  const [alert, setAlert] = useState(false)
  const [h2, setH2] = useState('Cadastrar Setor')
  const [loading, setLoading] = useState(true)
  const { id } = props.match.params

  const history = useHistory()

  useEffect(() => {
    if (id === undefined) {
      document.title = 'Cadastrar Setor'
      setLoading(false)
      return;
    }
    setH2('Editar Setor')
    document.title = 'Editar Setor'
    //setLoading(true)
    async function load() {
      const { data } = await api.get(`/sectors/${id}`)
      setSector(data) 
      setLoading(false)
    }
    load()

    }, [id])
  /** */
  async function handleSubmit(e) {
    e.preventDefault()
    setBtn({label:'Salvando...', disabled:true})
    try {
      if (id) {
        const { status } = await api.put(`/sectors/${id}`, sector)

        if (status === 200) {
          setAlert('Atualizado com Sucesso')
          loadSectors()      
          loadResources()
          loadUsers()   
          setBtn({label:'Salvar', disabled:false})
        }
        return;
      }

      const { data } = await api.post('/sectors', sector)
      const { message } = data
      if (message) {
        setAlert(message)
        setBtn({label:'Salvando...', disabled:true})

        return;
      }
      await loadSectors()
      await loadUsers()
      history.push('/setores/listar')
      //window.location.reload()
      /** */
    } catch (e) {

      logout()
    }

    /** */
  }

  return (

    <div className="container pb-5">
      <div className="row mb-4">
        <div className="col-md-12 border-bottom">
          <h2>{h2}</h2>
        </div>
      </div>
      <div className="row justify-content-center">
        {loading ?
          <Loading />
          :

          <div className="col-md-8">

            <div className="card">

              <h5 className="card-header indigo white-text text-center py-4">
                <strong>Setor</strong>
              </h5>

              <div className="card-body px-lg-5">
                {alert &&
                  <Alert msg={alert} />
                }
                <form className="text-center mt-3" onSubmit={handleSubmit}>

                  <div className="md-form mt-3">
                    <input type="text" id="name" className="form-control" value={sector.name} onChange={e => setSector({...sector, name:e.target.value})} autoFocus={true} required />
                    <label htmlFor="name" >Name</label>
                  </div>
                  <button className="btn btn-outline-indigo btn-rounded  z-depth-0 my-4 waves-effect" type="submit" disabled={btn.disabled}>{btn.label}</button>
                  <Link className="btn btn-outline-danger" to='/setores/listar'>Fechar</Link>

                </form>
              </div>

            </div>

          </div>
        }
      </div>

    </div>
  )
}

export default ResourceForm

