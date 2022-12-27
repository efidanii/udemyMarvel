import './charInfo.scss';
import PropTypes from 'prop-types'; // ES6
import { Component } from 'react';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton'


class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false
    }
     marvelService = new MarvelService();

     componentDidMount(){
        this.updateChar()
     }
     
     componentDidUpdate(prevProps){
        if (this.props.charId !== prevProps.charId){
            this.updateChar();
        }
     }

     updateChar = () => {
        const {charId} = this.props
        if (!charId) {
            return;
        }


        this.onLoading()
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
     }
     onCharLoaded = (char) => this.setState({char, loading: false})
     onError = () => this.setState({loading: false, error: true})
     onLoading = () =>  this.setState({loading: true})


    render(){
        const {char, loading, error} = this.state,
               skeleton = char || loading || error ? null : <Skeleton/>,
               errorMessage = error ? <ErrorMessage/> : null,
               spinner = loading ? <Spinner/> : null,
               content = !(loading || error || !char) ? <View char={char}/> : null


        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}
const View = ({char}) => {
    const {name, description, thumbnail, wiki, homepage, comics} = char
    let allComics = comics.length === 0
                ? <li>There is no comics with that character</li>
                : (
                    // eslint-disable-next-line array-callback-return
                    comics.map((item, i) => {
                        if (i<10)
                            {return(
                                <li key={i} className="char__comics-item">
                                    {item.name} <p>{i}</p>
                                </li>
                                )}
                        })
                ),
        imgStyle = {'objectFit' : 'cover'};
        if (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit' : 'unset'};
        }
                        
    
    return(
        
        <>
                <div className="char__basics">
                    <img src={thumbnail} alt={name} style={imgStyle}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">

                    {   
allComics
                    }

                </ul>
        </>
    )
}
CharInfo.propTypes = {
    charId: PropTypes.number
}
export default CharInfo;