import PropTypes from "prop-types";

const ShopItem = (props) => {
    return(
        <>
            <div className="shop-item-container">
                <img src={props.src} className="shop-item-img"></img>
                <h2 id={props.shopItemName}>{props.shopItemName}</h2>
                <h5 id='shop-item-price'>${props.price}</h5>
                
                <div>
                    <button id="add-to-cart-btn">ADD TO CART</button>
                </div>
                
            </div>
        </>
    )
}
export default ShopItem;

ShopItem.propTypes = {
    src: PropTypes.string.isRequired,
    shopItemName: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired

};