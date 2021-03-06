import React, { useEffect, useState, Fragment } from 'react';
import {useDispatch} from 'react-redux';
import { getCartItems, removeCartItem } from '../../../_actions/user_actions';
import UserCard from './Sections/UserCard';
import {Empty} from 'antd';

const CartPage= (props)=>{
    console.log('after Remove:',props.user)
    const dispatch = useDispatch();
    const [TotalPrice,setTotalPrice] = useState(0);
    const [showTotal,setShowTotal] = useState(false);
    const {user : {userData}} = props;
    useEffect(()=>{
        let cartItems = [];
        if (userData && userData.cart) {
            if (userData.cart.length >0) {
                userData.cart.forEach((item)=>{
                    cartItems.push(item.id);
                    dispatch(getCartItems(cartItems,userData.cart))
                        .then(response=>{calcTotalPrice(response.payload)})
                })
            }
        }
    },[userData])

    const calcTotalPrice = (cartList)=>{
        let priceSum = 0;
        cartList.forEach((cartItem)=>{
            priceSum += cartItem.price * cartItem.quantity
        })
        setTotalPrice(priceSum);
        setShowTotal(true);
    }
    const removeItem = (productId)=>{
        dispatch(removeCartItem(productId))
            .then(response=>{
                console.log(response,'at Remove Item')
                if (response.payload.productInfo.length  === 0) {
                    setShowTotal(false);

                }
            })
    }
    const priceChange =(str)=>{
        let result =str.split('').reverse()
          .map((item,index)=>{
            if (index%3===2&&index!==str.split('').length-1) {
              item=`,${item}`
            }
            return item;
          }).reverse().join('')
        return result;
    }
    return (
        <div style={{width:'85%',margin:'3rem auto'}}>
            <h1>내 장바구니</h1>
            <UserCard productInfo={props.user.cartDetail} removeItem={removeItem} />
            {showTotal ?
                <div className='total_price_container'>
                    <h2>총 합계 : {priceChange(String(TotalPrice))}원</h2>
                </div> :
                <Fragment>
                    <br />
                    <Empty description={false}></Empty>
                </Fragment>
            }   
        </div>
    )
}

export default CartPage;