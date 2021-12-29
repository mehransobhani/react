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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function ListDiscount() {

    const [open, setModalOpen] = React.useState(false);
    const [discounts, setDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState([null]);

    const [startDateInputState, setStartDateInputState] = useState(new Date());
    const [finishDateInputState, setFinishDateInputState] = useState(new Date());

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');
    const [filtersDisplayClass, setFiltersDisplayClass] = useState('d-none');
    const [maxPage, setMaxPage] = useState(1);
    const [p, setP] = useState(1);
    const [useStartDateFilter, setUseStartDateFilter] = useState(false);
    const [useFinishDateFilter, setUseFinishDateFilter] = useState(false);
    const [activeDiscountsStatus, setActiveDiscountsStatus] = useState(0);
    const [discountTypeFilter, setDiscountTypeFilter] = useState('all');

    const vertical = 'bottom';
    const horizontal = 'left';
    const discountTypes = [
        {type: 'all',       name: 'تمام تخفیف‌ها'},
        {type: 'product',   name: 'تخفیفات مخصوص محصول'}, 
        {type: 'category',  name: 'تخفیفات مخصوص دسته‌بندی'}, 
        {type: 'order',     name: 'تخفیفات مخصوص سفارش'}, 
        {type: 'shipping',  name: 'تخفیفات مخصوص ارسال'}, 
        {type: 'code',      name: 'تخفیفات با کدتخفیف'}
    ];

    useEffect(() => {

    }, []);

    const handleClickOpen = (discount) => {
        setSelectedDiscount(discount);
        setModalOpen(true);
    };

    const handleClose = () => {
        setAlertOpen(false);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    }

    const getPersianDiscountType = (type) => {
        switch(type){
            case 'product':
                return 'محصول';
            case 'category':
                return 'دسته‌بندی';
            case 'order':
                return 'سبدخرید';
            case 'shipping':
                return 'حمل و نقل';
        }
    }

    /*useEffect(() => {
        axios.post(Constants.apiUrl + '/api/discounts-basic-information').then((response) => {
            if(response.data.status === 'done'){
                setDiscounts(response.data.discounts);

                console.log(response.data.discounts);
            }else{
                console.log('not done');
            }
        }).catch((e) => {
            console.log(e);
        });
    }, []);*/

    useEffect(() => {
        axios.post(Constants.apiUrl + '/api/filtered-paginated-discounts', {
            page: 1,
            type: 'all',
            startDate: 0,
            finishDate: 0,
            active: 0,
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                if(response.found === true){
                    setMaxPage(response.maxPage);
                    setDiscounts(response.discounts);
                }else{
                    console.warn(response.message);
                    alert(response.umessage);
                }
            }else if(response.status === 'failed'){
                console.warn(response.message);
                alert(response.umessage);
            }
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    const receiveDiscounts = (obj) => {
        let startDate = 0;
        let finishDate = 0;
        let page = 1;
        if(useStartDateFilter){
            startDate = Math.floor(startDateInputState / 1000); 
        }
        if(useFinishDateFilter){
            finishDate = Math.floor(finishDateInputState / 1000);
        }
        if(obj.page !== undefined){
            page = obj.page;
        }
        axios.post(Constants.apiUrl + '/api/filtered-paginated-discounts', {
            page: page,
            type: discountTypeFilter,
            startDate: startDate,
            finishDate: finishDate,
            active: activeDiscountsStatus,
        }).then((res) => {
            let response = res.data;
            if(response.status === 'done'){
                if(response.found === true){
                    setMaxPage(response.maxPage);
                    setDiscounts(response.discounts);
                }else{
                    console.warn(response.message);
                    alert(response.umessage);
                }
            }else if(response.status === 'failed'){
                console.warn(response.message);
                alert(response.umessage);
            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });
    }

    const toggleDiscount = (discount) => {
        axios.post(Constants.apiUrl + '/api/toggle-discount', {
            discountId: discount.discountId
        }).then((response) => {
            if(response.data.status === 'done'){
                let discountsArray = [];
                for(let dscnt of discounts){
                    if(dscnt.discountId !== discount.discountId){
                        discountsArray.push(dscnt);
                    }else{
                        discountsArray.push({discountId: dscnt.discountId, title: dscnt.title, type: dscnt.type, status: response.data.newStatus});
                    }
                }
                setDiscounts(discountsArray);
                setAlertSeverity('success');
                setAlertMessage('عملیات با موفقیت انجام شد');
                setAlertOpen(true);
            }else{
                console.log('not done toggle');
                setAlertSeverity('warning');
                setAlertMessage(response.data.message);
                setAlertOpen(true);
            }
        }).catch((e) => {
            console.log(e);
            setAlertSeverity('error');
            setAlertMessage('مشکلی در ارسال درخواست بوجود آمد');
            setAlertOpen(true);
        });
    }

    const paginationChanged = () => {

    }

    const startDateCheckboxChanged = (event) => {
        if(event.target.checked){
            setUseStartDateFilter(true);
        }else{
            setUseStartDateFilter(false);
        }
    }

    const finishDateCheckboxChanged = (event) => {
        if(event.target.checked){
            setUseFinishDateFilter(true);
        }else{
            setUseFinishDateFilter(false);
        }
    }

    const activeCheckboxChanged = (event) => {
        if(event.target.checked){
            setActiveDiscountsStatus(1);
        }else{
            setActiveDiscountsStatus(0);
        }
    }

    const discountTypeSelectboxChanged = (event) => {
        setDiscountTypeFilter(event.target.value);
    }

    const searchButtonClicked = () => {
        receiveDiscounts({page: 1});
    }

    return (
        <React.Fragment>
        <div className={['container-fluid'].join(' ')}>
            <div className={['row', 'text-center', 'justify-content-center'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'rtl', 'text-right', 'align-items-center', 'px-0', 'mb-2'].join(' ')}>
                    <button onClick={()=>{setFiltersDisplayClass('d-flex')}} className={[ filtersDisplayClass === 'd-none' ? '' : 'd-none', 'px-3', 'py-1', 'pointer', 'mt-0'].join(' ')} style={{fontSize: '14px', background: '#F2F2F2', borderRadius: '3px', border: 'none', outlineStyle: 'none'}}>جستجوی پیشرفته</button>
                    <div className={[filtersDisplayClass, 'flex-row', 'rtl', 'text-right', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                        <h6 className={['mb-0', 'pl-2', 'pt-0', 'font14'].join(' ')} style={{}}>فیلتر برحسب نوع :‌ </h6>
                        <select className={['mt-0', 'font14'].join(' ')} onChange={discountTypeSelectboxChanged}>
                            {
                                discountTypes.map((item, counter) => {
                                    return (
                                        <option className={['customOption'].join(' ')} value={item.type}>{item.name}</option>
                                    );
                                })
                            }
                        </select>
                        <input type='checkbox' onChange={startDateCheckboxChanged} className={['mt-0', 'mr-3', 'pointer'].join(' ')} />
                        <h6 className={['mb-0', 'text-right', 'rtl', 'mr-1', 'pt-0', 'pl-1', 'font14'].join(' ')}>تاریخ شروع : </h6>
                        <DatePicker className={['font14'].join(' ')} style={{direction: 'rtl'}} value={startDateInputState} onClickSubmitButton={value => {setStartDateInputState(value.value._d)}} />
                        <input type='checkbox' onChange={finishDateCheckboxChanged} className={['mt-0', 'mr-3', 'pointer'].join(' ')} />
                        <h6 className={['mb-0', 'text-right', 'rtl', 'mr-1', 'pt-0', 'pl-1', 'font14'].join(' ')}>تاریخ پایان : </h6>
                        <DatePicker className={['font14'].join(' ')} style={{direction: 'rtl'}} value={startDateInputState} onClickSubmitButton={value => {setStartDateInputState(value.value._d)}} />
                        <input type='checkbox' onChange={activeCheckboxChanged} className={['mt-0', 'mr-3', 'pointer'].join(' ')} />
                        <h6 className={['mb-0', 'text-right', 'rtl', 'mr-1', 'pt-0', 'pl-1', 'font14'].join(' ')}>نمایش تخفیف‌های فعال</h6>
                        <button onClick={searchButtonClicked} className={['px-3', 'py-1', 'mt-0', 'mr-3', 'mb-0', 'pointer', 'font14'].join(' ')} style={{borderRadius: '3px', background: 'green', color: 'white', border: 'none', outlineStyle: 'none'}}>جستجو</button>
                    </div>
                </div>
            </div>
            {
                discounts.map((discount, counter) => {
                    return(
                        <div className={['row', 'rounded', 'align-items-center', 'mb-1'].join(' ')} style={{direction: 'rtl', backgroundColor: '#f2f2f2'}}>
                            <p className={['col-2', 'm-0', 'p-1', 'pr-3', 'text-right'].join(' ')}>{counter + 1}</p>
                            <p className={['col-6', 'm-0', 'p-1', 'text-right'].join(' ')}>{discount.title}</p>
                            <p className={['col-2', 'm-0', 'p-1', 'text-center'].join(' ')}>{getPersianDiscountType(discount.type)}</p> 
                            <div className={['col-1', 'text-left'].join(' ')}><img src={discount.status === 1 ? powerOnImage : powerOffImage} onClick={() => {toggleDiscount(discount)}} className={['pointer'].join(' ')} style={{width: '24px'}}/></div>
                            <div className={['col-1', 'text-left'].join(' ')}><img src={settingsImage} onClick={() => {handleClickOpen(discount)}} className={['pointer'].join(' ')} style={{width: '24px'}}/></div>
                        </div>
                    );
                })
            }
            <div className={['row'].join(' ')}>
                <div className={['col-12', 'text-center', 'd-flex', 'flex-row', 'justify-content-center', 'mt-2'].join(' ')}>
                    <Pagination count={maxPage} shape='rounded' onChange={paginationChanged} page={p} hideNextButton={true} hidePrevButton={true} />
                </div>
            </div>
        </div>
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} fullScreen={false} maxWidth='lg' fullWidth={true} >
            {selectedDiscount !== null ? <EditDiscount type={selectedDiscount.type} id={selectedDiscount.discountId} close={handleModalClose} /> : null}
        </Dialog>
        <Snackbar open={alertOpen} onClose={handleClose} onClick={handleClose} message="" autoHideDuration={1500} anchorOrigin={{ vertical, horizontal }}>
            <Alert severity={alertSeverity} icon={false}>{alertMessage}</Alert>
        </Snackbar>
        </React.Fragment>
    );
}

export default ListDiscount;
