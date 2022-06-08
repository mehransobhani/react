import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationBlackImage from '../../../../assets/images/location_black.png';
import axios from 'axios';
import * as Constants from '../../../../constants/urls';
import { useCookies } from 'react-cookie';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ProvinceLimiter = (props) => {

    const [btnClass, setBtnClass] = useState('btn-outline-success');
    const [btnTitle, setBtnTitle] = useState('افزودن');
    const [provinces, setProvinces] = useState([]);
    const [selectedProvinces, setSelectedProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    const [cookies, setCookie, removeCookie] = useCookies();

    const vertical = 'bottom';
    const horizontal = 'left';

    const handleClose = () => {
        setAlertOpen(false);
    }

    console.log(props.id);

    const addButtonClicked = () => {
        if(selectedProvince !== null){
            setBtnTitle('کمی صبر کنید');
            setBtnClass('btn-success');
            axios.post(Constants.apiUrl + '/api/add-dependency-to-discount',{
                discountId : props.discountId,
                dependencyId: selectedProvince,
                dependencyType: 'province'
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token,
                }
            }).then((response) => {
                if(response.data.status === 'done'){
                    let provincesArray = [...selectedProvinces];
                    provincesArray.push({id: response.data.id, name: response.data.name});
                    setSelectedProvinces(provincesArray);
                    setAlertSeverity('success');
                    setAlertMessage('عملیات با موفقیت انجام شد');
                }else if(response.data.status == 'failed'){
                    if(response.data.source === 'm'){
                        window.location.href = 'https://honari.com';
                    }else{
                        setAlertSeverity('warning');
                        if(response.data.message === 'dependency not found'){
                            setAlertMessage('چنین استانی یافت نشد');
                        }else if(response.data.message === 'dependency exists'){
                            setAlertMessage('این استان در لیست وجود دارد');
                            console.log(props.discountId);
                        }
                        console.log(response.data.umessage);
                    }
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
            setAlertMessage('لطفا استان را انتخاب کنید');
            setAlertOpen(true);
        }
        
    }

    useEffect(() => {
        axios.get(Constants.apiUrl + '/api/all-provinces')
            .then((response) => {
                if(response.data.status === 'done'){
                    setProvinces(response.data.provinces);
                }
            }).catch((error) => {
                console.log(error);
                setAlertSeverity('error');
                setAlertMessage('مشکلی در اتصال رخ داده است');
                setAlertOpen(true);
            });
    }, []);

    useEffect(() => {
        axios.post(Constants.apiUrl + '/api/discount-relevant-dependencies',{
            discountId: props.discountId,
            dependencyType: 'province'
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((response) => {
                if(response.data.status === 'done'){
                    setSelectedProvinces(response.data.provinces);
                }else if(response.data.status === 'failed'){
                    if(response.data.source === 'm'){
                        window.location.href = 'https://honari.com';
                    }else{
                        console.warn(response.data.message);
                        alert(response.data.umessage);
                    }
                }
            }).catch((error) => {
                console.log(error);
                setAlertSeverity('error');
                setAlertMessage('مشکلی در اتصال رخ داده است');
                setAlertOpen(true);
            });
    }, []);

    const deleteBtnClicked = (id) => {
        console.log(id);
        axios.post(Constants.apiUrl + '/api/remove-dependency-from-discount',{
                dependencyId : id
            }, {
                headers: {
                    'Authorization': 'Bearer ' + cookies.user_server_token,
                }
            }).then((response) => {
                if(response.data.status === 'done'){
                    let provincesArray = [];
                    for(let prvnc of selectedProvinces){
                        if(prvnc.id !== id){
                            provincesArray.push(prvnc);
                        }
                    }
                    setSelectedProvinces(provincesArray);
                }else if(response.data.status === 'failed'){
                    if(response.data.status === 'm'){
                        window.location.href = 'https://honari.com';
                    }else{
                        setAlertSeverity('warning');
                        setAlertMessage('مشکلی پیش آمده');
                        setAlertOpen(true);
                        console.log(response.data.umessage);
                    }
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
        <img src={LocationBlackImage} className={['mt-2'].join(' ')} style={{width: '40px'}} />
            <div className={['row', 'mt-2'].join(' ')} style={{direction: 'rtl'}}>
                <Autocomplete className={['col-10', 'text-right', 'justify-content-right', 'm-0', 'p-0'].join(' ')} style={{direction: 'rtl', fontFamily: 'IranSansWebFaNum'}}
                    onChange={(event, newValue) => {
                        if(newValue !== null){
                            setSelectedProvince(newValue.id);
                        }else{
                            setSelectedProvince(null);
                        }
                    }}
                    id="controllable-states-demo"
                    options={provinces}
                    getOptionLabel={(provinces) => provinces.name}
                    renderInput={(params) => <TextField className={['text-right'].join(' ')} {...params} variant="outlined" style={{fontFamily: 'IranSansWebFaNum', direction: 'rtl'}} />}
                />  
                <button className={['btn', btnClass, 'col-2'].join(' ')} onClick={addButtonClicked}>{btnTitle}</button>
            </div>
            {
                selectedProvinces.map((prvnc, counter) => {
                    return (
                        <div className={['row', 'mt-2', 'rounded', 'align-items-center'].join(' ')} style={{backgroundColor: '#f2f2f2'}}>
                            <p className={['text-center', 'm-0', 'col-1'].join(' ')}>{counter + 1}</p>
                            <p className={['text-center', 'm-0', 'col-9'].join(' ')}>{prvnc.name}</p>
                            <button className={['btn', 'btn-outline-danger', 'col-2'].join(' ')} onClick={() => {deleteBtnClicked(prvnc.id)}}>حذف</button>
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

export default ProvinceLimiter;