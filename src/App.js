import React, { useReducer, useRef,useMemo } from 'react';

import { useFetch, useInfiniteScroll, useLazyLoading } from './customHooks'
import './index.css';

function App() {
  const imgReducer = (state, action) => {
    switch (action.type) {
      case 'STACK_IMAGES':
        return { ...state, images: state.images.concat(action.images) }
      case 'FETCHING_IMAGES':
        return { ...state, fetching: action.fetching }
        case 'PAGE_WISE_DATA':
        return { ...state, hitpage: state.hitpage.concat(action.pagnum) }
      default:
        return state;
    }
  }

  const pageReducer = (state, action) => {
    switch (action.type) {
      case 'ADVANCE_PAGE':
        return { ...state, page: state.page + 1 }
      default:
        return state;
    }
  }

  const [pager, pagerDispatch] = useReducer(pageReducer, { page: 0 })
  const [imgData, imgDispatch] = useReducer(imgReducer, { images: [], fetching: true,hitpage:[], })
  
  const scrollRefs = useRef([]);

  const scrollSmoothHandler = (index) => () => {
    scrollRefs.current[index].current.scrollIntoView({ behavior: "smooth" });
  };

  let bottomBoundaryRef = useRef(null);
  useFetch(pager, imgDispatch);
  useLazyLoading('.card-img-top', imgData.images)
  useInfiniteScroll(bottomBoundaryRef, pagerDispatch);
  const containerRef = useRef(null);
  const refsById = useMemo(() => {
    
    if(!imgData.hitpage || !containerRef.current) return;

    const container = containerRef.current;
    const childNodes = container.childNodes;
    console.log("refsByIdimgData.hitpage",imgData.hitpage);
    console.log("childNodes2222",childNodes);
    scrollRefs.current = [...Array(childNodes.length).keys()].map(
      (_, i) => scrollRefs.current[i] ?? React.createRef()
    );
    childNodes.forEach((elem, index) => {
      elem.addEventListener("click", scrollSmoothHandler(index));
    });
  }, [imgData.hitpage])

 


  
  

  return (
    <div className="">
      <nav className="navbar bg-light">
        <div className="container">
          <a className="navbar-brand" href="/#">
            <h2>Infinite scroll + image lazy loading</h2>
          </a>
        </div>
      </nav>

      <div id='images' className="container">
        <div className="row">
          {imgData.hitpage && imgData.hitpage.length && (
            imgData.hitpage.map((nested, i) => {
              
              return(<div key={i}  className="row">
                 <h1 key={i} className="selected-element" ref={scrollRefs.current[i]}>Page{i+1}</h1>
               
                {nested.map((image, index) => {
                const { author, download_url } = image
                return (
                  <div key={index} className="card">
                    
                    <div className="card-body ">
                      <img
                        alt={author}
                        data-src={download_url}
                        className="card-img-top"
                        src={'https://picsum.photos/id/870/300/300?grayscale&blur=2'}
                      />
                    </div>
                    <div className="card-footer">
                      <p className="card-text text-center text-capitalize text-primary">Shot by: {author}</p>
                    </div>
                  </div>
                )
              })}</div>
              )
          }
          ))
          
          
          
          }
          
        </div>
      </div>
      <ul ref={containerRef} className="article-list__pagination" id="article-list-pagination">
        {/* <li className="article-list__pagination__item"></li> */}
      {/* <li className="article-list__pagination__item"><a href={`#article-page-${pager.page}`} onClick={() => window.location.replace(`/#article-page-${pager.page}`)}>{pager.page}</a></li> */}
      
        {imgData.hitpage && imgData.hitpage.length && (   imgData.hitpage.map((nested, i) => {
return(

    <li key={i}> <span style={{backgroundColor: "lightblue"}} className="chip">Page {i+1}</span></li>
)




}
)
        // <li> <button >SahilBack to the top dynamic {pager.page}</button></li>
      )}
        {/* <li>   {imgData.hitpage && imgData.hitpage.length && ( <button onClick={handlemultipleBackClick(pager.page)}>Back to the top dynamic {pager.page}</button>)}
        </li> */}
        
        </ul>
  
	
      {imgData.fetching && (
        <div className="text-center bg-secondary m-auto p-3">
          <p className="m-0 text-white">Getting images</p>
        </div>
      )}
      <div id='page-bottom-boundary' style={{ border: '1px solid red' }} ref={bottomBoundaryRef}></div>
    </div>
  );
}

export default App;
