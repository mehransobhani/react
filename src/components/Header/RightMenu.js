import React from 'react';
import HonariLogoIcon from '../../assets/images/honari_logo.png';
import HomeBlackIcon from '../../assets/images/home_black.png';
import BoxBlckIcon from '../../assets/images/box_black.png';
import DiscountBlackIcon from '../../assets/images/discount_black.png';
import BikeBlackIcon from '../../assets/images/motorbike_black.png';
import UserBlackIcon from '../../assets/images/user_black.png';
import coinsBlackIcon from '../../assets/images/coins_black.png';
import './RightMenu.css';

const RightMenu = () => {
    return (
        <div className={['container-fluid', 'text-center'].join(' ')} style={{width: '240px'}}>
            <img src={HonariLogoIcon} style={{width: '80px'}} className={['mt-2', 'mb-2'].join(' ')}/>
            <div className={['row', 'd-flex', 'text-right', 'align-items-center', 'pt-2', 'pb-2', 'item'].join(' ')} style={{direction: 'rtl'}}>
                <img src={HomeBlackIcon} style={{width: '24px', marginRight: '5px', marginLeft: '5px'}} />
                <h6 className={['m-0', 'p-0'].join(' ')}>وب‌سایت</h6>
            </div>
            <div className={['row', 'd-flex', 'text-right', 'align-items-center', 'pt-2', 'pb-2', 'item'].join(' ')} style={{direction: 'rtl'}}>
                <img src={BoxBlckIcon} style={{width: '24px', marginRight: '5px', marginLeft: '5px'}} />
                <h6 className={['m-0', 'p-0'].join(' ')}>محصولات</h6>
            </div>
            <div className={['row', 'd-flex', 'text-right', 'align-items-center', 'pt-2', 'pb-2', 'item'].join(' ')} style={{direction: 'rtl'}}>
                <img src={DiscountBlackIcon} style={{width: '24px', marginRight: '5px', marginLeft: '5px'}} />
                <a href='/discount'><h6 className={['m-0', 'p-0'].join(' ')}>تخفیف‌ها</h6></a>
            </div>
            <div className={['row', 'd-flex', 'text-right', 'align-items-center', 'pt-2', 'pb-2', 'item'].join(' ')} style={{direction: 'rtl'}}>
                <img src={BoxBlckIcon} style={{width: '24px', marginRight: '5px', marginLeft: '5px'}} />
                <a href='/category/course'><h6 className={['m-0', 'p-0'].join(' ')}>لینک دسته‌بندی‌ها</h6></a>
            </div>
            <div className={['row', 'd-flex', 'text-right', 'align-items-center', 'pt-2', 'pb-2', 'item'].join(' ')} style={{direction: 'rtl'}}>
                <img src={UserBlackIcon} style={{width: '24px', marginRight: '5px', marginLeft: '5px'}} />
                <h6 className={['m-0', 'p-0'].join(' ')}>کاربران</h6>
            </div>
            <div className={['row', 'd-flex', 'text-right', 'align-items-center', 'pt-2', 'pb-2', 'item'].join(' ')} style={{direction: 'rtl'}}>
                <img src={coinsBlackIcon} style={{width: '24px', marginRight: '5px', marginLeft: '5px'}} />
                <h6 className={['m-0', 'p-0'].join(' ')}>امور مالی</h6>
            </div>
            <div className={['row', 'd-flex', 'text-right', 'align-items-center', 'pt-2', 'pb-2', 'item'].join(' ')} style={{direction: 'rtl'}}>
                <img src={BikeBlackIcon} style={{width: '24px', marginRight: '5px', marginLeft: '5px'}} />
                <h6 className={['m-0', 'p-0'].join(' ')}>حمل و نقل</h6>
            </div>
        </div>
    );
}

export default RightMenu;