import React from 'react';
import MenuWhiteIcon from '../../assets/images/menu_white.png';
import UserWhiteIcon from '../../assets/images/user_white.png';
import LogoutWhiteIcon from '../../assets/images/logout_white.png';

const Header = (props) => {
    return(
        <div className={['container-fluid'].join(' ')} style={{position: 'sticky', top: '0', zIndex: '500'}}>
            <div className={['row', 'd-flex', 'justify-content-between', 'align-items-center', 'pt-1', 'pb-1'].join(' ')} style={{backgroundColor: '#00bac6'}}>
                <div className={[''].join(' ')}>
                    <img src={UserWhiteIcon} style={{width: '34px'}} className={['m-1', 'pointer', 'd-none'].join(' ')} />
                    <img src={LogoutWhiteIcon} style={{width: '34px'}} className={['mt-1', 'mb-1', 'ml-3', 'pointer', 'd-none'].join(' ')} />
                </div>
                <div>
                    <h5 style={{color: 'white'}} className={['mr-3', 'd-inline'].join(' ')}>{props.title}</h5>
                    <img src={MenuWhiteIcon} style={{width: '34px'}} className={['m-1', 'pointer'].join(' ')} onClick={props.menuItemClicked}/>
                </div>
            </div>
        </div>
    );
}

export default Header;