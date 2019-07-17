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
    const cotizacion = Number((props.cotizacion).toFixed(2));
    return (<CurrencyFormat value={cotizacion}
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
            loading: true,
            error: null,
            updated: null,
            monto: 1, 
            setcambio: 1,
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
                    amambayCompra: (data.dolarpy.amambay.compra * this.state.monto),
                    amambayVenta: (data.dolarpy.amambay.venta * this.state.monto),
                    bbvaCompra: (data.dolarpy.bbva.compra * this.state.monto),
                    bbvaVenta: (data.dolarpy.bbva.venta * this.state.monto),
                    bcpCompra: (data.dolarpy.bcp.compra * this.state.monto),
                    bcpVenta: (data.dolarpy.bcp.venta * this.state.monto),
                    bcpReferencial: (data.dolarpy.bcp.referencial_diario * this.state.monto),
                    cambiosalberdiCompra: (data.dolarpy.cambiosalberdi.compra * this.state.monto),
                    cambiosalberdiVenta: (data.dolarpy.cambiosalberdi.venta * this.state.monto),
                    cambioschacoCompra: (data.dolarpy.cambioschaco.compra * this.state.monto),
                    cambioschacoVenta: (data.dolarpy.cambioschaco.venta * this.state.monto),
                    eurocambiosCompra: (data.dolarpy.eurocambios.compra * this.state.monto),
                    eurocambiosVenta: (data.dolarpy.eurocambios.venta * this.state.monto),
                    interfisaCompra: (data.dolarpy.interfisa.compra * this.state.monto),
                    interfisaVenta: (data.dolarpy.interfisa.venta * this.state.monto),    
                    setCompra: (data.dolarpy.set.compra * this.state.monto),
                    setVenta: (data.dolarpy.set.venta * this.state.monto),  
                    mydcambiosCompra: (data.dolarpy.mydcambios.compra * this.state.monto),
                    mydcambiosVenta: (data.dolarpy.mydcambios.venta * this.state.monto),  
                    maxicambiosCompra: (data.dolarpy.maxicambios.compra * this.state.monto),
                    maxicambiosVenta: (data.dolarpy.maxicambios.venta * this.state.monto),                
                    loading: false,
                    updated: data.updated
                });
            });
    }

    handleChange(event) {
        this.setState({ monto: event.target.value });
        this.fetchData()
    }
    handleClick = e => {
        this.setState({ monto: 1 });
    }


    render() {
        const monto = this.state.monto
        
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
                            <CurrencyFormat value={this.state.monto}
                                decimalSeparator={','}
                                thousandSeparator={'.'}
                                displayType={'text'}
                                prefix={'$ '} /> 
                            <br/>
                            <TasaCambio cambios={monto}/>
                        </div>
                        <CardColumns>
                            <Card className="p-2">
                                <Card.Title>
                                    <center>
                                        <p>BBVA</p>
                                        <PrintFormat cotizacion={this.state.bbvaCompra} /> 
                                        
                                        <br />
                                        <PrintFormat cotizacion={this.state.bbvaVenta} /> 
                                                                         
                                    </center>
                                </Card.Title>
                            </Card>
                            <Card className="p-2">
                                <Card.Title>
                                    <center>
                                        <p>Amambay</p>
                                        <PrintFormat cotizacion={this.state.amambayCompra} /> 
                                        <br />
                                        <PrintFormat cotizacion={this.state.amambayVenta} /> 

                                    </center>
                                </Card.Title>
                            </Card>
                            <Card className="p-2">
                                <Card.Title>
                                    <center>
                                        <p>BCP</p>
                                        <PrintFormat cotizacion={this.state.bcpCompra} /> 
                                        <br />
                                        <PrintFormat cotizacion={this.state.bcpVenta} /> 
                                        <br />
                                        <PrintFormat cotizacion={this.state.bcpReferencial} />  
                                    </center>
                                </Card.Title>
                            </Card>
                            <Card className="p-2">
                                <Card.Title>
                                    <center>
                                        <p>Cambios Alberdi</p>
                                        <PrintFormat cotizacion={this.state.cambiosalberdiCompra} />  
                                    <br />
                                        <PrintFormat cotizacion={this.state.cambiosalberdiVenta} />  
                                    </center>
                                </Card.Title>
                            </Card>
                            <Card className="p-2">
                                <Card.Title>
                                    <center>
                                        <p>Cambios Chaco</p>
                                        <PrintFormat cotizacion={this.state.cambioschacoCompra} />  
                                        <br />
                                        <PrintFormat cotizacion={this.state.cambiosalberdiVenta} />  
                                    </center>
                                </Card.Title>
                            </Card>
                            <Card className="p-2">
                                <Card.Title>
                                    <center>
                                        <p>Euro cambios</p>
                                        <PrintFormat cotizacion={this.state.eurocambiosCompra} /> 
                                        <br />
                                        <PrintFormat cotizacion={this.state.eurocambiosVenta} /> 
                                    </center>
                                </Card.Title>
                            </Card>
                            <Card className="p-2">
                                <Card.Title>
                                    <center>
                                        <p>Interfisa</p>
                                        <PrintFormat cotizacion={this.state.interfisaCompra} /> 
                                        <br />
                                        <PrintFormat cotizacion={this.state.interfisaVenta} /> 
                                    </center>
                                </Card.Title>
                            </Card>
                            <Card className="p-2">
                                <Card.Title>
                                    <center>
                                        <p>Maxi Cambios</p>
                                        <PrintFormat cotizacion={this.state.maxicambiosCompra} /> 
                                        <br />
                                        <PrintFormat cotizacion={this.state.maxicambiosVenta} /> 
                                    </center>
                                </Card.Title>
                            </Card>
                            <Card className="p-2">
                                <Card.Title>
                                    <center>
                                        <p>M y d Cambios</p>
                                        <PrintFormat cotizacion={this.state.mydcambiosCompra} /> 
                                        <br />
                                        <PrintFormat cotizacion={this.state.mydcambiosVenta} /> 
                                    </center>
                                </Card.Title>
                            </Card>
                            <Card className="p-2">
                                <Card.Title>
                                    <center>
                                        <p>SET</p>
                                        <PrintFormat cotizacion={this.state.setCompra} /> 
                                        <br />
                                        <PrintFormat cotizacion={this.state.setVenta} /> 
                                    </center>
                                </Card.Title>
                            </Card>

                        </CardColumns>
                        <footer id="sticky-footer" className="py-4 bg-dark text-white-50">
                            <div className="container text-center">
                                <p>Última actualización: {this.state.updated}</p>
                                {/* <p>{this.state.updated}</p> */}
                            </div>
                        </footer>                        
                    </div>
                )}
        }
    }
}

export default CambiosList;