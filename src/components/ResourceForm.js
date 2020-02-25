import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import api from '../service/api'
import logout from '../service/logout'

import Loading from './default/Loading'
import Alert from './default/Alert'

const ResourceForm = (props) => {

  const [name, setName] = useState('')
  const [sector, setSector] = useState('')
  const [alert, setAlert] = useState(false)
  const [h2, setH2] = useState('Cadastrar Recurso')
  const [listSectors, setListSectors] = useState([])
  const [btnLabel, setBtnLabel] = useState('Salvar')
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const { id } = props.match.params

  const history = useHistory()

  useEffect(() => {
    async function loadSectors() {
      const { data } = await api.get('/sectors')
      setListSectors(data)
    }
    loadSectors()

  }, [])

  useEffect(() => {
    if (id === undefined) {
      document.title = 'Cadastrar Recurso'
      setLoading(false)
      return;
    }
    setH2('Editar Recurso')
    document.title = 'Editar Recurso'
    async function loadResource() {
      const { data } = await api.get(`/resources/${id}`)
      setName(data.name)
      setSector(data.sector_id)
      setLoading(false)
    }
    loadResource()

  }, [id])

  /** */
  async function handleSubmit(e) {
    e.preventDefault()
    let obj = { name, sector_id: sector }
    setBtnLabel('Salvando ...')
    setBtnDisabled(true)

    try {
      if (id) {
        const { status } = await api.put(`/resources/${id}`, obj)

        if (status === 200) {
          //console.log('update ')
          setAlert('Atualizado com Sucesso')
          return;
        }
      }


      const { data } = await api.post('/resources', obj)
      const { message } = data

      if (message) {
        setAlert(message)
        setBtnLabel('Salvar')
        setBtnDisabled(false)
        return;
      }
      history.push('/recursos/listar')

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
            {alert &&
              <Alert msg={alert} />
            }
            <div className="card">

              <h5 className="card-header indigo white-text text-center py-4">
                <strong>Informações do Recurso</strong>
              </h5>
              <div className="card-body px-lg-5">

                <form className="text-center" onSubmit={handleSubmit}>

                  <div className="md-form mt-3">
                    <input type="text" id="name" className="form-control" value={name} onChange={e => setName(e.target.value)} autoFocus={true} required />
                    <label htmlFor="name" >Name</label>
                  </div>
                  <div className="form-row">
                    <select value={sector} className="form-control" onChange={e => setSector(e.target.value)} required>
                      <option value="">Selecione o Setor</option>
                      {listSectors.map(r =>
                        <option key={r.id} value={r.id}>{r.name}</option>
                      )}
                    </select>
                  </div>

                  <button className="btn btn-outline-indigo btn-rounded  z-depth-0 my-4 waves-effect" type="submit" disabled={btnDisabled}>{btnLabel}</button>
                  <Link className="btn btn-outline-danger" to='/recursos/listar'>Fechar</Link>

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

