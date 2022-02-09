import React, { useEffect, useRef, useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import './Discount.css';
import RightMenu from '../Header/RightMenu.js';
import Header from '../Header/Header.js';
import addCircleActiveImage from '../../assets/images/add_circle_active.png';
import addCircleInactiveImage from '../../assets/images/add_circle_inactive.png';
import listCircleActiveImage from '../../assets/images/list_circle_active.png';
import listCircleInactiveImage from '../../assets/images/list_circle_inactive.png';
import searchCircleActiveImage from '../../assets/images/search_circle_active.png';
import searchCircleInactiveImage from '../../assets/images/search_circle_inactive.png';
import Button from '@material-ui/core/Button';
import ListDiscount from './ListDiscount/ListDiscount.js';
import AddDiscount from './AddDiscount/AddDiscount.js';
import ReportDiscount from './ReportDiscount/ReportDiscount';
import { IconButton } from '@material-ui/core';
import { useCookies } from 'react-cookie';

const Discount = () => {
  const [state, setState] = React.useState({right: false});
  const [listState, setListImage] = React.useState(listCircleActiveImage);
  const [addState, setAddImage] = React.useState(addCircleInactiveImage);
  const [selectedMenuItemIndex, setSelectedMenuItemIndex] = useState(0);
  const [cookies, setCookie, removeCookie] = useCookies();
  const topMenuItems = [
    {id: 0, name: 'نمایش همه',  component: <ListDiscount />},
    {id: 1, name: 'افزودن', component: <AddDiscount />}, 
    {id: 2, name: 'گزارشات استفاده', component: <ReportDiscount />}, 
    {id: 3, name: 'دریافت خروجی', component: null}
  ]

  /*const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };*/

  const listImageClicked = () => {
    setListImage(listCircleActiveImage);
    setAddImage(addCircleInactiveImage);
  };
  const addImageClicked = () => {
    setListImage(listCircleInactiveImage);
    setAddImage(addCircleActiveImage);
  }

  const showPanel = () => {
    if(listState == listCircleActiveImage){
      return(<ListDiscount />);
    }else if(addState == addCircleActiveImage){
      return(<AddDiscount />);
    }
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

  useEffect(() => {
    if(cookies.user_server_token === undefined){
      window.location.href = 'https://honari.com';
    }
  }, []);

  return (
    <div>
        <Header title="مدیریت تخفیف‌ها" />
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
            <div className={['col-12'].join(' ')}>
              {getCorrespondingComponent()}
            </div>
          </div>
        </div>
    </div>
  );
}

export default Discount;