import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import UserBlackImage from '../../../../assets/images/user_black.png';
import axios from 'axios';
import * as Constants from '../../../../constants/urls';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const UserLimiter = (props) => {

    const [deleteBtnTitle, setDeleteBtnTitle] = useState('حذف');

    const [btnClass, setBtnClass] = useState('btn-outline-success');
    const [btnTitle, setBtnTitle] = useState('افزودن');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [usersState, setUsersState] = useState([]);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');

    const users = null;
    const vertical = 'bottom';
    const horizontal = 'left';

    const handleClose = () => {
        setAlertOpen(false);
    }

    const addButtonClicked = () => {
        if(phoneNumber.trim() !== ''){
            setBtnTitle('کمی صبر کنید');
            setBtnClass('btn-success');
            axios.post(Constants.apiUrl + '/api/add-dependency-to-discount',{
                discountId : props.discountId,
                dependencyId: phoneNumber,
                dependencyType: 'user'
    
            }).then((response) => {
                if(response.data.status === 'done'){
                    let usersArray = [...usersState];
                    usersArray.push({id: response.data.id, username: response.data.username, name: response.data.name});
                    setUsersState(usersArray);
                    setAlertSeverity('success');
                    setAlertMessage('عملیات با موفقیت انجام شد');
                }else{
                    setAlertSeverity('warning');
                    if(response.data.message === 'dependency not found'){
                        setAlertMessage('کاربر با چنین شماره تماس یافت نشد');
                    }else if(response.data.message === 'dependency exists'){
                        setAlertMessage('این کاربر در لیست وجود دارد');
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
            setAlertMessage('شماره تلفن کاربر را به درستی وارد کنید');
            setAlertOpen(true);
        }
        
    }

    const phoneNumberInputChanged = (event) => {
        setPhoneNumber(event.target.value);
        console.log(usersState);
    }

    useEffect(() => {
        axios.post(Constants.apiUrl + '/api/discount-relevant-dependencies',{
                discountId : props.discountId,
                dependencyType: 'user'
            }).then((response) => {
                if(response.data.status === 'done'){
                    let usersArray = response.data.users;
                    let array1 = [];
                    usersArray.map((usr) => {
                        array1.push(usr);
                    });
                    setUsersState(array1);
                }else{
                    setAlertSeverity('warning');
                    if(response.data.message === 'discount not found'){
                        setAlertMessage('چنین تخفیفی پیدا نشد');
                    }else if(response.data.message === 'not enough parameter'){
                        setAlertMessage('ورودی به اندازه کافی نیست');
                    }
                    setAlertOpen(true);
                    console.log(response.data.message);
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
                    let usersArray = [];
                    for(let usr of usersState){
                        if(usr.id !== id){
                            usersArray.push(usr);
                        }
                    }
                    setUsersState(usersArray);
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

    return(
        <React.Fragment>
        <div className={['container-fluid'].join(' ')}>
        <img src={UserBlackImage} className={['mt-2'].join(' ')} style={{width: '40px'}} />
            <div className={['row', 'mt-2'].join(' ')} style={{direction: 'ltr'}}>
                <button className={['btn', btnClass, 'col-2'].join(' ')} onClick={addButtonClicked}>{btnTitle}</button>
                <Autocomplete className={['col-10', 'text-right', 'justify-content-right', 'd-none'].join(' ')} style={{direction: 'rtl'}}
                    onChange={(event, newValue) => {
                        console.log(newValue);
                    }}
                    id="controllable-states-demo"
                    options={users}
                    getOptionLabel={(users) => users.name + ' : ' + users.phone}
                    renderInput={(params) => <TextField className={['text-right'].join(' ')} {...params} label="اطلاعات کاربر" variant="outlined" style={{direction: 'ltr', fontFamily: 'IranSansWebFaNum'}} />}
                />
                <input typet="text" className={['form-control', 'col-10', 'text-right'].join(' ')} placeholder="تلفن همراه کاربر" onChange={phoneNumberInputChanged} />
            </div>
            {
                usersState.map((usr, counter) => { 
                    
                    return (
                        <div className={['row', 'mt-2', 'rounded', 'align-items-center'].join(' ')} style={{backgroundColor: '#f2f2f2'}}>
                            <p className={['text-center', 'm-0', 'col-1'].join(' ')}>{counter + 1}</p>
                            <p className={['text-center', 'm-0', 'col-4'].join(' ')}>{usr.name}</p>
                            <p className={['text-center', 'm-0', 'col-5'].join(' ')}>{usr.username}</p>
                            <button className={['btn', 'btn-outline-danger', 'col-2'].join(' ')} onClick={() => {deleteBtnClicked(usr.id)}}>{deleteBtnTitle}</button>
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

export default UserLimiter;