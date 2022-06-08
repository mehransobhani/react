import React, { useRef, useState } from 'react';
import Header from '../../Header/Header.js';
import addCircleActiveImage from '../../../assets/images/add_circle_active.png';
import addCircleInactiveImage from '../../../assets/images/add_circle_inactive.png';
import listCircleActiveImage from '../../../assets/images/list_circle_active.png';
import listCircleInactiveImage from '../../../assets/images/list_circle_inactive.png';
import searchCircleActiveImage from '../../../assets/images/search_circle_active.png';
import searchCircleInactiveImage from '../../../assets/images/search_circle_inactive.png';
import Button from '@material-ui/core/Button';
import { IconButton } from '@material-ui/core';
import AddLink from './AddLink/AddLink';
import ListLinks from './ListLinks/ListLinks';


const CategoryCourse = () => {

  const [listState, setListImage] = React.useState(listCircleActiveImage);
  const [addState, setAddImage] = React.useState(addCircleInactiveImage);
  const [selectedMenuItemIndex, setSelectedMenuItemIndex] = useState(0);

  const topMenuItems = [
    {id: 0, name: 'نمایش همه',  component: <ListLinks />},
    {id: 1, name: 'افزودن', component: <AddLink />}, 
  ]

  const listImageClicked = () => {
    setListImage(listCircleActiveImage);
    setAddImage(addCircleInactiveImage);
  };
  const addImageClicked = () => {
    setListImage(listCircleInactiveImage);
    setAddImage(addCircleActiveImage);
  }

  const getTopMenuItemClass = (i) => {
    if(i === selectedMenuItemIndex){
      return 'activeTopMenuButton';
    }else{
      return 'deactiveTopMenuButton';
    }
  }

  const getCorrespondingComponent = () => {
    return topMenuItems[selectedMenuItemIndex].component;
  }

  const topMenuItemClicked = (i) => {
    setSelectedMenuItemIndex(i);
  }

    return (
        <div>
            <Header title="مدیریت لینک کلاس به دسته‌بندی" />
            <div className={['container-fluid'].join(' ')}>
            <div className={['row', 'd-flex', 'mt-2',].join(' ')} style={{direction: 'rtl'}}>
              <img src={listState} className={['tab', 'd-none'].join(' ')} style={{width: '40px'}} onClick={listImageClicked}/>
              <img src={addState} className={['tab', 'd-none'].join(' ')} style={{width: '40px', marginRight: '10px'}} onClick={addImageClicked}/>
              {
                topMenuItems.map((item, i) => {
                  return (
                      <button onClick={() => {topMenuItemClicked(i)}} className={['mb-0', 'mr-2', 'px-3', 'py-1', getTopMenuItemClass(i)].join(' ')} style={{}}>{item.name}</button>
                  );
                })
              }
            </div>
            <div className={['row', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                <div className={['col-12', 'px-0', 'mx-0'].join(' ')}>
                {getCorrespondingComponent()}
                </div>
            </div>
            </div>
        </div>
    );
}

export default CategoryCourse;