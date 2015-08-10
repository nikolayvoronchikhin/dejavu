var WatchStock = React.createClass({
    getInitialState: function() {
        return {symbol: ""};
    },
    watchStock: function() {
        this.props.watchStockHandler(this.state.symbol);
        this.setState({symbol: ''});
    },
    handleChange: function(event) {
        this.setState({symbol: event.target.value});
    },
    render: function () {
        return (
            <div className="row">
            </div>
        );
    }
});

var StockRow = React.createClass({
    unwatch: function() {
        console.log("yeha pe h");
        this.props.unwatchStockHandler(this.props.stock._type);
    },
    render: function () {
        var source = this.props.stock._source;
        var items = [];
        for(var each in source){
            items.push(each);
        }
        var children = items.map(function(item){
            return <td key={item}>{item}</td>;
        });

        return (
            <tr>
                <td>{this.props.stock._type}</td>
                <td>{this.props.stock._id}</td>
                {children}
            </tr>
        );
    }
});

var StockTable = React.createClass({
    render: function () {
        var items = [];
        for (var symbol in this.props.stocks) {
            var stock = this.props.stocks[symbol];
            items.push(<StockRow key={stock._id} stock={stock} last={this.props.last} unwatchStockHandler={this.props.unwatchStockHandler}/>);
        }
        return (
            <div className="row-data">
            <table className="table-hover">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>ID</th>
                        <th>SOURCE</th>
                    </tr>
                </thead>
                <tbody>
                    {items}
                </tbody>
            </table>
            </div>
        );
    }
});

var TypeRow = React.createClass({
    unwatch: function() {
        elem = document.getElementById(this.props.type);
        if(elem.check == "true"){
            elem.check = "false";
            this.props.unwatchTypeHandler(this.props.type);
        }
        else{
            elem.check = "true";
            this.props.watchTypeHandler(this.props.type);
        }
    },
    render: function() {
        return(
            <tr>
                <td>
                <input type="checkbox" id={this.props.type} type="checkbox" onChange={this.unwatch} check="true"> {this.props.type} </input>
                </td>
            </tr>
        );
    }
});

var TypeTable = React.createClass({
    render: function()  {
        var types = this.props.Types;
        var rowObj = [];
        for(var type in types){
            rowObj.push(<TypeRow key={type} type={types[type]} unwatchTypeHandler={this.props.unwatchTypeHandler} watchTypeHandler={this.props.watchTypeHandler} />);
        }
        return (
            <div className="row-types">
            <table className="table-hover">
                <thead>
                    <tr>
                        <th>Types</th>
                    </tr>
                </thead>
                <tbody>
                    {rowObj}
                </tbody>
            </table>
            </div>
        );
    }
});

var HomePage = React.createClass({
    getInitialState: function() {
        var stocks = {};
        feed.watch([".percolator", "_default_", "foo", "scalrtest", "tweet"]);
        feed.onChange(function(stock) {
            stocks[stock._type] = stock;
            this.setState({stocks: stocks, last: stock});
        }.bind(this));
        return {stocks: stocks};
    },
    watchStock: function(symbols) {
        symbols = symbols.replace(/ /g,'');
        var arr = symbols.split(",");
        feed.watch(arr);
    },
    unwatchStock: function(symbol) {
        feed.unwatch(symbol);
        var stocks = this.state.stocks;
        delete stocks[symbol];
        this.setState({stocks: stocks});
    },
    render: function () {
        var types = [".percolator", "_default_", "foo", "scalrtest", "tweet"];
        return (
            <div>
                <TypeTable Types={types} watchTypeHandler={this.watchStock} unwatchTypeHandler={this.unwatchStock} />
                <WatchStock watchStockHandler={this.watchStock}/>
                <StockTable stocks={this.state.stocks} last={this.state._source} unwatchStockHandler={this.unwatchStock}/>
            </div>
        );
    }
});

React.render(<HomePage />, document.getElementById('main'));