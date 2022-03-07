import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as ConstantUrls from '../../../../constants/urls';
import { useCookies } from 'react-cookie';

const ListLinks = () => {

    const [links, setLinks] = useState([]);
    const [courses, setCourses] = useState([]);
    const [editingLinkIndex, setEditingLinkIndex] = useState(-1);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedCourseIdToAdd, setSelectedCourseIdToAdd] = useState(0);
    const [axiosProcessing, setAxiosProcessing] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies();

    useEffect(() => {   
        setAxiosProcessing(true);
        axios.post(ConstantUrls.apiUrl + '/api/art/filtered-paginated-linked-arts', {
            page: 1,
            maxCount: 10, 
            artId: 0, 
            courseId: 0,
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                if(response.found === true){
                    setLinks(response.links);
                }else {
                    alert('موردی یافت نشد');
                }
            }else if(response.stasus === 'failed'){
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

        axios.get(ConstantUrls.apiUrl + '/api/academy/all-courses').then((r) => {
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
        setAxiosProcessing(false);
    }, []);

    const getArtCourses = (artId) => {
        setAxiosProcessing(true);
        axios.post(ConstantUrls.apiUrl + '/api/art/arts-linked-courses', {
            artId: artId, 
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done' && response.found === true){
                let crss = [];
                for(let i=0; i<response.courses.length; i++){
                    crss.push(response.courses[i].course_id);
                }
                console.info(crss);
                setSelectedCourses(crss);
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
        setAxiosProcessing(false);
    }

    const showLinkInformation = (index) => {
        if(editingLinkIndex === index){
            setEditingLinkIndex(-1);
            return;
        }
        setEditingLinkIndex(index);
        getArtCourses(links[index].artId);
    }

    const getCourseName = (courseId) => {
        for(let i = 0; i<courses.length ; i++){
            if(courses[i].id === courseId){
                return courses[i].name;
            }
        }
    }

    const addCourseButtonClicked = () => {
        if(selectedCourseIdToAdd == 0){
            alert('لطفا یک آموزش را انتخاب کنید');
            return;
        }
        if(axiosProcessing){
            alert('کمی صبر کنید');
            return;
        }
        console.warn(selectedCourses);
        setAxiosProcessing(true);
        axios.post(ConstantUrls.apiUrl + '/api/art/add-course-to-art', {
            courseId: selectedCourseIdToAdd,
            artId: links[editingLinkIndex].artId
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                let newSelectedCourses = [];
                //newSelectedCourses.push(response.courseId);
                //console.info(newSelectedCourses);
                selectedCourses.map((item, i) => {
                    newSelectedCourses.push(item);
                });
                newSelectedCourses.push(parseInt(response.courseId));
                setSelectedCourses(newSelectedCourses);
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
        setAxiosProcessing(false);
    }

    const addingCourseSelectorChanged = (event) => {
        setSelectedCourseIdToAdd(event.target.value);
    }

    const removeLinkButtonClicked = (index) => {
        axios.post(ConstantUrls.apiUrl + '/api/art/remove-course-link', {
            artId: links[index].artId,
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){
                let newLinks = [];
                links.map((l, i) => {
                    if(i !== index){
                        newLinks.push(l);
                    }
                });
                setLinks(newLinks);
                setEditingLinkIndex(-1);
            }else if(response.status === 'failed'){
                console.warn(response.message);
                alert(response.umessage);
            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });
    }

    const removeCourseButtonClicked = (courseId) => {
        axios.post(ConstantUrls.apiUrl + '/api/art/remove-course-from-art', {
            artId: links[editingLinkIndex].artId,
            courseId: courseId          
        }, {
            headers: {
                'Authorization': 'Bearer ' + cookies.user_server_token,
            }
        }).then((r) => {
            let response = r.data;
            if(response.status === 'done'){ 
                let newSelectedCourses = [];
                selectedCourses.map((item ,i) => {
                    if(item != courseId){
                        newSelectedCourses.push(item);
                    }
                });
                setSelectedCourses(newSelectedCourses);
            }else if(response.status === 'failed'){
                if(response.source === 'm'){
                    window.location.href = 'https://honari.com';
                }else{
                    alert(response.umessage);
                    console.warn(response.message);
                }
            }
        }).catch((e) => {
            console.error(e);
            alert('خطا در برقراری ارتباط');
        });
    }

    const editingPart = (
        <div className={['col-12', 'px-0'].join(' ')}>
            <div className={['container-fluid'].join(' ')}>
                <div className={['row'].join(' ')}>
                    <div className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'p-2', 'rtl'].join(' ')} style={{background: '#F2F2F2'}}>
                        <select disabled={axiosProcessing} onChange={addingCourseSelectorChanged} className={['text-right'].join(' ')} style={{flex: '10', fontSize: '14px'}}>
                            <option value={0}>انتخاب کنید</option>
                            {
                                courses.map((course, index) => {
                                    if(selectedCourses.indexOf(course.id) === -1){
                                        return (
                                            <option value={course.id} >{course.name}</option>
                                        )
                                    }
                                })
                            }
                        </select>
                        <button disabled={axiosProcessing} onClick={addCourseButtonClicked} className={['mb-0', 'text-center', 'py-2', 'pointer', 'mr-3'].join(' ')} style={{fontSize: '14px', flex: '1', color: 'white', background: '#27A745', borderStyle: 'none', outlineStyle: 'none', borderRadius: '3px'}}>افزودن آموزش</button>
                    </div>
                    {
                        selectedCourses.map((courseId, i) => {
                            console.warn(courseId);
                            return(
                                <div key={i} className={['col-12', 'd-flex', 'flex-row', 'align-items-center', 'p-2', 'rtl'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px'}}>
                                    <h6 className={['mb-0', 'text-right'].join(' ')} style={{fontSize: '14px', flex: '10'}}>{getCourseName(courseId)}</h6>
                                    <button onClick={() => {removeCourseButtonClicked(courseId)}} disabled={axiosProcessing} className={['mb-0', 'text-center', 'py-2', 'mr-3'].join(' ')} style={{fontSize: '14px', flex: '1', color: 'white', background: '#DC3545', borderStyle: 'none', outlineStyle: 'none', borderRadius: '3px'}}>حذف آموزش</button>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    )

    return (
        <div className={['container-fluid', 'mx-0', 'px-2'].join(' ')}>
            <div className={['row', 'mx-0'].join(' ')} >
                <div className={['col-12', 'p-2', 'mt-2', 'rtl', 'd-flex', 'flex-row', 'align-items-center'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px'}}>
                    <h3 className={['text-right', 'font14', 'mb-0'].join(' ')} style={{color: '#00BAC6', width: '5rem'}}>ردیف</h3>
                    <h3 className={['text-right', 'font14', 'mb-0'].join(' ')} style={{color: '#00BAC6', flex: '1'}}>دسته‌بندی</h3>
                    <h3 className={['text-center', 'font14', 'mb-0', 'ml-2'].join(' ')} style={{color: '#00BAC6', width: '5rem'}}>ویرایش</h3>
                    <h3 className={['text-center', 'font14', 'mb-0'].join(' ')} style={{color: '#00BAC6', width: '5rem'}}>حذف</h3>
                </div>
                {
                    links.map((l, i) => {
                        return (
                            <React.Fragment>
                                <div className={['col-12', 'p-2', 'mt-2', 'rtl', 'd-flex', 'flex-row', 'align-items-center'].join(' ')} style={{background: '#F2F2F2', borderRadius: '2px'}}>
                                    <h5 className={['text-right', 'font14', 'mb-0'].join(' ')} style={{width: '5rem'}}>{i+1}</h5>
                                    <h5 className={['text-right', 'font14', 'mb-0'].join(' ')} style={{flex: '1'}}>{l.artName}</h5>
                                    <button disabled={axiosProcessing} onClick={() => {showLinkInformation(i)}} className={['text-center', 'font14', 'mb-0', 'btn', 'btn-warning', 'ml-2'].join(' ')} style={{width: '5rem'}}>ویرایش</button>
                                    <button onClick={() => {removeLinkButtonClicked(i)}} className={['text-center', 'font14', 'mb-0', 'btn', 'btn-danger'].join(' ')} style={{width: '5rem'}}>حذف لینک</button>
                                </div>
                                {
                                    i == editingLinkIndex ?
                                    editingPart
                                    :
                                    null
                                }
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default ListLinks;