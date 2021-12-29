import React, { useEffect, useState } from 'react';
import LeftArrowBlackImage from '../../../assets/images/left_arrow_black.png';
import SettingsLinearBlackImage from '../../../assets/images/settings_linear_black.png';
import boxImage from '../../../assets/images/box_black.png'
import truckImage from '../../../assets/images/truck_black.png';
import cartImage from '../../../assets/images/cart_black.png';
import categoryImage from '../../../assets/images/category_black.png';
import axios from 'axios';
import { DatePicker } from "jalali-react-datepicker";
import UserLimiter from './Limiter/UserLimiter.js';
import ProvinceLimiter from './Limiter/ProvinceLimiter.js';
import ProductLimiter from './Limiter/ProductLimiter.js';
import CategoryLimiter from './Limiter/CategoryLimiter.js';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import * as Constants from '../../../constants/urls';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const DiscountEdit = (props) => {

    const type = props.type;
    const id = props.id;
    const [typeCheckboxState, setTypeCheckboxState] = useState("percent");
    const [codeCheckboxState, setCodeCheckboxState] = useState(0);
    const [minPriceCheckboxState, setMinPriceCheckbox] = useState(0);
    const [maxPriceCheckboxState, setMaxPriceCheckbox] = useState(0);
    const [numberCheckboxState, setNumberCheckboxState] = useState(0); 
    const [expirationDateCheckboxState, setExpirationDateCheckboxState] = useState(0);
    const [statusState, setStatusState] = useState(0);
    const [reusableState, setReusableState] = useState(0);
    const [neworderState, setNeworderState] = useState(0);
    const [gapCheckboxState, setGapCheckboxState] = useState(0);
    const [userGapCheckboxState, setUserGapCheckboxState] = useState(0);
    const [joinableCheckboxState, setJoinableCheckboxState] = useState(1);

    const [titleInputState, setTitleInputState] = useState(null);
    const [descriptionInputState, setDescriptionInputState] = useState(null);
    const [valueInputState, setValueInputState] = useState('');
    const [codeInputState, setCodeInputState] = useState(null);
    const [minPriceInputState, setMinPriceInputState] = useState('');
    const [maxPriceInputState, setMaxPriceInputState] = useState('');
    const [numbersLeftInputState, setNumbersLeftInputState] = useState('');
    const [expirationDateInputState, setExpirationDateInputState] = useState(new Date());
    const [startDateInputState, setStartDateInputState] = useState(new Date());
    const [finishDateInputState, setFinishDateInputState] = useState(new Date());
    const [userStartDateInputState, setUserStartDateInputState] = useState(new Date());
    const [userFinishDateInputState, setUserFinishDateInputState] = useState(new Date());

    const [userLimiter, setUserLimiter]=  useState({show: false, class: 'btn-outline-info'});
    const [productLimiter, setProductLimiter] = useState({show: false, class: 'btn-outline-info'});
    const [categoryLimiter, setCategoryLimiter] = useState({show: false, class: 'btn-outline-info'});
    const [provinceLimiter, setProvinceLimiter] = useState({show: false, class: 'btn-outline-info'});

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    const vertical = 'bottom';
    const horizontal = 'left';

    const handleClose = () => {
        setAlertOpen(false);
    }

    let formDescription = null;
    let formPercent = null;
    let formPrice = null;
    let formCode = null;
    let formMinPrice = null;
    let formMaxPrice = null;
    let formNumbersLeft = null;
    let formStartDate = null;
    let formFinishDate = null;
    let formUserStartDate = null;
    let formUserFinishDate = null;
    let formExpirationDate = null;

    const editButtonClicked = () => {
        let error = false;

        if(titleInputState == ''){
            error = true;
            console.log('title is empty');
        }

        if(typeCheckboxState === 'percent' && valueInputState != ''){
            formPercent = valueInputState;
            formPrice = null;
        }else if(typeCheckboxState === 'price' && valueInputState != ''){
            formPercent = null;
            formPrice = valueInputState;
        }else{
            error = true;
            console.log('type error');
        }

        if(descriptionInputState != ''){
            formDescription = descriptionInputState;
        }else{
            formDescription = null;
        }

        if(codeCheckboxState === 0){
            formCode = null;
        }else if(codeCheckboxState === 1 && codeInputState != ''){
            formCode = codeInputState;
        }else{
            error = true;
            console.log('code error');
        }

        if(minPriceCheckboxState === 0){
            formMinPrice = null;
        }else if(minPriceCheckboxState === 1 && minPriceInputState != '' && !isNaN(minPriceInputState)){
            formMinPrice = minPriceInputState;
        }else{
            error = true;
            console.log('minprice error');
        }

        if(maxPriceCheckboxState === 0){
            formMaxPrice = null;
        }else if(maxPriceCheckboxState === 1 && maxPriceInputState != '' && !isNaN(maxPriceInputState)){
            formMaxPrice = maxPriceInputState;
        }else{
            error = true;
            console.log('maxprice error');
        }

        if(numberCheckboxState === 0){
            formNumbersLeft = null;
        }else if(numberCheckboxState === 1 && numbersLeftInputState != '' && !isNaN(numbersLeftInputState)){
            formNumbersLeft = numbersLeftInputState;
        }else{
            error = true;
            console.log('numbersleft error');
        }

        if(expirationDateCheckboxState === 0){
            formExpirationDate = null;
        }else if(expirationDateCheckboxState === 1){
            formExpirationDate = Math.floor(expirationDateInputState / 1000);
        }else{
            error = true;
            console.log('expiration date error');
        }

        if(gapCheckboxState === 0){
            formStartDate = null;
            formFinishDate = null;
        }else if(gapCheckboxState === 1){
            formStartDate = Math.floor(startDateInputState / 1000);
            formFinishDate = Math.floor(finishDateInputState / 1000);
        }else{
            error = true;
            console.log('gap error');
        }

        if(userGapCheckboxState === 0){
            formUserStartDate = null;
            formUserFinishDate = null;
        }else if(userGapCheckboxState === 1){
            formUserStartDate = Math.floor(userStartDateInputState / 1000);
            formUserFinishDate = Math.floor(userFinishDateInputState / 1000);
        }else{
            error = true;
            console.log('user gap error');
        }

        if(error){
            setAlertSeverity('warning');
            setAlertMessage('لطفا اطلاعات خواسته‌شده رابه درستی وارد کنید');
            setAlertOpen(true);
        }
        if(!error){
            axios.post(Constants.apiUrl + '/api/edit-discount', {
                discountId: id,
                title: titleInputState,
                description: formDescription,
                percent: formPercent,
                price: formPrice,
                code: formCode,
                minPrice: formMinPrice,
                maxPrice: formMaxPrice,
                neworder: neworderState,
                numbersLeft: formNumbersLeft,
                startDate: formStartDate,
                finishDate: formFinishDate,
                userStartDate: formUserStartDate, 
                userFinishDate: formUserFinishDate,
                reusable: reusableState,
                joinable: joinableCheckboxState,
                expirationDate: formExpirationDate,
                status: statusState
            }).then((response) => {
                if(response.data.status === 'done'){
                    setAlertSeverity('success');
                    setAlertMessage('ویرایش با موفقیت انجام شد');
                    setAlertOpen(true);
                }else{
                    setAlertSeverity('warning');
                    setAlertMessage('اطلاعات ذخیره نشدند');
                    setAlertOpen(true);
                    console.log(response.data.message);
                }
            }).catch((e) => {
                setAlertSeverity('error');
                setAlertMessage('مشکلی در اتصال رخ داده است');
                setAlertOpen(true);
                console.log(e);
            });
        }

    }

    const percentCheckboxClicked = () => {
        setTypeCheckboxState("percent");
    }
    const priceCheckboxClicked = () => {
        setTypeCheckboxState("price");
    }
    const codefulCheckboxClicked = () => {
        setCodeCheckboxState(1);
    }
    const codelessCheckboxClicked = () => {
        setCodeCheckboxState(0);
    }
    const hasMinPriceCheckboxClicked = () => {
        setMinPriceCheckbox(1);
    }
    const hasnotMinPriceCheckboxClicked = () => {
        setMinPriceCheckbox(0);
    }
    const hasMaxPriceCheckboxClicked = () => {
        setMaxPriceCheckbox(1);
    }
    const hasnotMaxPriceCheckboxClicked = () => {
        setMaxPriceCheckbox(0);
    }
    const hasNumberCheckboxClicked = () => {
        setNumberCheckboxState(1);
    }
    const hasnotNumberCheckboxClicked = () => {
        setNumberCheckboxState(0);
    }
    const hasExpirationDateCheckboxClicked = () => {
        setExpirationDateCheckboxState(1);
    }
    const hasnotExpirationDateCheckboxClicked = () => {
        setExpirationDateCheckboxState(0);
    }
    const activateDiscountCheckboxClicked = () => {
        setStatusState(1);
    }
    const disableDiscountCheckboxClicked = () => {
        setStatusState(0);
    }
    const isReusableCheckboxClicked = () => {
        setReusableState(1);
    }
    const isnotReusableCheckboxClicked = () => {
        setReusableState(0);
    }
    const isForNewordersCheckboxClicked = () => {
        setNeworderState(1);
    }
    const isnotForNewordersCheckboxClicked = () => {
        setNeworderState(0);
    }
    const isForGapCheckboxClicked = () => {
        setGapCheckboxState(1);
    }
    const isnotForGapCheckboxClicked = () => {
        setGapCheckboxState(0);
    }
    const isForUserGapCheckboxClicked = () => {
        setUserGapCheckboxState(1);
    }
    const isnotForUserGapCheckboxClicked = () => {
        setUserGapCheckboxState(0);
    }
    const isJoinableCheckboxClicked = () => {
        setJoinableCheckboxState(1);
    }
    const isnotJoinableCheckboxClicked = () => {
        setJoinableCheckboxState(0);
    }

    const typeValueChanged = (event) =>{
        let value = event.target.value;
        if(!isNaN(value)){
            setValueInputState(value);
        }else{
            setValueInputState(null);
        }         
    }

    const getInitialData  = () => {
        axios.post(Constants.apiUrl + '/api/discount-information',{
            id: id
        }).then((response) => {
            console.log(response.data);
            setTitleInputState(response.data.title);
            setDescriptionInputState(response.data.description);
            if(response.data.price !== null){
                setValueInputState(response.data.price);
            }else if(response.data.percent !== null){
                setValueInputState(response.data.percent);
            }
            setCodeInputState(response.data.code);
            setMinPriceInputState(response.data.min_price);
            setMaxPriceInputState(response.data.max_price);
            setNumbersLeftInputState(response.data.numbers_left);
            setJoinableCheckboxState(response.data.joinable);
            
            if(response.data.percent !== null){
                setTypeCheckboxState('percent');
            }else if(response.data.price !== null){
                setTypeCheckboxState('price');
            }

            if(response.data.code !== null){
                setCodeCheckboxState(1);
            }

            if(response.data.min_price !== null){
                setMinPriceCheckbox(1);
            }

            if(response.data.max_price !== null){
                setMaxPriceCheckbox(1);
            }

            if(response.data.numbers_left !== null){
                setNumberCheckboxState(1);
            }

            if(response.data.status === 1){
                setStatusState(1);
            }

            if(response.data.reusable === 1){
                setReusableState(1);
            }

            if(response.data.start_date !== null && response.data.finish_date !== null){
                setStartDateInputState(response.data.start_date * 1000);
                setFinishDateInputState(response.data.finish_date * 1000);
                setGapCheckboxState(1);
            } 

            if(response.data.user_start_date !== null && response.data.user_finish_date){ 
                setUserStartDateInputState(response.data.user_start_date * 1000); 
                setUserFinishDateInputState(response.data.user_finish_date * 1000); 
                setUserGapCheckboxState(1); 
            } 

            if(response.data.expiration_date !== null){
                setExpirationDateInputState(response.data.expiration_date * 1000);
                setExpirationDateCheckboxState(1);
            }

            if(response.data.neworder === 1){
                setNeworderState(1);
            }

            if(response.data.joinable === 1){
                setJoinableCheckboxState(1);
            }
            
        }).catch((error) => {
            console.log(error);
        });
    } 

    useEffect(() => {
        getInitialData();
    }, []);

    const titleChanged = (event) => {
        setTitleInputState(event.target.value.trim());
    }
    const descriptionChanged = (event) => {
        setDescriptionInputState(event.target.value.trim());
    }
    const codeChanged = (event) => {
        setCodeInputState(event.target.value.trim());
    }
    const minPriceChanged = (event) => {
        setMinPriceInputState(event.target.value.trim());
    }
    const maxPriceChanged = (event) => {
        setMaxPriceInputState(event.target.value.trim());
    }
    const numberChanged = (event) => {
        setNumbersLeftInputState(event.target.value.trim());
    }

    const userLimiterClicked = () => {
        if(userLimiter.show){
            setUserLimiter({show: false, class: 'btn-outline-info'});
        }else{
            setUserLimiter({show: true, class: 'btn-info'});
        }
        setProductLimiter({show: false, class: 'btn-outline-info'});
        setCategoryLimiter({show: false, class: 'btn-outline-info'});
        setProvinceLimiter({show: false, class: 'btn-outline-info'});
    }

    const provinceLimiterClicked = () => {
        if(provinceLimiter.show){
            setProvinceLimiter({show: false, class: 'btn-outline-info'});
        }else{
            setProvinceLimiter({show: true, class: 'btn-info'});
        }
        setProductLimiter({show: false, class: 'btn-outline-info'});
        setCategoryLimiter({show: false, class: 'btn-outline-info'});
        setUserLimiter({show: false, class: 'btn-outline-info'});
    }

    const productLimiterClicked = () => {
        if(productLimiter.show){
            setProductLimiter({show: false, class: 'btn-outline-info'});
        }else{
            setProductLimiter({show: true, class: 'btn-info'});
        }
        setProvinceLimiter({show: false, class: 'btn-outline-info'});
        setCategoryLimiter({show: false, class: 'btn-outline-info'});
        setUserLimiter({show: false, class: 'btn-outline-info'});
    }

    const categoryLimiterClicked = () => {
        if(categoryLimiter.show){
            setCategoryLimiter({show: false, class: 'btn-outline-info'});
        }else{
            setCategoryLimiter({show: true, class: 'btn-info'});
        }
        setProvinceLimiter({show: false, class: 'btn-outline-info'});
        setProductLimiter({show: false, class: 'btn-outline-info'});
        setUserLimiter({show: false, class: 'btn-outline-info'});
    }

    return(
        <React.Fragment>
        <div className={['container-fluid', 'text-center', 'rounded', 'shadow', 'mt-2', 'pt-2', 'pb-2'].join(' ')} style={{direction: 'rtl'}}>
            <img src={type === 'product' ? boxImage : (type === 'category' ? categoryImage : (type === 'shipping' ? truckImage : (type === 'order' ? cartImage : null)))} style={{width: '46px'}} />
            <div className={['col-12', 'text-right', 'mt-2', 'p-0'].join(' ')}>
                <img src={SettingsLinearBlackImage} style={{width: '30px'}} />
                <p className={['text-right', 'd-inline', 'mb-0', 'mr-2'].join(' ')}>تنظیمات عمومی</p>
            </div>
            <div className={['row', 'mt-3'].join(' ')}>
                <div className={['col-6', 'text-right'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>عنوان :</p>
                    <input type="text" onChange={titleChanged} className={['text-right', 'form-control'].join(' ')} style={{direction: 'rtl'}} defaultValue={titleInputState} placeholder = "عنوان تخفیف" />
                </div>
                <div className={['col-6'].join(' ')}></div>
                <div className={['col-6', 'text-right', 'mt-4'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>توضیحات :</p>
                    <input type="text" onChange={descriptionChanged} className={['text-right', 'form-control'].join(' ')} style={{direction: 'rtl'}} defaultValue={descriptionInputState} placeholder="توضیحات تخفیف (درصورت نیاز)"/>
                </div>
            </div>
            <div className={['row', 'mt-4'].join(' ')}>
                <div className={['col-6', 'text-right'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>نوع تخفیف :</p>
                    <input type="checkbox" className={['mr-2']} onChange={percentCheckboxClicked} checked={typeCheckboxState === 'percent' ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>درصدی</p>
                    <input type="checkbox" className={['mr-4']} onChange={priceCheckboxClicked} checked={typeCheckboxState === 'price' ? 'checked' : ''}/>
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>قیمتی</p>
                    {
                        <input type="number" onChange={typeValueChanged} className={['form-control'].join(' ')} defaultValue={valueInputState} placeholder={typeCheckboxState === "percent" ? 'مقدار تخفیف برحسب درصد' : 'مقدار تخفیف برحسب تومان'} /> 
                    }
                </div>
                <div className={['col-6'].join(' ')}></div>
                {
                    type !== 'product' && type !== 'category' ?
                    <div className={['col-6', 'text-right', 'mt-4'].join(' ')}>
                        <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                        <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>کد تخفیف :</p>
                        <input type="checkbox" className={['mr-2']} onChange={codelessCheckboxClicked} checked={codeCheckboxState === 0 ? 'checked' : ''} />
                        <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>ندارد</p>
                        <input type="checkbox" className={['mr-4']} onChange={codefulCheckboxClicked} checked={codeCheckboxState === 1 ? 'checked' : ''} />
                        <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>دارد</p>
                        { codeCheckboxState == 1 ? <input type="text" onChange={codeChanged} className={['form-control'].join(' ')} defaultValue={codeInputState} placeholder="کد تخفیف انتخابی" /> : null}
                    </div>
                    :
                    null
                }
            </div>
            <div className={['row', 'mt-4'].join(' ')}>
                <div className={['col-6', 'text-right'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>حداقل قیمت :</p>
                    <input type="checkbox" className={['mr-2']} onChange={hasnotMinPriceCheckboxClicked} checked={minPriceCheckboxState === 0 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>ندارد</p>
                    <input type="checkbox" className={['mr-4']} onChange={hasMinPriceCheckboxClicked} checked={minPriceCheckboxState === 1 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>دارد</p>
                    { minPriceCheckboxState === 1 ? <input type="number" onChange={minPriceChanged} className={['form-control'].join(' ')} defaultValue={minPriceInputState} placeholder="حداقل قیمت برای دریافت این تخفیف به تومان" /> : null}
                </div>
                <div className={['col-6'].join(' ')}></div>
                <div className={['col-6', 'text-right', 'mt-4'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>حداکثر قیمت :</p>
                    <input type="checkbox" className={['mr-2']}  onChange={hasnotMaxPriceCheckboxClicked} checked={maxPriceCheckboxState === 0 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>ندارد</p>
                    <input type="checkbox" className={['mr-4']}  onChange={hasMaxPriceCheckboxClicked} checked={maxPriceCheckboxState === 1 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>دارد</p>
                    { maxPriceCheckboxState == 1 ? <input type="number" onChange={maxPriceChanged} className={['form-control'].join(' ')} defaultValue={maxPriceInputState} placeholder="حداکثر مقدار تخفیف به تومان" /> : null}
                </div>
            </div>
            <div className={['row', 'mt-4'].join(' ')}>
                <div className={['col-6', 'text-right'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>تعداد :</p>
                    <input type="checkbox" className={['mr-2']} onChange={hasnotNumberCheckboxClicked} checked={numberCheckboxState === 0 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>نامحدود</p>
                    <input type="checkbox" className={['mr-4']} onChange={hasNumberCheckboxClicked} checked={numberCheckboxState === 1 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>محدود</p>
                    {
                        numberCheckboxState === 1 ? <input type="number" onChange={numberChanged} className={['form-control'].join(' ')} defaultValue={numbersLeftInputState} placeholder="حداکثر تعدادی که این تخفیف میتواند مورد استفاده قرار بگیرد" /> : null
                    }
                </div>
                <div className={['col-6'].join(' ')}></div>
                <div className={['col-6', 'text-right', 'mt-4'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>تاریخ انقضاء :</p>
                    <input type="checkbox" className={['mr-2']} onChange={hasnotExpirationDateCheckboxClicked} checked={expirationDateCheckboxState === 0 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>ندارد</p>
                    <input type="checkbox" className={['mr-4']} onChange={hasExpirationDateCheckboxClicked} checked={expirationDateCheckboxState === 1 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>دارد</p>
                    {
                        expirationDateCheckboxState === 1 ? <DatePicker className={['form-control'].join(' ')} style={{direction: 'rtl'}} value={expirationDateInputState} onClickSubmitButton={value => {setExpirationDateInputState(value.value._d)}} /> : null
                    }
                </div>
                <div className={['col-6'].join(' ')}></div>
                <div className={['col-6', 'text-right', 'mt-4'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>تاریخ شروع و پایان :</p>
                    <input type="checkbox" className={['mr-2']} onChange={isnotForGapCheckboxClicked} checked={gapCheckboxState === 0 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>ندارد</p>
                    <input type="checkbox" className={['mr-4']} onChange={isForGapCheckboxClicked} checked={gapCheckboxState === 1 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>دارد</p>
                    {
                        gapCheckboxState === 1 ? 
                        <div className={[].join(' ')}>
                            <DatePicker className={['form-control'].join(' ')} style={{direction: 'rtl'}} timePicker={true} value={startDateInputState} onClickSubmitButton={value => {setStartDateInputState(value.value._d)}} />
                            <DatePicker className={['form-control'].join(' ')} style={{direction: 'rtl'}} timePicker={true} value={finishDateInputState} onClickSubmitButton={value => {setFinishDateInputState(value.value._d)}} />
                        </div>
                        : 
                        null
                    }
                </div>
            </div>
            <div className={['row', 'mt-4', 'text-right'].join(' ')}>
                <div className={['col-6', 'text-right'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>وضعیت :</p>
                    <input type="checkbox" className={['mr-2']}  onChange={activateDiscountCheckboxClicked} checked={statusState === 1 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>فعال</p>
                    <input type="checkbox" className={['mr-4']}  onChange={disableDiscountCheckboxClicked} checked={statusState === 0 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>غیرفعال</p>
                </div>
            </div>
            <div className={['col-12', 'text-right', 'mt-5', 'p-0'].join(' ')}>
                <img src={SettingsLinearBlackImage} style={{width: '30px'}} />
                <p className={['text-right', 'd-inline', 'mb-0', 'mr-2'].join(' ')}>تنظیمات اختصاصی</p>
            </div>
            <div className={['row', 'mt-3'].join(' ')}>
                <div className={['col-6', 'text-right'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>قابلیت استفاده مجدد :</p>
                    <input type="checkbox" className={['mr-2']} onChange={isReusableCheckboxClicked} checked={reusableState === 1 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>بله</p>
                    <input type="checkbox" className={['mr-4']} onChange={isnotReusableCheckboxClicked} checked={reusableState === 0 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>خیر</p>
                </div>
                <div className={['col-6'].join(' ')}></div>
                <div className={['col-6', 'text-right', 'mt-4'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>برای کاربران خرید اولی :</p>
                    <input type="checkbox" className={['mr-2']} onChange={isnotForNewordersCheckboxClicked} checked={neworderState === 0 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>خیر</p>
                    <input type="checkbox" className={['mr-4']} onChange={isForNewordersCheckboxClicked} checked={neworderState === 1 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>بله</p>
                </div>
            </div>
            <div className={['row', 'mt-4'].join(' ')}>
                <div className={['col-6', 'text-right'].join(' ')}>
                    <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                    <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>برای کاربرانی که در تاریخ‌های زیر خرید نکردند :</p>
                    <input type="checkbox" className={['mr-2']} onChange={isnotForUserGapCheckboxClicked} checked={userGapCheckboxState === 0 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>خیر</p>
                    <input type="checkbox" className={['mr-4']} onChange={isForUserGapCheckboxClicked} checked={userGapCheckboxState === 1 ? 'checked' : ''} />
                    <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>بله</p>
                    {
                        userGapCheckboxState === 1 ? 
                        <div className={[].join(' ')}>
                            <DatePicker className={['form-control'].join(' ')} style={{direction: 'rtl'}} timePicker={true} value={userStartDateInputState} onClickSubmitButton={value => {setUserStartDateInputState(value.value._d)}} />
                            <DatePicker className={['form-control'].join(' ')} style={{direction: 'rtl'}} timePicker={true} value={userFinishDateInputState} onClickSubmitButton={value => {setUserFinishDateInputState(value.value._d)}} />
                        </div>
                        : 
                        null
                    }
                </div>
                <div className={['col-6'].join(' ')}></div>
                {
                    codeCheckboxState === 1 ?
                    <div className={['col-6', 'text-right', 'mt-4'].join(' ')}>
                        <img src={LeftArrowBlackImage} style={{width: '20px'}} />
                        <p className={['text-right','mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>الحاق با سایر کدهای تخفیف :</p>
                        <input type="checkbox" className={['mr-2']} onClick={isJoinableCheckboxClicked} checked={joinableCheckboxState === 1 ? 'checked' : ''} />
                        <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>بله</p>
                        <input type="checkbox" className={['mr-4']} onClick={isnotJoinableCheckboxClicked} checked={joinableCheckboxState === 0 ? 'checked' : ''} />
                        <p className={['text-right',' mb-0', 'mr-1', 'p-0', 'd-inline'].join(' ')} style={{direction: 'rtl'}}>خیر</p>
                    </div>
                    :
                    null
                }
            </div>
            <div className={['col-12', 'text-right', 'mt-5', 'p-0'].join(' ')}>
                <img src={SettingsLinearBlackImage} style={{width: '30px'}} />
                <p className={['text-right', 'd-inline', 'mb-0', 'mr-2'].join(' ')}>تنظیمات محدودکننده</p>
            </div>
            <div className={['row', 'mt-3', 'justify-content-between', 'px-3'].join(' ')}>
                <button className={['btn', 'col-2', 'btn', userLimiter.class].join(' ')} onClick={userLimiterClicked}>کاربران</button>
                <button className={['btn', 'col-2', 'btn', provinceLimiter.class].join(' ')} onClick={provinceLimiterClicked} >استان‌ها</button>
                { props.type !== 'category' ? <button className={['btn', 'col-2', 'btn', productLimiter.class].join(' ')} onClick={productLimiterClicked} >کالاها</button> : null}
                { props.type !== 'product' ? <button className={['btn', 'col-2', 'btn', categoryLimiter.class].join(' ')} onClick={categoryLimiterClicked} >دسته‌بندی‌ها</button> : null}
            </div>
            {userLimiter.show ? <UserLimiter discountId={id} /> : null}
            {provinceLimiter.show ? <ProvinceLimiter discountId={id} /> : null}
            {productLimiter.show ? <ProductLimiter discountId={id} /> : null}
            {categoryLimiter.show ? <CategoryLimiter discountId={id} /> : null}
            <div className={['row', 'mt-4', 'text-center', 'px-3'].join(' ')}>
                <button className={['btn', 'btn-success', 'col-12'].join(' ')} onClick={editButtonClicked}>ثبت تغییرات</button>
                {
                    typeof props.close === 'function' ? <button className={['btn', 'btn-danger', 'col-12', 'mt-2'].join(' ')} onClick={props.close}>خروج</button> : null
                }
            </div>
        </div>
        <Snackbar open={alertOpen} onClose={handleClose} message="" autoHideDuration={1500} anchorOrigin={{ vertical, horizontal }}>
        <Alert severity={alertSeverity} icon={false}>
          {alertMessage}
        </Alert>
        </Snackbar>
        </React.Fragment>
    )
}

export default DiscountEdit;