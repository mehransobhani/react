import React, { Fragment, useState } from 'react';
import newImage from '../../../assets/images/add_circle_black.png';
import boxImage from '../../../assets/images/box_black.png'
import truckImage from '../../../assets/images/truck_black.png';
import cartImage from '../../../assets/images/cart_black.png';
import categoryImage from '../../../assets/images/category_black.png';
import WarningAlert from '../../Alerts/WarningAlert.js';
//import ErrorAlert from '../../Alerts/ErrorAlert.js';
import './AddDiscount.css';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import DiscountEdit from '../EditDiscount/DiscountEdit.js';
import * as Constants from '../../../constants/urls';
import EditMultiDiscount from '../EditMultiDiscount/EditMultiDiscount';
import { useCookies } from 'react-cookie';

const AddDiscount = () => {

    const [productState, setProductState] = useState('');
    const [categoryState, setCategoryState] = useState('');
    const [cartState, setCartState] = useState('');
    const [shippingState, setShippingState] = useState('');
    const [circularLoading, setLoading] = useState(null);
    const [warningAlert, setWarningAlert] = useState(null);
    const [editState, setEditState] = useState("");
    const [initialEditPageState, setInitialEdiPageState] = useState(null);
    const [displayClassState, setDisplayClassState] = useState('');
    const [selectedDiscountPrototypeId, setSelectedDiscountPrototypeId] = useState(-1);
    const [cookies, setCookie, removeCookie] = useCookies();

    const discountTypesInformation = [
        {id: 0, type: 'product', typeId: 1, name: 'محصول', image: boxImage}, 
        {id: 1, type: 'category', typeId: 2, name: 'دسته‌بندی', image: categoryImage},
        {id: 2, type: 'shipping', typeId: 3, name: 'حمل و نقل', image: truckImage},
        {id: 3, type: 'order', typeId: 4, name: 'سبد خرید', image: cartImage}, 
        {id: 4, type: 'product-multi', typeId: 5, name: 'محصول ویژه', image: boxImage}
    ];

    const productClicked = () =>{
        localStorage.setItem('newDiscountType', 'product');
        setProductState('active');
        setCategoryState('');
        setCartState('');
        setShippingState('');
        setEditState('product');
    }
    const categoryClicked = () => {
        localStorage.setItem('newDiscountType', 'category');
        setProductState('');
        setCategoryState('active');
        setCartState('');
        setShippingState('');
        setEditState('category');
    }
    const shippingClicked = () => {
        localStorage.setItem('newDiscountType', 'shipping');
        setProductState('');
        setCategoryState('');
        setCartState('');
        setShippingState('active');
        setEditState('shipping');
    }
    const cartClicked = () => {
        localStorage.setItem('newDiscountType', 'order');
        setProductState('');
        setCategoryState('');
        setCartState('active');
        setShippingState('');
        setEditState('order');
    }

    const discountPrototypeClicked = (i) => {
        setSelectedDiscountPrototypeId(i);
        discountTypesInformation.map((info, index) => {
            if(info.id === i){
                localStorage.setItem('newDiscountType', info.type);
            }
        });
    }

    const createButtonClicked = () =>{
        if(selectedDiscountPrototypeId === -1){
            showWarningMessage('لطفا یکی از گزینه‌های زیر را انتخاب کنید');
        }else{
            axios.post(Constants.apiUrl + '/api/discount/add-discount',{
                typeId: discountTypesInformation[selectedDiscountPrototypeId].typeId
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token,
                }
            }).then((response) => {
                if(response.data.status === 'done'){
                    if(response.data.typeId !== 5){
                        setDisplayClassState('d-none');
                        setInitialEdiPageState(<DiscountEdit typeId={discountTypesInformation[selectedDiscountPrototypeId].typeId} id={response.data.id} />);
                    }else{
                        setDisplayClassState('d-none');
                        setInitialEdiPageState(<EditMultiDiscount stage={'firstEdit'} id={response.data.id} />);
                    }
                }else if(response.data.status == 'failed'){
                    if(response.data.status === 'm'){
                        window.location.href = 'https://honari.com';
                    }else{
                        console.warn(response.data.message);
                        alert(response.data.umessage);
                    }
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    const getDiscountBackground = (i) => {
        if(i === selectedDiscountPrototypeId){
            return '#00bac6';
        }else{
            return 'white';
        }
    }

    const showWarningMessage = (message) => {
        setWarningAlert(<WarningAlert text={message}/>);
    }
    const hideWarningMessage = () => {
        setWarningAlert(null);
    }

    return(
        <React.Fragment>
            <div className={['container-fluid', 'pt-3', 'pb-3', 'pr-2', 'pl-2', 'text-center', displayClassState].join(' ')} style={{borderRadius: '3px', backgroundColor: '#F2F2F2'}}>
                <div syle={{position: 'absolute', top: '5px', right: '20px', zIndex: '200'}} onClick={hideWarningMessage}>{warningAlert}</div>
                <img src={newImage} style={{width: '50px'}} />
                <h6 className={['mt-2'].join(' ')} >ایجاد تخفیف جدید</h6>
                <div className={['row', 'justify-content-around'].join(' ')}>
                    {
                        discountTypesInformation.map((discount, i) => {
                            return (
                                <div className={['rounded', 'shadow', 'text-center', 'col-2', 'pointer', 'item', 'pt-2',].join(' ')} style={{background: getDiscountBackground(i)}} onClick={() => {discountPrototypeClicked(i)}}>
                                    <img src={discount.image} style={{width: '50px'}} />
                                    <h5 className={['m-0', 'pt-3', 'pb-3'].join(' ')}>{discount.name}</h5>
                                </div>
                            );
                        })
                    }
                </div>
                <div className={['row', 'justify-content-around', 'mt-4'].join(' ')}>
                    <button className={['btn', 'btn-success', 'col-6'].join(' ')} onClick={createButtonClicked}>تایید</button>
                </div>
            </div>
            {initialEditPageState}
        </React.Fragment>
            
    );
}

export default AddDiscount;