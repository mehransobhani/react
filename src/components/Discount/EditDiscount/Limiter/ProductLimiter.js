import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BoxBlackImage from '../../../../assets/images/box_black.png';
import axios from 'axios';
import { findDOMNode } from 'react-dom';
import * as Constants from '../../../../constants/urls';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ProductLimiter = (props) => {

    const [btnClass, setBtnClass] = useState('btn-outline-success');
    const [btnTitle, setBtnTitle] = useState('افزودن');
    const [products, setproducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    const vertical = 'bottom';
    const horizontal = 'left';

    const handleClose = () => {
        setAlertOpen(false);
    }

    const addButtonClicked = () => {
        if(selectedProduct !== null){
            setBtnTitle('کمی صبر کنید');
            setBtnClass('btn-success');
            axios.post(Constants.apiUrl + '/api/add-dependency-to-discount',{
                discountId : props.discountId,
                dependencyId: selectedProduct,
                dependencyType: 'product'
            }).then((response) => {
                console.log(response.data);
                if(response.data.status === 'done'){
                    let productsArray = [...selectedProducts];
                    productsArray.push({id: response.data.id, name: response.data.name});
                    setSelectedProducts(productsArray);
                    setAlertSeverity('success');
                    setAlertMessage('عملیات با موفقیت انجام شد');
                }else{
                    setAlertSeverity('warning');
                    if(response.data.message === 'dependency not found'){
                        setAlertMessage('چنین کالایی یافت نشد');
                    }else if(response.data.message === 'dependency exists'){
                        setAlertMessage('این کالا در لیست وجود دارد');
                    }
                    console.log(response.data.message);
                }
                setAlertOpen(true);
                setBtnTitle('افزودن');
                setBtnClass('btn-outline-success');
            }).catch((error) => {
                console.log(error);
                setAlertSeverity('error');
                setAlertMessage('مشکلی در اتصال رخ داده است');
                setAlertOpen(true);
                setBtnTitle('افزودن');
                setBtnClass('btn-outline-success');
            });
        }else{
            setAlertSeverity('warning');
            setAlertMessage('لطفا کالا را انتخاب کنید');
            setAlertOpen(true);
        }
    }

    useEffect(() => {
        axios.post(Constants.apiUrl + '/api/discount-relevant-dependencies',{
            discountId: props.discountId,
            dependencyType: 'product'
        }).then((response) => {
                console.log(response.data);
                if(response.data.status === 'done'){
                    setSelectedProducts(response.data.products);
                }
            }).catch((error) => {
                console.log(error);
                setAlertSeverity('error');
                setAlertMessage('مشکلی در اتصال رخ داده است');
                setAlertOpen(true);
            });
    }, []);  

    useEffect(() => {
        axios.post(Constants.apiUrl + '/api/search-discount-relevant-dependencies',{
            discountId: props.discountId,
            dependencyType: 'product'
        }).then((response) => {
                if(response.data.status === 'done'){
                    setproducts(response.data.products);
                }
            }).catch((error) => {
                console.log(error);
                setAlertSeverity('error');
                setAlertMessage('مشکلی در اتصال رخ داده است');
                setAlertOpen(true);
            });
    }, []);

    const deleteBtnClicked = (id) => {
        axios.post(Constants.apiUrl + '/api/remove-dependency-from-discount',{
                dependencyId : id
            }).then((response) => {
                if(response.data.status === 'done'){
                    let productsArray = [];
                    for(let prdct of selectedProducts){
                        if(prdct.id !== id){
                            productsArray.push(prdct);
                        }
                    }
                    setSelectedProducts(productsArray);
                }else{
                    setAlertSeverity('warning');
                    setAlertMessage('مشکلی پیش آمده');
                    setAlertOpen(true);
                    console.log(response.data.message);
                }
            }).catch((error) => {
                console.log(error);
                setAlertSeverity('error');
                setAlertMessage('مشکلی در اتصال رخ داده است');
                setAlertOpen(true);
            });
    } 

    const findOptions = (input) => {
        axios.post(Constants.apiUrl + '/api/search-discount-relevant-dependencies',{
            key: input,
            dependencyType: 'product'
        }).then((response) => {
                if(response.data.status === 'done'){
                    setproducts(response.data.products);
                }
            }).catch((error) => {
                console.log(error);
                setAlertSeverity('error');
                setAlertMessage('مشکلی در اتصال رخ داده است');
                setAlertOpen(true);
        });
    }

    return(
        <React.Fragment>
        <div className={['container-fluid'].join(' ')}>
        <img src={BoxBlackImage} className={['mt-2'].join(' ')} style={{width: '40px'}} />
            <div className={['row', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                <Autocomplete className={['col-10', 'text-right', 'justify-content-right', 'm-0', 'p-0'].join(' ')} style={{direction: 'rtl', fontFamily: 'IranSansWebFaNum'}}
                    onChange={(event, newValue) => {
                        if(newValue !== null){
                            setSelectedProduct(newValue.id);
                        }else{
                            setSelectedProduct(null);
                        }
                    }}
                    onInputChange={(event, newInputValue) => {
                        findOptions(newInputValue);
                    }}
                    id="controllable-states-demo"
                    noOptionsText="..."
                    options={products}
                    getOptionLabel={(products) => products.name}
                    renderInput={(params) => <TextField className={['text-right'].join(' ')} {...params} variant="outlined" style={{fontFamily: 'IranSansWebFaNum', direction: 'rtl'}} />}
                /> 
                <button className={['btn', btnClass, 'col-2'].join(' ')} onClick={addButtonClicked}>{btnTitle}</button>
            </div>
            {
                selectedProducts.map((prdct, counter) => {
                    return (
                        <div className={['row', 'mt-2', 'rounded', 'align-items-center'].join(' ')} style={{backgroundColor: '#f2f2f2'}}>
                            <p className={['text-center', 'm-0', 'col-1'].join(' ')}>{counter + 1}</p>
                            <p className={['text-center', 'm-0', 'col-9'].join(' ')}>{prdct.name}</p>
                            <button className={['btn', 'btn-outline-danger', 'col-2'].join(' ')} onClick={() => {deleteBtnClicked(prdct.id)}}>حذف</button>
                        </div>
                    );
                })
            }
        </div>
        <Snackbar open={alertOpen} onClose={handleClose} message="I love snacks" autoHideDuration={1500} anchorOrigin={{ vertical, horizontal }}>
        <Alert severity={alertSeverity} icon={false}>
          {alertMessage}
        </Alert>
        </Snackbar>
        </React.Fragment>
    );
}

export default ProductLimiter;