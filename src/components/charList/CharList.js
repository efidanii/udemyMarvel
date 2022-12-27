import './charList.scss';
import Spinner from '../spinner/Spinner'
import { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1557,
        charEnded: false
    }

     MarvelService = new MarvelService()

     componentDidMount(){
        this.onRequest()
     }
     onRequest = (offset)=> {
        this.onCharListLoading()
        this.MarvelService.getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError)
     }
     onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }



        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
     }
     onCharListLoading = () => {
        this.setState({newItemLoading: true})
     }
     onError = () => {
        this.setState({loading: false, error: true})
     }
    
    itemRender(arr){
        const arrItems = arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
            <li 
                className="char__item" 
                key={item.id}
                onClick={() => this.props.onCharSelected(item.id)}>
                <img src={item.thumbnail} alt="abyss" style={imgStyle}/>
                <div className="char__name">{item.name.length < 37 ? item.name : `${item.name.slice(0, 28)}...`}</div>
            </li>
            )
        })
        return (
            <ul className="char__grid">{arrItems}</ul>
            
        )
    }


    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state
        let items = this.itemRender(charList),
        errorMessage = error ? <ErrorMessage/> : null,
        spinner = loading ? <Spinner/> : null
        return (
            
            <div className="char__list">
                {items}
                {spinner}
                {errorMessage}
                <button 
                    style={{'display' : charEnded ? 'none' : 'block'}}
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}
export default CharList;