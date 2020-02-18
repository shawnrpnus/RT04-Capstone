import React, { Component,Fragment } from 'react'
import { Search } from 'react-feather';

export class SearchHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchbar: false
        }
    }
    handleSearchClick = () => {
        this.setState({
            searchbar: !this.state.searchbar
        })
    }
    render() {
        return (
            <Fragment>
                <form className="form-inline search-form">
                    <div className="form-group">
                        <input className={"form-control-plaintext " + (this.state.searchbar ? 'open' : '')} type="search" placeholder="Search.." />
                        <span className="d-sm-none mobile-search" onClick={() => this.handleSearchClick()}><Search /></span>
                    </div>
                </form>
            </Fragment>
        )
    }
}

export default SearchHeader
