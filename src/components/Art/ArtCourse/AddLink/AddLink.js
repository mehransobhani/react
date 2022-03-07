import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Constants from '../../../../constants/urls';
import leftArrowImage from '../../../../assets/images/left_arrow_black.png';
import { useCookies } from 'react-cookie';

const AddLink = () => {

    const [arts, setArts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedArtId, setSelectedArtId] = useState(0);
    const [selectedFirstCourseId, setSelectedFirstCourseId] = useState(0);
    const [selectedSecondCourseId, setSelectedSecondCourseId] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies();

    useEffect(() => {
        axios.get(Constants.apiUrl + '/api/art/unlinked-arts').then((r) => {
            let response = r.data;
            if(response.status === 'done' && response.found === true){
                setArts(response.arts);
            }else if(response.status === 'done' && response.found === false){
                alert('هنر بدون لینکی وجود ندارد');
            }else if(response.status === 'failed'){
                console.warn(response.message);
                alert(response.umessage);
            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });

        axios.get(Constants.apiUrl + '/api/academy/all-courses').then((r) => {
            let response = r.data;
            if(response.status === 'done' && response.found === true){
                setCourses(response.courses);
            }else if(response.status === 'done' && response.found === false){
                alert('کلاسی یافت نشد');
            }else if(response.status === 'failed'){
                console.warn(response.message);
                alert(response.umessage);
            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });
    }, []);

    const confirmButtonClicked = () => {
        if(selectedArtId == 0 || selectedFirstCourseId == 0 || selectedFirstCourseId === -1 || selectedSecondCourseId == 0 || selectedSecondCourseId == -1){
            alert('لطفا موارد خواسته‌شده را به درستی وارد کنید');
            return;
        }

        if(selectedFirstCourseId === selectedSecondCourseId){
            alert('دوره‌های انتخاب شده یکسان هستند');
            return;
        }

        axios.post(Constants.apiUrl + '/api/art/add-art-course-link', {
            artId: selectedArtId, 
            firstCourseId: selectedFirstCourseId, 
            secondCourseId: selectedSecondCourseId 
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                alert('عملیات با موفقیت انجام شد');
            }else if(response.status === 'failed'){
                if(response.source === 'm'){
                    window.location.href = 'https://honari.com';
                }else{
                    console.warn(response.message);
                    alert(response.umessage);
                }
            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });
    }

    const artSelectorChanged = (event) => {
        setSelectedArtId(parseInt(event.target.value));
    }

    const firstCourseSelectorChanged = (event) => {
        setSelectedFirstCourseId(parseInt(event.target.value));
    }

    const secondCourseSelectorChanged = (event) => {
        setSelectedSecondCourseId(parseInt(event.target.value));
    }

    return (
        <div className={['container-fluid', 'mx-0', 'px-2'].join(' ')}>
            <div className={['row', 'mx-0'].join(' ')} style={{background: '#F8F8F8', borderRadius: '2px'}}>
                <div className={['col-12', 'p-2', 'd-flex','flex-row', 'rtl', 'align-items-center'].join(' ')}>
                    <img src={leftArrowImage} style={{width: '24px', height: '24px'}} />
                    <h3 className={['mx-2', 'mb-0'].join(' ')} style={{fontSize: '14px'}}>هنر را انتخاب کنید</h3>
                    <select onChange={artSelectorChanged} className={['text-right', 'rtl'].join(' ')} style={{fontSize: '14px', flex: '1'}}>
                        <option value={0}>انتخاب کنید</option>
                        {
                            arts.map((art, index) => {
                                return (
                                    <option key={index} value={art.artId}>{art.artName}</option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'p-2'].join(' ')}>
                <img src={leftArrowImage} style={{width: '24px', height: '24px'}} />
                    <h3 className={['mx-2', 'mb-0'].join(' ')} style={{fontSize: '14px'}}>کلاس اول : </h3>
                    <select onChange={firstCourseSelectorChanged} className={['text-right', 'rtl'].join(' ')} style={{fontSize: '14px', flex: '1'}}>
                        <option value={0}>انتخاب کنید</option>
                        {
                            courses.map((course, index) => {
                                return (
                                    <option key={index} value={course.id}>{course.name}</option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className={['col-6', 'd-flex', 'flex-row', 'rtl', 'align-items-center', 'p-2'].join(' ')}>
                <img src={leftArrowImage} style={{width: '24px', height: '24px'}} />
                    <h3 className={['mx-2', 'mb-0'].join(' ')} style={{fontSize: '14px'}}>کلاس دوم : </h3>
                    <select onChange={secondCourseSelectorChanged} className={['text-right', 'rtl'].join(' ')} style={{fontSize: '14px', flex: '1'}}>
                        <option value={-1}>انتخاب کنید</option>
                        {
                            courses.map((course, index) => {
                                return (
                                    <option key={index} value={course.id}>{course.name}</option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className={['col-12', 'd-flex', 'flex-row', 'mt-3', 'justify-content-center', 'mb-2'].join(' ')}>
                    <button onClick={confirmButtonClicked} className={['text-center', 'py-2', 'pointer', 'px-5'].join(' ')} style={{background: '#28A745', color: 'white', fontSize: '14px', borderStyle: 'none', outlineStyle: 'none', borderRadius: '3px'}}>ثبت</button>
                </div>
            </div>
        </div>
    )
}

export default AddLink;