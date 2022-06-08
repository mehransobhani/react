import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as constantUrls from '../../../constants/urls';
import { DatePicker } from "jalali-react-datepicker";
import leftArrowBlackImage from '../../../assets/images/left_arrow_black.png';
import enterBlackImage from '../../../assets/images/enter_key_black.png';
import { useCookies } from 'react-cookie';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


const AddSpecialDiscount = (props) => {

    const [allActiveCategoriesInformation, setAllActiveCategoriesInformation] = useState([]);
    const [discountId, setDiscountId] = useState(props.id);
    const [filtersDisplayClass, setFiltersDisplayClass] = useState('d-none');
    const [startDateInputState, setStartDateInputState] = useState(new Date());
    const [endDateInputState, setEndDateInputState] = useState(new Date());
    const [discountStartDateInputState, setDiscountStartDateInputState] = useState(new Date()); //
    const [discountFinishDateInputState, setDiscountFinishDateInputState] = useState(new Date());   //
    const [discountExpirationDateInputState, setDiscountExpirationDateInputState] = useState(new Date());   //
    const [productsInformation, setProductsInformation] = useState([]);
    const [categoryId, setCategoryId] = useState(-1);
    const [focusedProductIndex, setFocusedProductIndex] = useState(-1);
    const [productsDiscountInformation, setProductsDiscountInformation] = useState([]);
    const [expirationDateIsChecked, setExpirationDateIsChecked] = useState(false);
    const [startAndFinishDateIsChecked, setStartAndFinishDateIsChecked] = useState(false);
    const [discountStatus, setDiscountStatus] = useState(0);                  //
    const [discountTitle, setDiscountTitle] = useState('');                   //
    const [discountDescription, setDiscountDescription] = useState('');       //
    const [selectedProductsInformation, setSelectedProductsInformation] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState(0);
    const [focusedProductIndexForEdit, setFocusedProductIndexForEdit] = useState(-1);
    const [manipulatedProductEditInformation, setManipulatedProductEditInformation] = useState([]);
    const [priceBoundaryCheckboxChecked, setPriceBoundaryCheckboxChecked] = useState(false);
    const [priceBoundaryMinPrice, setPriceBoundaryMinPrice] = useState('');
    const [priceBoundaryMaxPrice, setPriceBoundaryMaxPrice] = useState('');
    const [sleepCheckboxChecked, setSleepCheckboxChecked] = useState(false);
    const [stockCheckboxChecked, setStockCheckboxChecked] = useState(false);
    const [factorDateChecked, setFactorDateChecked] = useState(false);
    const [discountInformation, setDiscountInformation] = useState(null);
    
const [minStock, setMinStock] = useState('');
    const [maxStock, setMaxStock] = useState('');
    const [minSleep, setMinSleep] = useState('');
    const [maxSleep, setMaxSleep] = useState('');

    const [cookies, setCookie, removeCookie] = useCookies();

    useEffect(() => {
        axios.post(constantUrls.apiUrl + '/api/active-categories', {
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                setAllActiveCategoriesInformation(response.categories);
            }else{
                alert('here is the error');
                alert(response.umessage);
            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });
    }, []);

    useEffect(() => {
        if(props.stage === 'secondEdit'){
            axios.post(constantUrls.apiUrl + '/api/discount/multi-product-discount-products', {
                discountId: discountId
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token,
                }
            }).then((r) => {
                let response = r.data;
                if(response.status === 'done'){
                    if(response.found === true){
                        setSelectedProductsInformation(response.products);
                    }
                }else if(response.status === 'failed'){
                    alert(response.umessage);
                }
            }).catch((e) => {
                console.error(e);
                alert('خطا در برقراری ارتباط');
            });
        }
    }, []);

    useEffect(() => {
        if(props.stage === 'secondEdit'){
            axios.post(constantUrls.apiUrl + '/api/discount/multi-product-discount-information', {
                discountId: discountId   
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token,
                }
            }).then((r)=> {
                let response = r.data;
                if(response.status === 'done'){
                    setDiscountInformation(response.information);
                    setDiscountTitle(response.information.title);
                        setDiscountDescription(response.information.description);
                        setDiscountStatus(response.information.status);
                        if(response.information.start_date != null){
                            setDiscountStartDateInputState(new Date(response.information.start_date * 1000));
                        }
                        if(response.information.finish_date != null){
                            setDiscountFinishDateInputState(new Date(response.information.finish_date * 1000));
                        }
                        if(response.information.expiration_date != null){
                            setDiscountExpirationDateInputState(new Date(response.information.expiration_date * 1000))
                            setExpirationDateIsChecked(true);
                        }
                        if(response.information.start_date != null && response.information.finish_date != null){
                            setStartAndFinishDateIsChecked(true);
                        }
                }else if(response.status === 'failed'){
                    console.warn(response.message);
                    alert(response.umessage);
                }
            }).catch((e) => {
                console.error(e);
                alert('خطا در برقراری ارتباط');
            })
        }
    }, []);

    const getSectionDisplayClass = (i) => {
        if(i === selectedSectionId){
            return 'activeTopMenuButton';
        }else{
            return 'deactiveTopMenuButton';
        }
    }

    const getNewProducts = (obj) => {
        let c = categoryId;
        if(obj.categoryId !== undefined){
            c = obj.categoryId;
        }

        let minP = '';
        let maxP = '';
        let minSt = '';
        let maxSt = '';
        let minSl = '';
        let maxSl = '';
        let sd = '';
        let ed = '';

        if(priceBoundaryCheckboxChecked){
            minP = priceBoundaryMinPrice;
            maxP = priceBoundaryMaxPrice;
        }
        if(stockCheckboxChecked){
            minSt = minStock;
            maxSt = maxStock;
        }
        if(sleepCheckboxChecked){
            minSl = minSleep;
            maxSl = maxSleep;
        }
        if(factorDateChecked){
            sd = Math.floor(startDateInputState / 1000);
            ed = Math.floor(endDateInputState / 1000);
        }

        axios.post(constantUrls.apiUrl + '/api/discount/no-paginated-filter-category-products', {
            discountId: discountId,
            categoryId: c,
            minPrice: minP,
            maxPrice: maxP,
            minSleep: minSl,
            maxSleep: maxSl,
            minStock: minSt,
            maxStock: maxSt,
            minFactor: sd,
            maxFactor: ed,
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                if(response.found === true){
                    setProductsInformation(response.products);
                }else if(response.found === false){
                    setProductsInformation([]);
                }
                let newProductsDiscountInformation = [];
                response.products.map((product, index) => {
                    newProductsDiscountInformation.push({id: product.id, percent: 0, price: 0, finalStock: 0});
                });
                setProductsDiscountInformation(newProductsDiscountInformation);
            }else if(response.status === 'failed'){
                alert('مشکلی پیش آمده');
            }
        }).catch((e) => {
            console.error(e);
            alert("خطا در برقراری ارتباط");
        });
        setFocusedProductIndex(-1);
    }

    const categorySelectorChanged = (event) => {
        if(event.target.value !== categoryId){
            setCategoryId(event.target.value);
            getNewProducts({categoryId: event.target.value});
        }
    }

    const searchButtonClicked = () => {
        getNewProducts({});
    }

    const productPercentInputChanged = (event) => {
        if(event.target.value != '' && event.target.value !== 0){
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                if(focusedProductIndex === index){
                    product.percent = parseInt(event.target.value);
                    newProductDiscountInformation.push(product);
                }else{
                    newProductDiscountInformation.push(product);
                }
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }else{
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                if(focusedProductIndex === index){
                    product.percent = 0;
                    newProductDiscountInformation.push(product);
                }else{
                    newProductDiscountInformation.push(product);
                }
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }
    }

    const productPriceInputChanged = (event) => {
        if(event.target.value != '' && event.target.value !== 0){
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                if(focusedProductIndex === index){
                    product.price = parseInt(event.target.value);
                    newProductDiscountInformation.push(product);
                }else{
                    newProductDiscountInformation.push(product);
                }
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }else{
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                if(focusedProductIndex === index){
                    product.price = 0;
                    newProductDiscountInformation.push(product);
                }else{
                    newProductDiscountInformation.push(product);
                }
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }
    }

    const focusOnProduct = (key) => {
        setFocusedProductIndex(key);
    }

    const submitDiscountProducts = () => {
        let newProductDiscountInformation = [];
        productsDiscountInformation.map((product, key) => {
            if(product.price !== 0 || product.percent !== 0){
                if(product.price !== 0 && product.percent !== 0){
                    product.price = 0;
                }
                newProductDiscountInformation.push(product);
            }
        })
        axios.post(constantUrls.apiUrl + '/api/discount/add-products-to-multi-product-discount', {
            discountId: discountId,
            products: newProductDiscountInformation,
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                updateSelectedProductInformation('add', {products: newProductDiscountInformation});
                setSelectedSectionId(2);
                setStockCheckboxChecked(false);
                setSleepCheckboxChecked(false);
                setPriceBoundaryCheckboxChecked(false);
                setFactorDateChecked(false);
            }else if(response.status === 'failed'){
                alert(response.umessage);
            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        })
    }

    const productFinalStockInputChanged = (event) => {
        if(event.target.value !== '' && event.target.value !== 0){
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                if(focusedProductIndex === index){
                    product.finalStock = parseInt(event.target.value);
                    newProductDiscountInformation.push(product);
                }else{
                    newProductDiscountInformation.push(product);
                }
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }else{
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                if(focusedProductIndex === index){
                    product.finalStock = 0;
                    newProductDiscountInformation.push(product);
                }else{
                    newProductDiscountInformation.push(product);
                }
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }
    }

    const startAndFinishDateCheckboxChanged = (event) => {
        setStartAndFinishDateIsChecked(event.target.checked);
    }
    
    const expirationDateCheckboxChanged = (event) => {
        setExpirationDateIsChecked(event.target.checked);
    }

    const discountActiveCheckboxClicked = () => {
        setDiscountStatus(1);
    }

    const discountDeactiveCheckboxClicked = () => {
        setDiscountStatus(0);
    }

    const discountTitleInputChanged = (event) => {
        setDiscountTitle(event.target.value);
    }

    const discountDescriptionInputChanged = (event)=> {
        setDiscountDescription(event.target.value);
    } 

    const submitDiscountInformationClicked = () => {
        if(discountTitle.trim().length == 0 || discountDescription.trim().length == 0){
            alert('لطفا عنوان و توضیحات تخفیف را به درستی وارد کنید');
            return;
        }
        let startDate = 0;
        let finishDate = 0;
        let expirationDate = 0;
        let status = discountStatus;
        if(startAndFinishDateIsChecked){
            startDate = Math.floor(discountStartDateInputState / 1000);
            finishDate = Math.floor(discountFinishDateInputState / 1000);
        }
        if(expirationDateIsChecked){
            expirationDate = Math.floor(discountExpirationDateInputState / 1000);
        }
        axios.post(constantUrls.apiUrl + '/api/discount/edit-multi-product-discount-general-information', {
            discountId: discountId, 
            title: discountTitle.trim(),
            description: discountDescription.trim(),
            startDate: startDate,
            finishDate: finishDate,
            expirationDate: expirationDate,
            status: status
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                alert('ویرایش با موفقیت انجام شد');
            }else if(response.status === 'failed'){
                console.warn(response.message);
                alert(response.umessage);
            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });
    }

    const generalSettingsLayout = (
        <div className={['row', 'p-2', 'mt-3', 'rtl'].join(' ')} style={{borderRadius: '3px', border: '1px solid #DEDEDE'}}>
            <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'text-right', 'align-items-center'].join(' ')}>
                <img src={leftArrowBlackImage} style={{width: '20px', height: '20px'}} />
                <h6 className={['rtl', 'font14', 'mb-0', 'mx-2'].join(' ')} style={{}}>عنوان :</h6>
                <input type='text' defaultValue={discountTitle} onChange={discountTitleInputChanged} className={['rtl', 'text-right', 'font14'].join(' ')} style={{flex: '1'}} />
            </div>
            <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'text-right', 'align-items-center'].join(' ')}>
                <img src={leftArrowBlackImage} style={{width: '20px', height: '20px'}} />
                <h6 className={['rtl', 'font14', 'mb-0', 'mx-2'].join(' ')} style={{}}>توضیحات :</h6>
                <input type='text' defaultValue={discountDescription} onChange={discountDescriptionInputChanged} className={['rtl', 'text-right', 'font14'].join(' ')} style={{flex: '1'}} />
            </div>
            <div className={['col-6', 'd-flex', 'flex-row', 'align-items-center', 'mt-3', 'rtl'].join(' ')}>
                <img src={leftArrowBlackImage} style={{width: '20px', height: '20px'}} />
                <input type='checkbox' checked={startAndFinishDateIsChecked} onChange={startAndFinishDateCheckboxChanged} className={['mr-2', 'pointer'].join(' ')} />
                <h6 className={['mb-0', 'mx-2', 'mb-0', 'font14'].join(' ')}>تاریخ شروع و پایان</h6>
                {
                    startAndFinishDateIsChecked
                    ?
                    (
                        <React.Fragment>
                            <h6 className={['mb-0', 'mx-2', 'mb-0', 'font14'].join(' ')}>از :</h6>
                            <DatePicker className={['font14'].join(' ')} style={{direction: 'rtl', flex: '1'}} value={discountStartDateInputState} onClickSubmitButton={value => {setDiscountStartDateInputState(value.value._d)}} />
                            <h6 className={['mb-0', 'mx-2', 'mb-0', 'font14'].join(' ')}>تا :</h6>
                            <DatePicker className={['font14'].join(' ')} style={{direction: 'rtl', flex: '1'}} value={discountFinishDateInputState} onClickSubmitButton={value => {setDiscountFinishDateInputState(value.value._d)}} />
                        </React.Fragment>
                    )
                    :
                    null
                }
            </div>
            <div className={['col-6', 'd-flex', 'flex-row', 'align-items-center', 'mt-3', 'rtl'].join(' ')}>
                <img src={leftArrowBlackImage} style={{width: '20px', height: '20px'}} />
                <input type='checkbox' checked={expirationDateIsChecked} onChange={expirationDateCheckboxChanged} className={['mr-2', 'pointer'].join(' ')} />
                <h6 className={['mb-0', 'mx-2', 'mb-0', 'font14'].join(' ')}>تاریخ انقضا :</h6>
                {
                    expirationDateIsChecked
                    ?
                        <DatePicker className={['font14'].join(' ')} style={{direction: 'rtl', flex: '1'}} value={discountInformation!=null ? discountInformation.expiration_date * 1000 : discountExpirationDateInputState} onClickSubmitButton={value => {setDiscountExpirationDateInputState(value.value._d)}} />
                    :
                    null
                }
            </div>
            <div className={['col-6', 'd-flex', 'flex-row', 'align-items-center', 'mt-3', 'rtl'].join(' ')}>
                <img src={leftArrowBlackImage} style={{width: '20px', height: '20px'}} />
                <h6 className={['mb-0', 'mx-2', 'mb-0', 'font14'].join(' ')}>وضعیت : </h6>
                <input type='checkbox' checked={discountStatus === 1 ? true : false} className={['pointer'].join(' ')} onChange={discountActiveCheckboxClicked} />
                <h6 className={['mb-0', 'mx-2', 'mb-0', 'font14'].join(' ')}>فعال</h6>
                <input type='checkbox' checked={discountStatus === 1 ? false : true} className={['pointer'].join(' ')} onChange={discountDeactiveCheckboxClicked} />
                <h6 className={['mb-0', 'mx-2', 'mx-0', 'font14'].join(' ') }>غیر فعال</h6>
            </div>
            <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-center'].join(' ')}>
                <button onClick={submitDiscountInformationClicked} className={['px-4', 'py-1', 'pointer'].join(' ')} style={{color: '#FFFFFF', background: '#008000', borderStyle: 'none', outlineStyle: 'none', borderRadius: '2px'}}>ذخیره اطلاعات</button>
            </div>
         </div>
    );

    const getSectionLayout = () => {
        if(selectedSectionId === 0){
            return generalSettingsLayout;
        }else if(selectedSectionId == 1){
            return addProductLayout;
        }else if(selectedSectionId === 2){
            return editProductLayout;
        }
    }

    const priceBoundaryCheckboxChanged = (event) => {
        setPriceBoundaryCheckboxChecked(event.target.checked);
    }

    const minPriceChanged = (event) => {
        setPriceBoundaryMinPrice(event.target.value);
    }

    const maxPriceChanged = (event) => {
        setPriceBoundaryMaxPrice(event.target.value);
    }

    const sleepCheckboxChanged = (event) => {
        setSleepCheckboxChecked(event.target.checked);
    }

    const minSleepChanged = (event) => {    
        setMinSleep(event.target.value);
    }

    const maxSleepChanged = (event) => {
        setMaxSleep(event.target.value);    
    }

    const stockCheckboxChanged = (event) => {
        setStockCheckboxChecked(event.target.checked);
    }

    const minStockChanged = (event) => {
        setMinStock(event.target.value);
    }

    const maxStockChanged = (event) => {
        setMaxStock(event.target.value);
    }

    const factorDateCheckboxChanged = (event) => {
        setFactorDateChecked(event.target.checked);
    }

    const totalPercentChanged = (event) => {
        if(event.target.value !== '' && event.target.value !== 0){
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                product.percent = parseInt(event.target.value);
                newProductDiscountInformation.push(product);
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }else{
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                product.percent = 0;
                newProductDiscountInformation.push(product);
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }
    }

    const totalPriceChanged = (event) => {
        if(event.target.value !== '' && event.target.value !== 0){
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                product.price = parseInt(event.target.value);
                newProductDiscountInformation.push(product);
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }else{
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                product.price = 0;
                newProductDiscountInformation.push(product);
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }
    }

    const totalProfitBoundaryChanged = (event) => {
        //(product.productProfitMargin * 100).toFixed(0)
        if(event.target.value !== '' && event.target.value !== 0){
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                product.percent = Math.floor(parseInt(event.target.value) * Math.ceil(productsInformation[index].productProfitMargin * 100) / 100);
                newProductDiscountInformation.push(product);
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }else{
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                product.percent = 0;
                newProductDiscountInformation.push(product);
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }
    }

    const totalLeftChanged = (event) => {
        if(event.target.value !== '' && event.target.value !== 0){
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                product.finalStock = parseInt(event.target.value);
                newProductDiscountInformation.push(product);
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }else{
            let newProductDiscountInformation = [];
            productsDiscountInformation.map((product, index) => {
                product.finalStock = 0;
                newProductDiscountInformation.push(product);
            });
            setProductsDiscountInformation(newProductDiscountInformation);
        }
    }

    const addProductLayout = (
        <React.Fragment>
        <div className={['row', 'mt-3', 'rtl'].join(' ')}>
                <div className={['col-12', 'px-2', 'd-flex', 'flex-row', 'align-items-center'].join(' ')}>
                    <h6 className={['text-center', 'mb-0', 'font14'].join(' ')}>دسته‌بندی موردنظر را انتخاب کنید</h6>
                    <select onChange={categorySelectorChanged} className={['mr-3', 'font14', 'd-none'].join(' ')} style={{flex: '1', maxHeight: '200px'}} >
                        <option value={0}>انتخاب کنید</option>
                        {
                            allActiveCategoriesInformation.map((category, index) => {
                                return (
                                    <option key={index} value={category.id}>{category.name}</option>
                                );
                            })
                        }
                    </select>
		    <Autocomplete className={['col-10', 'text-right', 'justify-content-right', 'm-0', 'p-0'].join(' ')} style={{direction: 'rtl', fontFamily: 'IranSansWebFaNum'}}
                        id="controllable-states-demo"
                        noOptionsText="..."
                        onChange={(event, newValue) => {
                            if(newValue !== null){
                                categorySelectorChanged({target:{value: newValue.id}});
                            }
                        }}
                        options={allActiveCategoriesInformation}
                        getOptionLabel={(allActiveCategoriesInformation) => allActiveCategoriesInformation.name}
                        renderInput={(params) => <TextField className={['text-right'].join(' ')} {...params} variant="outlined" style={{fontFamily: 'IranSansWebFaNum', direction: 'rtl'}} />}
                    /> 
                </div>
                <div className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'text-right', 'rtl', 'mt-2'].join(' ')}>
                    <button onClick={()=>{setFiltersDisplayClass('d-flex')}} className={[ filtersDisplayClass === 'd-none' ? '' : 'd-none', 'px-3', 'py-1', 'pointer', 'mt-0'].join(' ')} style={{fontSize: '14px', background: '#F2F2F2', borderRadius: '3px', border: 'none', outlineStyle: 'none'}}>جستجوی پیشرفته</button>
                    <div className={[filtersDisplayClass, 'flex-row', 'rtl', 'text-right', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                        <input type='checkbox' onChange={priceBoundaryCheckboxChanged} className={['mr-3', 'mt-0', 'pointer'].join(' ')} />
                        <h6 className={['mb-0', 'text-right', 'rtl', 'mr-1', 'pt-0', 'pl-1', 'font14'].join(' ')}>قیمت کالا</h6>
                        <input type="number" onChange={minPriceChanged} className={['ltr', 'text-left', 'font14', 'mx-1', priceBoundaryCheckboxChecked ? '' : 'd-none'].join(' ')} placeholder="حداقل قیمت" style={{maxWidth: '140px'}} />
                        <input type="number" onChange={maxPriceChanged} className={['ltr', 'text-left', 'font14', 'mx-1', priceBoundaryCheckboxChecked ? '' : 'd-none'].join(' ')} placeholder="حداکثر قیمت" style={{maxWidth: '140px'}}/>
                        <input type='checkbox' onChange={sleepCheckboxChanged} className={['mr-3', 'mt-0', 'pointer'].join(' ')} />
                        <h6 className={['mb-0', 'text-right', 'rtl', 'mr-1', 'pt-0', 'pl-1', 'font14'].join(' ')}>خواب کالا</h6>
                        <input onChange={minSleepChanged} type="number" className={['ltr', 'text-left', 'font14', 'mx-1', sleepCheckboxChecked ? '' : 'd-none'].join(' ')} placeholder="حداقل خواب" style={{maxWidth: '100px'}} />
                        <input onChange={maxSleepChanged} type="number" className={['ltr', 'text-left', 'font14' , sleepCheckboxChecked ? '' : 'd-none'].join(' ')} placeholder="حداکثر خواب" style={{maxWidth: '100px'}}/>
                        <input type='checkbox' onChange={stockCheckboxChanged} className={['mr-3', 'mt-0', 'ml-1', 'pointer'].join(' ')} />
                        <h6 className={['mb-0', 'text-right', 'rtl', 'ml-1', 'font14'].join(' ')}>موجودی کالا</h6>
                        <input type="number" onChange={minStockChanged} className={['ltr', 'text-left', 'font14', 'mx-1', stockCheckboxChecked ? '' : 'd-none'].join(' ')} placeholder="حداقل موجودی" style={{maxWidth: '100px'}} />
                        <input type="number" onChange={maxStockChanged} className={['ltr', 'text-left', 'font14', 'mx-1', stockCheckboxChecked ? '' : 'd-none'].join(' ')} placeholder="حداکثر موجودی" style={{maxWidth: '100px'}}/>
                        <input type='checkbox' onChange={factorDateCheckboxChanged} className={['mr-3', 'mt-0', 'pointer'].join(' ')} />
                        <h6 className={['mr-1', 'mb-0', 'rtl', 'text-right', 'font14'].join(' ')}>تاریخ آخرین فاکتور</h6>
                        <h6 className={['mb-0', 'text-right', 'rtl', 'mr-1', 'pt-0', 'pl-1', 'font14', factorDateChecked ? '' : 'd-none'].join(' ')}>از : </h6>
                        <DatePicker className={['font14', factorDateChecked ? '' : 'd-none'].join(' ')} style={{direction: 'rtl'}} value={startDateInputState} onClickSubmitButton={value => {setStartDateInputState(value.value._d)}} />
                        <h6 className={['mb-0', 'text-right', 'rtl', 'mr-1', 'pt-0', 'pl-1', 'font14', factorDateChecked ? '' : 'd-none'].join(' ')}>تا : </h6>
                        <DatePicker className={['font14', factorDateChecked ? '' : 'd-none'].join(' ')} style={{direction: 'rtl'}} value={startDateInputState} onClickSubmitButton={value => {setStartDateInputState(value.value._d)}} />
                        <button onClick={searchButtonClicked} className={['px-3', 'py-1', 'mt-0', 'mr-3', 'mb-0', 'pointer', 'font14'].join(' ')} style={{borderRadius: '3px', background: 'green', color: 'white', border: 'none', outlineStyle: 'none'}}>جستجو</button>
                    </div>
                </div>
                <div className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'text-right', 'rtl', 'mt-2'].join(' ')}>
                    <div className={['d-flex', 'flex-row', 'rtl', 'text-right', 'align-items-center'].join(' ')} style={{flex: '1'}}>
                        <h6 className={['mb-0', 'font14'].join(' ')}>درصد کلی : </h6>
                        <input type='number' onChange={totalPercentChanged} className={['font14', 'mr-1', 'text-center'].join(' ')} style={{maxWidth: '100px'}} placeholder='%' />
                        <h6 className={['mb-0', 'mr-2', 'font14'].join(' ')}>قیمت کلی : </h6>
                        <input type='number' onChange={totalPriceChanged} className={['font14', 'mr-1', 'text-center'].join(' ')} style={{maxWidth: '100px'}} placeholder='$' />
                        <h6 className={['mb-0', 'mr-2', 'font14'].join(' ')}>درصد حاشیه کلی : </h6>
                        <input type='number' onChange={totalProfitBoundaryChanged} className={['font14', 'mr-1', 'text-center'].join(' ')} style={{maxWidth: '100px'}} placeholder='%' />
                        <h6 className={['mb-0', 'mr-2', 'font14'].join(' ')}>تعداد باقیمانده کلی : </h6>
                        <input type='number' onChange={totalLeftChanged} className={['font14', 'mr-1', 'text-center'].join(' ')} style={{maxWidth: '100px'}} placeholder='#' />
                    </div>
                </div>
            </div>
            <div className={['row', 'p-2', 'mt-2', 'align-items-center', 'text-right', 'rtl'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px'}}>
                <h6 className={['col-4', 'text-rigt', 'mb-0', 'font14', 'colorMain'].join(' ')}>نام محصول</h6>
                <h6 className={['col-1', 'text-center', 'mb-0', 'font14', 'colorMain'].join(' ')}>موجودی محصول</h6>
                <h6 className={['col-1', 'text-center', 'mb-0', 'font14', 'colorMain'].join(' ')}>قیمت خرید</h6>
                <h6 className={['col-1', 'text-center', 'mb-0', 'font14', 'colorMain'].join(' ')}>قیمت محصول</h6>
                <h6 className={['col-1', 'text-center', 'mb-0', 'font14', 'colorMain'].join(' ')}>خواب کالا</h6>
                <h6 className={['col-1', 'text-center', 'mb-0', 'font14', 'ltr', 'colorMain'].join(' ')}>حاشیه سود</h6>
                <h6 className={['col-1', 'text-center', 'mb-0', 'font14', 'ltr', 'colorMain'].join(' ')}>موجودی نهایی</h6>
                <h6 className={['col-1', 'text-center', 'mb-0', 'font14', 'colorMain'].join(' ')}>درصد تخفیف</h6>
                <h6 className={['col-1', 'text-center', 'mb-0', 'font14', 'colorMain'].join(' ')}>مقدار تخفیف</h6>
            </div>
            {
                productsInformation.map((product, key) => {
                    return (
                        <div key={key} className={['row', 'p-2', 'mt-2', 'align-items-center', 'text-right', 'rtl'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px'}}>
                            <a className={['col-4', 'text-rigt', 'mb-0', 'font14'].join(' ')} href={'https://honari.com/' + product.productUrl} target="_blank">{product.productName}</a>
                            <a className={['col-1', 'text-center', 'mb-0', 'font14'].join(' ')} href={'https://admin.honari.com/productstock/admin?ProductStock%5Bproduct_id%5D=' + product.productPackId} target="_blank" >{product.productStock}</a>
                            <h6 className={['col-1', 'text-center', 'mb-0', 'font14'].join(' ')}>{product.productBuyPrice.toLocaleString()}</h6>
                            <a className={['col-1', 'text-center', 'mb-0', 'font14'].join(' ')} href={'https://admin.honari.com/products/update/' + product.id} target="_blank">{product.productPrice.toLocaleString()}</a>
                            <h6 className={['col-1', 'text-center', 'mb-0', 'font14'].join(' ')}>{product.productSleep.toFixed(2)}</h6>
                            <h6 className={['col-1', 'text-center', 'mb-0', 'font14', 'ltr'].join(' ')}>{(product.productProfitMargin * 100).toFixed(0) + " %"}</h6>
                            <input type="number" defaultValue='' value={productsDiscountInformation.length == productsInformation.length ? productsDiscountInformation[key].finalStock : -1} onFocus={()=>{focusOnProduct(key)}} onChange={productFinalStockInputChanged} placeholder='موجودی' className={['col-1', 'text-center', 'font14'].join(' ')} style={{borderStyle: 'none', outlineStyle: 'none', borderRadius: '2px'}}/>
                            <input type="number" defaultValue='' value={productsDiscountInformation.length == productsInformation.length ? productsDiscountInformation[key].percent : -1} onFocus={()=>{focusOnProduct(key)}} placeholder='درصد' onChange={productPercentInputChanged} className={['col-1', 'text-center', 'font14'].join(' ')} style={{borderStyle: 'none', outlineStyle: 'none', borderRadius: '2px'}}/>
                            <input type="number" defaultValue='' value={productsDiscountInformation.length == productsInformation.length ? productsDiscountInformation[key].price : -1} onFocus={()=>{focusOnProduct(key)}} onChange={productPriceInputChanged} placeholder='قیمت' className={['col-1', 'text-center', 'font14'].join(' ')} style={{borderStyle: 'none', outlineStyle: 'none', borderRadius: '2px'}}/>
                        </div>
                    );
                })
            }
            {
                productsDiscountInformation.length !== 0
                ?
                <div className={['row'].join(' ')}>
                    <div className={['col-12', 'd-flex', 'flex-row', 'justify-content-center', 'mb-2'].join(' ')}>
                        <button onClick={submitDiscountProducts} className={['px-4', 'py-2', 'font14', 'mt-2', 'pointer'].join(' ')} style={{background: '#008000', color: 'white', borderStyle: 'none', outlineStyle: 'none', borderRadius: '2px'}}>افزودن محصولات به تخفیف</button>
                    </div>
                </div>
                :
                null
            }
        </React.Fragment>
    );

    const productEditButtonClicked = (key) => {
        let price = manipulatedProductEditInformation[key].price !== '' ? manipulatedProductEditInformation[key].price : 0;
        let percent = manipulatedProductEditInformation[key].percent !== '' ? manipulatedProductEditInformation[key].percent : 0;
        let finalStock = manipulatedProductEditInformation[key].finalStock !== '' ? manipulatedProductEditInformation[key].finalStock : 0;
        let productId = selectedProductsInformation[key].productId;

        axios.post(constantUrls.apiUrl + '/api/discount/edit-multi-product-discount-product-information', {
            discountId: discountId, 
            productId: productId, 
            price: price,
            percent: percent, 
            finalStock: finalStock
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                updateSelectedProductInformation('update', {productId: productId, price: price, percent: percent, finalStock: finalStock});
                alert('ویرایش با موفقیت انجام شد');
            }else if(response.status === 'failed'){
                alert(response.umessage);
            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });
    }

    const updateSelectedProductInformation = (method, input) => {
        if(method === 'update'){
            let newProductInformation = [];
            selectedProductsInformation.map((info, index) => {
                if(info.productId === input.productId){
                    info.discountPrice = input.price;
                    info.discountPercent = input.percent;
                    info.discountFinalStock = input.finalStock;
                    newProductInformation.push(info);
                }else{
                    newProductInformation.push(info);
                }
            });
            setSelectedProductsInformation(newProductInformation);
        }else if(method === 'remove'){
            let newProductInformation = [];
            for(let i=0; i< selectedProductsInformation.length; i++){
                if(selectedProductsInformation[i].productId != input.productId){
                    newProductInformation.push(selectedProductsInformation[i]);
                }
            }
            /*
            selectedProductsInformation.map((info, index) => {
                if(info.productId != input.productId){
                    newProductInformation.push(info);
                }
            });
            */
            setSelectedProductsInformation(newProductInformation);
            console.warn(newProductInformation);
        }else if(method === 'add'){
            let newProductInformation = [];
            let b = [];
            let a = selectedProductsInformation;
            //newProductInformation.map((i, c) => {
            //    a.push(i);
            //});
            input.products.map((p, c) => { 
                productsInformation.map((info, index) => {
                    if(p.id === info.id){
                        a.push({
                            productId: info.id,
                            productName: info.productName,
                            productUrl: info.productUrl,
                            productStock: info.productStock,
                            productSleep: info.productSleep,
                            productProfitMargin: info.productProfitMargin,
                            discountPrice: p.price,
                            discountPercent: p.percent,
                            discountFinalStock: p.finalStock
                        });
                    }
                });
            })
            
            setSelectedProductsInformation(a);
            console.warn(a);
            let newProductDiscountInformation = [];
            productsInformation.map((info, index) => {
                let found = false;
                input.products.map((p, c) => {
                    if(info.id == p.id){
                        found = true;
                    }
                });
                if(!found){
                    newProductDiscountInformation.push({id: info.id, price: 0, percent: 0, finalStock: 0});
                    b.push(info);
                }
            });
            setProductsInformation(b);
            setProductsDiscountInformation(newProductDiscountInformation);
        }
    }

    const productRemoveButtonClicked = (key) => {
        let productId = selectedProductsInformation[key].productId;
        axios.post(constantUrls.apiUrl + '/api/discount/remove-product-from-multi-product-discount', {
            discountId: discountId,
            productId: productId,
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                updateSelectedProductInformation('remove', {productId: productId});
            }else if(response.status === 'failed'){
                console.warn(response.message);
                alert(response.umessage);
            }
        }).catch((e)=>{
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });
    }

    const productFinalStockInputChangeForEdit = (event) => {
        let newEditInformation = manipulatedProductEditInformation[focusedProductIndexForEdit];
        let newManipulatedProductEditInformation = [];
        newEditInformation.finalStock = 0;
        if(event.target.value.trim() !== ''){
            newEditInformation.finalStock = parseInt(event.target.value.trim());
        }
        manipulatedProductEditInformation.map((info, index) => {
            if(index !== setFocusedProductIndexForEdit){
                newManipulatedProductEditInformation.push(info);
            }else{
                newManipulatedProductEditInformation.push(newEditInformation);
            }
        });
        setManipulatedProductEditInformation(newManipulatedProductEditInformation);
    }

    const productPercentInputChangedForEdit = (event) => {
        let newEditInformation = manipulatedProductEditInformation[focusedProductIndexForEdit];
        let newManipulatedProductEditInformation = [];
        newEditInformation.percent = 0;
        if(event.target.value.trim() !== ''){
            newEditInformation.percent = parseInt(event.target.value.trim());
        }
        manipulatedProductEditInformation.map((info, index) => {
            if(index !== setFocusedProductIndexForEdit){
                newManipulatedProductEditInformation.push(info);
            }else{
                newManipulatedProductEditInformation.push(newEditInformation);
            }
        });
        setManipulatedProductEditInformation(newManipulatedProductEditInformation);
    }

    const productPriceInputChangedForEdit = (event) => {
        let newEditInformation = manipulatedProductEditInformation[focusedProductIndexForEdit];
        let newManipulatedProductEditInformation = [];
        newEditInformation.price = 0;
        if(event.target.value.trim() !== ''){
            newEditInformation.price = parseInt(event.target.value.trim());
        }
        manipulatedProductEditInformation.map((info, index) => {
            if(index !== setFocusedProductIndexForEdit){
                newManipulatedProductEditInformation.push(info);
            }else{
                newManipulatedProductEditInformation.push(newEditInformation);
            }
        });
        setManipulatedProductEditInformation(newManipulatedProductEditInformation);
    }

    const fillManipulatedProductsEditInformation = () => {
        let newEditInformation = [];
        selectedProductsInformation.map((info, index)=>{
            newEditInformation.push({price: info.discountPrice, percent: info.discountPercent, finalStock: info.discountFinalStock});
        });
        setManipulatedProductEditInformation(newEditInformation);
    }

    const editProductLayout = (
        <React.Fragment>
            <div className={['row', 'rtl', 'p-2', 'mt-2', 'mx-1'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px', color: '#00BAC6'}}>
                <h6 className={['col-1', 'font14', 'text-right', 'mb-0'].join(' ')}>ردیف</h6>
                <h6 className={['col-3', 'font14', 'text-right', 'mb-0'].join(' ')}>نام محصول</h6>
                <h6 className={['col-1', 'font14', 'text-center', 'mb-0'].join(' ')}>موجودی</h6>
                <h6 className={['col-1', 'font14', 'text-right', 'mb-0'].join(' ')}>خواب کالا</h6>
                <h6 className={['col-1', 'font14', 'text-center', 'mb-0'].join(' ')}>حاشیه سود</h6>
                <h6 className={['col-1', 'font14', 'text-center', 'mb-0'].join(' ')}>موجودی پایانی</h6>
                <h6 className={['col-1', 'font14', 'text-center', 'mb-0'].join(' ')}>درصد تخفیف</h6>
                <h6 className={['col-1', 'font14', 'text-center', 'mb-0'].join(' ')}>مبلغ تخفیف</h6>
                <h6 className={['col-1', 'font14', 'text-center', 'mb-0'].join(' ')}>ویرایش</h6>
                <h6 className={['col-1', 'font14', 'text-center', 'mb-0'].join(' ')}>حذف</h6>
            </div>
            {
                selectedProductsInformation.map((productInformation, index) => {
                    return (
                        <div className={['row', 'rtl', 'p-2', 'mt-2', 'mx-1', 'align-items-center'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px'}}>
                            <h6 className={['col-1', 'font14', 'text-right', 'mb-0'].join(' ')}>{index + 1}</h6>
                            <h6 className={['col-3', 'font14', 'text-right', 'mb-0'].join(' ')}>{productInformation.productName}</h6>
                            <h6 className={['col-1', 'font14', 'text-center', 'mb-0'].join(' ')}>{productInformation.productStock}</h6>
                            <h6 className={['col-1', 'font14', 'text-right', 'mb-0'].join(' ')}>{productInformation.productSleep}</h6>
                            <h6 className={['col-1', 'font14', 'text-center', 'mb-0'].join(' ')}>{productInformation.productProfitMargin}</h6>
                            <input type='number' defaultValue='' placeholder={productInformation.discountFinalStock}  onFocus={()=>{setFocusedProductIndexForEdit(index)}} onChange={productFinalStockInputChangeForEdit}  className={['col-1', 'font-14', 'text-center'].join(' ')} style={{borderStyle: 'none', borderRadius: '2px', outlineStyle: 'none'}} />
                            <input type='number' defaultValue='' placeholder={productInformation.discountPercent}  onFocus={()=>{setFocusedProductIndexForEdit(index)}} onChange={productPercentInputChangedForEdit}   className={['col-1', 'font-14', 'text-center'].join(' ')} style={{borderStyle: 'none', borderRadius: '2px', outlineStyle: 'none'}} />
                            <input type='number' defaultValue='' placeholder={productInformation.discountPrice}  onFocus={()=>{setFocusedProductIndexForEdit(index)}} onChange={productPriceInputChangedForEdit}   className={['col-1', 'font-14', 'text-center'].join(' ')} style={{borderStyle: 'none', borderRadius: '2px', outlineStyle: 'none'}} />
                            <button onClick={()=>{productEditButtonClicked(index)}} className={['col-1', 'pointer'].join(' ')} style={{background: '#FFC107', color: 'black', borderStyle: 'none', outlineStyle: 'none', borderRadius: '2px'}}>ویرایش</button>
                            <button onClick={()=>{productRemoveButtonClicked(index)}} className={['col-1', 'pointer'].join(' ')} style={{background: '#DC3545', color: 'white', borderStyle: 'none', outlineStyle: 'none', borderRadius: '2px'}}>حذف</button>
                        </div>
                    );
                })
            }
        </React.Fragment>
    );

    return(
        <div className={['container-fluid'].join(' ')}>
            <div className={['row'].join(' ')}>
                <div className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'rtl', 'justify-content-right'].join(' ')}>
                    <img src={enterBlackImage} style={{width: '20px', height: '20px'}} />
                    <button className={['px-2', 'py-1', 'mr-2', getSectionDisplayClass(0)].join(' ')} onClick={() => {setSelectedSectionId(0)}}>ویرایش اطلاعات</button>
                    <button className={['px-2', 'py-1', 'mr-2', getSectionDisplayClass(1)].join(' ')} onClick={() => {setSelectedSectionId(1); setMaxSleep(''); setMinSleep(''); setMinStock(''); setMaxStock(''); setPriceBoundaryMinPrice(''); setPriceBoundaryMaxPrice(''); setStockCheckboxChecked(false); setPriceBoundaryCheckboxChecked(false); setSleepCheckboxChecked(false); setFactorDateChecked(false);}}>افزودن محصولات</button>
                    <button className={['px-2', 'py-1', 'mr-2', getSectionDisplayClass(2)].join(' ')} onClick={() => {setSelectedSectionId(2); fillManipulatedProductsEditInformation();}}>ویرایش محصولات</button>
                </div>
            </div>
            {
                getSectionLayout()
            }
            <div className={['row', 'px-2'].join(' ')} style={{position: 'sticky', bottom: '0.5rem'}}>
            {
                typeof props.close === 'function' ? <button className={['btn', 'btn-danger', 'col-12', 'mt-2', 'mx-0'].join(' ')} onClick={props.close}>خروج</button> : null
            }
            </div>
        </div>
    );
}

export default AddSpecialDiscount;
