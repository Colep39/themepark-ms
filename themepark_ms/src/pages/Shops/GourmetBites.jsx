import './Shops.css';
import ShopItem from './ShopItem';

export default function GourmetBits(){
    return(
        <>
            <div className="gourmet-container">
                <h1 id="shop-header">GourmetBites</h1>

                <div className="shop-items-container">
                    <ShopItem src="/images/brisket.jpg" shopItemName="Brisket" price="15.00"/>
                    <ShopItem src="/images/fries.jpg" shopItemName="Fries" price="5.00"/>
                    <ShopItem src="/images/chili-dog.webp" shopItemName="Chili Dog" price="10.00"/>
                    <ShopItem src="/images/sub-honey-butter.webp" shopItemName="Honey Butter Sandwich" price="10.00"/>
                    <ShopItem src="/images/pizza.webp" shopItemName="Pizza" price="20.00" />
                    <ShopItem src="/images/soda.avif" shopItemName="Soft drink" price="2.00"/>
                    <ShopItem src="/images/water.webp" shopItemName="Water" price="0.00" />
                    <ShopItem src="/images/alcohol.jpg" shopItemName="Mimosa (21+)" price="5.00"/>
                </div>
            </div>
        </>
    )
}