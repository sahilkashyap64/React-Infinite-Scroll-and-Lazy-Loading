import React, { useReducer, useRef,useMemo,useLayoutEffect,useEffect,useCallback } from 'react';

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
  const titleRef = useRef()
  const scrollRefs = useRef([]);

  const scrollSmoothHandler = (index) => () => {
    scrollRefs.current[index].current.scrollIntoView({ behavior: "smooth" });
  };


  // useEffect(() => {

  //   const chipsArray = document.querySelectorAll("#article-list__pagination > li > .chip");
  //   if (!loaded) {
  //     scrollRefs.current = [...Array(chipsArray.length).keys()].map(
  //       (_, i) => scrollRefs.current[i] ?? createRef()
  //     );

  //     chipsArray.forEach((elem, index) => {
  //       elem.addEventListener("click", scrollSmoothHandler(index));
  //     });
  //     setLoaded(true);
  //   }
  // }, [imgData.hitpage.length!==0]);
  function handleBackClick() {
    titleRef.current.scrollIntoView({ behavior: 'smooth' })
} 


  let bottomBoundaryRef = useRef(null);
  useFetch(pager, imgDispatch);
  useLazyLoading('.card-img-top', imgData.images)
  useInfiniteScroll(bottomBoundaryRef, pagerDispatch);
  const containerRef = useRef(null);
  const refsById = useMemo(() => {
    const refs = {}
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
    imgData.hitpage.forEach((item,index) => {
        refs[index] = React.createRef(null)
    })
    console.log("refs",refs);
    return refs
  }, [imgData.hitpage])

  const handlemultipleBackClick=(i)=> {
    console.log("handlemultipleBackClick",i);
    if(isEmpty(refsById)) {

      console.log("yes its empty");
    }else{
      if(i !== undefined || i !== null){
      // refsById[i].current.scrollIntoView({ behavior: 'smooth' })
    
    }
      console.log("not emty");}
    // if(refsById){
    // refsById[i].current.scrollIntoView({ behavior: 'smooth' })}
  }
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

  useEffect(() => {
    // handlemultipleBackClick();
    if(!imgData.hitpage || !containerRef.current) return;
    console.log("i hope it got mounted",imgData.hitpage);
    if(!isEmpty(imgData.hitpage)) {
      const container = containerRef.current;
      const childNodes = container.childNodes;
     const lastchild= document.querySelector("#article-list-pagination > li:nth-child(1) > span");
      const chipsArray = document.querySelectorAll("#article-list__pagination > li > .chip");
    console.log("itemchipsArray",chipsArray);
    console.log("lastchild",lastchild);
    console.log("childNodes",childNodes);
  }
    // handlemultipleBackClick(1);
  }, [imgData.hitpage.length!==0]);

  
  
  useLayoutEffect(() => {
    console.log("hello");
  }, [imgData.hitpage.length]);

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
        <h1 ref={titleRef}>A React article for Latin readers</h1>
        <p id="about">Jump to this </p>
          {imgData.hitpage && imgData.hitpage.length && (
            imgData.hitpage.map((nested, i) => {
              
              return(<div key={i}  className="row">
                 <h1 key={i} className="selected-element" ref={scrollRefs.current[i]}>Chipset walla{i}</h1>
               <br></br> <h1 ref={refsById[i]}>Refs by id{i}</h1>
                <br></br><h2 id={"article-page-" +i+1}>About {i+1}</h2>
                <h2 id={"about" +i+1}>saho {i+1}</h2>
                <br></br>
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
      
      {/* <li><p style={{backgroundColor: "lightblue",display:"inline"}} onClick={() => window.location.replace("/#about")}>
<span>go to about</span>
</p></li><li>    <button onClick={handleBackClick}>Back to the top</button>

        </li> */}
        {imgData.hitpage && imgData.hitpage.length && (   imgData.hitpage.map((nested, i) => {
return(

    <li key={i}> <span style={{backgroundColor: "lightblue"}} className="chip">SahilBack to the top dynamic {i}</span></li>
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
