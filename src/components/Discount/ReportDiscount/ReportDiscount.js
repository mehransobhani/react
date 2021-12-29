import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import EditDiscount from '../EditDiscount/DiscountEdit';
import settingsImage from '../../../assets/images/settings_yellow.png';
import powerOffImage from '../../../assets/images/power_off_circle.png';
import powerOnImage from '../../../assets/images/power_on_circle.png';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import * as Constants from '../../../constants/urls';
import { DatePicker } from "jalali-react-datepicker";
import Pagination from '@material-ui/lab/Pagination';


const ReportDiscount = () => {

    const [selectedFilterType, setSelectedFilterType] = useState('all');
    const [startDateInput, setStartDateInput] = useState(new Date());
    const [finishDateInput, setFinishDateInput] = useState(new Date());
    const [discountIdInput, setDiscountIdInput] = useState('');
    const [orderIdInput, setOrderIdInput] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [searchButtonDisplayClass, setSearchButtonDisplayClass] = useState('');
    const [discountIdCheckboxIsChecked, setDiscountIdCheckboxIsChecked] = useState(false);
    const [orderIdCheckboxIsChecked, setOrderIdCheckboxIsChecked] = useState(false);
    const [usernameCheckboxIsChecked, setUsernameCheckboxIsChecked] = useState(false);
    const [startDateCheckboxIsChecked, setStartDateCheckboxIsChecked] = useState(false);
    const [finishDateCheckboxIsChecked, setFinishDateCheckboxIsChecked] = useState(false);

    const [reports, setReports] = useState([]);
    const [p, setP] = useState(1);
    const [maxPage, setMaxPage] = useState(1);

    const filterOptions = [
        {id: 0, value: 'all', name: 'تمام گزارش‌ها'}, 
        {id: 1, value: 'confirmed', name: 'سفارش‌های تایید شده'},
        {id: 2, value: 'delivered', name: 'سفارش‌های ارسال شده'},
        {id: 3, value: 'canceled', name: 'سفارش‌های لغو شده'}, 
        {id: 4, value: 'notPaid', name: 'سفارش‌های پرداخت نشده'},
        {id: 5, value: 'code', name: 'تخفیف‌های دارای کد'}, 
        {id: 6, value: 'product', name: 'تخفیف‌های محصول'}, 
        {id: 7, value: 'category', name: 'تخفیف‌های دسته‌بندی'},
        {id: 8, value: 'shipping', name: 'تخفیف‌های حمل و نقل'},
        {id: 9, value: 'order', name: 'تخفیف‌های سفارش'}
    ];

    useEffect(() => {
        axios.post(Constants.apiUrl + '/api/filtered-paginated-discount-reports', {
            page: 1,
            type: 'all',
            orderId: 0,
            discountId: 0,
            username: '0',
            startDate: 0,
            finishDate: 0,
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                if(response.found === true){
                    setReports(response.reports);
                    setMaxPage(Math.ceil(response.count / 12));
                }else{
                    console.warn(response.message);
                    alert('موردی یافت نشد');
                }
            }else if(response.status === 'failed'){
                console.warn(response.message);
                alert(response.umessage);
            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });
    }, []);

    const discountIdCheckboxChanged = (event) => {
        setDiscountIdCheckboxIsChecked(event.target.checked);
    }

    const orderIdCheckboxChanged = (event) => {
        setOrderIdCheckboxIsChecked(event.target.checked);
    }

    const usernameCheckboxChanged = (event) => {
        setUsernameCheckboxIsChecked(event.target.checked);
    }

    const startDateCheckboxChanged = (event) => {
        setStartDateCheckboxIsChecked(event.target.checked);
    }

    const finishDateCheckboxChanged = (event) => {
        setFinishDateCheckboxIsChecked(event.target.checked);
    }

    const typeFilterSelectorChanged = (event) => {
        setSelectedFilterType(event.target.value);
    }

    const getDisplayClass = (type) => {
        if(type === 'discountId'){
            if(discountIdCheckboxIsChecked){
                return '';
            }else{
                return 'd-none';
            }
        }else if(type === 'orderId'){
            if(orderIdCheckboxIsChecked){
                return '';
            }else {
                return 'd-none';
            }
        }else if(type === 'username'){
            if(usernameCheckboxIsChecked){
                return '';
            }else{
                return 'd-none';
            }
        }else if(type === 'startDate'){
            if(startDateCheckboxIsChecked){
                return '';
            }else{
                return 'd-none';
            }
        }else if(type === 'finishDate'){
            if(finishDateCheckboxIsChecked){
                return '';
            }else{
                return 'd-none';
            }
        }
    }

    const discountIdInputChanged = (event) => {
        setDiscountIdInput(event.target.value);
    }

    const orderIdInputChanged = (event) => {
        setOrderIdInput(event.target.value);
    }

    const usernameInputChanged = (event) => {
        setUsernameInput(event.target.value);
    }

    const getNewReports = (obj) => {
        let di = 0;
        let oi = 0;
        let un = '0';
        let sd = 0;
        let fd = 0;
        let page = p;
        if(obj.page !== undefined){
            page = obj.page;
        }
        if(discountIdCheckboxIsChecked && discountIdInput.trim() !== ''){
            di = discountIdInput;
        }
        if(orderIdCheckboxIsChecked && orderIdInput.trim() !== ''){
            oi = orderIdInput;
        }
        if(usernameCheckboxIsChecked && usernameInput.trim() !== ''){
            un = usernameInput
        }
        if(startDateCheckboxIsChecked){
            sd = Math.ceil(startDateInput / 1000);
        }
        if(finishDateCheckboxIsChecked){
            fd = Math.ceil(finishDateInput / 1000);
        }
        axios.post(Constants.apiUrl + '/api/filtered-paginated-discount-reports', {
            page: page,
            type: selectedFilterType,
            username: un,
            orderId: oi,
            discountId: di, 
            startDate: sd,
            finishDate: fd
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                if(response.found === true){
                    setReports(response.reports);
                }else{
                    setReports([]);
                    alert('موردی یافت نشد');
                }
            }else if(response.status === 'failed'){

            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });
    }

    return (
        <div className={['container-fluid'].join(' ')}>
            <div className={['row'].join(' ')}>
                <div className={['col-12', 'rtl', 'text-right', 'px-0'].join(' ')}>
                    <button onClick={()=>{setSearchButtonDisplayClass('d-none')}} className={['mb-0', 'px-3', 'py-1', 'font14', 'pointer', searchButtonDisplayClass].join(' ')} style={{background: '#F2F2F2', borderRadius: '3px', border: 'none', }}>جستجوی پیشرفته</button>
                    <div className={[searchButtonDisplayClass === 'd-none' ? 'd-flex' : 'd-none', 'flex-row', 'align-items-center', 'rtl', 'text-right'].join(' ')}>
                        <h6 className={['mb-0', 'ml-1', 'font14'].join(' ')}>فیلتر : </h6>
                        <select className={['font14'].join(' ')} onChange={typeFilterSelectorChanged}>
                            {
                                filterOptions.map((item, index) => {
                                    return (
                                        <option value={item.value}>{item.name}</option>  
                                    );
                                })
                            }
                        </select>
                        <input type='checkbox' onChange={discountIdCheckboxChanged} className={['mr-3', 'ml-1', 'pointer'].join(' ')} />
                        <h6 className={['mb-0', 'mx-1', 'font14'].join(' ')}>شماره تخفیف</h6>
                        <input type='number' onChange={discountIdInputChanged} className={['font14', 'text-center', 'rtl', getDisplayClass('discountId')].join(' ')} style={{maxWidth: '140px'}} />
                        <input type='checkbox' onChange={orderIdCheckboxChanged} className={['mr-3', 'ml-1', 'pointer'].join(' ')} />
                        <h6 className={['mb-0', 'mx-1', 'font14'].join(' ')}>شماره سفارش</h6>
                        <input type='number' onChange={orderIdInputChanged} className={['font14', 'text-center', 'rtl', getDisplayClass('orderId')].join(' ')} style={{maxWidth: '140px'}} />
                        <input type='checkbox' onChange={usernameCheckboxChanged} className={['mr-3', 'ml-1', 'pointer'].join(' ')} />
                        <h6 className={['mb-0', 'mx-1', 'font14'].join(' ')}>شماره همراه کاربر</h6>
                        <input type='text' onChange={usernameInputChanged} className={['font14', 'text-center', 'rtl', getDisplayClass('username')].join(' ')} />
                        <input type='checkbox' onChange={startDateCheckboxChanged} className={['mt-0', 'mr-3', 'pointer'].join(' ')} />
                        <h6 className={['mb-0', 'text-right', 'rtl', 'mr-1', 'pt-0', 'pl-1', 'font14'].join(' ')}>تاریخ شروع</h6>
                        <DatePicker className={['font14', 'text-center', getDisplayClass('startDate')].join(' ')} style={{direction: 'rtl'}} value={startDateInput} onClickSubmitButton={value => {setStartDateInput(value.value._d)}} />
                        <input type='checkbox' onChange={finishDateCheckboxChanged} className={['mt-0', 'mr-3', 'pointer'].join(' ')} />
                        <h6 className={['mb-0', 'text-right', 'rtl', 'mr-1', 'pt-0', 'pl-1', 'font14'].join(' ')}>تاریخ پایان</h6>
                        <DatePicker className={['font14', 'text-center', getDisplayClass('finishDate')].join(' ')} style={{direction: 'rtl'}} value={finishDateInput} onClickSubmitButton={value => {setFinishDateInput(value.value._d)}} />
                        <button onClick={getNewReports} className={['mr-3', 'px-3', 'py-1', 'font14', 'pointer'].join(' ')} style={{background: '#28a745', color: 'white', border: 'none', borderRadius: '3px'}}>جستجو</button>
                    </div>
                </div>
            </div>
            {
                reports.length !== 0
                ?
                (
                    <div className={['row', 'py-1', 'mt-2'].join(' ')} style={{background: '#F2F2F2', borderRadius: '3px'}}>
                        <h6 className={['col-1', 'mb-0', 'text-right', 'font14'].join(' ')} style={{color: '#00BAC6'}}>ردیف</h6>
                        <h6 className={['col-1', 'mb-0', 'text-center', 'font14'].join(' ')} style={{color: '#00BAC6'}}>شماره تخفیف</h6>
                        <h6 className={['col-4', 'mb-0', 'text-right', 'font14'].join(' ')} style={{color: '#00BAC6'}}>عنوان تخفیف</h6>
                        <h6 className={['col-2', 'mb-0', 'text-right', 'font14'].join(' ')} style={{color: '#00BAC6'}}>نام کاربر</h6>
                        <h6 className={['col-1', 'mb-0', 'text-right', 'font14'].join(' ')} style={{color: '#00BAC6'}}>شماره تلفن کاربر</h6>
                        <h6 className={['col-1', 'mb-0', 'text-center', 'font14', 'rtl'].join(' ')} style={{color: '#00BAC6'}}>شماره سفارش</h6>
                        <h6 className={['col-2', 'mb-0', 'text-left', 'font14', 'rtl'].join(' ')} style={{color: '#00BAC6'}}>تاریخ سفارش</h6>
                    </div>
                )
                :
                null
            }
            {
                reports.map((report, index) => {
                    return(
                        <div key={index} className={['row', 'py-1', 'mt-2'].join(' ')} style={{background: '#F2F2F2', borderRadius: '3px'}}>
                            <h6 className={['col-1', 'mb-0', 'text-right', 'font14'].join(' ')}>{index + 1}</h6>
                            <h6 className={['col-1', 'mb-0', 'text-center', 'font14'].join(' ')}>{report.discountId}</h6>
                            <h6 className={['col-4', 'mb-0', 'text-right', 'font14'].join(' ')}>{report.discountTitle}</h6>
                            <h6 className={['col-2', 'mb-0', 'text-right', 'font14'].join(' ')}>{report.uname}</h6>
                            <h6 className={['col-1', 'mb-0', 'text-right', 'font14'].join(' ')}>{report.username}</h6>
                            <h6 className={['col-1', 'mb-0', 'text-center', 'font14', 'rtl'].join(' ')}>{report.orderId}</h6>
                            <h6 className={['col-2', 'mb-0', 'text-left', 'font14', 'rtl'].join(' ')}>1400/10/06 12:24:09</h6>
                        </div>
                    );
                })
            }
        </div>  
    );
}

export default ReportDiscount;