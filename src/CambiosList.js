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
            nombres: [],
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
        this.intervalId = setInterval(this.fetchData, 100000);
    }

    fetchData = async () => {
        fetch('https://dolar.melizeche.com/api/1.0')
            .then(results => {
                return results.json();
            })
            .then(data => {
                this.setState({
                    bancos: [(data.dolarpy.bbva), (data.dolarpy.bcp), (data.dolarpy.cambiosalberdi),
                        (data.dolarpy.cambioschaco), (data.dolarpy.eurocambios), (data.dolarpy.interfisa), (data.dolarpy.set),
                        (data.dolarpy.mydcambios), (data.dolarpy.maxicambios)],
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
                            <PrintFormat cotizacion={this.state.monto} monto={1} />
                            <br/>
                            <TasaCambio cambios={monto}/>
                        </div>
                        <CardColumns>
                            <ul className="list-unstyled">
                                {bancos.map((number,index)=>
                                    <li key={index}>
                                        <Card className="p-2">
                                            <Card.Title>
                                                <center>
                                                <p>{index}</p>
                                                    <PrintFormat cotizacion={number.compra} monto={monto} />
                                                <br/>
                                                    <PrintFormat cotizacion={number.venta} monto={monto} /> 
                                                </center>
                                            </Card.Title>
                                        </Card>
                                            
                                    </li>
                                )}
                            </ul>
                        </CardColumns>
                        <footer id="sticky-footer" className="py-4 bg-dark text-white-50">
                            <div className="container text-center">
                                <p>Última actualización: {this.state.updated}</p>
=                            </div>
                        </footer>                        
                    </div>
                )}
        }
    }
}

export default CambiosList;