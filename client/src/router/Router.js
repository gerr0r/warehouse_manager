import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import ProductsPage from '../pages/ProductsPage'
import WarehousesPage from '../pages/WarehousesPage'

const Router = () => {

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' ><Redirect to='/products' /></Route>
                <Route exact path='/products' component={ProductsPage}></Route>
                <Route exact path='/warehouses' component={WarehousesPage}></Route>
            </Switch>
        </BrowserRouter>
    )
}

export default Router