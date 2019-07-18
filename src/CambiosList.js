import React from 'react';

import CurrencyFormat from 'react-currency-format';
import './ListItem.css';
import CardColumns from 'react-bootstrap/CardColumns';
import Card from 'react-bootstrap/Card';

function TasaCambio(props) {
    if (props.cambios > 0) {
        return <p> </p>;
    }
    return <p>Cambio debe ser mayor a 0</p>;
}

function PrintFormat(props){
    const cotizacion = props.cotizacion;
    const monto = Number((cotizacion * props.monto).toFixed(2));
    return (<CurrencyFormat value={monto}
        decimalSeparator={','}
        thousandSeparator={'.'}
        displayType={'text'}
        suffix={' ₲'} /> 
    )
}

class CambiosList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bancos: [],
            // nombres: [{banco: []}],
            loading: true,
            error: null,
            updated: null,
            monto: 1, 
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    componentDidMount() {
        this.setState({ loading: true, error: null });
        this.fetchData();
        this.intervalId = setInterval(this.fetchData, 10000);
    }

    fetchData = async () => {
        // const proxyurl = 'https://cors-anywhere.herokuapp.com/'
        const url = 'https://dolar.melizeche.com/api/1.0/'
        // fetch(url + proxyurl)
        fetch(url)
            .then(results => {
                return results.json();
            })
            .then(data => {
                this.setState({
                    bancos: [{ id: 'bbva', descripcion: 'BBVA', valor: (data.dolarpy.bbva) }, 
                        { id: 'bcp', descripcion: 'BCP', valor: (data.dolarpy.bcp) }, 
                        { id: 'cambiosalberdi', descripcion: 'Cambios Alberdi', valor: (data.dolarpy.cambiosalberdi)},
                        { id: 'cambioschaco', descripcion: 'Cambios Chaco', valor: (data.dolarpy.cambioschaco) },
                        { id: 'interfisa', descripcion: 'Interfisa', valor: (data.dolarpy.interfisa) },
                        { id: 'set', descripcion: 'SET', valor:  (data.dolarpy.set) },
                        { id: 'mydcambios', descripcion: 'MYD Cambios', valor: (data.dolarpy.mydcambios) },
                        { id: 'maxicambios', descripcion: 'Maxi Cambios', valor: (data.dolarpy.maxicambios) }],
                    // nombres: {banco: (data.dolarpy)},
                    loading: false,
                    updated: data.updated
                });
            })
            .catch(error => this.setState({ error, loading: false }));
    }

    handleChange(event) {
        this.setState({ monto: event.target.value });
        this.fetchData()
    }

    render() {
        const monto = this.state.monto
        const bancos = this.state.bancos

        if (this.state.error) {
            return <div> Error: {this.state.error.message}</div>;
        }else if (this.state.loading) {
            return <div> Loading..</div>;
        }else{
            if (this.state.updated){
                return (
                    <div className="ListItem">
                        <div className="form-group col-md-6">                            
                            <input
                                onChange={this.handleChange}
                                className="form-control"
                                type="text"
                                value={this.state.monto}
                            />
                            <CurrencyFormat value={monto}
                                decimalSeparator={','}
                                thousandSeparator={'.'}
                                displayType={'text'}
                                prefix={'$ '}/>
                            <br/>
                            <TasaCambio cambios={monto}/>
                        </div>
                        <CardColumns >
                            <ul className="list-unstyled">
                                {bancos.map((number)=>
                                    <li key={number.id}>
                                        <Card className="Items">
                                            <Card.Title >
                                                <div className="Items_Banco">
                                                    <center>{number.descripcion}</center>    
                                                </div>
                                                {/* <br/> */}
                                                {/* <center> */}
                                                    Compra:
                                                    <PrintFormat cotizacion={number.valor.compra} monto={monto} />
                                                {/* </center> */}
                                                <br/>
                                                Venta:
                                                {/* <div> */}
                                                    <PrintFormat cotizacion={number.valor.venta} monto={monto} /> 
                                                {/* </div>  */}
                                            </Card.Title>
                                        </Card>
                                            
                                    </li>
                                )}
                            </ul>
                        </CardColumns>
                        <footer id="sticky-footer" className="py-2 Footer">
                            <div className="container text-center">
                                <p>Última actualización: {this.state.updated}</p>
                            </div>
                        </footer>                        
                    </div>
                )}
        }
    }
}

export default CambiosList;